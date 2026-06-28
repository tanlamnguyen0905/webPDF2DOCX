# UI/UX Design Document - PDF to Word Converter Future (Post-MVP)

**Phiên bản**: 2.0  
**Ngày**: 2026-06-28  
**Tác giả**: Claude  
**Mục tiêu**: Thiết kế giao diện chi tiết cho các tính năng nâng cao sau MVP (dựa trên task_future.md)

---

## 1. Thanh toán & Giao dịch (Payments & Transactions)

### 1.1. Màn hình Nạp Coin - Tích hợp MoMo

**Mục đích**: Cho phép người dùng nạp coin qua cổng thanh toán MoMo

**Route đề xuất**: `/payment/momo`

**Component chính**:
- Form chọn gói coin (radio/group card)
- Nút "Thanh toán bằng MoMo"
- Hiển thị QR code MoMo (nếu支付宝 QR)
- Deep link mở app MoMo (mobile)
- Nút "Hủy" quay lại trang nạp coin

**Dữ liệu hiển thị**:
- Danh sách gói: Tên gói, Giá (VND), Số coin, Badge "Phổ biến" / "Tiết kiệm"
- Tổng thanh toán: "100.000 VND = 100 coin"
- Thông báo: "Bạn sẽ được chuyển sang ứng dụng MoMo / trang web MoMo"
- Timer đếm ngược: "Giao dịch hết hạn sau 15 phút"

**Hành động**:
- Chọn gói coin → cập nhật tổng tiền
- Click "Thanh toán" → gọi API tạo giao dịch MoMo → redirect sang MoMo
- MoMo callback → tự động quay lại `/payment/result?transaction_id=xxx`
- Click "Hủy" → quay lại `/payment`

**Trạng thái**:
- **Loading**: Spinner trên nút, disable chọn gói
- **Redirecting**: "Đang chuyển hướng đến MoMo..."
- **Success (callback)**: Chuyển `/payment/success` với flash "Nạp coin thành công! Số dư: X coin"
- **Error (callback)**: Chuyển `/payment/failed` với lỗi từ MoMo
- **Timeout**: Hiển thị "Giao dịch hết hạn", nút "Thử lại"
- **Empty**: Chưa chọn gói → disable nút thanh toán

**Validation**:
- Phải chọn ít nhất 1 gói coin
- Kiểm tra gói còn active (admin không disable)
- Verify checksum từ MoMo callback

**Điều hướng**:
- Header: Logo, "Nạp coin", Avatar
- Breadcrumb: Home > Nạp coin > MoMo
- Sau thanh toán thành công → `/profile` hoặc `/payment/success`

**Responsive**:
- Mobile: Card gói coin stack dọc, full width, QR code full width
- Tablet: 2 cột gói coin, QR code bên cạnh
- Desktop: 3-4 cột gói coin, QR code sidebar

---

### 1.2. Màn hình Nạp Coin - Tích hợp VNPAY

**Mục đích**: Cho phép người dùng nạp coin qua cổng thanh toán VNPAY

**Route đề xuất**: `/payment/vnpay`

**Component chính**:
- Form chọn gói coin (giống MoMo)
- Nút "Thanh toán bằng VNPAY"
- Form ẩn auto-submit sang VNPAY (standard flow)
- Nút "Hủy"

**Dữ liệu hiển thị**:
- Tương tự MoMo
- Thông báo: "Bạn sẽ được chuyển sang trang thanh toán VNPAY"

**Hành động**:
- Chọn gói → click thanh toán → API tạo URL VNPAY → redirect
- VNPAY return URL → `/payment/result?vnp_TransactionNo=xxx&vnp_ResponseCode=xx`
- Xử lý response code: 00 = thành công, khác = thất bại

**Trạng thái**:
- Giống MoMo, thêm trạng thái "Chờ xác thực OTP" (nếu VNPAY yêu cầu)

**Validation**:
- Verify chữ ký số (secure hash) từ VNPAY return
- Kiểm tra mã giao dịch trùng lặp

**Responsive**: Giống MoMo

---

### 1.3. Màn hình Kết quả Thanh toán

**Mục đích**: Hiển thị kết quả sau khi redirect từ cổng thanh toán

**Route đề xuất**: `/payment/result`

**Component chính**:
- Icon trạng thái (Success/Error/Warning)
- Thông tin giao dịch: Mã GD, Số tiền, Số coin, Thời gian
- Nút "Xem số dư" → `/profile`
- Nút "Nạp thêm" → `/payment`
- Nút "Về trang chủ" → `/`

**Dữ liệu hiển thị**:
- **Success**: "Thanh toán thành công! Đã cộng 100 coin vào tài khoản"
- **Failed**: "Thanh toán thất bại: [Lý do từ cổng thanh toán]"
- **Pending**: "Đang xử lý... Vui lòng chờ vài phút"

**Hành động**:
- Poll API kiểm tra trạng thái (nếu pending)
- Auto redirect sau 3s nếu success

**Trạng thái**:
- **Success**: Xanh, icon check
- **Error**: Đỏ, icon X, nút "Liên hệ hỗ trợ"
- **Pending**: Vàng, spinner, polling 5s/lần

---

### 1.4. Màn hình Đối chiếu Giao dịch (Admin)

**Mục đích**: Admin xem và đối chiếu giao dịch tự động

**Route đề xuất**: `/admin/reconciliation`

**Component chính**:
- Bảng giao dịch cần đối chiếu (filter: Chưa đối chiếu / Sai lệch / Đã đối chiếu)
- Nút "Chạy đối chiếu ngay" (trigger cron job thủ công)
- Nút "Xuất báo cáo" (CSV/Excel)
- Modal chi tiết khi click dòng giao dịch

**Dữ liệu hiển thị**:
- Cột: STT, Mã GD hệ thống, Mã GD MoMo/VNPAY, User, Số tiền, Số coin, Trạng thái cổng, Trạng thái hệ thống, Thời gian, Hành động
- Badge trạng thái: "Đồng bộ" (xanh), "Thiếu coin" (đỏ), "Thừa coin" (cam), "Chưa xử lý" (xám)
- Thống kê header: Tổng GD, Đồng bộ, Sai lệch, Chưa xử lý

**Hành động**:
- Click "Chạy đối chiếu" → loading → cập nhật bảng
- Click dòng → modal chi tiết: Log API, Response cổng thanh toán, Lịch sử retry
- Click "Khắc phục" → tự động cộng coin / hoàn tiền / tạo ticket

**Trạng thái**:
- **Loading**: Skeleton table
- **Empty**: "Không có giao dịch cần đối chiếu"
- **Error**: Toast "Lỗi khi chạy đối chiếu"

**Responsive**:
- Mobile: Table cuộn ngang, card view cho từng dòng
- Desktop: Full table với sticky header

---

## 2. Xử lý file nâng cao (Advanced File Processing)

### 2.1. Màn hình Upload - Tích hợp OCR

**Mục đích**: Upload PDF và chọn chế độ OCR cho file scan

**Route đề xuất**: `/upload` (cập nhật từ MVP)

**Thay đổi so với MVP**:

**Component mới**:
- Toggle/Radio: "Chế độ chuyển đổi"
  - "Bình thường (Miễn phí / Nâng cao)" - default
  - "OCR (PDF scan/ảnh)" -/badge "2 coin cost "2 coin/trang"
- Hiển thị estimated cost: "Ước tính: 15 trang × 2 coin = 30 coin"
- Tooltip: "OCR dùng cho PDF scan, ảnh chụp màn hình, tài liệu in"

**Dữ liệu hiển thị**:
- Phân tích file tự động: "Phát hiện: PDF văn bản" hoặc "Phát hiện: PDF scan (khuyên dùng OCR)"
- Nếu PDF scan + chọn thường: Warning "Kết quả có thể không chính xác, khuyến nghị dùng OCR"

**Validation**:
- Nếu chọn OCR: Kiểm tra coin đủ (pages × 2)
- Nếu không đủ coin: Disable OCR, hiển thị "Cần nạp thêm X coin"

**Trạng thái**:
- **Analyzing**: "Đang phân tích file..." (spinner nhỏ)
- **OCR Selected**: Highlight border, hiển thị chi phí

---

### 2.2. Màn hình Cài đặt Chuyển đổi (Conversion Settings)

**Mục đích**: Người dùng tùy chọn chất lượng chuyển đổi nâng cao

**Route đề xuất**: `/settings/conversion` hoặc modal trên `/preview`

**Component chính**:
- Accordion/Tabs: "Định dạng", "Bố cục", "Hình ảnh", "Font chữ"
- Toggle: "Giữ nguyên bảng biểu" (default on cho nâng cao)
- Toggle: "Giữ nguyên hình ảnh" (default on)
- Select: "Chế độ font" - "Tự động" / "Giữ nguyên" / "Chuyển sang font chuẩn"
- Toggle: "Giữ headers/footers/số trang"
- Slider: "Chất lượng hình ảnh" - Thấp / Trung bình / Cao
- Nút "Lưu làm mặc định"
- Nút "Áp dụng cho file này"

**Dữ liệu hiển thị**:
- Mô tả ngắn dưới mỗi tùy chọn
- Badge "Chỉ nâng cao" cho tính năng premium
- Preview nhỏ thay đổi (nếu có)

**Hành động**:
- Toggle → cập nhật config tạm thời
- "Lưu làm mặc định" → gọi API lưu user preferences
- "Áp dụng" → truyền config vào job convert

**Validation**:
- Kiểm tra quyền: Chỉ user nâng cao (có coin/subscription) mới dùng các toggle premium

---

### 2.3. Màn hình Upload File Lớn (Large File Upload)

**Mục đích**: Hỗ trợ upload file > 50MB (lên đến 100MB)

**Route đề xuất**: `/upload` (cập nhật)

**Thay đổi**:
- Progress bar chi tiết: "Đang tải... 45/100 MB (2.3 MB/s)"
- Chunked upload indicator: "Đoạn 3/10"
- Resume capability: Nếu ngắt → "Tiếp tục tải"
- Web Worker indicator: "Đang xử lý nền..."

**Trạng thái**:
- **Chunk Uploading**: Progress bar từng chunk
- **Paused**: Nút "Tiếp tục"
- **Error Chunk**: "Lỗi đoạn 5, đang thử lại..."

---

### 2.4. Màn hình So sánh Chất lượng (Quality Comparison)

**Mục đích**: Cho user xem trước chất lượng trước/sau convert

**Route đề xuất**: `/result/:id/compare` hoặc tab trên `/result/:id`

**Component chính**:
- Split view: PDF gốc (trái) vs DOCX kết quả (phải)
- Zoom sync: Zoom một bên → bên kia cùng zoom
- Toolbar: Zoom in/out, Fit width, Fit page, Rotate
- Toggle: "Chế độ so sánh" - Side by side / Overlay (opacity slider)
- Highlight differences: Viền đỏ cho vùng khác biệt
- Nút "Tải PDF gốc", "Tải DOCX"

**Responsive**:
- Mobile: Tab chuyển đổi (PDF / DOCX), không split view
- Tablet/Desktop: Split view ngang hoặc dọc

---

## 3. Hàng đợi & Hiệu năng (Queue & Performance)

### 3.1. Màn hình Đang xử lý - Hàng đợi chuyên nghiệp (Converting with Queue)

**Mục đích**: Hiển thị vị trí trong hàng đợi và thời gian ước tính thực tế

**Route đề xuất**: `/converting` (cập nhật)

**Thay đổi**:
- Hiển thị vị trí: "Vị trí trong hàng đợi: #3"
- Thời gian ước tính dựa trên queue: "Dự kiến: 2 phút 30 giây"
- Progress bar 2 tầng: Queue progress + Processing progress
- WebSocket/SSE real-time update
- Nút "Hủy chuyển đổi" (nếu chưa bắt đầu xử lý)

**Dữ liệu hiển thị**:
- Queue status: "Đang chờ..." → "Đang xử lý..." → "Đang nén..." → "Hoàn tất"
- Số file đang chờ trước user
- Ưu tiên: "Bạn đang dùng gói nâng cao - ưu tiên cao" (badge)

**Trạng thái**:
- **Queued**: Vị trí queue, spinner chờ
- **Processing**: Progress bar xử lý thực
- **Priority**: Badge "Ưu tiên" cho user coin/subscription

---

### 3.2. Màn hình Ưu tiên Xử lý (Priority Indicator)

**Mục đích**: Thông báo cho user về quyền ưu tiên

**Component**: Badge/Toast trên header hoặc `/converting`

**Dữ liệu hiển thị**:
- "Bạn đang được ưu tiên xử lý (gói nâng cao)" - xanh
- "Nâng cấp để được ưu tiên" - cho user free (link đến `/payment`)

---

### 3.3. Màn hình Quản lý Cache (Admin)

**Mục đích**: Admin xem và xóa cache

**Route đề xuất**: `/admin/cache`

**Component chính**:
- Tabs: "User Profile", "File kết quả", "Preview", "API Response"
- Mỗi tab: Bảng key, Size, TTL, Last accessed, Nút xóa
- Nút "Xóa tất cả cache", "Xóa hết hạn"
- Stats: Tổng kích thước, Hit rate

---

### 3.4. Màn hình Cài đặt Tự động xóa File (Admin)

**Mục đích**: Cấu hình cron job xóa file hết hạn

**Route đề xuất**: `/admin/file-retention`

**Component chính**:
- Form cấu hình:
  - "File DOCX miễn phí": Số giờ (default: 1)
  - "File DOCX nâng cao": Số giờ (default: 24)
  - "File PDF gốc": Số ngày (default: 7)
- Toggle "Bật/Tắt cron job"
- Nút "Chạy ngay" (manual trigger)
- Log lịch sử chạy: Thời gian, Số file xóa, Lỗi

---

## 4. Chatbot AI & Hỗ trợ (Chatbot & Support)

### 4.1. Màn hình Chatbot AI

**Mục đích**: Trò chuyện với AI hỗ trợ tự động

**Route đề xuất**: `/chatbot` hoặc floating widget trên mọi trang

**Component chính**:
- Floating button (góc phải dưới): Icon chat, badge số tin nhắn chưa đọc
- Panel chat (slide từ phải): Header, Danh sách tin nhắn, Input area
- Header: "Trợ lý ảo", Avatar bot, Trạng thái "Online", Nút thu nhỏ/đóng
- Tin nhắn bot: Bubble trái, avatar bot, markdown support (bold, link, code)
- Tin nhắn user: Bubble phải, avatar user
- Input: Textarea, nút gửi, nút đính kèm file (optional), gợi ý quick-reply
- Quick-reply chips: "Cách convert", "Nạp coin", "Lỗi thường gặp", "Liên hệ nhân viên"

**Dữ liệu hiển thị**:
- Welcome message: "Chào bạn! Tôi có thể giúp gì hôm nay?"
- Typing indicator: "Đang nhập..." (3 chấm nhảy)
- Error message: "Xin lỗi, tôi không hiểu. Bạn có muốn chat với nhân viên?"

**Hành động**:
- Gửi tin nhắn → gọi API LLM → streaming response
- Click quick-reply → gửi tin nhắn định sẵn
- Click "Chuyển nhân viên" → mở real-time chat (4.2)
- Click tin nhắn bot có link → mở link trong tab mới

**Trạng thái**:
- **Loading**: Typing indicator
- **Streaming**: Hiển thị từng token (typewriter effect)
- **Error**: "Mất kết nối, thử lại sau"
- **Empty**: Welcome message + quick-reply

**Validation**:
- Giới hạn độ dài tin nhắn: 2000 ký tự
- Rate limit: 30 tin nhắn/phút

**Responsive**:
- Mobile: Full screen overlay, bottom sheet
- Desktop: Sidebar 380px width, floating button

---

### 4.2. Màn hình Chat Real-time (User Side)

**Mục đích**: Trò chuyện trực tiếp với nhân viên hỗ trợ

**Route đề xuất**: `/support/chat` hoặc tích hợp trong chatbot panel

**Component chính**:
- Danh sách cuộc trò chuyện (nếu multiple) hoặc single chat
- Header: Tên nhân viên, Avatar, Trạng thái "Đang online" / "Rời tuyến"
- Tin nhắn: Real-time (WebSocket), read receipt (seen)
- Input: Textarea, Emoji picker, File attach (screen shot lỗi)
- Nút "Kết thúc cuộc trò chuyện", "Đánh giá"

**Dữ liệu hiển thị**:
- Thời gian từng tin nhắn
- Badge "Đã xem" / "Đang soạn thảo..."
- System message: "Nhân viên A đã tham gia", "Cuộc trò chuyện kết thúc"

**Hành động**:
- Gửi tin nhắn → real-time delivery
- Attach file → upload → gửi link file
- Click "Đánh giá" → modal rating 1-5 sao + comment
- Close panel → vẫn nhận notification (badge trên floating button)

**Trạng thái**:
- **Connecting**: "Đang kết nối..."
- **Connected**: Xanh, real-time
- **Disconnected**: Đỏ, "Mất kết nối, đang thử lại..."
- **Queue**: "Vị trí chờ: #2", estimated wait time

---

### 4.3. Màn hình Quản lý Hỗ trợ viên (Admin)

**Mục đích**: Admin quản lý tài khoản và phân quyền support

**Route đề xuất**: `/admin/support-agents`

**Component chính**:
- Bảng danh sách support agent
- Cột: STT, Email, Tên, Trạng thái (Online/Offline/Busy), Cuộc trò chuyện đang xử lý, Tổng đã xử lý, Hành động
- Nút "Thêm nhân viên hỗ trợ" → Modal form
- Modal form: Email, Tên, Mật khẩu, Quyền (dropdown: Chỉ xem khiếu nại / Trả lời chat / Quản lý khiếu nại)

**Hành động**:
- Click "Thêm" → tạo tài khoản role SUPPORT
- Click "Phân quyền" → cập nhật permissions
- Click "Xem log" → lịch sử hành động của support

---

### 4.4. Màn hình Quản lý Khiếu nại (Workflow) - Admin

**Mục đích**: Xử lý khiếu nại theo quy trình có trạng thái

**Route đề xuất**: `/admin/complaints`

**Component chính**:
- Tabs/Filter: "Tất cả", "Mới", "Đang xử lý", "Đã phản hồi", "Hoàn tất", "Hủy"
- Bảng khiếu nại: STT, Mã ticket, User, Tiêu đề, Loại, Mức độ ưu tiên, Trạng thái, Assignee, Thời gian tạo, Hành động
- Badge ưu tiên: "Khẩn cấp" (đỏ), "Cao" (cam), "Trung bình" (vàng), "Thấp" (xanh)
- Click dòng → Slide panel chi tiết bên phải

**Panel chi tiết**:
- Thông tin user: Email, Tên, Số coin, Link profile
- Nội dung khiếu nại
- Lịch sử phản hồi (timeline): Admin/Support phản hồi, User reply, Thay đổi trạng thái
- Form phản hồi: Textarea, Chọn trạng thái mới, Nút "Gửi"
- Nút "Chuyển cho nhân viên khác", "Thăng cấp"

**Hành động**:
- Click "Nhận xử lý" → gán assignee = current admin, trạng thái → "Đang xử lý"
- Phản hồi → gửi email/push cho user, trạng thái → "Đã phản hồi"
- User reply → trạng thái → "Mới" (cho admin biết)
- Click "Hoàn tất" → xác nhận → trạng thái → "Hoàn tất"

**Trạng thái**:
- **Empty**: "Không có khiếu nại nào"
- **Loading**: Skeleton

---

### 4.5. Màn hình Xem Khiếu nại (User Side)

**Mục đích**: User theo dõi khiếu nại của mình

**Route đề xuất**: `/support/my-tickets`

**Component chính**:
- Danh sách ticket của user
- Mỗi item: Mã ticket, Tiêu đề, Trạng thái, Thời gian tạo, Thời gian cập nhật
- Click → xem chi tiết (read-only timeline như admin)
- Nút "Phản hồi thêm" (nếu ticket chưa hoàn tất)

---

## 5. Tính năng mở rộng (Extended Features)

### 5.1. Màn hình Batch Convert (Chuyển đổi hàng loạt)

**Mục đích**: Upload và convert nhiều file PDF cùng lúc

**Route đề xuất**: `/batch-upload` hoặc tab trên `/upload`

**Component chính**:
- Dropzone multi-file: "Kéo thả nhiều file PDF vào đây"
- Danh sách file đã chọn: Table với cột: STT, Tên file, Dung lượng, Số trang, Trạng thái, Chi phí, Hành động
- Nút "Xóa tất cả", "Xóa file đã chọn"
- Toggle "Áp dụng cùng cài đặt cho tất cả"
- Nút "Bắt đầu chuyển đổi hàng loạt"
- Progress tổng thể: "Đang xử lý 3/10 file"
- Progress từng file: Progress bar nhỏ cho từng dòng

**Dữ liệu hiển thị**:
- Tổng: "10 file, 45 trang, Ước tính: 90 coin"
- Badge trạng thái từng file: "Chờ", "Đang xử lý", "Hoàn tất", "Lỗi"
- Nút "Tải về" cho file hoàn tất
- Nút "Tải tất cả (ZIP)" khi tất cả hoàn tất

**Hành động**:
- Thêm file → validate từng file
- Click "Bắt đầu" → tạo batch job → redirect `/batch-processing/:batchId`
- Xử lý song song (tùy queue capacity)
- Real-time update qua WebSocket

**Trạng thái**:
- **Empty**: Dropzone + hướng dẫn
- **Processing**: Progress tổng + progress từng file
- **Partial Success**: Một số lỗi → hiển thị lỗi từng file, cho retry file lỗi
- **All Success**: Nút "Tải ZIP" nổi bật

**Responsive**:
- Mobile: Card view cho từng file, stack dọc
- Desktop: Table full width

---

### 5.2. Màn hình Xử lý Batch (Batch Processing)

**Mục đích**: Theo dõi tiến trình batch convert

**Route đề xuất**: `/batch-processing/:batchId`

**Component chính**:
- Header: Tên batch, Thời gian bắt đầu, Tổng file, Đã xong, Đang xử lý, Lỗi
- Progress bar tổng thể
- Danh sách file (giống batch-upload nhưng read-only)
- Nút "Hủy batch" (chỉ hủy file chưa xử lý)
- Nút "Tải ZIP" (khi hoàn tất)

**Trạng thái**:
- **Processing**: Live update
- **Completed**: Success toast, nút tải ZIP
- **Partial**: Warning, nút "Tải thành công", nút "Retry lỗi"

---

### 5.3. Màn hình Gói Thành viên (Subscription Plans)

**Mục đích**: Hiển thị và mua gói subscription hàng tuần/tháng/năm

**Route đề xuất**: `/subscription`

**Component chính**:
- Toggle: "Trả theo lần (Coin)" / "Gói thành viên (Subscription)"
- 3 cột gói: Tuần / Tháng / Năm
- Mỗi cột: Giá, Badge "Tiết kiệm X%", Danh sách lợi ích (icon check)
  - Convert không giới hạn
  - Ưu tiên hàng đợi cao nhất
  - OCR miễn phí (năm)
  - Lưu file 30 ngày
  - Hỗ trợ ưu tiên
- Nút "Đăng ký" cho từng gói
- Thông tin gói hiện tại (nếu đã sub): "Đang dùng: Gói Tháng", "Hết hạn: 2026-07-28", "Tự động gia hạn: Bật/Tắt", Nút "Hủy gia hạn"

**Hành động**:
- Click "Đăng ký" → redirect thanh toán (MoMo/VNPAY) với loại subscription
- Callback → kích hoạt subscription, gửi email xác nhận
- Click "Hủy gia hạn" → confirm modal → API cancel

**Trạng thái**:
- **Active**: Badge xanh, hiển thị ngày hết hạn
- **Expired**: Badge đỏ, nút "Gia hạn ngay"
- **Cancelled**: Badge xám, "Sẽ hết hạn vào ngày X"
- **Trial**: Badge tím, "Dùng thử miễn phí"

---

### 5.4. Màn hình Quản lý API Key (User/Developer)

**Mục đích**: Tạo và quản lý API key cho tích hợp bên thứ ba

**Route đề xuất**: `/developer/api-keys`

**Component chính**:
- Danh sách API key: Tên, Key (masked: `sk_live_****abcd`), Tạo lúc, Lần dùng cuối, Rate limit, Trạng thái, Hành động
- Nút "Tạo API Key mới" → Modal: Tên key, Rate limit (requests/phút), Expire date (optional)
- Copy to clipboard nút
- Nút "Vô hiệu hóa", "Xóa"
- Tab "Documentation" → link Swagger UI
- Tab "Usage Stats": Biểu đồ requests/ngày, Error rate, Latency

**Validation**:
- Rate limit: Free tier 100 req/phút, Paid tier 1000 req/phút
- Key format: `cvpdf_live_` / `cvpdf_test_`

---

### 5.5. Màn hình API Documentation (Swagger UI)

**Mục đích**: Tài liệu API cho developer

**Route đề xuất**: `/developer/docs` hoặc `/api/docs`

**Component**: Swagger UI embed
- Authentication: API Key header
- Endpoints: POST /api/v1/upload, POST /api/v1/convert, GET /api/v1/status/:id, GET /api/v1/download/:id/download
- Webhook config: URL, Events (convert.completed, convert.failed)

---

### 5.6. Màn hình Lịch sử Convert - Bộ lọc nâng cao

**Mục đích**: Lọc và sắp xếp lịch sử chi tiết hơn

**Route đề xuất**: `/history` (cập nhật)

**Thay đổi**:
- Filter panel (collapse/expand):
  - Date range picker (từ - đến)
  - Dropdown "Loại xử lý": Tất cả / Thường / OCR / Nâng cao
  - Range slider "Dung lượng file": 0 - 100MB
  - Range slider "Số trang": 0 - 1000
  - Dropdown "Sắp xếp": Mới nhất / Cũ nhất / Dung lượng giảm / Trang giảm
- Nút "Xóa bộ lọc"
- URL query params cho share link: `/history?from=2026-01-01&to=2026-06-28&type=ocr&sort=size_desc`

---

### 5.7. Màn hình Thông báo (Notification Center)

**Mục đích**: Trung tâm thông báo push/email

**Route đề xuất**: `/notifications` hoặc dropdown từ header bell icon

**Component chính**:
- Bell icon header với badge số未读
- Dropdown/Panel: Tabs "Tất cả", "Chưa đọc", "Đã đọc"
- List thông báo: Icon loại, Tiêu đề, Nội dung rút gọn, Thời gian, Trạng thái đọc/chưa đọc
- Loại thông báo: Convert hoàn tất, Nạp coin thành công, Hệ thống, Khuyến mãi
- Nút "Đánh dấu tất cả đã đọc"
- Click → điều hướng đến trang liên quan (`/result/:id`, `/payment/result`, `/support/my-tickets`)

**Real-time**: WebSocket push notification khi online

---

## 6. Dashboard & Thống kê (Dashboard & Analytics)

### 6.1. Màn hình Dashboard Admin Nâng cao

**Mục đích**: Bảng điều khiển thống kê toàn diện cho admin

**Route đề xuất**: `/admin` (cập nhật) hoặc `/admin/analytics`

**Component chính**:
- Date range picker (header): Hôm nay / 7 ngày / 30 ngày / Tuỳ chỉnh
- Row 1 - KPI Cards (4-6 card):
  - Tổng user mới
  - Tổng lượt convert
  - Doanh thu (VND)
  - Coin đã bán
  - Tỷ lệ thành công convert
  - Avg 처리 time
- Row 2 - Charts (2 cột):
  - Biểu đồ đường: Lượt convert/ngày (miễn phí vs nâng cao vs OCR)
  - Biểu đồ cột: Doanh thu/ngày
- Row 3 - Charts (2 cột):
  - Biểu đồ tròn: Phân bổ phương thức thanh toán (MoMo/VNPAY/Manual)
  - Biểu đồ đường: Số user active/ngày
- Row 4 - Table: Top 10 user theo coin tiêu, Top 10 file lỗi
- Nút "Xuất báo cáo" (CSV/Excel/PDF) cho từng biểu đồ

**Real-time**: WebSocket cập nhật số liệu live (convert hôm nay, user online)

**Responsive**:
- Mobile: Card stack dọc, chart full width, swipe tabs
- Desktop: Grid 2-4 cột

---

### 6.2. Màn hình Giám sát Hệ thống (System Monitoring)

**Mục đích**: Theo dõi health hệ thống real-time

**Route đề xuất**: `/admin/monitoring`

**Component chính**:
- Grid metrics:
  - **Queue Status**: Đang chờ, Đang xử lý, Hoàn tất (1h), Lỗi (1h)
  - **Worker Status**: Số worker online, Idle, Busy, Offline
  - **Storage**: Used/Total, File PDF, File DOCX, Temp
  - **API**: Requests/min, Error rate, Avg latency, P95 latency
  - **Database**: Connections, Slow queries, Size
  - **Cache**: Hit rate, Memory used, Keys
- Alert panel: Cảnh báo nếu queue > 100, error rate > 5%, disk > 80%
- Nút "Restart worker", "Clear queue", "Scale up"

**Visual**: Gauge charts, Sparkline, Color-coded status (Green/Yellow/Red)

---

## 7. Bảo mật nâng cao (Advanced Security)

### 7.1. Màn hình Cài đặt Rate Limiting (Admin)

**Mục đích**: Cấu hình rate limit cho các endpoint

**Route đề xuất**: `/admin/security/rate-limiting`

**Component chính**:
- Bảng rules: Endpoint, Method, Limit (req/phút), Window, Action (Block/Throttle), Trạng thái
- Nút "Thêm rule"
- Modal form: Path pattern (regex), Method, Limit, Window (seconds), Action, Message
- Preset: "Upload strict", "API moderate", "Auth strict"
- Log vi phạm: IP, Endpoint, Thời gian, Action taken

---

### 7.2. Màn hình Quét Virus (Virus Scan Status)

**Mục đích**: Hiển thị trạng thái quét virus file upload

**Component**: Indicator trên `/upload` và `/converting`

**Trạng thái hiển thị**:
- **Scanning**: "Đang quét an toàn..." (spinner nhỏ)
- **Clean**: Badge xanh "An toàn" (tooltip: "Đã quét bởi ClamAV lúc 10:30")
- **Infected**: Badge đỏ "Phát hiện mã độc", file bị chặn, thông báo user
- **Error**: Badge cam "Không thể quét", cho phép tiếp tục với warning

**Admin view** (`/admin/security/virus-scan`):
- Log quét: File, User, Kết quả, Thời gian, Action (Delete/Quarantine)
- Stats: Tổng quét, Phát hiện, False positive rate

---

## 8. Layout & Navigation Cập nhật

### 8.1. Header Mở rộng

**Desktop**:
```
[Logo] [Home] [Upload] [Batch] [History] [Subscription] [Coin: 50] [Notifications 🔔] [Avatar ▼]
```

**Dropdown user mở rộng**:
- Profile
- Transactions
- Subscription (mới)
- API Keys (mới - developer)
- Notifications (mới)
- Support/Chatbot (mới)
- Admin (ADMIN/SUPPORT)
- Logout

### 8.2. Sidebar Mobile Mở rộng
- Home
- Upload
- Batch Convert (mới)
- History
- Subscription (mới)
- Profile
- Support/Chat (mới)
- Notifications (mới)
- Logout

---

## 9. Responsive Breakpoints (Cập nhật)

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 768px | Single column, bottom sheet cho chat, card view cho table |
| Tablet | 768px - 1024px | 2 columns, sidebar collapsible, split view cho compare |
| Desktop | > 1024px | Max 1440px, multi-column dashboard, floating chat widget |

---

## 10. States & Feedback (Mở rộng)

### 10.1. Loading States Mới
- Skeleton cho dashboard charts
- Streaming text cho chatbot AI
- Progress bar multi-file cho batch
- Real-time queue position indicator

### 10.2. Empty States Mới
- Chatbot: Welcome + quick replies
- Batch: "Chưa có file nào, kéo thả để bắt đầu"
- Subscription: "Bạn chưa có gói thành viên"
- API Keys: "Chưa có API key, hãy tạo mới"

### 10.3. Error States Mới
- Payment gateway error: Chi tiết mã lỗi MoMo/VNPAY
- OCR error: "Không nhận dạng được văn bản"
- Queue full: "Hệ thống bận, vui lòng thử lại sau"
- Rate limited: "Quá nhiều yêu cầu, thử lại sau X giây"
- Virus detected: "File không an toàn, đã bị chặn"

### 10.4. Success States Mới
- Subscription activated: Toast + email
- Batch completed: "10/10 file thành công, tải ZIP"
- Complaint resolved: "Khiếu nại đã được giải quyết"

---

## 11. Route Mapping Tổng hợp (Future)

| Path | Component | Role | Mô tả |
|------|-----------|------|-------|
| `/payment` | PaymentGateway | User | Chọn cổng thanh toán |
| `/payment/momo` | PaymentMoMo | User | Thanh toán MoMo |
| `/payment/vnpay` | PaymentVNPAY | User | Thanh toán VNPAY |
| `/payment/result` | PaymentResult | User | Kết quả thanh toán |
| `/subscription` | SubscriptionPlans | User | Gói thành viên |
| `/subscription/manage` | SubscriptionManage | User | Quản lý subscription |
| `/batch-upload` | BatchUpload | User | Upload hàng loạt |
| `/batch-processing/:id` | BatchProcessing | User | Theo dõi batch |
| `/result/:id/compare` | QualityCompare | User | So sánh chất lượng |
| `/settings/conversion` | ConversionSettings | User | Cài đặt convert |
| `/chatbot` | ChatbotAI | User | Chatbot AI |
| `/support/chat` | SupportChat | User | Chat real-time |
| `/support/my-tickets` | MyTickets | User | Khiếu nại của tôi |
| `/developer/api-keys` | ApiKeys | User | Quản lý API key |
| `/developer/docs` | ApiDocs | User | Tài liệu API |
| `/notifications` | NotificationCenter | User | Trung tâm thông báo |
| `/admin/reconciliation` | AdminReconciliation | Admin | Đối chiếu giao dịch |
| `/admin/cache` | AdminCache | Admin | Quản lý cache |
| `/admin/file-retention` | AdminFileRetention | Admin | Cấu hình xóa file |
| `/admin/support-agents` | AdminSupportAgents | Admin | Quản lý hỗ trợ viên |
| `/admin/complaints` | AdminComplaints | Admin | Quản lý khiếu nại workflow |
| `/admin/analytics` | AdminAnalytics | Admin | Dashboard thống kê nâng cao |
| `/admin/monitoring` | AdminMonitoring | Admin | Giám sát hệ thống |
| `/admin/security/rate-limiting` | AdminRateLimiting | Admin | Cấu hình rate limit |
| `/admin/security/virus-scan` | AdminVirusScan | Admin | Log quét virus |

---

## 12. Design Tokens (Mở rộng)

### Colors (Mở rộng)
- Primary: `#3B82F6` (blue)
- Primary Dark: `#2563EB`
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)
- Info: `#06B6D4` (cyan)
- Purple: `#8B5CF6` (subscription)
- Background: `#F9FAFB`
- Card: `#FFFFFF`
- Text primary: `#111827`
- Text secondary: `#6B7280`
- Border: `#E5E7EB`
- **Status Colors**:
  - Queued: `#F59E0B`
  - Processing: `#3B82F6`
  - Completed: `#10B981`
  - Failed: `#EF4444`
  - Priority: `#8B5CF6`
  - Scanning: `#06B6D4`
  - Clean: `#10B981`
  - Infected: `#EF4444`

### Typography (Mở rộng)
- Heading: `Inter Bold, 24px`
- Subheading: `Inter SemiBold, 18px`
- Body: `Inter Regular, 16px`
- Caption: `Inter Regular, 14px`
- **Code/Monospace**: `JetBrains Mono, 14px` (API keys, logs)
- **Chat**: `Inter Regular, 15px` (line-height 1.6)

### Spacing
- XS: `4px`
- SM: `8px`
- MD: `16px`
- LG: `24px`
- XL: `32px`
- 2XL: `48px`

### Shadows
- Card: `0 1px 3px rgba(0,0,0,0.1)`
- Dropdown: `0 4px 12px rgba(0,0,0,0.15)`
- Modal: `0 8px 30px rgba(0,0,0,0.2)`
- Floating: `0 4px 20px rgba(0,0,0,0.15)`

### Border Radius
- SM: `4px` (button, input)
- MD: `8px` (card, modal)
- LG: `12px` (panel)
- Full: `9999px` (badge, pill)

### Z-Index
- Dropdown: `100`
- Modal: `200`
- Toast: `300`
- Tooltip: `400`
- Chat widget: `500`
- Sidebar: `600`

---

## 13. Accessibility (A11y)

- **Keyboard navigation**: Tab order logic, focus visible, Escape đóng modal
- **Screen reader**: ARIA labels cho icon button, live region cho chat, status announcement
- **Color contrast**: WCAG AA (4.5:1) cho text, 3:1 cho UI elements
- **Reduced motion**: Tắt animation cho user bật `prefers-reduced-motion`
- **Language**: `lang="vi"` trên HTML, RTL support không cần

---

## 14. Internationalization (i18n) - Chuẩn bị

- Tất cả text hardcode → i18n key
- Date/Number format: VI locale (dd/MM/yyyy, 1.000,00)
- Currency: VND (đ)
- RTL: Không cần (tiếng Việt LTR)

---

## 15. Phân quyền UI (Permission-based UI)

| Feature | Guest | Free User | Coin User | Subscription | Admin | Support |
|---------|-------|-----------|-----------|--------------|-------|---------|
| Upload thường | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Upload OCR | ✗ | ✗ | ✓ (coin) | ✓ (free) | ✓ | ✓ |
| Batch convert | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Priority queue | ✗ | ✗ | ✓ | ✓ (highest) | ✓ | ✓ |
| Subscription UI | ✗ | ✓ (buy) | ✓ (buy) | ✓ (manage) | ✓ | ✗ |
| API Keys | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ |
| Chatbot AI | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Real-time chat | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ (own) |
| Admin Dashboard | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Reconciliation | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Support Agents | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Complaints | ✗ (submit) | ✓ (submit) | ✓ (submit) | ✓ (submit) | ✓ (manage) | ✓ (assign) |
| Monitoring | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |

---

## 16. Từ vựng UI (Glossary)

| English | Vietnamese | Context |
|---------|------------|---------|
| Batch Convert | Chuyển đổi hàng loạt | 5.1 |
| Subscription | Gói thành viên | 5.3 |
| Priority Queue | Hàng đợi ưu tiên | 3.2 |
| Reconciliation | Đối chiếu | 1.4 |
| OCR | Nhận dạng ký tự quang học | 2.1 |
| Webhook | Webhook / Callback | 5.4 |
| Rate Limit | Giới hạn tốc độ | 7.1 |
| Virus Scan | Quét virus | 7.2 |
| Floating Widget | Widget nổi | 4.1 |
| Quick Reply | Trả lời nhanh | 4.1 |
| Read Receipt | Đã đọc | 4.2 |
| Assignee | Người phụ trách | 4.4 |
| SLA | Thời gian cam kết xử lý | 4.4 |

---

## 17. Checklist Implementation

### Phase 2 (2 tuần) - Core Payments & OCR
- [ ] Payment Gateway selection screen
- [ ] MoMo integration flow
- [ ] VNPAY integration flow
- [ ] Payment result handling
- [ ] OCR toggle on upload
- [ ] OCR cost calculation
- [ ] Admin reconciliation screen

### Phase 3 (2 tuần) - Queue & Support
- [ ] Professional queue UI
- [ ] Priority indicators
- [ ] Chatbot AI widget
- [ ] Real-time chat
- [ ] Support agent management
- [ ] Complaint workflow admin
- [ ] User ticket view

### Phase 4 (2 tuần) - Subscription & Batch
- [ ] Subscription plans page
- [ ] Subscription management
- [ ] Batch upload/processing
- [ ] API key management
- [ ] API documentation
- [ ] Advanced history filters
- [ ] Notification center

### Phase 5 (1-2 tuần) - Analytics & Security
- [ ] Advanced admin dashboard
- [ ] System monitoring
- [ ] Rate limiting config
- [ ] Virus scan status
- [ ] File retention config
- [ ] Quality comparison view
- [ ] Conversion settings

---

**Lưu ý**: Tài liệu này đồng bộ với `ui_des_now.md` về cấu trúc, naming convention, design tokens. Các màn hình mới mở rộng từ base MVP, tái sử dụng component chung (Button, Card, Table, Modal, Form, Toast, Dropdown, Tabs, Accordion, Progress, Badge, Avatar, Tooltip, Skeleton, Spinner).