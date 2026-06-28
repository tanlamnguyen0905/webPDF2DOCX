# UI/UX Design Document - PDF to Word Converter MVP

**Phiên bản**: 2.0  
**Ngày**: 2026-06-27  
**Tác giả**: Claude  
**Mục tiêu**: Thiết kế giao diện chi tiết cho toàn bộ chức năng MVP website Convert PDF to Word

---

## 1. Auth & Account Management (Xác thực & Quản lý tài khoản)

### 1.1. Màn hình Đăng ký (Register)

**Mục đích**: Tạo tài khoản mới cho người dùng

**Route đề xuất**: `/register`

**Component chính**:
- Form đăng ký với 3 trường: Email, Password, Confirm Password
- Nút submit, link điều hướng đăng nhập

**Dữ liệu hiển thị**:
- Label: "Email", "Mật khẩu", "Xác nhận mật khẩu"
- Placeholder: "example@email.com", "Tối thiểu 8 ký tự", "Nhập lại mật khẩu"
- Error message mặc định: "Đã có lỗi xảy ra"

**Hành động**:
- Submit form → gọi API đăng ký
- Click link → điều hướng đến `/login`

**Trạng thái**:
- **Loading**: Disable nút submit, hiển thị spinner
- **Success**: Điều hướng đến `/login` với flash message "Đăng ký thành công"
- **Error**: Hiển thị lỗi dưới form (ví dụ: "Email đã tồn tại", "Mật khẩu không khớp")
- **Empty**: Form trống, các trường hợp lỗi chưa nhập

**Validation**:
- Email: Định dạng email hợp lệ, bắt buộc nhập
- Password: Tối thiểu 8 ký tự, bắt buộc nhập
- Confirm Password: Phải trùng với Password
- Check API trước khi submit (email tồn tại chưa)

**Điều hướng**:
- Header: Logo (về trang chủ), liên kết đăng nhập
- Nếu đã đăng nhập → chuyển hướng về trang chủ `/`

**Responsive**:
- Mobile: Form full width, spacing 16px
- Tablet: Form width 400px, centered
- Desktop: Form width 480px, centered

---

### 1.2. Màn hình Đăng nhập (Login)

**Mục đích**: Xác thực người dùng

**Route đề xuất**: `/login`

**Component chính**:
- Form đăng nhập: Email, Password
- Nút submit, link "Quên mật khẩu", link đăng ký

**Dữ liệu hiển thị**:
- Label: "Email", "Mật khẩu"
- Placeholder: "example@email.com", "Nhập mật khẩu"
- Error message: "Sai email hoặc mật khẩu"

**Hành động**:
- Submit form → gọi API đăng nhập
- Click "Quên mật khẩu" → điều hướng `/forgot-password`
- Click "Đăng ký" → điều hướng `/register`

**Trạng thái**:
- **Loading**: Disable nút submit, hiển thị spinner
- **Success**: Lưu token, điều hướng về `/` hoặc URL trước đó
- **Error**: Hiển thị "Sai email hoặc mật khẩu"
- **Empty**: Form trống

**Validation**:
- Email: Định dạng email hợp lệ, bắt buộc nhập
- Password: Bắt buộc nhập

**Điều hướng**:
- Header: Logo (về trang chủ)
- Nếu đã đăng nhập → chuyển hướng về trang chủ

---

### 1.3. Màn hình Quên mật khẩu (Forgot Password)

**Mục đích**: Khôi phục mật khẩu qua email

**Route đề xuất**: `/forgot-password`

**Component chính**:
- Form nhập email
- Nút gửi yêu cầu reset, link quay lại đăng nhập

**Dữ liệu hiển thị**:
- Label: "Email"
- Placeholder: "Nhập email của bạn"
- Message thành công: "Vui lòng kiểm tra email để đặt lại mật khẩu"

**Hành động**:
- Submit email → gọi API gửi email reset
- Click link → quay lại `/login`

**Trạng thái**:
- **Loading**: Disable nút, hiển thị spinner
- **Success**: Hiển thị message thành công
- **Error**: Hiển thị "Không tìm thấy tài khoản với email này"
- **Empty**: Form trống

**Validation**:
- Email: Định dạng email hợp lệ, tồn tại trong hệ thống

---

### 1.4. Màn hình Đặt lại mật khẩu (Reset Password)

**Mục đích**: Đặt mật khẩu mới sau khi nhận email reset

**Route đề xuất**: `/reset-password/:token`

**Component chính**:
- Form mật khẩu mới, xác nhận mật khẩu
- Nút xác nhận

**Dữ liệu hiển thị**:
- Label: "Mật khẩu mới", "Xác nhận mật khẩu"
- Placeholder: "Tối thiểu 8 ký tự"

**Hành động**:
- Submit → gọi API đặt lại mật khẩu

**Trạng thái**:
- **Loading**: Disable nút, spinner
- **Success**: Điều hướng `/login` với message "Đặt lại mật khẩu thành công"
- **Error**: Hiển thị lỗi (token hết hạn, không hợp lệ)
- **Empty**: Form trống

**Validation**:
- Password: Tối thiểu 8 ký tự
- Confirm Password: Trùng khớp

---

### 1.5. Màn hình Profile

**Mục đích**: Xem và cập nhật thông tin cá nhân, xem số coin

**Route đề xuất**: `/profile`

**Component chính**:
- Avatar hiện tại (có thể upload mới)
- Form: Họ tên, Email (readonly), Số coin
- Nút lưu thông tin

**Dữ liệu hiển thị**:
- Avatar: Ảnh đại diện người dùng hoặc icon mặc định
- Họ tên: Text input
- Email: Text input (không cho sửa)
- Số coin: Hiển thị số lượng coin hiện tại (vd: "50 coin")

**Hành động**:
- Upload avatar → gọi API upload ảnh
- Cập nhật họ tên → gọi API cập nhật
- Click "Lịch sử giao dịch" → điều hướng `/transactions`

**Trạng thái**:
- **Loading**: Hiển thị skeleton khi dữ liệu đang tải
- **Success**: Cập nhật thành công, flash message
- **Error**: Hiển thị lỗi dưới form
- **Empty**: Chưa có thông tin

**Validation**:
- Họ tên: Tối đa 100 ký tự

---

## 2. Upload & PDF Validation (Tải file & Kiểm tra PDF)

### 2.1. Màn hình Upload PDF

**Mục đích**: Tải file PDF để bắt đầu quá trình convert

**Route đề xuất**: `/upload`

**Component chính**:
- Khu vực dropzone kéo thả file
- Nút chọn file
- Danh sách file đã chọn (nếu có)

**Dữ liệu hiển thị**:
- Dropzone: Icon upload, text "Kéo thả file PDF vào đây hoặc click để chọn"
- Dung lượng tối đa: "Tối đa 5MB (miễn phí) / 50MB (nâng cao)"
- Số trang tối đa: "Tối đa 30 trang (miễn phí)"
- File đã chọn: Tên file, dung lượng, nút xóa

**Hành động**:
- Kéo thả file → xử lý upload
- Click chọn file → mở file explorer
- Click xóa file → xóa file đã chọn

**Trạng thái**:
- **Loading**: Hiển thị thanh tiến trình upload
- **Success**: Hiển thị thông tin file, nút "Tiếp tục"
- **Error**: Hiển thị lỗi (sai định dạng, vượt kích thước, vượt trang)
- **Empty**: Hiển thị trống với hướng dẫn

**Validation**:
- Kiểm tra file có phải PDF thực sự (.pdf extension + magic bytes)
- Kiểm tra dung lượng ≤ giới hạn
- Kiểm tra số trang ≤ giới hạn

---

### 2.2. Màn hình Xem trước PDF

**Mục đích**: Hiển thị thông tin file và xác nhận convert

**Route đề xuất**: `/preview`

**Component chính**:
- Thông tin file: Tên, dung lượng, số trang
- Chi phí: "Miễn phí" hoặc "X coin"
- Nút "Convert ngay"
- Nút "Xóa file"

**Dữ liệu hiển thị**:
- Tên file PDF
- Dung lượng: "2.5 MB"
- Số trang: "15 trang"
- Phí: "0 coin" hoặc "15 coin"
- Lưu ý: "File sẽ được xóa sau 1 tiếng tải về"

**Hành động**:
- Click "Convert ngay" → điều hướng `/converting`
- Click "Xóa file" → quay lại `/upload`

**Trạng thái**:
- Đã login: Hiển thị đầy đủ thông tin
- Chưa login: Hiển thị message "Đăng nhập để tiếp tục"

---

## 3. Convert Process (Quá trình Convert)

### 3.1. Màn hình Đang xử lý (Converting)

**Mục đích**: Theo dõi tiến trình convert

**Route đề xuất**: `/converting`

**Component chính**:
- Spinner hoặc progress bar
- Trạng thái: "Đang chờ..." → "Đang xử lý..." → "Hoàn tất!"
- Tiến trình phần trăm

**Dữ liệu hiển thị**:
- Status: "Đang xử lý PDF...", "Vui lòng chờ..."
- Progress: Thanh tiến trình với phần trăm
- Estimated time: "Dự kiến: 30 giây"

**Hành động**:
- Poll API để kiểm tra trạng thái
- Khi hoàn tất → điều hướng `/result`

**Trạng thái**:
- **Processing**: Hiển thị đang xử lý
- **Success**: Chuyển sang `/result`
- **Error**: Hiển thị lỗi, nút "Thử lại"

---

### 3.2. Màn hình Kết quả (Result)

**Mục đích**: Hiển thị kết quả convert và cho tải về

**Route đề xuất**: `/result/:id`

**Component chính**:
- Thông báo thành công
- Tên file DOCX
- Nút tải về
- Nút "Convert thêm"

**Dữ liệu hiển thị**:
- Icon success
- Message: "Convert thành công!"
- Tên file: "document.docx"
- Thời gian còn lại: "Có thể tải trong 1 tiếng" (miễn phí) / "24 tiếng" (nâng cao)

**Hành động**:
- Click "Tải về" → tải file DOCX
- Click "Convert thêm" → quay lại `/upload`

**Trạng thái**:
- File đã sẵn sàng để tải
- Timer đếm ngược thời gian còn lại

---

## 4. History & Transactions (Lịch sử & Giao dịch)

### 4.1. Màn hình Lịch sử Convert

**Mục đích**: Xem lịch sử các lần convert

**Route đề xuất**: `/history`

**Component chính**:
- Danh sách các lần convert (có phân trang)
- Filter: Trạng thái, chế độ (miễn phí/nâng cao)
- Search by date range

**Dữ liệu hiển thị mỗi item**:
- Tên file PDF → Tên file DOCX
- Ngày giờ convert
- Trạng thái: Thành công / Thất bại / Đang xử lý
- Chế độ: Miễn phí / Nâng cao
- Số coin trừ (nếu có)
- Nút tải lại (nếu còn hạn)

**Hành động**:
- Click vào item → xem chi tiết
- Filter → làm mới danh sách
- Pagination → tải trang khác

**Trạng thái**:
- **Empty**: Chưa có lịch sử convert nào
- **Loading**: Skeleton list
- **Success**: Danh sách đầy đủ
- **Error**: Thông báo lỗi

---

### 4.2. Màn hình Giao dịch Coin

**Mục đích**: Xem lịch sử các giao dịch coin

**Route đề xuất**: `/transactions`

**Component chính**:
- Danh sách giao dịch (có phân trang)
- Filter: Loại giao dịch (cộng/trừ/hoàn)

**Dữ liệu hiển thị mỗi item**:
- Loại: Cộng coin / Trừ coin / Hoàn coin
- Số coin: +10 / -5 / +5
- Số dư sau giao dịch
- Mô tả: "Đăng ký tài khoản", "Convert trang 15", "Hoàn do lỗi hệ thống"
- Thời gian

**Hành động**:
- Filter loại giao dịch
- Phân trang

**Trạng thái**:
- **Empty**: Chưa có giao dịch nào
- **Loading**: Skeleton
- **Success**: Danh sách đầy đủ

---

## 5. Admin Panel (Quản trị)

### 5.1. Màn hình Dashboard Admin

**Mục đích**: Tổng quan hệ thống

**Route đề xuất**: `/admin`

**Component chính**:
- Thống kê: Tổng user, Tổng convert, Doanh thu coin, Convert hôm nay
- Danh sách các chức năng quản lý

**Dữ liệu hiển thị**:
- Card thống kê 4 số liệu
- Menu: Quản lý user, Gói coin, Giao dịch, Cài đặt

**Hành động**:
- Click menu → điều hướng đến trang tương ứng

---

### 5.2. Màn hình Quản lý User

**Mục đích**: Quản lý tài khoản người dùng

**Route đề xuất**: `/admin/users`

**Component chính**:
- Bảng user với phân trang
- Search theo email/tên
- Cột: STT, Email, Tên, Role, Số coin, Trạng thái, Hành động

**Dữ liệu hiển thị**:
- Email, Tên, Role (USER/ADMIN/SUPPORT)
- Số coin hiện tại
- Trạng thái: Đang hoạt động / Đã khóa
- Nút khóa/mở, thay đổi role

**Hành động**:
- Search: filter realtime
- Click khóa → xác nhận
- Thay đổi role → cập nhật

**Trạng thái**:
- Loading, Empty, Error

---

### 5.3. Màn hình Quản lý Gói Coin

**Mục đích**: Tạo/sửa/xóa các gói nạp coin

**Route đề xuất**: `/admin/coin-packages`

**Component chính**:
- Nút "Thêm gói mới"
- Bảng các gói coin

**Dữ liệu hiển thị**:
- Tên gói, Giá (VND), Số coin, Mô tả, Trạng thái
- Hành động: Sửa, Xóa, Bật/Tắt

**Hành động**:
- Click "Thêm mới" → modal hoặc trang form
- Click sửa → điều hướng form sửa
- Click xóa → xác nhận xóa

---

### 5.4. Màn hình Quản lý Giao dịch

**Mục đíp**: Quản lý các giao dịch nạp tiền

**Route đề xuất**: `/admin/transactions`

**Component chính**:
- Bảng giao dịch
- Filter theo trạng thái

**Dữ liệu hiển thị**:
- User, Số coin, Mệnh giá, Phương thức, Trạng thái, Thời guan
- Nút xác nhận/thất bại

**Hành động**:
- Click xác nhận → cập nhật trạng thái

---

## 6. Support & Complaints (Hỗ trợ & Khiếu nại)

### 6.1. Màn hình Gửi khiếu nại

**Mục đích**: Người dùng gửi khiếu nại hoặc yêu cầu hỗ trợ

**Route đề xuất**: `/support`

**Component chính**:
- Form: Tiêu đề, Loại vấn đề (dropdown), Nội dung

**Dữ liệu hiển thị**:
- Các loại vấn đề: Lỗi convert, Trừ coin sai, Khác

**Hành động**:
- Submit → gửi khiếu nại
- Hiển thị message đã gửi thành công

---

## 7. Layout & Navigation

### 7.1. Header (Đầu trang)

**Desktop**:
```
[Logo] [Home] [Upload] [History] [Coin: 50] [Avatar ▼]
```

**Mobile**:
```
[Logo] [Menu hamburger]
```

**Dropdown user**:
- Profile
- Transactions
- Admin (chỉ hiện với ADMIN/SUPPORT)
- Logout

### 7.2. Sidebar (Mobile)

**Menu trượt trái**:
- Home
- Upload
- History
- Profile
- Support
- Logout

---

## 8. Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 768px | Single column, hamburger menu |
| Tablet | 768px - 1024px | 2 columns, reduced padding |
| Desktop | > 1024px | Max 1200px, full padding |

---

## 9. States & Feedback

### 9.1. Loading States

- Skeleton screens cho danh sách
- Spinner trong buttons
- Progress bar cho upload

### 9.2. Empty States

- Icon minh họa
- Message hướng dẫn
- Nút hành động gợi ý

### 9.3. Error States

- Icon lỗi
- Message lỗi bằng tiếng Việt
- Nút thử lại

### 9.4. Success States

- Toast notification
- Icon thành công
- Message xác nhận

---

## 10. Route Mapping Tổng hợp

| Path | Component | Role | Mô tả |
|------|-----------|------|-------|
| `/` | Home | All | Trang chủ |
| `/login` | Login | Guest | Đăng nhập |
| `/register` | Register | Guest | Đăng ký |
| `/forgot-password` | ForgotPassword | Guest | Quên mật khẩu |
| `/reset-password/:token` | ResetPassword | Guest | Đặt lại mật khẩu |
| `/upload` | Upload | User | Tải file PDF |
| `/preview` | Preview | User | Xem trước và convert |
| `/converting` | Converting | User | Đang xử lý |
| `/result/:id` | Result | User | Kết quả convert |
| `/history` | History | User | Lịch sử convert |
| `/transactions` | Transactions | User | Lịch sử giao dịch |
| `/profile` | Profile | User | Thông tin cá nhân |
| `/support` | Support | User | Gửi khiếu nại |
| `/admin` | AdminDashboard | Admin | Dashboard quản trị |
| `/admin/users` | AdminUsers | Admin | Quản lý user |
| `/admin/coin-packages` | AdminCoinPackages | Admin | Quản lý gói coin |
| `/admin/transactions` | AdminTransactions | Admin | Quản lý giao dịch |

---

## 11. Design Tokens

### Colors
- Primary: `#3B82F6` (blue)
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)
- Background: `#F9FAFB`
- Card: `#FFFFFF`
- Text primary: `#111827`
- Text secondary: `#6B7280`

### Typography
- Heading: `Inter Bold, 24px`
- Subheading: `Inter SemiBold, 18px`
- Body: `Inter Regular, 16px`
- Caption: `Inter Regular, 14px`

### Spacing
- XS: `4px`
- SM: `8px`
- MD: `16px`
- LG: `24px`
- XL: `32px`