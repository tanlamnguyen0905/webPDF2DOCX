# Thiết kế cơ sở dữ liệu cho website Convert PDF to Word

Database Design Specification (DB Design / ERD)

Tài liệu này mô tả thiết kế cơ sở dữ liệu cho website cho phép upload PDF, convert sang DOCX, quản lý coin, nạp coin, lịch sử chuyển đổi, chatbot AI, hỗ trợ viên và khiếu nại.

Thiết kế dưới đây phù hợp cho **MySQL 8+**. Nếu dùng PostgreSQL, có thể đổi `ENUM` thành `VARCHAR` hoặc tạo enum type riêng.

---

## 1. Tổng quan thiết kế

Hệ thống gồm các nhóm dữ liệu chính:

1. **Người dùng và phân quyền**

   - Quản lý tài khoản người dùng, admin, hỗ trợ viên.
   - Quản lý trạng thái tài khoản và số dư coin.
   - JWT refresh token cho xác thực phiên.
2. **Convert PDF sang Word**

   - Lưu thông tin file upload.
   - Lưu thông tin file kết quả.
   - Lưu chế độ chuyển đổi: miễn phí hoặc nâng cao.
   - Lưu loại xử lý: thường hoặc OCR.
   - Lưu trạng thái xử lý: chờ xử lý, đang xử lý, thành công, thất bại.
3. **Coin và giao dịch coin**

   - Quản lý số dư coin.
   - Lưu lịch sử cộng coin, trừ coin, hoàn coin, điều chỉnh coin thủ công.
4. **Nạp tiền mua coin & Subscription**

   - Quản lý gói coin.
   - Lưu lịch sử thanh toán.
   - Cộng coin khi thanh toán thành công.
   - Quản lý gói thành viên (subscription) theo tuần/tháng/năm.
   - Lưu subscription của người dùng.
5. **Giới hạn convert miễn phí**

   - Kiểm soát số lần convert miễn phí mỗi ngày.
   - Áp dụng cho cả user đã đăng nhập và khách chưa đăng nhập.
6. **Hỗ trợ, khiếu nại và chatbot AI**

   - Lưu hội thoại chatbot.
   - Lưu khiếu nại của người dùng.
   - Lưu tin nhắn giữa người dùng và hỗ trợ viên.
7. **Cấu hình hệ thống & Audit**

   - Lưu các giới hạn như dung lượng file miễn phí, số trang miễn phí, số lần miễn phí mỗi ngày.
   - Lưu cấu hình giá coin cho từng loại convert.
   - Lưu nhật ký thao tác admin/support.
8. **Batch & API (Nâng cao)**

   - Lưu thông tin batch convert nhiều file.
   - Lưu API key cho tích hợp bên thứ ba.
   - Lưu webhook notification.
9. **Notification & Email (Nâng cao)**

   - Lưu thông báo trong hệ thống (notification center).
   - Lưu log gửi email.
10. **Bảo mật (Nâng cao)**

    - Lưu log quét virus cho file upload.

---

## 2. Quy ước đặt tên

- Tên bảng dùng dạng số nhiều, ví dụ: `users`, `conversion_jobs`, `payments`.
- Khóa chính dùng tên `id`.
- Khóa ngoại dùng dạng `{table_singular}_id`, ví dụ: `user_id`, `payment_id`.
- Các cột thời gian:
  - `created_at`: thời điểm tạo bản ghi.
  - `updated_at`: thời điểm cập nhật bản ghi.
  - `deleted_at`: thời điểm xóa mềm nếu có.
- Các file lưu trong database chỉ nên lưu **đường dẫn hoặc URL**, không lưu trực tiếp nội dung file trong database.

---

## 3. Sơ đồ quan hệ tổng quát

```mermaid
erDiagram
    users ||--o{ conversion_jobs : creates
    users ||--o{ payments : makes
    users ||--o{ coin_transactions : owns
    users ||--o{ support_tickets : submits
    users ||--o{ chatbot_conversations : starts
    users ||--o{ user_subscriptions : has
    users ||--o{ batch_jobs : creates
    users ||--o{ api_keys : owns
    users ||--o{ notifications : receives
    users ||--o{ refresh_tokens : has

    coin_packages ||--o{ payments : selected_in
    subscription_plans ||--o{ user_subscriptions : defines

    payments ||--o{ coin_transactions : generates
    payments ||--o{ user_subscriptions : pays_for

    conversion_jobs ||--o{ coin_transactions : charges_or_refunds
    conversion_jobs ||--o{ batch_jobs : belongs_to
    conversion_jobs ||--o{ virus_scans : scanned_in

    support_tickets ||--o{ support_messages : contains
    conversion_jobs ||--o{ support_tickets : related_to
    payments ||--o{ support_tickets : related_to

    chatbot_conversations ||--o{ chatbot_messages : contains

    batch_jobs ||--o{ conversion_jobs : contains
    user_subscriptions ||--o{ payments : generates

    users ||--o{ email_logs : receives
```

---

## 4. Danh sách bảng đề xuất

| STT | Tên bảng                 | Mục đích                                                            | Giai đoạn |
| --: | -------------------------- | ---------------------------------------------------------------------- | --------- |
|   1 | `users`                  | Lưu tài khoản người dùng, admin, hỗ trợ viên và số dư coin | MVP       |
|   2 | `refresh_tokens`         | Lưu JWT refresh token cho phiên đăng nhập                        | MVP       |
|   3 | `password_reset_tokens`  | Lưu token quên mật khẩu                                            | MVP       |
|   4 | `coin_packages`          | Lưu các gói coin người dùng có thể mua                         | MVP       |
|   5 | `payments`               | Lưu giao dịch nạp tiền mua coin                                    | MVP       |
|   6 | `conversion_jobs`        | Lưu thông tin file PDF, file DOCX và trạng thái convert           | MVP       |
|   7 | `coin_transactions`      | Lưu lịch sử cộng, trừ, hoàn và điều chỉnh coin               | MVP       |
|   8 | `free_conversion_usages` | Lưu số lần convert miễn phí theo ngày                            | MVP       |
|   9 | `support_tickets`        | Lưu yêu cầu hỗ trợ hoặc khiếu nại                              | MVP       |
|  10 | `support_messages`       | Lưu tin nhắn trong từng yêu cầu hỗ trợ                          | MVP       |
|  11 | `chatbot_conversations`  | Lưu phiên hội thoại chatbot AI                                     | Phase 3   |
|  12 | `chatbot_messages`       | Lưu nội dung hỏi đáp với chatbot AI                              | Phase 3   |
|  13 | `system_settings`        | Lưu cấu hình hệ thống                                             | MVP       |
|  14 | `admin_audit_logs`       | Lưu lịch sử thao tác quan trọng của admin/support                | MVP       |
|  15 | `subscription_plans`     | Lưu các gói thành viên (tuần/tháng/năm)                         | Phase 4   |
|  16 | `user_subscriptions`     | Lưu subscription của người dùng                                   | Phase 4   |
|  17 | `batch_jobs`             | Lưu thông tin batch convert nhiều file                            | Phase 3   |
|  18 | `api_keys`               | Lưu API key cho tích hợp bên thứ ba                              | Phase 4   |
|  19 | `webhooks`               | Lưu webhook notification                                          | Phase 4   |
|  20 | `notifications`          | Lưu thông báo trong hệ thống                                       | Phase 3   |
|  21 | `email_logs`             | Lưu log gửi email                                                  | Phase 4   |
|  22 | `virus_scans`            | Lưu log quét virus cho file upload                                | Phase 5   |

---

# 5. Thiết kế chi tiết từng bảng

---

## 5.1. Bảng `users`

Lưu thông tin tài khoản người dùng, admin và hỗ trợ viên.

### Chức năng liên quan

- Đăng ký, đăng nhập.
- Cập nhật thông tin cá nhân.
- Xem số dư coin.
- Phân quyền admin, support, user.
- Quản lý tài khoản.

### Cấu trúc bảng

| Cột                   | Kiểu dữ liệu | Ràng buộc                 | Mô tả                                  |
| ---------------------- | --------------- | --------------------------- | ------------------------------------------ |
| `id`                 | BIGINT UNSIGNED | PK, AUTO_INCREMENT          | ID người dùng                           |
| `full_name`          | VARCHAR(150)    | NULL                        | Họ tên                                   |
| `email`              | VARCHAR(255)    | NOT NULL, UNIQUE            | Email đăng nhập                         |
| `password_hash`      | VARCHAR(255)    | NOT NULL                    | Mật khẩu đã mã hóa                   |
| `avatar_url`         | VARCHAR(500)    | NULL                        | Đường dẫn ảnh đại diện               |
| `role`               | ENUM            | NOT NULL, DEFAULT 'USER'    | `USER`, `ADMIN`, `SUPPORT`           |
| `coin_balance`       | INT UNSIGNED    | NOT NULL, DEFAULT 0         | Số dư coin hiện tại                    |
| `subscription_tier`  | ENUM            | NOT NULL, DEFAULT 'FREE'    | `FREE`, `PREMIUM`, `VIP`              |
| `status`             | ENUM            | NOT NULL, DEFAULT 'ACTIVE'  | `ACTIVE`, `LOCKED`, `BANNED`         |
| `last_login_at`      | DATETIME        | NULL                        | Lần đăng nhập gần nhất               |
| `last_login_ip`      | VARCHAR(45)     | NULL                        | IP đăng nhập gần nhất                |
| `deleted_at`         | DATETIME        | NULL                        | Thời gian xóa mềm                    |
| `created_at`         | DATETIME        | NOT NULL                    | Ngày tạo                                 |
| `updated_at`         | DATETIME        | NOT NULL                    | Ngày cập nhật                           |

### Ghi chú

- `coin_balance` được lưu trực tiếp để đọc nhanh.
- Mọi thay đổi coin vẫn phải được ghi vào bảng `coin_transactions`.
- Khi cộng/trừ coin, nên dùng database transaction để tránh sai lệch số dư.
- `subscription_tier` là cache để đọc nhanh, dữ liệu gốc ở bảng `user_subscriptions`.
- `deleted_at` phục vụ GDPR/compliance — user có thể yêu cầu xóa tài khoản.

---

## 5.2. Bảng `password_reset_tokens`

Lưu token phục vụ chức năng quên mật khẩu.

| Cột           | Kiểu dữ liệu | Ràng buộc        | Mô tả                                  |
| -------------- | --------------- | ------------------ | ---------------------------------------- |
| `id`         | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID token                                 |
| `user_id`    | BIGINT UNSIGNED | FK, NOT NULL       | Người dùng yêu cầu đổi mật khẩu |
| `token_hash` | VARCHAR(255)    | NOT NULL           | Token đã hash                          |
| `expires_at` | DATETIME        | NOT NULL           | Thời gian hết hạn                     |
| `used_at`    | DATETIME        | NULL               | Thời gian đã sử dụng                |
| `created_at` | DATETIME        | NOT NULL           | Ngày tạo                               |

### Ghi chú

- Không nên lưu token dạng plain text.
- Token nên hết hạn sau một khoảng thời gian ngắn, ví dụ 15 đến 30 phút.

---

## 5.3. Bảng `refresh_tokens`

Lưu JWT refresh token để duy trì phiên đăng nhập.

### Chức năng liên quan

- Đăng nhập và duy trì phiên.
- Rotate refresh token.
- Thu hồi token khi đăng xuất.

| Cột              | Kiểu dữ liệu | Ràng buộc        | Mô tả                            |
| ----------------- | --------------- | ------------------ | ---------------------------------- |
| `id`            | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID token                          |
| `user_id`       | BIGINT UNSIGNED | FK, NOT NULL       | Người dùng sở hữu              |
| `token_hash`    | VARCHAR(255)    | NOT NULL           | Refresh token đã hash           |
| `expires_at`    | DATETIME        | NOT NULL           | Thời gian hết hạn (7 ngày)      |
| `revoked_at`    | DATETIME        | NULL               | Thời gian thu hồi               |
| `device_info`   | VARCHAR(255)    | NULL               | User-Agent                          |
| `ip_address`    | VARCHAR(45)     | NULL               | IP đăng nhập                      |
| `created_at`    | DATETIME        | NOT NULL           | Ngày tạo                           |

---

## 5.4. Bảng `coin_packages`

Lưu các gói coin để người dùng chọn khi nạp tiền.

### Chức năng liên quan

- Hiển thị các gói coin.
- Admin quản lý gói coin.
- Người dùng chọn gói coin để thanh toán.

| Cột            | Kiểu dữ liệu | Ràng buộc            | Mô tả                   |
| --------------- | --------------- | ---------------------- | ------------------------- |
| `id`          | BIGINT UNSIGNED | PK, AUTO_INCREMENT     | ID gói coin              |
| `name`        | VARCHAR(100)    | NOT NULL               | Tên gói                 |
| `price_vnd`   | INT UNSIGNED    | NOT NULL               | Giá tiền VNĐ           |
| `coin_amount` | INT UNSIGNED    | NOT NULL               | Số coin nhận được    |
| `description` | TEXT            | NULL                   | Mô tả gói              |
| `is_active`   | BOOLEAN         | NOT NULL, DEFAULT TRUE | Gói còn bán hay không |
| `sort_order`  | INT             | NOT NULL, DEFAULT 0    | Thứ tự hiển thị       |
| `created_at`  | DATETIME        | NOT NULL               | Ngày tạo                |
| `updated_at`  | DATETIME        | NOT NULL               | Ngày cập nhật          |

### Dữ liệu mẫu

| name   | price_vnd | coin_amount |
| ------ | --------: | ----------: |
| Gói 1 |     10000 |         100 |
| Gói 2 |     50000 |         600 |
| Gói 3 |    100000 |        1500 |

---

## 5.5. Bảng `payments`

Lưu lịch sử nạp tiền mua coin.

### Chức năng liên quan

- Người dùng nạp coin.
- Hệ thống nhận kết quả thanh toán.
- Admin xem danh sách giao dịch nạp tiền.
- Thống kê lượng nạp coin và doanh thu.

| Cột                          | Kiểu dữ liệu | Ràng buộc        | Mô tả                                                         |
| ----------------------------- | --------------- | ------------------ | --------------------------------------------------------------- |
| `id`                        | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID thanh toán                                                  |
| `user_id`                   | BIGINT UNSIGNED | FK, NOT NULL       | Người dùng nạp tiền                                        |
| `coin_package_id`           | BIGINT UNSIGNED | FK, NULL           | Gói coin được chọn                                         |
| `subscription_id`           | BIGINT UNSIGNED | FK, NULL           | Đăng ký subscription liên quan (nếu có)                |
| `amount_vnd`                | INT UNSIGNED    | NOT NULL           | Số tiền thanh toán                                           |
| `coin_amount`               | INT UNSIGNED    | NOT NULL           | Số coin được cộng nếu thành công                        |
| `payment_method`            | ENUM            | NOT NULL           | `MANUAL`, `BANK_TRANSFER`, `MOMO`, `VNPAY`, `ZALOPAY` |
| `status`                    | ENUM            | NOT NULL           | `PENDING`, `SUCCESS`, `FAILED`, `CANCELED`              |
| `provider_transaction_code` | VARCHAR(255)    | NULL               | Mã giao dịch từ cổng thanh toán                            |
| `payment_content`           | VARCHAR(255)    | NULL               | Nội dung thanh toán                                           |
| `note`                      | TEXT            | NULL               | Ghi chú                                                        |
| `paid_at`                   | DATETIME        | NULL               | Thời điểm thanh toán thành công                           |
| `created_at`                | DATETIME        | NOT NULL           | Ngày tạo                                                      |
| `updated_at`                | DATETIME        | NOT NULL           | Ngày cập nhật                                                |

### Ghi chú

- Khi `status = SUCCESS`, hệ thống tạo một bản ghi `coin_transactions` loại `ADD`.
- Nên có ràng buộc không cộng coin hai lần cho cùng một thanh toán.

---

## 5.6. Bảng `conversion_jobs`

Lưu thông tin mỗi lần người dùng convert PDF sang DOCX.

### Chức năng liên quan

- Upload PDF.
- Convert miễn phí.
- Convert nâng cao tốn coin.
- OCR.
- Hàng đợi xử lý file.
- Tải file sau khi convert.
- Lịch sử chuyển đổi.
- Theo dõi lỗi convert.

| Cột                   | Kiểu dữ liệu  | Ràng buộc         | Mô tả                                                                        |
| ---------------------- | ---------------- | ------------------- | ------------------------------------------------------------------------------ |
| `id`                 | BIGINT UNSIGNED  | PK, AUTO_INCREMENT  | ID lần convert                                                                |
| `request_code`       | VARCHAR(64)      | NOT NULL, UNIQUE    | Mã yêu cầu convert, chống xử lý trùng                                   |
| `user_id`            | BIGINT UNSIGNED  | FK, NULL            | Người dùng convert, NULL nếu là khách                                    |
| `guest_token`        | VARCHAR(100)     | NULL                | Mã định danh khách chưa đăng nhập                                      |
| `source_ip`          | VARCHAR(45)      | NULL                | IP người dùng                                                               |
| `source`             | ENUM             | NOT NULL, DEFAULT 'WEB' | `WEB`, `API` — phân biệt web vs API                              |
| `original_file_name` | VARCHAR(255)     | NOT NULL            | Tên file PDF gốc                                                             |
| `original_file_path` | VARCHAR(500)     | NOT NULL            | Đường dẫn lưu file PDF                                                    |
| `output_file_name`   | VARCHAR(255)     | NULL                | Tên file DOCX kết quả                                                       |
| `output_file_path`   | VARCHAR(500)     | NULL                | Đường dẫn lưu file DOCX                                                   |
| `file_size_bytes`    | BIGINT UNSIGNED  | NOT NULL            | Dung lượng file PDF                                                          |
| `total_pages`        | INT UNSIGNED     | NOT NULL            | Số trang PDF                                                                  |
| `conversion_mode`    | ENUM             | NOT NULL            | `FREE`, `PREMIUM`                                                          |
| `processing_type`    | ENUM             | NOT NULL            | `NORMAL`, `OCR`                                                            |
| `conversion_settings`| JSON             | NULL                | Cấu hình chuyển đổi (giữ bảng, font, image quality...)          |
| `batch_job_id`       | BIGINT UNSIGNED  | FK, NULL            | Batch job chứa lần convert này (nếu có)                           |
| `coin_estimated`     | INT UNSIGNED     | NOT NULL, DEFAULT 0 | Coin dự kiến                                                                 |
| `coin_charged`       | INT UNSIGNED     | NOT NULL, DEFAULT 0 | Coin thực tế đã trừ                                                       |
| `status`             | ENUM             | NOT NULL            | `PENDING`, `QUEUED`, `PROCESSING`, `SUCCESS`, `FAILED`, `EXPIRED`, `DELETED` |
| `queue_priority`     | TINYINT UNSIGNED | NOT NULL, DEFAULT 5 | Độ ưu tiên xử lý, số nhỏ ưu tiên cao hơn                            |
| `retry_count`        | TINYINT UNSIGNED | NOT NULL, DEFAULT 0 | Số lần đã retry                                                             |
| `error_message`      | TEXT             | NULL                | Thông báo lỗi nếu thất bại                                               |
| `started_at`         | DATETIME         | NULL                | Thời điểm bắt đầu xử lý                                                |
| `completed_at`       | DATETIME         | NULL                | Thời điểm hoàn tất                                                        |
| `file_expired_at`    | DATETIME         | NULL                | Thời điểm file hết hạn                                                    |
| `deleted_at`         | DATETIME         | NULL                | Thời điểm file bị xóa                                                     |
| `created_at`         | DATETIME         | NOT NULL            | Ngày tạo                                                                     |
| `updated_at`         | DATETIME         | NOT NULL            | Ngày cập nhật                                                               |

### Quy tắc nghiệp vụ

- Convert miễn phí:
  - `conversion_mode = FREE`
  - `coin_estimated = 0`
  - `coin_charged = 0`
  - File kết quả lưu 1 giờ.
- Convert nâng cao:
  - `conversion_mode = PREMIUM`
  - Cần kiểm tra số dư coin.
  - File kết quả lưu 24 giờ.
- Nếu convert thất bại:
  - `status = FAILED`
  - Nếu đã trừ coin thì tạo giao dịch hoàn coin trong `coin_transactions`.
- Nếu file hết hạn:
  - `status = EXPIRED` hoặc giữ trạng thái `SUCCESS` và chỉ dựa vào `file_expired_at`.
  - Khi file bị xóa vật lý khỏi storage thì cập nhật `deleted_at`.

---

## 5.7. Bảng `coin_transactions`

Lưu toàn bộ lịch sử biến động coin.

### Chức năng liên quan

- Xem lịch sử cộng coin.
- Xem lịch sử trừ coin.
- Hoàn coin khi convert lỗi.
- Admin cộng/trừ coin thủ công.
- Đối chiếu khi có khiếu nại.

| Cột                  | Kiểu dữ liệu | Ràng buộc        | Mô tả                                            |
| --------------------- | --------------- | ------------------ | -------------------------------------------------- |
| `id`                | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID giao dịch coin                                 |
| `transaction_code`  | VARCHAR(64)     | NOT NULL, UNIQUE   | Mã giao dịch coin                                |
| `user_id`           | BIGINT UNSIGNED | FK, NOT NULL       | Người sở hữu giao dịch                        |
| `payment_id`        | BIGINT UNSIGNED | FK, NULL           | Thanh toán liên quan nếu có                    |
| `conversion_job_id` | BIGINT UNSIGNED | FK, NULL           | Lần convert liên quan nếu có                   |
| `type`              | ENUM            | NOT NULL           | `ADD`, `DEDUCT`, `REFUND`, `ADJUST`        |
| `amount`            | INT UNSIGNED    | NOT NULL           | Số coin thay đổi                                |
| `balance_before`    | INT UNSIGNED    | NOT NULL           | Số dư trước giao dịch                         |
| `balance_after`     | INT UNSIGNED    | NOT NULL           | Số dư sau giao dịch                             |
| `reason`            | VARCHAR(255)    | NOT NULL           | Lý do giao dịch                                  |
| `status`            | ENUM            | NOT NULL           | `PENDING`, `SUCCESS`, `FAILED`, `CANCELED` |
| `created_by`        | BIGINT UNSIGNED | FK, NULL           | Admin/support tạo giao dịch nếu là thủ công  |
| `created_at`        | DATETIME        | NOT NULL           | Ngày tạo                                         |

### Quy tắc nghiệp vụ

- Khi nạp coin thành công: tạo giao dịch `ADD`.
- Khi convert nâng cao thành công: tạo giao dịch `DEDUCT`.
- Khi convert lỗi sau khi đã trừ coin: tạo giao dịch `REFUND`.
- Khi admin điều chỉnh coin: tạo giao dịch `ADJUST`.
- Không cập nhật `users.coin_balance` mà không ghi `coin_transactions`.

---

## 5.8. Bảng `free_conversion_usages`

Lưu số lần convert miễn phí trong ngày.

### Chức năng liên quan

- Giới hạn 5 lần convert miễn phí mỗi ngày.
- Áp dụng cho user đã đăng nhập hoặc khách chưa đăng nhập.
- Chống lạm dụng chế độ miễn phí.

| Cột               | Kiểu dữ liệu | Ràng buộc         | Mô tả                       |
| ------------------ | --------------- | ------------------- | ----------------------------- |
| `id`             | BIGINT UNSIGNED | PK, AUTO_INCREMENT  | ID bản ghi                   |
| `identity_type`  | ENUM            | NOT NULL            | `USER`, `GUEST`, `IP`   |
| `identity_value` | VARCHAR(255)    | NOT NULL            | ID user, guest token hoặc IP |
| `usage_date`     | DATE            | NOT NULL            | Ngày sử dụng               |
| `used_count`     | INT UNSIGNED    | NOT NULL, DEFAULT 0 | Số lần đã dùng           |
| `daily_limit`    | INT UNSIGNED    | NOT NULL, DEFAULT 5 | Giới hạn mỗi ngày         |
| `created_at`     | DATETIME        | NOT NULL            | Ngày tạo                    |
| `updated_at`     | DATETIME        | NOT NULL            | Ngày cập nhật              |

### Ràng buộc quan trọng

- Unique: `identity_type`, `identity_value`, `usage_date`.
- Khi người dùng convert miễn phí thành công hoặc bắt đầu xử lý, tăng `used_count`.
- Nên tăng trong transaction để tránh vượt giới hạn khi gửi nhiều yêu cầu cùng lúc.

---

## 5.9. Bảng `support_tickets`

Lưu yêu cầu hỗ trợ hoặc khiếu nại của người dùng.

### Chức năng liên quan

- Người dùng gửi khiếu nại.
- Người dùng nhắn tin với hỗ trợ viên.
- Hỗ trợ viên quản lý và phản hồi khiếu nại.
- Admin theo dõi các vấn đề liên quan đến convert, coin, thanh toán.

| Cột                          | Kiểu dữ liệu | Ràng buộc        | Mô tả                                                                            |
| ----------------------------- | --------------- | ------------------ | ---------------------------------------------------------------------------------- |
| `id`                        | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID ticket                                                                          |
| `ticket_code`               | VARCHAR(64)     | NOT NULL, UNIQUE   | Mã khiếu nại                                                                    |
| `user_id`                   | BIGINT UNSIGNED | FK, NOT NULL       | Người tạo ticket                                                                |
| `assigned_support_id`       | BIGINT UNSIGNED | FK, NULL           | Hỗ trợ viên phụ trách                                                         |
| `related_payment_id`        | BIGINT UNSIGNED | FK, NULL           | Thanh toán liên quan                                                             |
| `related_conversion_job_id` | BIGINT UNSIGNED | FK, NULL           | Lần convert liên quan                                                            |
| `title`                     | VARCHAR(255)    | NOT NULL           | Tiêu đề                                                                         |
| `content`                   | TEXT            | NOT NULL           | Nội dung ban đầu                                                                |
| `issue_type`                | ENUM            | NOT NULL           | `CONVERT_ERROR`, `PAYMENT_ERROR`, `COIN_ERROR`, `ACCOUNT_ERROR`, `OTHER` |
| `priority`                  | ENUM            | NOT NULL           | `LOW`, `NORMAL`, `HIGH`, `URGENT`                                          |
| `status`                    | ENUM            | NOT NULL           | `NEW`, `IN_PROGRESS`, `REPLIED`, `RESOLVED`, `CANCELED`                  |
| `created_at`                | DATETIME        | NOT NULL           | Ngày tạo                                                                         |
| `updated_at`                | DATETIME        | NOT NULL           | Ngày cập nhật                                                                   |
| `resolved_at`               | DATETIME        | NULL               | Ngày hoàn tất                                                                   |

### Ghi chú

- `assigned_support_id` trỏ tới `users.id` có role `SUPPORT` hoặc `ADMIN`.
- Ticket có thể liên kết với một lần convert hoặc một thanh toán cụ thể.

---

## 5.10. Bảng `support_messages`

Lưu tin nhắn trong từng cuộc hỗ trợ/khiếu nại.

| Cột                  | Kiểu dữ liệu | Ràng buộc             | Mô tả                                               |
| --------------------- | --------------- | ----------------------- | ----------------------------------------------------- |
| `id`                | BIGINT UNSIGNED | PK, AUTO_INCREMENT      | ID tin nhắn                                          |
| `support_ticket_id` | BIGINT UNSIGNED | FK, NOT NULL            | Ticket chứa tin nhắn                                |
| `sender_id`         | BIGINT UNSIGNED | FK, NULL                | Người gửi, NULL nếu là hệ thống/bot            |
| `sender_role`       | ENUM            | NOT NULL                | `USER`, `SUPPORT`, `ADMIN`, `BOT`, `SYSTEM` |
| `message`           | TEXT            | NOT NULL                | Nội dung tin nhắn                                   |
| `attachment_path`   | VARCHAR(500)    | NULL                    | File đính kèm nếu có                             |
| `is_read`           | BOOLEAN         | NOT NULL, DEFAULT FALSE | Trạng thái đã đọc                               |
| `created_at`        | DATETIME        | NOT NULL                | Thời gian gửi                                       |

---

## 5.11. Bảng `chatbot_conversations`

Lưu phiên hội thoại chatbot AI.

| Cột            | Kiểu dữ liệu | Ràng buộc        | Mô tả                             |
| --------------- | --------------- | ------------------ | ----------------------------------- |
| `id`          | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID phiên chat                      |
| `user_id`     | BIGINT UNSIGNED | FK, NULL           | Người dùng, NULL nếu là khách |
| `guest_token` | VARCHAR(100)    | NULL               | Mã định danh khách              |
| `status`      | ENUM            | NOT NULL           | `OPEN`, `CLOSED`, `ESCALATED` |
| `created_at`  | DATETIME        | NOT NULL           | Ngày tạo                          |
| `updated_at`  | DATETIME        | NOT NULL           | Ngày cập nhật                    |

### Ghi chú

- Khi chatbot không xử lý được, có thể chuyển sang ticket hỗ trợ.
- Khi chuyển sang ticket, cập nhật `status = ESCALATED`.

---

## 5.12. Bảng `chatbot_messages`

Lưu từng câu hỏi và câu trả lời trong chatbot.

| Cột                        | Kiểu dữ liệu  | Ràng buộc        | Mô tả                                 |
| --------------------------- | ---------------- | ------------------ | --------------------------------------- |
| `id`                      | BIGINT UNSIGNED  | PK, AUTO_INCREMENT | ID tin nhắn chatbot                    |
| `chatbot_conversation_id` | BIGINT UNSIGNED  | FK, NOT NULL       | Phiên chat                             |
| `sender_role`             | ENUM             | NOT NULL           | `USER`, `BOT`, `SYSTEM`           |
| `message`                 | TEXT             | NOT NULL           | Nội dung                               |
| `metadata`                | JSON             | NULL               | Context cho LLM (intent, entities...) |
| `rating`                  | TINYINT UNSIGNED | NULL               | Đánh giá câu trả lời, ví dụ 1-5 |
| `created_at`              | DATETIME         | NOT NULL           | Thời gian gửi                         |

---

## 5.14. Bảng `system_settings`

Lưu cấu hình hệ thống để admin có thể thay đổi mà không cần sửa code.

### Ví dụ cấu hình

| setting_key                      | setting_value | Ý nghĩa                                  |
| -------------------------------- | ------------- | ------------------------------------------ |
| `free_max_file_size_mb`        | `5`         | Dung lượng tối đa chế độ miễn phí |
| `free_max_pages`               | `30`        | Số trang tối đa chế độ miễn phí    |
| `free_daily_limit`             | `5`         | Số lần convert miễn phí mỗi ngày     |
| `free_file_storage_hours`      | `1`         | Thời gian lưu file miễn phí            |
| `premium_file_storage_hours`   | `24`        | Thời gian lưu file nâng cao             |
| `coin_normal_per_page`         | `1`         | Coin cho convert thường                  |
| `coin_ocr_per_page`            | `2`         | Coin cho convert OCR                       |
| `coin_after_30_pages_per_page` | `3`         | Coin cho mỗi trang sau trang 30           |

### Cấu trúc bảng

| Cột              | Kiểu dữ liệu | Ràng buộc        | Mô tả                                    |
| ----------------- | --------------- | ------------------ | ------------------------------------------ |
| `id`            | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID cấu hình                              |
| `setting_key`   | VARCHAR(100)    | NOT NULL, UNIQUE   | Tên cấu hình                            |
| `setting_value` | TEXT            | NOT NULL           | Giá trị cấu hình                       |
| `data_type`     | ENUM            | NOT NULL           | `STRING`, `INT`, `BOOLEAN`, `JSON` |
| `description`   | VARCHAR(255)    | NULL               | Mô tả                                    |
| `updated_by`    | BIGINT UNSIGNED | FK, NULL           | Admin cập nhật                           |
| `created_at`    | DATETIME        | NOT NULL           | Ngày tạo                                 |
| `updated_at`    | DATETIME        | NOT NULL           | Ngày cập nhật                           |

---

## 5.14. Bảng `admin_audit_logs`

Lưu lịch sử thao tác quan trọng của admin hoặc hỗ trợ viên.

### Chức năng liên quan

- Theo dõi admin thay đổi gói coin.
- Theo dõi admin cộng/trừ coin thủ công.
- Theo dõi thay đổi cấu hình hệ thống.
- Hỗ trợ kiểm tra khi có lỗi hoặc khiếu nại.

| Cột             | Kiểu dữ liệu | Ràng buộc        | Mô tả                     |
| ---------------- | --------------- | ------------------ | --------------------------- |
| `id`           | BIGINT UNSIGNED | PK, AUTO_INCREMENT | ID log                      |
| `actor_id`     | BIGINT UNSIGNED | FK, NULL           | Người thực hiện         |
| `action`       | VARCHAR(100)    | NOT NULL           | Hành động                |
| `target_table` | VARCHAR(100)    | NULL               | Bảng bị tác động       |
| `target_id`    | BIGINT UNSIGNED | NULL               | ID bản ghi bị tác động |
| `old_value`    | JSON            | NULL               | Dữ liệu cũ               |
| `new_value`    | JSON            | NULL               | Dữ liệu mới              |
| `source_ip`    | VARCHAR(45)     | NULL               | IP thực hiện              |
| `created_at`   | DATETIME        | NOT NULL           | Thời gian thực hiện      |

---

## 5.15. Bảng `subscription_plans`

> **Giai đoạn**: Phase 4 — Gói thành viên (task_future.md §5.2)

Lưu các gói thành viên subscription (tuần/tháng/năm).

### Chức năng liên quan

- Hiển thị các gói subscription.
- Admin quản lý gói.
- Người dùng đăng ký gói.

| Cột              | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| ----------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`            | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID gói                                              |
| `name`          | VARCHAR(100)    | NOT NULL                       | Tên gói: "Gói Tuần", "Gói Tháng"...               |
| `price_vnd`    | INT UNSIGNED    | NOT NULL                       | Giá VNĐ                                             |
| `duration_days` | INT UNSIGNED    | NOT NULL                       | Số ngày: 7, 30, 365                                 |
| `coin_bonus`   | INT UNSIGNED    | NOT NULL, DEFAULT 0            | Coin tặng kèm mỗi kỳ                                |
| `priority_level` | TINYINT UNSIGNED | NOT NULL, DEFAULT 5            | Mức ưu tiên queue (số nhỏ = cao hơn)               |
| `max_file_size_mb` | INT UNSIGNED    | NULL                           | Giới hạn file (NULL = không giới hạn)              |
| `ocr_included`    | BOOLEAN         | NOT NULL, DEFAULT FALSE        | OCR miễn phí                                        |
| `features`      | JSON            | NULL                           | Mô tả chi tiết các lợi ích                           |
| `is_active`    | BOOLEAN         | NOT NULL, DEFAULT TRUE         | Còn bán hay không                                   |
| `sort_order`   | INT             | NOT NULL, DEFAULT 0            | Thứ tự hiển thị                                     |
| `created_at`   | DATETIME        | NOT NULL                       | Ngày tạo                                            |
| `updated_at`   | DATETIME        | NOT NULL                       | Ngày cập nhật                                       |

---

## 5.16. Bảng `user_subscriptions`

> **Giai đoạn**: Phase 4 — Subscription của người dùng (task_future.md §5.2, ui_des_future.md §5.3)

Lưu thông tin subscription của từng người dùng.

### Chức năng liên quan

- Quản lý gói đã đăng ký.
- Kiểm tra quyền ưu tiên.
- Tự động gia hạn.

| Cột              | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| ----------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`            | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID bản ghi                                          |
| `user_id`       | BIGINT UNSIGNED | FK → users.id, NOT NULL        | Người dùng                                          |
| `plan_id`       | BIGINT UNSIGNED | FK → subscription_plans.id, NOT NULL | Gói subscription                              |
| `start_at`      | DATETIME        | NOT NULL                       | Ngày bắt đầu                                        |
| `end_at`        | DATETIME        | NOT NULL                       | Ngày hết hạn                                        |
| `auto_renew`    | BOOLEAN         | NOT NULL, DEFAULT TRUE         | Tự động gia hạn                                     |
| `is_trial`      | BOOLEAN         | NOT NULL, DEFAULT FALSE        | Dùng thử miễn phí                                   |
| `payment_id`    | BIGINT UNSIGNED | FK → payments.id, NULL         | Thanh toán khởi tạo (NULL nếu trial)               |
| `status`        | ENUM            | NOT NULL                       | `ACTIVE`, `EXPIRED`, `CANCELED`, `TRIAL`          |
| `canceled_at`  | DATETIME        | NULL                           | Thời điểm hủy                                       |
| `created_at`   | DATETIME        | NOT NULL                       | Ngày tạo                                            |
| `updated_at`   | DATETIME        | NOT NULL                       | Ngày cập nhật                                       |

### Ghi chú

- Khi subscription active, cập nhật `users.subscription_tier` tương ứng.
- Khi subscription hết hạn, đặt lại `users.subscription_tier = 'FREE'`.

---

## 5.17. Bảng `batch_jobs`

> **Giai đoạn**: Phase 3 — Convert hàng loạt (task_future.md §5.1, ui_des_future.md §5.1-5.2)

Lưu thông tin batch convert nhiều file cùng lúc.

### Chức năng liên quan

- Upload và convert nhiều file.
- Download batch dạng ZIP.
- Theo dõi tiến trình batch.

| Cột                | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| ------------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`              | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID batch                                            |
| `batch_code`      | VARCHAR(64)     | NOT NULL, UNIQUE               | Mã batch                                            |
| `user_id`         | BIGINT UNSIGNED | FK → users.id, NOT NULL        | Người dùng tạo batch                                |
| `total_files`     | INT UNSIGNED    | NOT NULL, DEFAULT 0            | Tổng số file                                        |
| `completed_files` | INT UNSIGNED    | NOT NULL, DEFAULT 0            | Số file hoàn tất                                    |
| `failed_files`    | INT UNSIGNED    | NOT NULL, DEFAULT 0            | Số file lỗi                                         |
| `status`          | ENUM            | NOT NULL                       | `PROCESSING`, `COMPLETED`, `PARTIAL_SUCCESS`, `FAILED` |
| `zip_path`        | VARCHAR(500)    | NULL                           | Đường dẫn file ZIP kết quả                          |
| `zip_size_bytes`  | BIGINT UNSIGNED | NULL                           | Dung lượng file ZIP                                 |
| `zip_expired_at`  | DATETIME        | NULL                           | Thời gian hết hạn file ZIP                          |
| `created_at`      | DATETIME        | NOT NULL                       | Ngày tạo                                            |
| `updated_at`      | DATETIME        | NOT NULL                       | Ngày cập nhật                                       |

### Ghi chú

- `conversion_jobs` có `batch_job_id` FK trỏ về bảng này.
- File ZIP được tạo khi tất cả file trong batch hoàn tất.

---

## 5.18. Bảng `api_keys`

> **Giai đoạn**: Phase 4 — API cho bên thứ ba (task_future.md §5.3, ui_des_future.md §5.4)

Lưu API key cho tích hợp bên thứ ba.

### Chức năng liên quan

- Quản lý API key của developer.
- Rate limiting theo key.
- Thống kê usage.

| Cột              | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| ----------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`            | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID key                                              |
| `user_id`       | BIGINT UNSIGNED | FK → users.id, NOT NULL        | Chủ sở hữu key                                     |
| `key_hash`      | VARCHAR(255)    | NOT NULL                       | API key đã hash                                     |
| `prefix`        | VARCHAR(20)     | NOT NULL                       | Prefix hiển thị: `cvpdf_live_abc...`               |
| `name`          | VARCHAR(100)    | NOT NULL                       | Tên key                                             |
| `rate_limit`    | INT UNSIGNED    | NOT NULL, DEFAULT 100          | Số request/phút                                     |
| `status`        | ENUM            | NOT NULL                       | `ACTIVE`, `DISABLED`, `REVOKED`                   |
| `last_used_at`  | DATETIME        | NULL                           | Lần dùng gần nhất                                   |
| `expires_at`    | DATETIME        | NULL                           | NULL = không hết hạn                                |
| `created_at`    | DATETIME        | NOT NULL                       | Ngày tạo                                            |
| `updated_at`    | DATETIME        | NOT NULL                       | Ngày cập nhật                                       |

### Ghi chú

- Không lưu key plain text, chỉ lưu hash.
- Prefix giúp user nhận diện key trong danh sách.

---

## 5.19. Bảng `webhooks`

> **Giai đoạn**: Phase 4 — Webhook notification (task_future.md §5.3, ui_des_future.md §5.5)

Lưu webhook URL để gửi notification khi convert hoàn tất.

### Chức năng liên quan

- Nhận webhook khi convert completed/failed.
- HMAC signature verification.

| Cột                  | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| --------------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`                | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID webhook                                          |
| `user_id`           | BIGINT UNSIGNED | FK → users.id, NOT NULL        | Chủ sở hữu webhook                                  |
| `url`               | VARCHAR(500)    | NOT NULL                       | Endpoint URL                                        |
| `secret`            | VARCHAR(255)    | NOT NULL                       | HMAC secret để verify                               |
| `events`            | JSON            | NOT NULL                       | Danh sách event: `["convert.completed", "convert.failed"]` |
| `status`            | ENUM            | NOT NULL                       | `ACTIVE`, `DISABLED`                               |
| `last_triggered_at` | DATETIME        | NULL                           | Lần trigger gần nhất                                |
| `last_http_status`  | SMALLINT        | NULL                           | HTTP status lần trigger cuối                        |
| `created_at`        | DATETIME        | NOT NULL                       | Ngày tạo                                            |
| `updated_at`        | DATETIME        | NOT NULL                       | Ngày cập nhật                                       |

---

## 5.20. Bảng `notifications`

> **Giai đoạn**: Phase 3 — Trung tâm thông báo (ui_des_future.md §5.7)

Lưu thông báo trong hệ thống cho người dùng.

### Chức năng liên quan

- Hiển thị notification bell + badge.
- Push notification real-time.

| Cột              | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| ----------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`            | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID thông báo                                        |
| `user_id`       | BIGINT UNSIGNED | FK → users.id, NOT NULL        | Người nhận                                          |
| `type`          | VARCHAR(50)     | NOT NULL                       | `CONVERT_DONE`, `COIN_ADDED`, `SYSTEM`, `PROMOTION` |
| `title`         | VARCHAR(255)    | NOT NULL                       | Tiêu đề                                             |
| `content`       | TEXT            | NULL                           | Nội dung                                            |
| `data`          | JSON            | NULL                           | Dữ liệu liên quan (result_id, payment_id...)        |
| `action_url`    | VARCHAR(500)    | NULL                           | Link chuyển hướng khi click                         |
| `is_read`       | BOOLEAN         | NOT NULL, DEFAULT FALSE        | Đã đọc                                              |
| `read_at`       | DATETIME        | NULL                           | Thời điểm đọc                                       |
| `email_sent_at` | DATETIME        | NULL                           | Thời điểm gửi email (nếu có)                       |
| `created_at`    | DATETIME        | NOT NULL                       | Ngày tạo                                            |

---

## 5.21. Bảng `email_logs`

> **Giai đoạn**: Phase 4 — Log gửi email (task_future.md §5.5, tech_arch.md §3.5)

Lưu log gửi email qua AWS SES.

### Chức năng liên quan

- Theo dõi email gửi đi.
- Xử lý email bị bounce.

| Cột              | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| ----------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`            | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID log                                              |
| `user_id`       | BIGINT UNSIGNED | FK → users.id, NULL            | Người nhận (NULL nếu anonymous)                    |
| `to_email`      | VARCHAR(255)    | NOT NULL                       | Địa chỉ email nhận                                  |
| `subject`       | VARCHAR(255)    | NOT NULL                       | Tiêu đề                                             |
| `body`          | TEXT            | NOT NULL                       | Nội dung email                                      |
| `email_type`    | VARCHAR(50)     | NOT NULL                       | `REGISTER`, `RESET_PASSWORD`, `CONVERT_DONE`, `COIN_ADDED`, `SUBSCRIPTION` |
| `status`        | ENUM            | NOT NULL, DEFAULT 'SENT'       | `SENT`, `FAILED`, `BOUNCED`, `OPENED`             |
| `error_message` | TEXT            | NULL                           | Lỗi nếu gửi thất bại                                |
| `sent_at`       | DATETIME        | NOT NULL                       | Thời gian gửi                                       |
| `opened_at`     | DATETIME        | NULL                           | Thời gian mở email                                  |

---

## 5.22. Bảng `virus_scans`

> **Giai đoạn**: Phase 5 — Quét virus (task_future.md §7.2, ui_des_future.md §7.2)

Lưu log quét virus cho file upload.

### Chức năng liên quan

- Quét file PDF trước khi lưu.
- Thông báo user nếu phát hiện virus.

| Cột                  | Kiểu dữ liệu | Ràng buộc                    | Mô tả                                              |
| --------------------- | --------------- | ------------------------------ | ---------------------------------------------------- |
| `id`                | BIGINT UNSIGNED | PK, AUTO_INCREMENT             | ID log                                              |
| `conversion_job_id` | BIGINT UNSIGNED | FK → conversion_jobs.id, NOT NULL | File được quét                                |
| `scanner`           | VARCHAR(100)    | NOT NULL                       | `ClamAV`, `AWS Textract`                           |
| `status`            | ENUM            | NOT NULL                       | `CLEAN`, `INFECTED`, `ERROR`, `SKIPPED`          |
| `result`            | TEXT            | NULL                           | Chi tiết kết quả quét                               |
| `scanned_at`        | DATETIME        | NOT NULL                       | Thời điểm quét                                      |

---

# 6. SQL DDL tham khảo

> Lưu ý: DDL này dùng cho MySQL 8+. Có thể điều chỉnh enum, index hoặc kiểu dữ liệu theo framework/backend bạn dùng.

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    role ENUM('USER', 'ADMIN', 'SUPPORT') NOT NULL DEFAULT 'USER',
    coin_balance INT UNSIGNED NOT NULL DEFAULT 0,
    subscription_tier ENUM('FREE', 'PREMIUM', 'VIP') NOT NULL DEFAULT 'FREE',
    status ENUM('ACTIVE', 'LOCKED', 'BANNED') NOT NULL DEFAULT 'ACTIVE',
    last_login_at DATETIME NULL,
    last_login_ip VARCHAR(45) NULL,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE password_reset_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    device_info VARCHAR(255) NULL,
    ip_address VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE coin_packages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_vnd INT UNSIGNED NOT NULL,
    coin_amount INT UNSIGNED NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    coin_package_id BIGINT UNSIGNED NULL,
    subscription_id BIGINT UNSIGNED NULL,
    amount_vnd INT UNSIGNED NOT NULL,
    coin_amount INT UNSIGNED NOT NULL,
    payment_method ENUM('MANUAL', 'BANK_TRANSFER', 'MOMO', 'VNPAY', 'ZALOPAY') NOT NULL DEFAULT 'MANUAL',
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    provider_transaction_code VARCHAR(255) NULL,
    payment_content VARCHAR(255) NULL,
    note TEXT NULL,
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_payments_coin_package
        FOREIGN KEY (coin_package_id) REFERENCES coin_packages(id),
    CONSTRAINT fk_payments_subscription
        FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id)
        ON DELETE SET NULL
);

CREATE TABLE conversion_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    request_code VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NULL,
    guest_token VARCHAR(100) NULL,
    source_ip VARCHAR(45) NULL,
    source ENUM('WEB', 'API') NOT NULL DEFAULT 'WEB',
    original_file_name VARCHAR(255) NOT NULL,
    original_file_path VARCHAR(500) NOT NULL,
    output_file_name VARCHAR(255) NULL,
    output_file_path VARCHAR(500) NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL,
    total_pages INT UNSIGNED NOT NULL,
    conversion_mode ENUM('FREE', 'PREMIUM') NOT NULL,
    processing_type ENUM('NORMAL', 'OCR') NOT NULL DEFAULT 'NORMAL',
    conversion_settings JSON NULL,
    batch_job_id BIGINT UNSIGNED NULL,
    coin_estimated INT UNSIGNED NOT NULL DEFAULT 0,
    coin_charged INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('PENDING', 'QUEUED', 'PROCESSING', 'SUCCESS', 'FAILED', 'EXPIRED', 'DELETED') NOT NULL DEFAULT 'PENDING',
    queue_priority TINYINT UNSIGNED NOT NULL DEFAULT 5,
    retry_count TINYINT UNSIGNED NOT NULL DEFAULT 0,
    error_message TEXT NULL,
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    file_expired_at DATETIME NULL,
    deleted_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_conversion_jobs_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_conversion_jobs_batch
        FOREIGN KEY (batch_job_id) REFERENCES batch_jobs(id)
        ON DELETE SET NULL
);

CREATE TABLE coin_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    transaction_code VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    payment_id BIGINT UNSIGNED NULL,
    conversion_job_id BIGINT UNSIGNED NULL,
    type ENUM('ADD', 'DEDUCT', 'REFUND', 'ADJUST') NOT NULL,
    amount INT UNSIGNED NOT NULL,
    balance_before INT UNSIGNED NOT NULL,
    balance_after INT UNSIGNED NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'SUCCESS',
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_coin_transactions_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_coin_transactions_payment
        FOREIGN KEY (payment_id) REFERENCES payments(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_coin_transactions_conversion_job
        FOREIGN KEY (conversion_job_id) REFERENCES conversion_jobs(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_coin_transactions_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE free_conversion_usages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    identity_type ENUM('USER', 'GUEST', 'IP') NOT NULL,
    identity_value VARCHAR(255) NOT NULL,
    usage_date DATE NOT NULL,
    used_count INT UNSIGNED NOT NULL DEFAULT 0,
    daily_limit INT UNSIGNED NOT NULL DEFAULT 5,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_free_usage_identity_date (identity_type, identity_value, usage_date)
);

CREATE TABLE support_tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_code VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    assigned_support_id BIGINT UNSIGNED NULL,
    related_payment_id BIGINT UNSIGNED NULL,
    related_conversion_job_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    issue_type ENUM('CONVERT_ERROR', 'PAYMENT_ERROR', 'COIN_ERROR', 'ACCOUNT_ERROR', 'OTHER') NOT NULL DEFAULT 'OTHER',
    priority ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
    status ENUM('NEW', 'IN_PROGRESS', 'REPLIED', 'RESOLVED', 'CANCELED') NOT NULL DEFAULT 'NEW',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    CONSTRAINT fk_support_tickets_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_support_tickets_assigned_support
        FOREIGN KEY (assigned_support_id) REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_support_tickets_payment
        FOREIGN KEY (related_payment_id) REFERENCES payments(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_support_tickets_conversion_job
        FOREIGN KEY (related_conversion_job_id) REFERENCES conversion_jobs(id)
        ON DELETE SET NULL
);

CREATE TABLE support_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    support_ticket_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NULL,
    sender_role ENUM('USER', 'SUPPORT', 'ADMIN', 'BOT', 'SYSTEM') NOT NULL,
    message TEXT NOT NULL,
    attachment_path VARCHAR(500) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_support_messages_ticket
        FOREIGN KEY (support_ticket_id) REFERENCES support_tickets(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_support_messages_sender
        FOREIGN KEY (sender_id) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE chatbot_conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    guest_token VARCHAR(100) NULL,
    status ENUM('OPEN', 'CLOSED', 'ESCALATED') NOT NULL DEFAULT 'OPEN',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatbot_conversations_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE chatbot_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chatbot_conversation_id BIGINT UNSIGNED NOT NULL,
    sender_role ENUM('USER', 'BOT', 'SYSTEM') NOT NULL,
    message TEXT NOT NULL,
    rating TINYINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chatbot_messages_conversation
        FOREIGN KEY (chatbot_conversation_id) REFERENCES chatbot_conversations(id)
        ON DELETE CASCADE
);

CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(500) NOT NULL,
    data_type ENUM('STRING', 'INT', 'BOOLEAN', 'JSON') NOT NULL DEFAULT 'STRING',
    description VARCHAR(255) NULL,
    updated_by BIGINT UNSIGNED NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_system_settings_updated_by
        FOREIGN KEY (updated_by) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE admin_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NULL,
    target_id BIGINT UNSIGNED NULL,
    old_value JSON NULL,
    new_value JSON NULL,
    source_ip VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_audit_logs_actor
        FOREIGN KEY (actor_id) REFERENCES users(id)
        ON DELETE SET NULL
);
```

## New Tables DDL

```sql
CREATE TABLE subscription_plans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_vnd INT UNSIGNED NOT NULL,
    duration_days INT UNSIGNED NOT NULL,
    coin_bonus INT UNSIGNED NOT NULL DEFAULT 0,
    priority_level TINYINT UNSIGNED NOT NULL DEFAULT 5,
    max_file_size_mb INT UNSIGNED NULL,
    ocr_included BOOLEAN NOT NULL DEFAULT FALSE,
    features JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    plan_id BIGINT UNSIGNED NOT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    is_trial BOOLEAN NOT NULL DEFAULT FALSE,
    payment_id BIGINT UNSIGNED NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'CANCELED', 'TRIAL') NOT NULL DEFAULT 'ACTIVE',
    canceled_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_subscriptions_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_subscriptions_plan
        FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
    CONSTRAINT fk_user_subscriptions_payment
        FOREIGN KEY (payment_id) REFERENCES payments(id)
        ON DELETE SET NULL
);

CREATE TABLE batch_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    batch_code VARCHAR(64) NOT NULL UNIQUE,
    user_id BIGINT UNSIGNED NOT NULL,
    total_files INT UNSIGNED NOT NULL DEFAULT 0,
    completed_files INT UNSIGNED NOT NULL DEFAULT 0,
    failed_files INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('PROCESSING', 'COMPLETED', 'PARTIAL_SUCCESS', 'FAILED') NOT NULL DEFAULT 'PROCESSING',
    zip_path VARCHAR(500) NULL,
    zip_size_bytes BIGINT UNSIGNED NULL,
    zip_expired_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_batch_jobs_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE api_keys (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    prefix VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    rate_limit INT UNSIGNED NOT NULL DEFAULT 100,
    status ENUM('ACTIVE', 'DISABLED', 'REVOKED') NOT NULL DEFAULT 'ACTIVE',
    last_used_at DATETIME NULL,
    expires_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_api_keys_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE webhooks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    url VARCHAR(500) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    events JSON NOT NULL,
    status ENUM('ACTIVE', 'DISABLED') NOT NULL DEFAULT 'ACTIVE',
    last_triggered_at DATETIME NULL,
    last_http_status SMALLINT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_webhooks_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NULL,
    data JSON NULL,
    action_url VARCHAR(500) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at DATETIME NULL,
    email_sent_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE email_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    status ENUM('SENT', 'FAILED', 'BOUNCED', 'OPENED') NOT NULL DEFAULT 'SENT',
    error_message TEXT NULL,
    sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    opened_at DATETIME NULL,
    CONSTRAINT fk_email_logs_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE virus_scans (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversion_job_id BIGINT UNSIGNED NOT NULL,
    scanner VARCHAR(100) NOT NULL,
    status ENUM('CLEAN', 'INFECTED', 'ERROR', 'SKIPPED') NOT NULL,
    result TEXT NULL,
    scanned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_virus_scans_conversion_job
        FOREIGN KEY (conversion_job_id) REFERENCES conversion_jobs(id)
        ON DELETE CASCADE
);
```

---

# 7. Index đề xuất

Các index dưới đây giúp tăng tốc truy vấn thường gặp.

```sql
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

CREATE INDEX idx_conversion_jobs_user_id ON conversion_jobs(user_id);
CREATE INDEX idx_conversion_jobs_status ON conversion_jobs(status);
CREATE INDEX idx_conversion_jobs_mode ON conversion_jobs(conversion_mode);
CREATE INDEX idx_conversion_jobs_created_at ON conversion_jobs(created_at);
CREATE INDEX idx_conversion_jobs_file_expired_at ON conversion_jobs(file_expired_at);

CREATE INDEX idx_coin_transactions_user_id ON coin_transactions(user_id);
CREATE INDEX idx_coin_transactions_type ON coin_transactions(type);
CREATE INDEX idx_coin_transactions_created_at ON coin_transactions(created_at);
CREATE INDEX idx_coin_transactions_payment_id ON coin_transactions(payment_id);
CREATE INDEX idx_coin_transactions_conversion_job_id ON coin_transactions(conversion_job_id);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_assigned_support_id ON support_tickets(assigned_support_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_issue_type ON support_tickets(issue_type);

CREATE INDEX idx_support_messages_ticket_id ON support_messages(support_ticket_id);
CREATE INDEX idx_support_messages_is_read ON support_messages(is_read);

CREATE INDEX idx_chatbot_messages_conversation_id ON chatbot_messages(chatbot_conversation_id);

-- New table indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_batch_jobs_user_id ON batch_jobs(user_id);
CREATE INDEX idx_batch_jobs_status ON batch_jobs(status);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_virus_scans_job_id ON virus_scans(conversion_job_id);
CREATE INDEX idx_virus_scans_status ON virus_scans(status);

---

# 8. Dữ liệu cấu hình ban đầu

Có thể thêm dữ liệu mặc định cho bảng `system_settings` và `coin_packages`.

```sql
INSERT INTO system_settings (setting_key, setting_value, data_type, description)
VALUES
('free_max_file_size_mb', '5', 'INT', 'Dung lượng file tối đa cho chế độ miễn phí'),
('free_max_pages', '30', 'INT', 'Số trang tối đa cho chế độ miễn phí'),
('free_daily_limit', '5', 'INT', 'Số lần convert miễn phí mỗi ngày'),
('free_file_storage_hours', '1', 'INT', 'Thời gian lưu file miễn phí'),
('premium_file_storage_hours', '24', 'INT', 'Thời gian lưu file nâng cao'),
('coin_normal_per_page', '1', 'INT', 'Coin cho convert thường mỗi trang'),
('coin_ocr_per_page', '2', 'INT', 'Coin cho convert OCR mỗi trang'),
('coin_after_30_pages_per_page', '3', 'INT', 'Coin cho mỗi trang sau trang 30'),
('max_file_size_premium_mb', '50', 'INT', 'Dung lượng tối đa cho nâng cao'),
('max_pages_premium', '500', 'INT', 'Số trang tối đa cho nâng cao'),
('file_retention_original_days', '7', 'INT', 'Thời gian lưu PDF gốc (ngày)'),
('rate_limit_upload_per_minute', '10', 'INT', 'Giới hạn upload mỗi phút'),
('rate_limit_chatbot_per_minute', '30', 'INT', 'Giới hạn chatbot mỗi phút'),
('virus_scan_enabled', 'true', 'BOOLEAN', 'Bật/tắt quét virus');

INSERT INTO coin_packages (name, price_vnd, coin_amount, description, sort_order)
VALUES
('Gói 1', 10000, 100, 'Gói coin cơ bản', 1),
('Gói 2', 50000, 600, 'Gói coin tiết kiệm', 2),
('Gói 3', 100000, 1500, 'Gói coin nhiều ưu đãi', 3);
```

---

# 9. Quan hệ giữa các bảng

## 9.1. `users` và `conversion_jobs`

- Một user có thể có nhiều lần convert.
- Một lần convert có thể thuộc về user hoặc khách chưa đăng nhập.
- Quan hệ:
  - `users.id` → `conversion_jobs.user_id`

## 9.2. `users` và `payments`

- Một user có thể có nhiều giao dịch nạp tiền.
- Mỗi thanh toán thuộc về một user.
- Quan hệ:
  - `users.id` → `payments.user_id`

## 9.3. `payments` và `coin_transactions`

- Khi thanh toán thành công, hệ thống tạo giao dịch cộng coin.
- Một payment có thể tạo một giao dịch coin loại `ADD`.
- Quan hệ:
  - `payments.id` → `coin_transactions.payment_id`

## 9.4. `conversion_jobs` và `coin_transactions`

- Khi convert nâng cao thành công, hệ thống tạo giao dịch trừ coin.
- Khi convert lỗi sau khi đã trừ coin, hệ thống tạo giao dịch hoàn coin.
- Quan hệ:
  - `conversion_jobs.id` → `coin_transactions.conversion_job_id`

## 9.5. `support_tickets` và `support_messages`

- Một ticket có nhiều tin nhắn.
- Mỗi tin nhắn thuộc về một ticket.
- Quan hệ:
  - `support_tickets.id` → `support_messages.support_ticket_id`

## 9.6. `chatbot_conversations` và `chatbot_messages`

- Một phiên chatbot có nhiều tin nhắn.
- Mỗi tin nhắn thuộc về một phiên chatbot.
- Quan hệ:
  - `chatbot_conversations.id` → `chatbot_messages.chatbot_conversation_id`

## 9.7. `users` và `user_subscriptions`

- Một user có thể có nhiều subscription (active + history).
- Mỗi subscription thuộc về một user và một plan.
- Quan hệ:
  - `users.id` → `user_subscriptions.user_id`
  - `subscription_plans.id` → `user_subscriptions.plan_id`

## 9.8. `batch_jobs` và `conversion_jobs`

- Một batch chứa nhiều conversion job.
- Mỗi conversion job trong batch có `batch_job_id` trỏ về batch.
- Quan hệ:
  - `batch_jobs.id` → `conversion_jobs.batch_job_id`

## 9.9. `users` và `notifications`

- Một user có nhiều notification.
- Mỗi notification thuộc về một user.
- Quan hệ:
  - `users.id` → `notifications.user_id`

---

# 10. Luồng dữ liệu chính

## 10.1. Luồng convert miễn phí

1. Tạo bản ghi trong `conversion_jobs` với:
   - `conversion_mode = FREE`
   - `coin_estimated = 0`
   - `coin_charged = 0`
   - `status = PENDING`
2. Kiểm tra hoặc tạo bản ghi trong `free_conversion_usages`.
3. Nếu chưa vượt giới hạn, tăng `used_count`.
4. Hệ thống xử lý convert.
5. Nếu thành công:
   - Cập nhật `conversion_jobs.status = SUCCESS`.
   - Cập nhật `output_file_path`.
   - Cập nhật `file_expired_at = thời điểm hiện tại + 1 giờ`.
6. Nếu thất bại:
   - Cập nhật `conversion_jobs.status = FAILED`.
   - Lưu `error_message`.

---

## 10.2. Luồng convert nâng cao bằng coin

1. Tạo bản ghi trong `conversion_jobs` với:
   - `conversion_mode = PREMIUM`
   - `coin_estimated` theo số trang và loại xử lý.
   - `status = PENDING`
2. Kiểm tra `users.coin_balance`.
3. Nếu không đủ coin, không cho tạo yêu cầu xử lý nâng cao hoặc cập nhật yêu cầu là thất bại.
4. Nếu đủ coin, đưa yêu cầu vào hàng đợi ưu tiên.
5. Khi convert thành công:
   - Trừ coin trong `users.coin_balance`.
   - Tạo bản ghi `coin_transactions` loại `DEDUCT`.
   - Cập nhật `conversion_jobs.coin_charged`.
   - Cập nhật `conversion_jobs.status = SUCCESS`.
   - Cập nhật `file_expired_at = thời điểm hiện tại + 24 giờ`.
6. Nếu convert thất bại:
   - Cập nhật `conversion_jobs.status = FAILED`.
   - Nếu trước đó đã trừ coin, tạo `coin_transactions` loại `REFUND`.

---

## 10.3. Luồng nạp coin

1. Người dùng chọn gói coin.
2. Tạo bản ghi trong `payments` với `status = PENDING`.
3. Người dùng thanh toán.
4. Hệ thống nhận kết quả thanh toán.
5. Nếu thành công:
   - Cập nhật `payments.status = SUCCESS`.
   - Cập nhật `payments.paid_at`.
   - Cộng coin vào `users.coin_balance`.
   - Tạo bản ghi `coin_transactions` loại `ADD`.
6. Nếu thất bại hoặc hủy:
   - Cập nhật `payments.status = FAILED` hoặc `CANCELED`.

---

## 10.4. Luồng khiếu nại/hỗ trợ

1. Người dùng tạo ticket trong `support_tickets`.
2. Nếu liên quan đến convert, lưu `related_conversion_job_id`.
3. Nếu liên quan đến thanh toán, lưu `related_payment_id`.
4. Người dùng và hỗ trợ viên trao đổi trong `support_messages`.
5. Khi xử lý xong, cập nhật `support_tickets.status = RESOLVED`.

---

# 11. Lưu ý triển khai quan trọng

## 11.1. Tránh trừ coin sai

Khi trừ coin, cần thực hiện trong database transaction:

```sql
START TRANSACTION;

SELECT coin_balance
FROM users
WHERE id = :user_id
FOR UPDATE;

-- Kiểm tra đủ coin ở tầng backend
-- Sau đó cập nhật số dư

UPDATE users
SET coin_balance = coin_balance - :coin_amount
WHERE id = :user_id
  AND coin_balance >= :coin_amount;

INSERT INTO coin_transactions (
    transaction_code,
    user_id,
    conversion_job_id,
    type,
    amount,
    balance_before,
    balance_after,
    reason,
    status
) VALUES (
    :transaction_code,
    :user_id,
    :conversion_job_id,
    'DEDUCT',
    :coin_amount,
    :balance_before,
    :balance_after,
    'Convert PDF to DOCX nâng cao',
    'SUCCESS'
);

COMMIT;
```

## 11.2. Tránh cộng coin hai lần

- `payments.provider_transaction_code` nên được kiểm tra trùng.
- `coin_transactions.transaction_code` phải unique.
- Khi nhận callback thanh toán, nếu payment đã `SUCCESS` thì không cộng coin lần nữa.

## 11.3. Tránh vượt giới hạn miễn phí

Khi tăng số lần convert miễn phí, nên dùng transaction hoặc câu SQL cập nhật có điều kiện.

```sql
UPDATE free_conversion_usages
SET used_count = used_count + 1
WHERE identity_type = :identity_type
  AND identity_value = :identity_value
  AND usage_date = CURRENT_DATE
  AND used_count < daily_limit;
```

Nếu số dòng bị ảnh hưởng bằng 0, nghĩa là người dùng đã vượt giới hạn hoặc chưa có bản ghi phù hợp.

## 11.4. Không lưu file trực tiếp trong database

Chỉ nên lưu:

- `original_file_path`
- `output_file_path`
- `attachment_path`

File thật nên lưu trong:

- Local storage của server.
- Object storage như S3, MinIO, Cloudflare R2.
- Hoặc dịch vụ cloud tương đương.

## 11.5. Tự động xóa file hết hạn

Nên có cron job hoặc background worker chạy định kỳ:

1. Tìm các bản ghi `conversion_jobs` có `file_expired_at < NOW()`.
2. Xóa file vật lý khỏi storage.
3. Cập nhật `deleted_at`.
4. Cập nhật `status = DELETED` hoặc `EXPIRED`.

---

# 12. Bảng tối thiểu cho phiên bản MVP

Nếu muốn làm bản đầu tiên đơn giản, có thể bắt đầu với các bảng sau:

1. `users`
2. `refresh_tokens`
3. `password_reset_tokens`
4. `coin_packages`
5. `payments`
6. `conversion_jobs`
7. `coin_transactions`
8. `free_conversion_usages`
9. `support_tickets`
10. `support_messages`
11. `system_settings`

Các bảng chatbot, audit log và future tables có thể thêm ở phiên bản nâng cấp.

---

# 13. Gợi ý thứ tự tạo migration

Nên tạo bảng theo thứ tự sau để tránh lỗi khóa ngoại:

### Bảng core (MVP)
1. `users`
2. `refresh_tokens`
3. `password_reset_tokens`
4. `coin_packages`
5. `payments`
6. `conversion_jobs`
7. `coin_transactions`
8. `free_conversion_usages`
9. `support_tickets`
10. `support_messages`
11. `system_settings`
12. `admin_audit_logs`

### Bảng phase sau (có thể tạo migration riêng)
13. `chatbot_conversations`
14. `chatbot_messages`
15. `subscription_plans` (Phase 4)
16. `user_subscriptions` (Phase 4 — cần `payments` có trước)
17. `batch_jobs` (Phase 3)
18. `api_keys` (Phase 4)
19. `webhooks` (Phase 4)
20. `notifications` (Phase 3)
21. `email_logs` (Phase 4)
22. `virus_scans` (Phase 5 — cần `conversion_jobs` có trước)

---

# 14. Kết luận

Thiết kế database trên đáp ứng các yêu cầu chính của hệ thống:

- Người dùng có thể đăng ký, đăng nhập và quản lý tài khoản.
- Người dùng có thể upload PDF và convert sang DOCX.
- Hệ thống hỗ trợ hai chế độ: miễn phí và nâng cao tốn coin.
- Hệ thống quản lý số dư coin và lịch sử giao dịch coin.
- Người dùng có thể nạp tiền mua coin.
- Admin có thể quản lý người dùng, gói coin, giao dịch, lịch sử convert và thống kê.
- Hỗ trợ viên có thể xử lý khiếu nại và nhắn tin với người dùng.
- Chatbot AI có thể hỗ trợ trả lời các câu hỏi cơ bản.
- Hệ thống có thể mở rộng thêm OCR, hàng đợi xử lý, thanh toán tự động và thống kê nâng cao.
