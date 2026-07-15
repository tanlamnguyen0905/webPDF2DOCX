"""Cấu hình worker đọc từ biến môi trường (xem .env.example)."""
import os
import socket

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
# W16: Unique worker ID per instance — hostname + PID ensures uniqueness in MVP
WORKER_ID = os.getenv("WORKER_ID", f"worker-{socket.gethostname()}-{os.getpid()}")

# Số giây chờ long-polling khi nhận message SQS.
SQS_WAIT_TIME_SECONDS = int(os.getenv("SQS_WAIT_TIME_SECONDS", "20"))
# Thời gian visibility timeout cho message SQS (giây), đủ cho conversion lâu.
SQS_VISIBILITY_TIMEOUT = int(os.getenv("SQS_VISIBILITY_TIMEOUT", "300"))
# ARN của Dead Letter Queue — cấu hình ở infra (LocalStack init script).
# Khi message bị xử lý lỗi quá maxReceiveCount, SQS tự động chuyển sang DLQ.
SQS_DLQ_ARN = os.getenv("SQS_DLQ_ARN", "")

# W15: Zombie job timeout — backend MUST implement a scheduled task to expire
# jobs stuck in PROCESSING state older than this many minutes.
# This config is documented here for reference; the actual implementation
# belongs in the backend (not in the worker).
JOB_TIMEOUT_MINUTES = int(os.getenv("JOB_TIMEOUT_MINUTES", "60"))
