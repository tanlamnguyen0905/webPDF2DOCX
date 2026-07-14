"""Điểm khởi chạy worker: vòng lặp long-poll SQS và xử lý từng job.

Luồng xử lý mỗi message (xem done/backend/api_spec.md §13, §14):
    1. Parse message body -> jobId, source (S3 key), target, conversion.
    2. callback_client.notify_started(jobId, ...)
    3. Tải PDF từ S3 (source.bucket/source.key) về thư mục tạm.
    4. converter.pdf_to_docx.convert(...)  (hoặc ocr nếu processingType = OCR)
    5. Upload DOCX lên S3 (target.bucket/target.key).
    6. callback_client.notify_completed(jobId, {...})
    7. Xóa message khỏi queue. Nếu lỗi -> notify_failed và để SQS retry (DLQ sau 3 lần).

Worker phải idempotent: nếu job đã SUCCESS thì bỏ qua.
"""
import json
import logging
import time

from app import aws_clients, config
from app import callback_client
from app.converter import pdf_to_docx, ocr

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("worker")


def handle_message(message: dict) -> None:
    body = json.loads(message["Body"])
    job_id = body.get("conversionJobId")
    s3_bucket = body.get("s3Bucket")
    s3_key = body.get("s3Key")
    processing_type = body.get("processingType", "STANDARD")
    logger.info("Xử lý job %s: bucket=%s key=%s type=%s", job_id, s3_bucket, s3_key, processing_type)

    # Bước 2: thông báo started
    started_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    callback_client.notify_started(job_id, started_at)

    # Tạo path tạm
    input_path = f"/tmp/{job_id}_input.pdf"
    output_path = f"/tmp/{job_id}_output.docx"

    # Bước 3: tải PDF từ S3
    s3 = aws_clients.s3_client()
    s3.download_file(s3_bucket, s3_key, input_path)

    # Bước 4: convert
    if processing_type.upper() == "OCR":
        ocr.ocr_pdf_to_docx(input_path, output_path)
    else:
        pdf_to_docx.convert(input_path, output_path)

    # Bước 5: upload DOCX lên S3
    output_key = s3_key.rsplit(".", 1)[0] + ".docx"
    s3.upload_file(output_path, s3_bucket, output_key)

    # Bước 6: thông báo completed
    callback_client.notify_completed(job_id, {
        "outputBucket": s3_bucket,
        "outputKey": output_key,
    })


def run() -> None:
    # Bug 5 fix: khởi tạo client và URL một lần duy nhất
    sqs = aws_clients.sqs_client()
    url = aws_clients.queue_url(sqs)
    logger.info("Worker %s bắt đầu poll queue: %s", config.WORKER_ID, url)

    while True:
        # Bug 4 fix: bọc receive_message trong try/except
        try:
            resp = sqs.receive_message(
                QueueUrl=url,
                MaxNumberOfMessages=1,
                WaitTimeSeconds=config.SQS_WAIT_TIME_SECONDS,
            )
        except Exception as e:
            logger.exception("receive_message thất bại — sẽ thử lại sau 5s")
            time.sleep(5)
            continue

        for message in resp.get("Messages", []):
            try:
                handle_message(message)
                sqs.delete_message(QueueUrl=url, ReceiptHandle=message["ReceiptHandle"])
            except Exception:  # noqa: BLE001 — Bug 2: except Exception (Python 3) không bắt KeyboardInterrupt/SystemExit
                logger.exception("Xử lý message thất bại — để SQS retry")


if __name__ == "__main__":
    run()