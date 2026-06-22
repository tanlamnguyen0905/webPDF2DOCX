# PDF to Word Converter

Hệ thống website cho phép người dùng upload file PDF và chuyển đổi sang Word (`.docx`)
với hai chế độ: **miễn phí** (giới hạn) và **nâng cao** (tốn coin). Kèm hệ thống coin,
nạp tiền, lịch sử convert, hỗ trợ/khiếu nại, chatbot và trang quản trị.

> Tài liệu phân tích & thiết kế đầy đủ nằm trong thư mục [`done/`](./done).

## Kiến trúc tổng quan

```
Next.js (frontend)  ──HTTP──>  Spring Boot (backend API)  ──>  MySQL
                                      │  │
                                      │  └──> S3 (LocalStack)   : lưu file PDF/DOCX
                                      └─────> SQS (LocalStack)  : hàng đợi convert
                                                   │
                                                   ▼
                                      Python Worker  ──> convert PDF→DOCX, callback backend
```

| Service    | Công nghệ            | Thư mục       | Cổng mặc định |
| ---------- | -------------------- | ------------- | ------------- |
| Frontend   | Next.js (App Router) | `frontend/`   | 3000          |
| Backend    | Spring Boot (Java 17)| `backend/`    | 8080          |
| Worker     | Python               | `worker/`     | -             |
| Database   | MySQL 8              | (docker)      | 3306          |
| S3 + SQS   | LocalStack           | `infra/`      | 4566          |

## Cấu trúc thư mục

```
pdf-to-word-converter/
├── done/            # Tài liệu yêu cầu, phân tích, schema, API spec, UI/UX
├── frontend/        # Next.js — giao diện người dùng, admin, support
│   └── src/
│       ├── app/          # App Router: (public) (auth) (user) admin support-dashboard
│       ├── components/   # UploadBox, FileInfoCard, ConvertStatusCard, ...
│       └── lib/          # api client, hooks, types, utils, constants
├── backend/         # Spring Boot — REST API, nghiệp vụ coin/payment/convert
│   └── src/main/java/com/pdfconverter/
│       ├── common/       # ApiResponse, exception, enums, util
│       ├── config/       # Security, S3, SQS, JWT, Web config
│       ├── security/     # JWT provider, filter
│       ├── domain/       # package-by-feature: user, auth, conversion, coin,
│       │                 #   payment, support, chatbot, setting, admin, internal
│       ├── storage/      # S3 service
│       └── queue/        # SQS publisher
├── worker/          # Python — nhận job SQS, convert PDF→DOCX
│   └── app/
│       ├── main.py       # vòng lặp poll SQS
│       ├── converter/    # pdf_to_docx, ocr
│       └── callback_client.py
├── infra/           # Script khởi tạo LocalStack (S3, SQS), MySQL
├── log/             # Nhật ký làm việc theo ngày
├── docker-compose.yml
└── .env.example
```

## Bắt đầu nhanh (local development)

> Đây là bản **scaffold** — các lệnh init/cài đặt dependency chưa được chạy. Xem README
> trong từng service để hoàn thiện trước khi chạy thật.

```bash
# 1. Tạo file môi trường
cp .env.example .env

# 2. Bật hạ tầng (MySQL, LocalStack) + các service
docker compose up -d

# 3. Frontend (sau khi đã cài dependency)
cd frontend && npm install && npm run dev

# 4. Backend
cd backend && ./mvnw spring-boot:run

# 5. Worker
cd worker && pip install -r requirements.txt && python -m app.main
```

## Tài liệu tham khảo

- [`done/TechSpec/requires.md`](./done/TechSpec/requires.md) — Yêu cầu hệ thống (SRS)
- [`done/TechSpec/analystic_system.md`](./done/TechSpec/analystic_system.md) — Phân tích hệ thống
- [`done/TechSpec/schema.md`](./done/TechSpec/schema.md) — Thiết kế cơ sở dữ liệu
- [`done/TechSpec/tech_arch.md`](./done/TechSpec/tech_arch.md) — Kiến trúc công nghệ
- [`done/backend/api_spec.md`](./done/backend/api_spec.md) — Đặc tả REST API
- [`done/UI_UX_Design/`](./done/UI_UX_Design) — Thiết kế UI/UX & luồng giao diện