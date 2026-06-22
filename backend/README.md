# Backend — Spring Boot

REST API cho website Convert PDF to Word: xác thực, phân quyền, nghiệp vụ
coin/payment/convert/support, tạo job convert, ký upload/download, callback worker.

- **Java 17**, Spring Boot 3.3, Spring Data JPA, Spring Security, Flyway, AWS SDK v2.
- DB: **MySQL 8**. Storage/Queue: **S3 + SQS** (LocalStack ở local).

## Cài đặt & chạy

```bash
cp .env.example .env          # nếu chạy ngoài docker
# Tạo Maven wrapper lần đầu (nếu chưa có): mvn -N wrapper:wrapper
./mvnw spring-boot:run        # http://localhost:8080
```

Hoặc qua docker-compose ở thư mục gốc: `docker compose up backend`.

## Cấu trúc package (`com.pdfconverter`)

```
common/        # ApiResponse, PageResponse, exception (ErrorCode, BusinessException, handler), enums, util
config/        # SecurityConfig, AwsConfig (S3Client, SqsClient)
security/      # JwtTokenProvider (+ filter sẽ bổ sung)
domain/        # package-by-feature, mỗi domain gồm entity/repo/service/controller/dto
  ├── user/         auth/         conversion/   coin/
  ├── payment/      support/      chatbot/      setting/
  ├── admin/        internal/   (worker callback)
storage/       # S3StorageService
queue/         # ConversionJobPublisher (gửi SQS)
```

> `domain/conversion` được scaffold đầy đủ hơn (entity + repository + controller + enum)
> làm mẫu. Các domain khác hiện có `package-info.java` mô tả trách nhiệm — triển khai dần
> theo `done/backend/api_spec.md`.

## Database migration (Flyway)

`src/main/resources/db/migration/`:
- `V1__init_schema.sql` — toàn bộ bảng + index (theo `done/TechSpec/schema.md`).
- `V2__seed_data.sql` — `system_settings` + `coin_packages` mặc định.

`spring.jpa.hibernate.ddl-auto=validate` → schema do Flyway quản lý, JPA chỉ kiểm tra khớp.
