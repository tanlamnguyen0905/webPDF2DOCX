---
**Ngày**: 2026-06-27
**Phiên bản**: 2.0
**Mục tiêu**: Danh sách task nâng cao (Phiên bản sau MVP) cho website Convert PDF to Word
**Tác giả**: Claude
**Tóm tắt**: Các tính năng mở rộng sau khi MVP hoạt động ổn định, bao gồm thanh toán thật, OCR, chatbot AI, API bên thứ ba
---

# Task Nâng cao - Phiên bản sau MVP

## 1. Thanh toán & Giao dịch

### 1.1. Tích hợp thanh toán MoMo
- **Mô tả**: Tích hợp cổng thanh toán MoMo để nạp coin thật
- **Mapping**: requires.md §3.5, §8.2, §12.1
- **Tiêu chí hoàn thành**:
  - [ ] Tích hợp MoMo API (sandbox + production)
  - [ ] Tạo giao dịch thanh toán với MoMo
  - [ ] Xử lý callback/notify từ MoMo
  - [ ] Cộng coin tự động khi thanh toán thành công
  - [ ] Lưu mã giao dịch MoMo để đối chiếu
  - [ ] Xử lý các trường hợp: timeout, hủy, thất bại
- **Ưu tiên**: High
- **Dependencies**: task_now.md §6.2

### 1.2. Tích hợp thanh toán VNPAY
- **Mô tả**: Tích hợp cổng thanh toán VNPAY
- **Mapping**: requires.md §3.5, §8.2, §12.1
- **Tiêu chí hoàn thành**:
  - [ ] Tích hợp VNPAY API
  - [ ] Tạo URL thanh toán và xử lý return URL
  - [ ] Xác thựchữ ký số (checksum) từ VNPAY
  - [ ] Cộng coin tự động khi thành công
- **Ưu tiên**: High
- **Dependencies**: task_now.md §6.2

### 1.3. Đối chiếu giao dịch tự động
- **Mô tả**: Tự động đối chiếu giao dịch với cổng thanh toán
- **Mapping**: requires.md §3.5, §5.3
- **Tiêu chí hoàn thành**:
  - [ ] Cron job chạy định kỳ đối chiếu
  - [ ] Phát hiện giao dịch chưa cộng coin
  - [ ] Thông báo admin nếu có sai lệch
- **Ưu tiên**: Medium
- **Dependencies**: 1.1, 1.2

---

## 2. Xử lý file nâng cao

### 2.1. OCR cho PDF scan
- **Mô tả**: Nhận dạng văn bản từ PDF dạng ảnh (scanned PDF)
- **Mapping**: requires.md §3.3, §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Tích hợp thư viện OCR (Tesseract hoặc cloud OCR)
  - [ ] Phân biệt PDF text vs PDF scan
  - [ ] Tự động áp dụng OCR cho PDF scan
  - [ ] Tính phí OCR: 2 coin/trang
  - [ ] Hỗ trợ đa ngôn ngữ (Việt, Anh)
- **Ưu tiên**: High
- **Dependencies**: task_now.md §3.2

### 2.2. Cải thiện giữ định dạng
- **Mô tả**: Giữ nguyên bố cục, bảng biểu, hình ảnh, font chữ tốt hơn
- **Mapping**: requires.md §3.3, §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Giữ nguyên bảng biểu khi convert
  - [ ] Giữ nguyên hình ảnh trong PDF
  - [ ] Nhận diện và map font chữ
  - [ ] Giữ nguyên headers, footers, page numbers
- **Ưu tiên**: Medium
- **Dependencies**: task_now.md §3.1, 3.2

### 2.3. Convert file dung lượng lớn
- **Mô tả**: Hỗ trợ file PDF dung lượng lớn (trên 50MB)
- **Mapping**: requires.md §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Tối ưu bộ nhớ khi xử lý file lớn
  - [ ] Stream processing thay vì load toàn bộ vào RAM
  - [ ] Tăng giới hạn upload lên 100MB
- **Ưu tiên**: Low
- **Dependencies**: task_now.md §2.1

### 2.4. Tối ưu chất lượng file Word đầu ra
- **Mô tả**: Cải thiện chất lượng .docx đầu ra
- **Mapping**: requires.md §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Giảm kích thước file đầu ra
  - [ ] Cải thiện độ chính xác của layout
  - [ ] Test với nhiều loại PDF khác nhau
- **Ưu tiên**: Low
- **Dependencies**: 2.2

---

## 3. Hàng đợi & Hiệu năng

### 3.1. Hàng đợi xử lý file chuyên nghiệp
- **Mô tả**: Sử dụng message queue (SQS/RabbitMQ) để xử lý convert
- **Mapping**: requires.md §4.2, §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Tích hợp SQS hoặc RabbitMQ
  - [ ] Tạo producer đưa task vào queue
  - [ ] Tạo worker consume và xử lý convert
  - [ ] Xử lý retry khi lỗi
  - [ ] Dead letter queue cho task thất bại
- **Ưu tiên**: High
- **Dependencies**: task_now.md §3.1, 3.2

### 3.2. Ưu tiên xử lý cho người dùng dùng coin
- **Mô tả**: File convert nâng cao được ưu tiên trong hàng đợi
- **Mapping**: requires.md §4.2, §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Hàng đợi ưu tiên (priority queue)
  - [ ] File coin user được xử lý trước
  - [ ] Cấu hình hệ số ưu tiên
- **Ưu tiên**: Medium
- **Dependencies**: 3.1

### 3.3. Cache layer
- **Mô tả**: Cache dữ liệu frequently-accessed
- **Mapping**: requires.md §12.2
- **Tiêu chí hoàn thành**:
  - [ ] Cache profile user
  - [ ] Cache file kết quả cỡ nhỏ
  - [ ] Cache bản xem trước (preview)
  - [ ] Cấu hình TTL phù hợp
- **Ưu tiên**: Low
- **Dependencies**: -

### 3.4. Tự động xóa file hết hạn
- **Mô tả**: Cron job xóa file sau thời gian hết hạn
- **Mapping**: requires.md §3.6, §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Cron job chạy định kỳ (mỗi giờ)
  - [ ] Xóa file DOCX miễn phí sau 1 giờ
  - [ ] Xóa file DOCX nâng cao sau 24 giờ
  - [ ] Xóa file PDF gốc sau 7 ngày
- **Ưu tiên**: Medium
- **Dependencies**: task_now.md §4.1

---

## 4. Chatbot AI & Hỗ trợ

### 4.1. Chatbot AI thật
- **Mô tả**: Chatbot trả lời tự động các câu hỏi phổ biến
- **Mapping**: requires.md §3.9, §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Tích hợp LLM API (Claude/GPT)
  - [ ] Xây dựng knowledge base (FAQ)
  - [ ] Chat interface trên website
  - [ ] Trả lời các chủ đề: upload, convert, coin, lỗi thường gặp
  - [ ] Escalate sang support nếu không giải quyết được
  - [ ] Lưu lịch sử chat
- **Ưu tiên**: High
- **Dependencies**: task_now.md §8.1

### 4.2. Hệ thống nhắn tin trực tiếp (Real-time chat)
- **Mô tả**: Chat real-time giữa user và support viên
- **Mapping**: requires.md §8.2
- **Tiêu chí hoàn thành**:
  - [ ] WebSocket/Socket.io cho real-time
  - [ ] Chat box trên website
  - [ ] Support viên xem danh sách cuộc trò chuyện
  - [ ] Phân bổ cuộc trò chuyện cho support viên
  - [ ] Lưu lịch sử tin nhắn
- **Ưu tiên**: Medium
- **Dependencies**: 4.1, task_now.md §8.1

### 4.3. Phân quyền hỗ trợ viên chi tiết
- **Mô tả**: Quản lý vai trò và quyền của support viên
- **Mapping**: requires.md §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Phân quyền: chỉ xem khiếu nại, không quản lý coin/user
  - [ ] Admin có thể tạo tài khoản support
  - [ ] Log mọi hành động của support
- **Ưu tiên**: Medium
- **Dependencies**: task_now.md §7.1

### 4.4. Quản lý khiếu nại theo workflow
- **Mô tả**: Quy trình xử lý khiếu nại với các trạng thái
- **Mapping**: requires.md §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Trạng thái: mới → đang xử lý → đã phản hồi → hoàn tất → hủy
  - [ ] Mức độ ưu tiên: thấp, trung bình, cao, khẩn cấp
  - [ ] Lọc và tìm kiếm khiếu nại
  - [ ] Lịch sử phản hồi
- **Ưu tiên**: Medium
- **Dependencies**: task_now.md §8.1

---

## 5. Tính năng mở rộng

### 5.1. Convert nhiều file cùng lúc (Batch)
- **Mô tả**: Upload và convert nhiều file PDF cùng lúc
- **Mapping**: requires.md §8.2, §12.1
- **Tiêu chí hoàn thành**:
  - [ ] Upload nhiều file (drag & drop hoặc chọn nhiều)
  - [ ] Xếp hàng đợi xử lý batch
  - [ ] Hiển thị tiến trình cho từng file
  - [ ] Download batch (file ZIP)
- **Ưu tiên**: Medium
- **Dependencies**: 3.1, task_now.md §2.1

### 5.2. Gói thành viên theo tháng
- **Mô tả**: Subscription model - gói thành viên hàng tuần/tháng
- **Mapping**: requires.md §8.2, §12.1
- **Tiêu chí hoàn thành**:
  - [ ] Tạo các gói subscription (tuần, tháng, năm)
  - [ ] Tích hợp thanh toán định kỳ (recurring payment)
  - [ ] User có số lượng convert không giới hạn (theo gói)
  - [ ] Tự động gia hạn và thông báo
  - [ ] Hủy subscription
- **Ưu tiên**: High
- **Dependencies**: 1.1, 1.2

### 5.3. API cho bên thứ ba
- **Mô tả**: Mở API REST cho đối tác sử dụng dịch vụ convert
- **Mapping**: requires.md §8.2, §12.1
- **Tiêu chí hoàn thành**:
  - [ ] API key management
  - [ ] REST API: upload, convert, download
  - [ ] Rate limit cho API
  - [ ] API documentation (Swagger/OpenAPI)
  - [ ] Versioning API (v1, v2)
  - [ ] Webhook notification khi convert hoàn tất
- **Ưu tiên**: Medium
- **Dependencies**: task_now.md §3.1, 3.2

### 5.4. Bộ lọc nâng cao cho lịch sử
- **Mô tả**: Sắp xếp và lọc lịch sử convert chi tiết hơn
- **Mapping**: requires.md §12.1
- **Tiêu chí hoàn thành**:
  - [ ] Lọc theo dung lượng file
  - [ ] Lọc theo số trang
  - [ ] Lọc theo loại xử lý (OCR/thường)
  - [ ] Sắp xếp theo thời gian, dung lượng, số trang
- **Ưu tiên**: Low
- **Dependencies**: task_now.md §5.1

### 5.5. Push notification
- **Mô tả**: Thông báo khi convert hoàn tất
- **Mapping**: requires.md §8.2, §12.1
- **Tiêu chí hoàn thành**:
  - [ ] Gửi email thông báo khi convert hoàn tất
  - [ ] Gửi email xác nhận khi nạp coin thành công
  - [ ] Web notification (nếu user đang online)
- **Ưu tiên**: Medium
- **Dependencies**: 1.1, 1.2, task_now.md §3.1

---

## 6. Dashboard & Thống kê

### 6.1. Dashboard thống kê nâng cao
- **Mô tả**: Bảng điều khiển thống kê cho admin
- **Mapping**: requires.md §3.8, §8.2
- **Tiêu chí hoàn thành**:
  - [ ] Thống kê lượng nạp coin (theo ngày/tháng/năm)
  - [ ] Thống kê doanh thu
  - [ ] Thống kê lượt convert (miễn phí vs nâng cao)
  - [ ] Thống kê lỗi convert
  - [ ] Biểu đồ real-time
  - [ ] Export báo cáo (CSV/Excel)
- **Ưu tiên**: Medium
- **Dependencies**: task_now.md §7.5

### 6.2. Theo dõi tài nguyên hệ thống
- **Mô tả**: Giám sát health của hệ thống
- **Mapping**: requires.md §3.8, §12.2
- **Tiêu chí hoàn thành**:
  - [ ] Hiển thị số lượng file đang xử lý
  - [ ] Hiển thị trạng thái hàng đợi
  - [ ] Hiển thị số lượt convert real-time
  - [ ] Cảnh báo khi hệ thống quá tải
- **Ưu tiên**: Low
- **Dependencies**: 3.1

---

## 7. Bảo mật nâng cao

### 7.1. Rate limiting
- **Mô tả**: Giới hạn số request để tránh lạm dụng
- **Mapping**: requires.md §4.1, §14.1
- **Tiêu chí hoàn thành**:
  - [ ] Rate limit cho upload (ví dụ: 10 lần/phút/user)
  - [ ] Rate limit cho API
  - [ ] Chặn IP sau N lần vi phạm
- **Ưu tiên**: Medium
- **Dependencies**: -

### 7.2. Virus scan file upload
- **Mô tả**: Quét virus cho file PDF upload
- **Mapping**: requires.md §14.2
- **Tiêu chí hoàn thành**:
  - [ ] Tích hợp virus scanning (ClamAV hoặc cloud service)
  - [ ] Quét file trước khi lưu
  - [ ] Xóa file nhiễm virus và thông báo
- **Ưu tiên**: Medium
- **Dependencies**: task_now.md §2.1

---

## Tổng kết

| Nhóm | Số task | Ưu tiên High | Ưu tiên Medium | Ưu tiên Low |
|------|---------|--------------|----------------|--------------|
| Thanh toán & Giao dịch | 3 | 2 | 1 | 0 |
| Xử lý file nâng cao | 4 | 1 | 1 | 2 |
| Hàng đợi & Hiệu năng | 4 | 1 | 2 | 1 |
| Chatbot & Hỗ trợ | 4 | 1 | 3 | 0 |
| Tính năng mở rộng | 5 | 1 | 3 | 1 |
| Dashboard & Thống kê | 2 | 0 | 1 | 1 |
| Bảo mật nâng cao | 2 | 0 | 2 | 0 |
| **Tổng** | **24** | **6** | **13** | **5** |

---

## Timeline đề xuất

| Giai đoạn | Thời gian | Task |
|-----------|-----------|------|
| MVP | 2-3 tuần | task_now.md (31 task) |
| Phase 2 | 2 tuần | 1.1, 1.2, 2.1, 3.1, 4.1 |
| Phase 3 | 2 tuần | 3.2, 3.4, 4.2, 4.3, 4.4, 5.1 |
| Phase 4 | 2 tuần | 5.2, 5.3, 5.5, 6.1 |
| Phase 5 | 1-2 tuần | 2.2, 2.3, 2.4, 3.3, 5.4, 6.2, 7.1, 7.2 |
