## 4. Viết API Specification

Sau UI/UX, bạn nên viết tài liệu API trước khi code backend.

Tài liệu này nên đặt tên là:

api_spec.md

Nội dung cần có:

### Auth API

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password

### User API

GET /api/me
PUT /api/me
GET /api/me/coin-balance

### Upload/Conversion API

POST /api/files/presigned-upload-url
POST /api/conversions/estimate
POST /api/conversions
GET /api/conversions/{id}
GET /api/conversions
GET /api/conversions/{id}/download-url

### Coin API

GET /api/coins/balance
GET /api/coins/transactions

### Payment API

GET /api/coin-packages
POST /api/payments
GET /api/payments

### Support API

POST /api/support/tickets
GET /api/support/tickets
GET /api/support/tickets/{id}
POST /api/support/tickets/{id}/messages

### Admin API

GET /api/admin/users
GET /api/admin/conversions
GET /api/admin/payments
POST /api/admin/coin-packages
PUT /api/admin/coin-packages/{id}
GET /api/admin/statistics
PUT /api/admin/settings

Viết API spec trước sẽ giúp frontend và backend không bị lệch nhau.

## 5. Thiết kế chi tiết luồng convert file

Đây là nghiệp vụ quan trọng nhất của dự án.

Luồng nên thiết kế như sau:

Frontend xin presigned upload URL
        ↓
Backend tạo URL upload S3
        ↓
Frontend upload PDF trực tiếp lên S3
        ↓
Frontend gọi API tạo conversion job
        ↓
Backend lưu metadata vào MySQL
        ↓
Backend gửi message vào SQS
        ↓
Python Worker nhận job
        ↓
Worker tải PDF từ S3
        ↓
Worker convert sang DOCX
        ↓
Worker upload DOCX lên S3
        ↓
Worker cập nhật trạng thái job
        ↓
Frontend polling trạng thái
        ↓
Người dùng tải file DOCX

Trong yêu cầu của bạn, cả convert miễn phí và nâng cao đều có bước kiểm tra file, đưa vào hàng đợi xử lý, convert sang DOCX, sau đó người dùng tải file kết quả. Convert nâng cao còn cần tính coin, kiểm tra số dư, trừ coin hoặc hoàn coin nếu lỗi.

## 6. Thiết kế trạng thái hệ thống

Trước khi code, bạn nên chốt trạng thái cho các nghiệp vụ chính.

### Trạng thái conversion job

PENDING
UPLOADED
QUEUED
PROCESSING
SUCCESS
FAILED
EXPIRED
DELETED

### Trạng thái payment

PENDING
SUCCESS
FAILED
CANCELED

### Trạng thái coin transaction

PENDING
SUCCESS
FAILED
CANCELED

### Trạng thái support ticket

NEW
IN_PROGRESS
REPLIED
RESOLVED
CANCELED

Việc chốt trạng thái sớm giúp backend, frontend, worker và admin dashboard thống nhất với nhau.

## 7. Lập backlog công việc

Sau API và luồng nghiệp vụ, bạn nên chia toàn bộ dự án thành task nhỏ.

Ví dụ:

### Sprint 1 — Khởi tạo dự án

* Tạo monorepo hoặc nhiều repo.
* Tạo project Next.js.
* Tạo project Spring Boot.
* Tạo Python worker.
* Tạo Docker Compose local.
* Tạo MySQL local.
* Tạo LocalStack S3/SQS hoặc MinIO + SQS local.
* Tạo cấu trúc thư mục chuẩn.

### Sprint 2 — Database và authentication

* Tạo migration database.
* Tạo bảng `users`.
* Tạo bảng `password_reset_tokens`.
* Tạo JWT login.
* Tạo phân quyền `USER`, `ADMIN`, `SUPPORT`.
* Tạo API `/api/me`.

### Sprint 3 — Upload file và S3-compatible storage

* Tạo service sinh presigned upload URL.
* Frontend upload PDF lên storage.
* Lưu metadata file.
* Kiểm tra định dạng PDF.
* Kiểm tra dung lượng.
* Kiểm tra số trang.

### Sprint 4 — Conversion job và worker

* Tạo bảng `conversion_jobs`.
* Tạo API tạo conversion job.
* Gửi message vào queue.
* Worker nhận job.
* Worker tải PDF từ storage.
* Worker convert sang DOCX.
* Worker upload kết quả.
* Cập nhật trạng thái job.

### Sprint 5 — Coin và convert nâng cao

* Tạo bảng `coin_transactions`.
* Tạo logic tính coin.
* Kiểm tra số dư coin.
* Trừ coin bằng transaction.
* Hoàn coin khi convert lỗi.
* Hiển thị lịch sử giao dịch coin.

Schema của bạn đã nhấn mạnh khi cộng/trừ coin cần lưu lịch sử giao dịch, tránh trừ coin sai, tránh cộng coin hai lần và dùng transaction khi cần.

### Sprint 6 — Payment giả lập và admin

* Tạo bảng `coin_packages`.
* Tạo bảng `payments`.
* Admin tạo/sửa gói coin.
* User tạo yêu cầu nạp coin.
* Admin xác nhận thanh toán.
* Hệ thống cộng coin.

### Sprint 7 — Lịch sử và tải file

* Trang lịch sử convert.
* Trang lịch sử coin.
* API tải file bằng signed URL.
* Kiểm tra quyền tải file.
* Xử lý file hết hạn.
* Job tự động xóa file hết hạn.

Yêu cầu của bạn đã xác định file miễn phí lưu 1 giờ, file dùng coin lưu 24 giờ, và người dùng chỉ tải lại được nếu file còn hạn.

### Sprint 8 — Hỗ trợ/khiếu nại

* Tạo bảng `support_tickets`.
* Tạo bảng `support_messages`.
* User tạo khiếu nại.
* Support/admin phản hồi.
* Liên kết ticket với payment hoặc conversion job.

## 8. Setup môi trường local trước

Vì bạn hướng tới production trên AWS, local nên mô phỏng gần giống production.

Theo file kiến trúc của bạn, local development nên dùng:

<pre class="overflow-visible! px-0!" data-start="8501" data-end="8598"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>Next.js + Spring Boot + MySQL Docker + LocalStack S3 + LocalStack SQS + Python Worker</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Còn production sẽ là:

<pre class="overflow-visible! px-0!" data-start="8623" data-end="8740"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>Next.js + Spring Boot + RDS MySQL + S3 + CloudFront + SQS + ElastiCache Redis + Python Worker ECS/Fargate</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Vì vậy bước kỹ thuật tiếp theo nên là tạo:

<pre class="overflow-visible! px-0!" data-start="8825" data-end="8911"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>docker-compose.yml</span><br/><span>.env.example</span><br/><span>frontend/</span><br/><span>backend/</span><br/><span>worker/</span><br/><span>database/</span><br/><span>docs/</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

Cấu trúc dự án nên bắt đầu như sau:

<pre class="overflow-visible! px-0!" data-start="8950" data-end="9251"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>pdf-to-word/</span><br/><span>├── frontend/</span><br/><span>├── backend/</span><br/><span>├── worker/</span><br/><span>├── database/</span><br/><span>│   ├── migrations/</span><br/><span>│   └── seed/</span><br/><span>├── docs/</span><br/><span>│   ├── requires.md</span><br/><span>│   ├── analystic_system.md</span><br/><span>│   ├── schema.md</span><br/><span>│   ├── tech_arch.md</span><br/><span>│   ├── api_spec.md</span><br/><span>│   └── backlog.md</span><br/><span>├── docker-compose.yml</span><br/><span>├── .env.example</span><br/><span>└── README.md</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

## 9. Thứ tự làm thực tế nên là

Theo mình, thứ tự tốt nhất là:

<pre class="overflow-visible! px-0!" data-start="9318" data-end="9793"><div class="relative w-full mt-4 mb-1"><div class=""><div class="contents"><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="relative"><div class="pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><pre class="cm-content q9tKkq_readonly m-0"><code><span>1. Chốt MVP</span><br/><span>2. Cập nhật schema cho S3/SQS</span><br/><span>3. Thiết kế UI flow/wireframe</span><br/><span>4. Viết API spec</span><br/><span>5. Viết backlog/task list</span><br/><span>6. Setup repo + Docker Compose local</span><br/><span>7. Code backend auth + database migration</span><br/><span>8. Code upload S3-compatible</span><br/><span>9. Code conversion job + queue</span><br/><span>10. Code Python worker convert file</span><br/><span>11. Code coin/payment giả lập</span><br/><span>12. Code frontend user flow</span><br/><span>13. Code admin cơ bản</span><br/><span>14. Test toàn bộ local</span><br/><span>15. Deploy staging lên AWS</span><br/><span>16. Tối ưu, bảo mật, logging</span><br/><span>17. Production</span></code></pre></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></div></pre>

## 10. Việc nên làm ngay tiếp theo

Việc tiếp theo hợp lý nhất của bạn là tạo **3 tài liệu còn thiếu** trước khi bắt đầu code:

1. `ui_flow.md` — mô tả màn hình và luồng giao diện.
2. `api_spec.md` — mô tả toàn bộ API backend.
3. `backlog.md` — chia task theo sprint để bắt đầu lập trình.

Trong 3 file này,  **nên làm `api_spec.md` trước** , vì nó là cầu nối giữa yêu cầu, database, frontend, backend và worker. Sau đó mới setup project và code.
