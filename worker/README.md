# Worker — Python

Nhận job convert từ **SQS**, tải PDF từ **S3**, convert sang **DOCX**, upload kết quả
và **callback** backend cập nhật trạng thái + xử lý coin.

## Cài đặt & chạy

```bash
cp .env.example .env
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

Hoặc qua docker-compose ở thư mục gốc: `docker compose up worker`.

## Cấu trúc

```
app/
├── main.py            # vòng lặp long-poll SQS, điều phối xử lý job
├── config.py          # đọc biến môi trường
├── aws_clients.py     # boto3 client S3 + SQS (LocalStack)
├── callback_client.py # gọi internal API backend (started/completed/failed)
└── converter/
    ├── pdf_to_docx.py # convert PDF text -> DOCX (pdf2docx)
    └── ocr.py         # OCR cho PDF scan (tùy chọn)
tests/                 # unit test
```

## Hợp đồng message & callback

- Định dạng SQS message: `done/backend/api_spec.md` §14.2.
- Internal callback endpoint: `done/backend/api_spec.md` §13 (header `X-Worker-Token`).
- Worker phải **idempotent**: job đã `SUCCESS` thì bỏ qua; lỗi để SQS retry (DLQ sau 3 lần).
