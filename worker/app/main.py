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

from app import aws_clients, config

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("worker")


def handle_message(message: dict) -> None:
    body = json.loads(message["Body"])
    job_id = body.get("jobId")
    logger.info("Nhận job %s", job_id)
    # TODO: triển khai đầy đủ 7 bước mô tả ở docstring module.


def run() -> None:
    sqs = aws_clients.sqs_client()
    url = aws_clients.queue_url(sqs)
    logger.info("Worker %s bắt đầu poll queue: %s", config.WORKER_ID, url)

    while True:
        resp = sqs.receive_message(
            QueueUrl=url,
            MaxNumberOfMessages=1,
            WaitTimeSeconds=config.SQS_WAIT_TIME_SECONDS,
        )
        for message in resp.get("Messages", []):
            try:
                handle_message(message)
                sqs.delete_message(QueueUrl=url, ReceiptHandle=message["ReceiptHandle"])
            except Exception:  # noqa: BLE001
                logger.exception("Xử lý message thất bại — để SQS retry")


if __name__ == "__main__":
    run()
