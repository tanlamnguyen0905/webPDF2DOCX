"""Cấu hình worker đọc từ biến môi trường (xem .env.example)."""
import os

from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "test")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "test")
AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL", "http://localhost:4566")

S3_BUCKET = os.getenv("S3_BUCKET", "pdf-converter")
SQS_QUEUE_NAME = os.getenv("SQS_QUEUE_NAME", "pdf-conversion-jobs")

BACKEND_INTERNAL_BASE_URL = os.getenv(
    "BACKEND_INTERNAL_BASE_URL", "http://localhost:8080/api/v1/internal/worker"
)
WORKER_SHARED_SECRET = os.getenv("WORKER_SHARED_SECRET", "change-me-worker-secret")
WORKER_ID = os.getenv("WORKER_ID", "worker-01")

# Số giây chờ long-polling khi nhận message SQS.
SQS_WAIT_TIME_SECONDS = int(os.getenv("SQS_WAIT_TIME_SECONDS", "20"))
