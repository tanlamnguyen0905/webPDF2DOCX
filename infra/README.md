# Infra — Hạ tầng local

Cấu hình hạ tầng cho môi trường phát triển local qua Docker Compose.

## Thành phần

- **localstack/init/** — Script tự chạy khi LocalStack sẵn sàng, tạo:
  - S3 bucket `pdf-converter` (lưu file PDF gốc + DOCX kết quả).
  - SQS queue `pdf-conversion-jobs` + dead-letter queue (maxReceiveCount=3, visibilityTimeout=300s).
- **mysql/init/** — Script SQL chạy lần đầu khi MySQL khởi tạo (tạo database, charset).

## Endpoint local

| Dịch vụ      | URL                                                        |
| ------------ | ---------------------------------------------------------- |
| S3           | http://localhost:4566                                      |
| SQS          | http://localhost:4566                                      |
| Queue URL    | http://localhost:4566/000000000000/pdf-conversion-jobs     |
| MySQL        | localhost:3306                                             |

## Kiểm tra nhanh (cần cài awscli-local hoặc dùng aws --endpoint-url)

```bash
aws --endpoint-url=http://localhost:4566 s3 ls
aws --endpoint-url=http://localhost:4566 sqs list-queues
```

> Production thay LocalStack bằng AWS S3 + SQS thật, MySQL bằng RDS (xem `done/TechSpec/tech_arch.md`).
