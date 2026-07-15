"""Điểm khởi chạy worker: vòng lặp long-poll SQS và xử lý từng job.

Luồng xử lý mỗi message (xem done/backend/api_spec.md §13, §14):
    1. Parse message body -> jobId, source (S3 key), target, conversion.
    2. Kiểm tra các trường bắt buộc; nếu thiếu -> xóa message, bỏ qua.
    3. Tải PDF từ S3 (source.bucket/source.key) về thư mục tạm.
    4. callback_client.notify_started(jobId, ...)  — chỉ sau khi tải thành công.
    5. converter.pdf_to_docx.convert(...)  (hoặc ocr nếu processingType = OCR)
    6. Upload DOCX lên S3 (target.bucket/target.key).
    7. callback_client.notify_completed(jobId, {...})
    8. Xóa message khỏi queue. Nếu lỗi -> notify_failed và để SQS retry (DLQ sau 3 lần).
    9. finally: dọn sạch file tạm.

Worker phải idempotent: nếu job đã SUCCESS thì bỏ qua.
"""
import json
import logging
import os
import signal
import threading
import time

from app import aws_clients, config
from app import callback_client
from app.converter import pdf_to_docx, ocr

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("worker")

# W13: Graceful shutdown flag
shutdown_event = threading.Event()


def sigterm_handler(signum, frame):
    logger.info("Received SIGTERM — initiating graceful shutdown")
    shutdown_event.set()


signal.signal(signal.SIGTERM, sigterm_handler)


class JobLoggerAdapter(logging.LoggerAdapter):
    """LoggerAdapter that prefixes every message with job context."""
    def process(self, msg, kwargs):
        return f"[job:{self.extra.get('job_id', '?')}] {msg}", kwargs


def handle_message(message: dict) -> None:
    body = json.loads(message["Body"])

    # W4: Validate required fields — skip message if any missing
    required = ["conversionJobId", "s3Key", "processingType", "callbackUrl"]
    for field in required:
        if not body.get(field):
            logger.error("Missing required field: %s", field)
            message.delete()
            return

    job_id = body.get("conversionJobId")
    s3_bucket = body.get("s3Bucket")
    s3_key = body.get("s3Key")
    processing_type = body.get("processingType", "STANDARD")

    # W14: Structured logger with job_id context
    log = JobLoggerAdapter(logger, {"job_id": job_id})
    log.info("Processing job: bucket=%s key=%s type=%s", s3_bucket, s3_key, processing_type)

    # Tạo path tạm
    input_path = f"/tmp/{job_id}_input.pdf"
    output_path = f"/tmp/{job_id}_output.docx"
    start_time = time.time()

    try:
        # Bước 3: tải PDF từ S3
        s3 = aws_clients.s3_client()
        s3.download_file(s3_bucket, s3_key, input_path)

        # Bước 2 (delayed): thông báo started — chỉ sau khi tải thành công
        started_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        callback_client.notify_started(job_id, started_at)

        # Bước 4: convert
        if processing_type.upper() == "OCR":
            ocr.ocr_pdf_to_docx(input_path, output_path)
        else:
            pdf_to_docx.convert(input_path, output_path)

        # Bước 5: upload DOCX lên S3
        output_key = s3_key.rsplit(".", 1)[0] + ".docx"
        s3.upload_file(output_path, s3_bucket, output_key)

        # W14: Log conversion duration
        elapsed = time.time() - start_time
        log.info("Conversion completed in %.2fs", elapsed)

        # Bước 6: thông báo completed
        callback_client.notify_completed(job_id, {
            "outputBucket": s3_bucket,
            "outputKey": output_key,
        })

    except Exception:
        # W2: best-effort notify_failed (wrapped in its own try/except)
        log.exception("Conversion failed — notifying backend")
        try:
            callback_client.notify_failed(job_id, {
                "error": "Conversion failed",
                "workerId": config.WORKER_ID,
            })
        except Exception:
            log.exception("notify_failed also failed")
        # Re-raise so the outer loop logs and does not delete the message
        raise

    finally:
        # W1: Always clean up temp files
        for path in (input_path, output_path):
            if os.path.exists(path):
                os.remove(path)


def run() -> None:
    sqs = aws_clients.sqs_client()
    url = aws_clients.queue_url(sqs)
    logger.info("Worker %s bắt đầu poll queue: %s", config.WORKER_ID, url)

    while not shutdown_event.is_set():
        try:
            resp = sqs.receive_message(
                QueueUrl=url,
                MaxNumberOfMessages=1,
                WaitTimeSeconds=config.SQS_WAIT_TIME_SECONDS,
                # W5: ensure enough time for conversion before message reappears
                VisibilityTimeout=config.SQS_VISIBILITY_TIMEOUT,
            )
        except Exception:
            logger.exception("receive_message thất bại — sẽ thử lại sau 5s")
            if shutdown_event.is_set():
                break
            time.sleep(5)
            continue

        for message in resp.get("Messages", []):
            try:
                handle_message(message)
                sqs.delete_message(QueueUrl=url, ReceiptHandle=message["ReceiptHandle"])
            except (KeyboardInterrupt, SystemExit):
                raise
            except Exception:
                logger.exception("Xử lý message thất bại — để SQS retry")

    logger.info("Worker %s shut down cleanly", config.WORKER_ID)


if __name__ == "__main__":
    run()
