---
**Ngày**: 2026-06-27
**Phiên bản**: 2.0
**Mục tiêu**: Danh sách task MVP (Phiên bản đầu tiên) cho website Convert PDF to Word
**Tác giả**: Claude
**Tóm tắt**: Các task cốt lõi để hệ thống hoạt động được, bao gồm xác thực, upload, convert, coin management, admin cơ bản
---

# Task MVP - Phiên bản đầu tiên

## 1. Xác thực & Quản lý tài khoản

### 1.1. Đăng ký tài khoản
- **Mô tả**: Cho phép người dùng tạo tài khoản bằng email và mật khẩu
- **Mapping**: requires.md §3.1
- **Tiêu chí hoàn thành**:
  - [ ] Form đăng ký với email, mật khẩu, xác nhận mật khẩu
  - [ ] Validate định dạng email, độ dài mật khẩu tối thiểu 8 ký tự
  - [ ] Kiểm tra email đã tồn tại chưa
  - [ ] Mã hóa mật khẩu bằng bcrypt trước khi lưu DB
  - [ ] Tự động cộng coin khởi điểm (ví dụ: 10 coin) cho user mới
- **Ưu tiên**: High
- **Dependencies**: -

### 1.2. Đăng nhập
- **Mô tả**: Cho phép người dùng đăng nhập bằng email và mật khẩu
- **Mapping**: requires.md §3.1
- **Tiêu chí hoàn thành**:
  - [ ] Form đăng nhập email, mật khẩu
  - [ ] Tạo JWT token (access token + refresh token)
  - [ ] Lưu token ở httpOnly cookie
  - [ ] Trang thông báo lỗi khi sai thông tin
- **Ưu tiên**: High
- **Dependencies**: 1.1

### 1.3. Đăng xuất
- **Mô tả**: Người dùng có thể đăng xuất khỏi hệ thống
- **Mapping**: requires.md §3.1
- **Tiêu chí hoàn thành**:
  - [ ] Nút đăng xuất trên header
  - [ ] Xóa token/ invalidate session
- **Ưu tiên**: Medium
- **Dependencies**: 1.2

### 1.4. Quên mật khẩu
- **Mô tả**: Cho phép người dùng đặt lại mật khẩu qua email
- **Mapping**: requires.md §3.1
- **Tiêu chí hoàn thành**:
  - [ ] Form nhập email để yêu cầu reset
  - [ ] Gửi email chứa link reset (có token hết hạn 15 phút)
  - [ ] Form đặt lại mật khẩu mới
  - [ ] Thông báo thành công
- **Ưu tiên**: Medium
- **Dependencies**: 1.1

### 1.5. Cập nhật thông tin cá nhân
- **Mô tả**: Người dùng có thể cập nhật họ tên, avatar
- **Mapping**: requires.md §3.1
- **Tiêu chí hoàn thành**:
  - [ ] Trang profile hiển thị thông tin hiện tại
  - [ ] Form chỉnh sửa họ tên
  - [ ] Hiển thị số dư coin hiện tại
- **Ưu tiên**: Low
- **Dependencies**: 1.2

---

## 2. Upload & Kiểm tra file PDF

### 2.1. Upload file PDF
- **Mô tả**: Người dùng tải file PDF từ thiết bị lên hệ thống
- **Mapping**: requires.md §3.2
- **Tiêu chí hoàn thành**:
  - [ ] Drag & drop hoặc nút chọn file
  - [ ] Hiển thị thanh tiến trình upload
  - [ ] Hỗ trợ upload file lớn (chunked upload nếu cần)
- **Ưu tiên**: High
- **Dependencies**: -

### 2.2. Kiểm tra định dạng PDF
- **Mô tả**: Xác nhận file upload thực sự là PDF hợp lệ
- **Mapping**: requires.md §3.2, §14.2
- **Tiêu chí hoàn thành**:
  - [ ] Kiểm tra magic bytes (`%PDF`)
  - [ ] Phát hiện file giả mạo đuôi .pdf
  - [ ] Thông báo lỗi rõ ràng nếu không phải PDF
- **Ưu tiên**: High
- **Dependencies**: 2.1

### 2.3. Kiểm tra dung lượng file
- **Mô tả**: Đảm bảo file nằm trong giới hạn cho phép
- **Mapping**: requires.md §3.2, §3.3
- **Tiêu chí hoàn thành**:
  - [ ] Với miễn phí: giới hạn ≤ 5MB
  - [ ] Với nâng cao: giới hạn ≤ 50MB (cấu hình được)
  - [ ] Thông báo lỗi khi vượt quá
- **Ưu tiên**: High
- **Dependencies**: 2.1

### 2.4. Kiểm tra số trang
- **Mô tả**: Đếm số trang PDF để tính coin và kiểm tra giới hạn
- **Mapping**: requires.md §3.2, §3.3
- **Tiêu chí hoàn thành**:
  - [ ] Parse PDF lấy số trang
  - [ ] Miễn phí: giới hạn ≤ 30 trang
  - [ ] Thông báo lỗi khi vượt quá giới hạn
- **Ưu tiên**: High
- **Dependencies**: 2.1

### 2.5. Hiển thị thông tin file trước khi convert
- **Mô tả**: Hiển thị tên file, dung lượng, số trang và phí coin dự kiến
- **Mapping**: requires.md §3.2, §3.3
- **Tiêu chí hoàn thành**:
  - [ ] Hiển thị: tên file, dung lượng (MB), số trang
  - [ ] Hiển thị phí coin nếu chọn nâng cao
  - [ ] Hiển thị miễn phí nếu đủ điều kiện
- **Ưu tiên**: High
- **Dependencies**: 2.2, 2.3, 2.4

### 2.6. Xóa file đã chọn
- **Mô tả**: Cho phép người dùng xóa file đã chọn trước khi convert
- **Mapping**: requires.md §3.2
- **Tiêu chí hoàn thành**:
  - [ ] Nút xóa file
  - [ ] Reset trạng thái về ban đầu
- **Ưu tiên**: Low
- **Dependencies**: 2.1

---

## 3. Convert PDF sang Word

### 3.1. Convert miễn phí
- **Mô tả**: Chuyển đổi PDF sang DOCX không tốn coin với giới hạn
- **Mapping**: requires.md §3.3, §5.1
- **Tiêu chí hoàn thành**:
  - [ ] Kiểm tra điều kiện: ≤ 5MB, ≤ 30 trang, ≤ 5 lần/ngày
  - [ ] Đưa vào hàng đợi xử lý
  - [ ] Hiển thị trạng thái: đang chờ → đang xử lý → hoàn tất
  - [ ] Thông báo lỗi rõ ràng nếu vượt giới hạn và gợi ý dùng nâng cao
- **Ưu tiên**: High
- **Dependencies**: 2.1, 2.2, 2.3, 2.4

### 3.2. Convert nâng cao bằng coin
- **Mô tả**: Chuyển đổi PDF sang DOCX chất lượng cao, tốn coin
- **Mapping**: requires.md §3.3, §5.2
- **Tiêu chí hoàn thành**:
  - [ ] Tính coin theo công thức: 1 coin/trang (thường), 2 coin/trang (OCR), 3 coin/trang (trang > 30)
  - [ ] Kiểm tra số dư coin trước khi cho phép convert
  - [ ] Đưa vào hàng đợi ưu tiên
  - [ ] Trừ coin sau khi thành công
  - [ ] Hoàn coin nếu convert thất bại do lỗi hệ thống
- **Ưu tiên**: High
- **Dependencies**: 2.1, 2.2, 2.3, 2.4, 3.1

### 3.3. Tính coin dự kiến
- **Mô tả**: Hiển thị số coin sẽ trừ trước khi người dùng xác nhận
- **Mapping**: requires.md §3.3
- **Tiêu chí hoàn thành**:
  - [ ] Tính dựa trên số trang, loại xử lý
  - [ ] Hiển thị rõ ràng trên UI
  - [ ] Nút xác nhận trừ coin
- **Ưu tiên**: High
- **Dependencies**: 3.2

### 3.4. Trừ coin khi convert thành công
- **Mô tả**: Trừ coin khỏi tài khoản sau khi convert thành công
- **Mapping**: requires.md §3.4
- **Tiêu chí hoàn thành**:
  - [ ] Giao dịch trừ coin được atomic (tránh trừ nhiều lần)
  - [ ] Lưu lịch sử giao dịch
- **Ưu tiên**: High
- **Dependencies**: 3.2

### 3.5. Hoàn coin nếu convert lỗi
- **Mô tả**: Hoàn lại coin nếu quá trình convert thất bại do lỗi hệ thống
- **Mapping**: requires.md §3.4
- **Tiêu chí hoàn thành**:
  - [ ] Phân biệt lỗi hệ thống vs lỗi file hỏng
  - [ ] Tự động hoàn coin cho lỗi hệ thống
  - [ ] Lưu log giao dịch hoàn coin
- **Ưu tiên**: High
- **Dependencies**: 3.2

---

## 4. Tải file sau khi convert

### 4.1. Tải file DOCX
- **Mô tả**: Người dùng tải file Word đã convert về thiết bị
- **Mapping**: requires.md §3.6
- **Tiêu chí hoàn thành**:
  - [ ] Nút tải file trên trang kết quả
  - [ ] Tên file đầu ra dựa trên tên file gốc (đuôi .docx)
  - [ ] File có thể tải trong thời gian hạn (1h cho miễn phí, 24h cho nâng cao)
- **Ưu tiên**: High
- **Dependencies**: 3.1, 3.2

### 4.2. Tải lại file từ lịch sử
- **Mô tả**: Cho phép tải lại file từ lịch sử nếu còn hạn
- **Mapping**: requires.md §3.6
- **Tiêu chí hoàn thành**:
  - [ ] Kiểm tra thời gian hết hạn
  - [ ] Ẩn/vô hiệu hóa nút tải nếu đã hết hạn
  - [ ] Cho phép tải nếu còn hạn
- **Ưu tiên**: Medium
- **Dependencies**: 4.1, 5.1

---

## 5. Lịch sử & Giao dịch

### 5.1. Lưu lịch sử convert
- **Mô tả**: Lưu lại các lần convert của người dùng
- **Mapping**: requires.md §3.7
- **Tiêu chí hoàn thành**:
  - [ ] Lưu: tên file PDF, tên file DOCX, thời gian, chế độ, số coin, trạng thái
  - [ ] Hiển thị danh sách lịch sử
  - [ ] Lọc theo trạng thái (thành công/thất bại/đang xử lý)
  - [ ] Lọc theo chế độ (miễn phí/nâng cao)
  - [ ] Lọc theo khoảng thời gian
- **Ưu tiên**: Medium
- **Dependencies**: 3.1, 3.2

### 5.2. Lưu lịch sử giao dịch coin
- **Mô tả**: Lưu lại tất cả giao dịch cộng/trừ/hoàn coin
- **Mapping**: requires.md §3.4
- **Tiêu chí hoàn thành**:
  - [ ] Lưu: loại giao dịch, số coin, số dư trước/sau, lý do, thời gian
  - [ ] Hiển thị danh sách giao dịch
  - [ ] Phân loại: cộng coin, trừ coin, hoàn coin
- **Ưu tiên**: Medium
- **Dependencies**: 3.4, 3.5

---

## 6. Quản lý Coin

### 6.1. Xem số dư coin
- **Mô tả**: Hiển thị số dư coin hiện tại trên header/trang tài khoản
- **Mapping**: requires.md §3.4
- **Tiêu chí hoàn thành**:
  - [ ] Hiển thị số dư coin
  - [ ] Cập nhật real-time sau mỗi giao dịch
- **Ưu tiên**: Medium
- **Dependencies**: 3.4

### 6.2. Nạp coin giả lập / Admin xác nhận thủ công
- **Mô tả**: Cơ chế nạp coin ban đầu (giả lập hoặc admin thủ công)
- **Mapping**: requires.md §3.5, §8.1
- **Tiêu chí hoàn thành**:
  - [ ] Trang nạp coin với các gói coin mẫu
  - [ ] Admin có thể cộng coin thủ công cho user
  - [ ] Ghi nhận lịch sử giao dịch
- **Ưu tiên**: Medium
- **Dependencies**: 6.1

---

## 7. Quản trị (Admin)

### 7.1. Phân quyền USER, ADMIN, SUPPORT
- **Mô tả**: Hệ thống phân quyền với 3 vai trò chính
- **Mapping**: requires.md §2.3, §3.8
- **Tiêu chí hoàn thành**:
  - [ ] Middleware kiểm tra role trên mỗi route
  - [ ] USER: upload, convert, xem lịch sử của mình
  - [ ] ADMIN: quản lý toàn bộ hệ thống
  - [ ] SUPPORT: xem khiếu nại, nhắn tin hỗ trợ (không được quản lý coin/user)
- **Ưu tiên**: High
- **Dependencies**: 1.1, 1.2

### 7.2. Admin quản lý người dùng
- **Mô tả**: Admin có thể xem danh sách và quản lý user
- **Mapping**: requires.md §3.8
- **Tiêu chí hoàn thành**:
  - [ ] Danh sách user với phân trang
  - [ ] Tìm kiếm theo email/tên
  - [ ] Xem chi tiết: số dư coin, số lần convert
  - [ ] Khóa/mở khóa tài khoản
- **Ưu tiên**: Medium
- **Dependencies**: 7.1

### 7.3. Admin quản lý gói coin
- **Mô tả**: Admin tạo/sửa/xóa các gói nạp coin
- **Mapping**: requires.md §3.5, §3.8
- **Tiêu chí hoàn thành**:
  - [ ] CRUD gói coin (tên, giá, số coin, mô tả, trạng thái)
  - [ ] Bật/tắt gói coin
- **Ưu tiên**: Medium
- **Dependencies**: 7.1

### 7.4. Admin quản lý giao dịch nạp tiền
- **Mô tả**: Admin xem và xác nhận giao dịch nạp tiền
- **Mapping**: requires.md §3.8
- **Tiêu chí hoàn thành**:
  - [ ] Danh sách giao dịch với trạng thái
  - [ ] Lọc theo trạng thái (đang xử lý, thành công, thất bại)
  - [ ] Xác nhận thủ công giao dịch nạp tiền
- **Ưu tiên**: Medium
- **Dependencies**: 7.1

### 7.5. Admin xem lịch sử convert
- **Mô tả**: Admin xem tất cả lịch sử convert của hệ thống
- **Mapping**: requires.md §3.8
- **Tiêu chí hoàn thành**:
  - [ ] Danh sách lịch sử với phân trang
  - [ ] Lọc theo user, trạng thái, thời gian
  - [ ] Xem chi tiết từng lần convert
- **Ưu tiên**: Low
- **Dependencies**: 7.1

### 7.6. Cấu hình giới hạn convert
- **Mô tẩ**: Admin cấu hình các giới hạn hệ thống
- **Mapping**: requires.md §3.8
- **Tiêu chí hoàn thành**:
  - [ ] Cấu hình: dung lượng tối đa, số trang tối đa, số lần miễn phí/ngày
  - [ ] Cấu hình chi phí coin cho từng loại convert
- **Ưu tiên**: Low
- **Dependencies**: 7.1

---

## 8. Hỗ trợ & Khiếu nại

### 8.1. Hỗ trợ/khiếu nại cơ bản
- **Mô tả**: Form gửi khiếu nại hoặc yêu cầu hỗ trợ
- **Mapping**: requires.md §3.9, §5.5
- **Tiêu chí hoàn thành**:
  - [ ] Form gửi khiếu nại với tiêu đề, nội dung, loại vấn đề
  - [ ] Lưu khiếu nại vào DB
  - [ ] Thông báo đã gửi thành công
  - [ ] Admin/support xem danh sách khiếu nại
  - [ ] Phản hồi khiếu nại qua email (hoặc trong hệ thống)
- **Ưu tiên**: Medium
- **Dependencies**: 1.1

---

## 9. Giao diện & Trải nghiệm

### 9.1. Giao diện responsive
- **Mô tả**: UI tương thích với desktop, tablet, mobile
- **Mapping**: requires.md §4.4
- **Tiêu chí hoàn thành**:
  - [ ] Responsive trên 3 breakpoints (mobile, tablet, desktop)
  - [ ] Touch-friendly trên mobile
- **Ưu tiên**: Medium
- **Dependencies**: -

### 9.2. Thông báo lỗi dễ hiểu
- **Mô tả**: Hiển thị thông báo lỗi thân thiện với người dùng
- **Mapping**: requires.md §4.4
- **Tiêu chí hoàn thành**:
  - [ ] Mã lỗi theo requires.md §11.1
  - [ ] Thông báo bằng tiếng Việt, dễ hiểu
  - [ ] Gợi ý hành động tiếp theo
- **Ưu tiên**: Medium
- **Dependencies**: -

---

## Tổng kết

| Nhóm | Số task | Ưu tiên High | Ưu tiên Medium | Ưu tiên Low |
|------|---------|--------------|----------------|--------------|
| Xác thực & Tài khoản | 5 | 3 | 1 | 1 |
| Upload & Kiểm tra | 6 | 4 | 0 | 2 |
| Convert | 5 | 5 | 0 | 0 |
| Tải file | 2 | 1 | 1 | 0 |
| Lịch sử & Giao dịch | 2 | 0 | 2 | 0 |
| Quản lý Coin | 2 | 0 | 2 | 0 |
| Quản trị | 6 | 1 | 4 | 1 |
| Hỗ trợ | 1 | 0 | 1 | 0 |
| UI/UX | 2 | 0 | 2 | 0 |
| **Tổng** | **31** | **14** | **11** | **6** |
