"""Khởi tạo boto3 client cho S3 + SQS (trỏ LocalStack ở local)."""
import boto3

from app import config


def _kwargs():
    return {
        "region_name": config.AWS_REGION,
        "aws_access_key_id": config.AWS_ACCESS_KEY_ID,
        "aws_secret_access_key": config.AWS_SECRET_ACCESS_KEY,
        "endpoint_url": config.AWS_ENDPOINT_URL,
    }


def s3_client():
    return boto3.client("s3", **_kwargs())


def sqs_client():
    return boto3.client("sqs", **_kwargs())


def queue_url(sqs) -> str:
    return sqs.get_queue_url(QueueName=config.SQS_QUEUE_NAME)["QueueUrl"]
