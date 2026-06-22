#!/bin/bash
# LocalStack init hook — chạy khi LocalStack sẵn sàng (ready.d).
# Tạo S3 bucket và SQS queue (kèm dead-letter queue) cho hệ thống convert.
set -euo pipefail

BUCKET="${S3_BUCKET:-pdf-converter}"
QUEUE="${SQS_QUEUE_NAME:-pdf-conversion-jobs}"
DLQ="${SQS_DLQ_NAME:-pdf-conversion-jobs-dlq}"
REGION="${DEFAULT_REGION:-us-east-1}"

echo "[init] Creating S3 bucket: ${BUCKET}"
awslocal s3 mb "s3://${BUCKET}" --region "${REGION}" || true

echo "[init] Creating SQS dead-letter queue: ${DLQ}"
awslocal sqs create-queue --queue-name "${DLQ}" --region "${REGION}" || true

DLQ_ARN=$(awslocal sqs get-queue-attributes \
  --queue-url "$(awslocal sqs get-queue-url --queue-name "${DLQ}" --query QueueUrl --output text)" \
  --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)

echo "[init] Creating SQS main queue: ${QUEUE} (maxReceiveCount=3 -> ${DLQ})"
awslocal sqs create-queue --queue-name "${QUEUE}" --region "${REGION}" \
  --attributes "{\"VisibilityTimeout\":\"300\",\"RedrivePolicy\":\"{\\\"deadLetterTargetArn\\\":\\\"${DLQ_ARN}\\\",\\\"maxReceiveCount\\\":\\\"3\\\"}\"}" || true

echo "[init] Done."
