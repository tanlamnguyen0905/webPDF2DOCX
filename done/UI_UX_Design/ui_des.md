# Mô tả UI/UX website Convert PDF to Word

## 1. Phong cách giao diện tổng thể

Website nên có phong cách  **sạch, hiện đại, tập trung vào thao tác upload file** . Giao diện cần tạo cảm giác nhanh, an toàn và dễ dùng giống các công cụ chuyển đổi PDF trực tuyến chuyên nghiệp.

Tông giao diện nên ưu tiên nền sáng, nhiều khoảng trắng, bố cục rõ ràng. Khu vực quan trọng nhất là vùng upload PDF, cần được đặt ở trung tâm màn hình và có nút hành động nổi bật.

Các nút chính như  **Chọn file PDF** ,  **Convert miễn phí** ,  **Convert nâng cao** , **Tải file DOCX** nên có màu nổi bật. Các nút phụ như  **Hủy** ,  **Chọn file khác** , **Quay lại** nên dùng màu nhẹ hơn.

Trải nghiệm người dùng cần đi theo luồng ngắn gọn:

**Upload PDF → Xem thông tin file → Chọn chế độ convert → Theo dõi trạng thái → Tải DOCX**

---

## 2. Header

Header xuất hiện ở hầu hết các trang public và user.

### Mục tiêu UX

Giúp người dùng nhận diện website, điều hướng nhanh đến các chức năng chính và biết trạng thái đăng nhập của mình.

### Mô tả UI

Header nằm cố định phía trên hoặc nằm đầu trang. Bên trái là logo hoặc tên website, ví dụ  **PDF to Word Converter** . Bên phải là menu điều hướng.

Với khách chưa đăng nhập, menu gồm:

* Trang chủ
* Upload PDF
* Bảng giá
* Hướng dẫn
* Hỗ trợ
* Đăng nhập
* Đăng ký

Với người dùng đã đăng nhập, menu gồm:

* Upload PDF
* Lịch sử convert
* Ví coin
* Nạp coin
* Hỗ trợ
* Avatar tài khoản

Avatar mở dropdown gồm:

* Tài khoản cá nhân
* Lịch sử coin
* Lịch sử thanh toán
* Đăng xuất

### Gợi ý thiết kế

Header nên đơn giản, không chiếm quá nhiều chiều cao. Nút **Upload PDF** hoặc **Chọn file** có thể được làm nổi bật để người dùng luôn thấy hành động chính.

---

## 3. Trang chủ

### Mục tiêu UX

Trang chủ cần giúp người dùng hiểu ngay website dùng để làm gì và bắt đầu upload PDF trong vài giây đầu tiên.

### Mô tả UI

Phần đầu trang là hero section, đặt ở trung tâm. Nội dung nên gồm:

**Tiêu đề chính:**
Convert PDF sang Word nhanh chóng

**Mô tả ngắn:**
Tải lên file PDF và chuyển đổi sang file Word `.docx`. Hỗ trợ chế độ miễn phí và chế độ nâng cao bằng coin.

Bên dưới tiêu đề là khu vực upload nhanh. Khu vực này nên được thiết kế như một thẻ lớn có viền nét đứt hoặc nền trắng nổi trên nền xám nhạt.

Trong upload box hiển thị:

* Icon file PDF
* Text: “Kéo thả file PDF vào đây”
* Nút chính: “Chọn file PDF”
* Ghi chú: “Chỉ hỗ trợ file .pdf”
* Dòng giới hạn miễn phí: “Miễn phí với file dưới 5MB, dưới 30 trang, tối đa 5 lần/ngày”

Bên dưới hero có thể có phần giới thiệu 2 chế độ:

### Chế độ miễn phí

Dành cho file nhỏ, không tốn coin, phù hợp với nhu cầu chuyển đổi nhanh.

### Chế độ nâng cao

Dành cho file lớn hơn, có thể hỗ trợ OCR, ưu tiên xử lý và giữ định dạng tốt hơn.

Tiếp theo là phần lợi ích gồm các card:

* Dễ sử dụng
* Chuyển đổi nhanh
* Có lịch sử convert
* Bảo mật file
* Tự động xóa file sau thời gian hết hạn
* Hỗ trợ nạp coin cho nhu cầu nâng cao

Cuối trang có FAQ và footer.

### Cảm giác cần đạt

Người dùng không cần đọc nhiều vẫn biết phải bấm vào đâu. Trang chủ nên giống một công cụ hơn là một trang giới thiệu dài.

---

## 4. Upload Box

### Mục tiêu UX

Đây là component quan trọng nhất của website. Người dùng cần upload file dễ dàng, rõ trạng thái và biết lỗi ngay nếu file không hợp lệ.

### Mô tả UI

Upload Box là một khung lớn ở giữa màn hình. Khi chưa chọn file, khung hiển thị:

* Icon upload hoặc icon PDF
* Text: “Kéo thả file PDF vào đây”
* Nút: “Chọn file PDF”
* Ghi chú nhỏ: “Hỗ trợ định dạng .pdf”

Khi người dùng kéo file vào, khung đổi trạng thái hover, viền nổi bật hơn và hiển thị text:

“Thả file để upload”

Khi đã chọn file, khung chuyển sang trạng thái file selected:

* Tên file
* Dung lượng file
* Icon PDF
* Nút xóa file
* Nút tiếp tục hoặc tự động upload

Khi upload, hiển thị:

* Thanh tiến trình upload
* Text: “Đang tải file lên...”
* Không cho người dùng bấm convert cho đến khi upload xong

Khi lỗi, hiển thị thông báo rõ ràng:

* “File không hợp lệ. Vui lòng chọn file PDF.”
* “File vượt quá dung lượng cho phép.”
* “Không thể đọc file PDF. Vui lòng thử file khác.”

### Trạng thái cần thiết kế

* Empty
* Drag over
* File selected
* Uploading
* Uploaded
* Invalid file
* Upload error

---

## 5. Trang Upload PDF

### Mục tiêu UX

Cho người dùng tập trung hoàn toàn vào thao tác chọn file, không bị phân tán bởi quá nhiều nội dung.

### Mô tả UI

Trang upload có layout đơn giản. Header nằm trên cùng. Phần chính ở giữa trang là tiêu đề và Upload Box.

Nội dung đề xuất:

**Tiêu đề:**
Upload file PDF của bạn

**Mô tả:**
Chọn file PDF từ thiết bị hoặc kéo thả file vào khu vực bên dưới để bắt đầu chuyển đổi sang Word.

Bên dưới upload box hiển thị giới hạn miễn phí:

* File nhỏ hơn 5MB
* Dưới 30 trang
* Tối đa 5 lần convert miễn phí mỗi ngày

Nếu người dùng chưa đăng nhập, hiển thị thêm gợi ý:

“Đăng nhập để sử dụng chế độ nâng cao, lưu lịch sử convert và tải lại file trong thời gian còn hạn.”

CTA phụ:

* Đăng nhập
* Xem bảng giá coin

### Cảm giác cần đạt

Trang này phải tạo cảm giác nhanh, nhẹ, không rườm rà. Người dùng chỉ cần chọn file và đi tiếp.

---

## 6. Trang thông tin file

### Mục tiêu UX

Giúp người dùng kiểm tra file trước khi convert và hiểu rõ file có đủ điều kiện miễn phí hay không.

### Mô tả UI

Trang này nên dùng một card lớn ở giữa màn hình gọi là  **File Info Card** .

Thông tin hiển thị:

* Tên file PDF
* Dung lượng file
* Số trang
* Trạng thái kiểm tra file
* Chế độ miễn phí có khả dụng hay không
* Coin dự kiến nếu dùng chế độ nâng cao

Ví dụ bố cục:

**example.pdf**
Dung lượng: 3.2MB
Số trang: 12
Trạng thái: File hợp lệ
Coin dự kiến: 12 coin

Bên dưới là 2 lựa chọn lớn:

### Convert miễn phí

Hiển thị như một card lựa chọn. Nội dung gồm:

* 0 coin
* Dành cho file dưới 5MB và dưới 30 trang
* Không ưu tiên xử lý
* File lưu 1 giờ

Nếu file hợp lệ, nút **Convert miễn phí** được bật.
Nếu không hợp lệ, nút bị disabled và hiển thị lý do.

### Convert nâng cao

Hiển thị như một card nổi bật hơn. Nội dung gồm:

* Tính coin theo số trang
* Hỗ trợ file lớn hơn
* Có thể hỗ trợ OCR
* Ưu tiên xử lý
* File lưu 24 giờ

Nếu người dùng chưa đăng nhập, card này hiển thị trạng thái khóa và có nút  **Đăng nhập để dùng coin** .

### Cảm giác cần đạt

Người dùng phải hiểu rõ nên chọn chế độ nào mà không cần đọc tài liệu hướng dẫn.

---

## 7. Modal chọn chế độ convert

### Mục tiêu UX

So sánh nhanh giữa miễn phí và nâng cao trước khi người dùng quyết định.

### Mô tả UI

Modal xuất hiện khi người dùng bấm chọn chế độ hoặc bấm “So sánh chế độ”.

Modal có tiêu đề:

**Chọn chế độ chuyển đổi**

Bên trong là bảng so sánh 2 cột:

| Tiêu chí           | Miễn phí               | Nâng cao            |
| -------------------- | ------------------------ | -------------------- |
| Chi phí             | 0 coin                   | Tính theo số trang |
| Dung lượng         | Dưới 5MB               | Cao hơn             |
| Số trang            | Dưới 30 trang          | Cao hơn             |
| OCR                  | Có thể không hỗ trợ | Có thể hỗ trợ    |
| Ưu tiên xử lý    | Không                   | Có                  |
| Thời gian lưu file | 1 giờ                   | 24 giờ              |

Cuối modal có 3 hành động:

* Convert miễn phí
* Convert nâng cao
* Hủy

### Gợi ý UX

Không nên để modal quá dài. Mỗi dòng cần ngắn, dễ so sánh. Chế độ được khuyến nghị có thể có badge “Phù hợp cho file lớn”.

---

## 8. Modal xác nhận coin

### Mục tiêu UX

Đảm bảo người dùng biết rõ số coin bị trừ trước khi dùng chế độ nâng cao.

### Mô tả UI

Modal có tiêu đề:

**Xác nhận sử dụng coin**

Nội dung hiển thị:

* Tên file
* Số trang
* Loại xử lý: Convert thường hoặc OCR
* Công thức tính coin
* Tổng coin cần dùng
* Số dư coin hiện tại
* Số dư còn lại sau khi convert

Ví dụ:

File: `example.pdf`
Số trang: 12
Loại xử lý: Convert thường
Phí: 1 coin / trang
Tổng phí: 12 coin
Số dư hiện tại: 100 coin
Sau khi convert còn: 88 coin

Nếu không đủ coin, modal chuyển sang trạng thái cảnh báo:

“Bạn còn thiếu 20 coin để thực hiện chuyển đổi nâng cao.”

Nút hành động:

* Nạp thêm coin
* Hủy

Nếu đủ coin:

* Xác nhận convert
* Hủy

### Cảm giác cần đạt

Người dùng cảm thấy minh bạch, không bị trừ coin bất ngờ.

---

## 9. Trang trạng thái convert

### Mục tiêu UX

Giúp người dùng biết file đang được xử lý đến đâu và kết quả cuối cùng là gì.

### Mô tả UI

Trang này dùng **Convert Status Card** đặt ở giữa màn hình.

Thông tin hiển thị:

* Tên file
* Chế độ convert
* Loại xử lý
* Trạng thái hiện tại
* Thời gian tạo yêu cầu
* Coin dự kiến hoặc coin đã dùng
* Thanh tiến trình nếu có

Các trạng thái hiển thị:

### Đang chờ xử lý

Hiển thị icon đồng hồ hoặc loading nhỏ.
Text: “File của bạn đang chờ được xử lý.”

### Đã đưa vào hàng đợi

Text: “Yêu cầu đã được đưa vào hàng đợi chuyển đổi.”

### Đang chuyển đổi

Hiển thị progress bar hoặc animation loading.
Text: “Hệ thống đang chuyển đổi PDF sang Word.”

### Chuyển đổi thành công

Hiển thị icon thành công, màu tích cực.
Text: “File của bạn đã được chuyển đổi thành công.”

Nút chính:

* Tải file DOCX

Nút phụ:

* Convert file khác
* Xem lịch sử convert

### Chuyển đổi thất bại

Hiển thị icon lỗi.
Text: “Convert thất bại. Vui lòng thử lại hoặc gửi khiếu nại.”

Nút:

* Thử lại
* Gửi khiếu nại
* Convert bằng chế độ nâng cao nếu phù hợp

### Cảm giác cần đạt

Người dùng không bị hoang mang trong thời gian chờ. Trạng thái phải rõ ràng, ngắn gọn và có hành động tiếp theo.

---

## 10. Trang tải file DOCX

### Mục tiêu UX

Cho người dùng tải file kết quả một cách rõ ràng và nhanh chóng.

### Mô tả UI

Trang này nên có card kết quả ở trung tâm.

Nội dung card:

* Icon thành công
* Tiêu đề: “Chuyển đổi thành công”
* Tên file DOCX
* Dung lượng file nếu có
* Thời gian hoàn thành
* Thời gian hết hạn file

Nút chính:

**Tải file DOCX**

Nút phụ:

* Convert file khác
* Xem lịch sử convert

Nếu file miễn phí, hiển thị:

“File miễn phí sẽ được lưu trong 1 giờ.”

Nếu file nâng cao, hiển thị:

“File nâng cao sẽ được lưu trong 24 giờ.”

Nếu file hết hạn, nút tải bị vô hiệu hóa và hiển thị:

“File đã hết hạn và không còn khả dụng.”

---

## 11. Trang đăng ký

### Mục tiêu UX

Cho người dùng tạo tài khoản nhanh, ít trường, dễ hiểu.

### Mô tả UI

Form đăng ký nằm giữa màn hình trong một card.

Các trường gồm:

* Họ tên
* Email
* Mật khẩu
* Nhập lại mật khẩu
* Checkbox đồng ý điều khoản

Nút chính:

**Đăng ký**

Bên dưới có link:

“Đã có tài khoản? Đăng nhập”

### Validate UX

Lỗi nên hiển thị ngay dưới input:

* Email không được để trống
* Email không đúng định dạng
* Mật khẩu quá ngắn
* Mật khẩu nhập lại không khớp
* Email đã tồn tại

### Cảm giác cần đạt

Form ngắn gọn, thân thiện, không tạo cảm giác phức tạp.

---

## 12. Trang đăng nhập

### Mục tiêu UX

Cho người dùng đăng nhập nhanh để dùng coin, lịch sử convert và các tính năng cá nhân.

### Mô tả UI

Form đăng nhập đặt giữa màn hình.

Các trường gồm:

* Email
* Mật khẩu
* Checkbox ghi nhớ đăng nhập nếu cần

Nút chính:

**Đăng nhập**

Link phụ:

* Quên mật khẩu
* Đăng ký tài khoản

Nếu đăng nhập sai, hiển thị lỗi:

“Email hoặc mật khẩu không đúng.”

Sau khi đăng nhập:

* User đi đến trang tài khoản hoặc trang upload
* Admin đi đến admin dashboard
* Support đi đến support dashboard

---

## 13. Trang quên mật khẩu

### Mục tiêu UX

Giúp người dùng lấy lại tài khoản dễ dàng.

### Mô tả UI

Card trung tâm gồm:

* Tiêu đề: “Quên mật khẩu”
* Mô tả: “Nhập email của bạn, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu.”
* Input email
* Nút: “Gửi yêu cầu”
* Link quay lại đăng nhập

Sau khi gửi thành công, hiển thị trạng thái:

“Vui lòng kiểm tra email để đặt lại mật khẩu.”

---

## 14. Trang tài khoản cá nhân

### Mục tiêu UX

Cho người dùng xem thông tin cá nhân và truy cập nhanh các chức năng liên quan.

### Mô tả UI

Trang tài khoản có layout dạng dashboard nhẹ.

Các card chính:

* Thông tin cá nhân
* Số dư coin
* Lượt convert gần đây
* Giao dịch coin gần đây
* Nút nạp coin
* Nút xem lịch sử convert

Thông tin cá nhân gồm:

* Họ tên
* Email
* Vai trò
* Trạng thái tài khoản

### Gợi ý UX

Nên có card số dư coin nổi bật để người dùng luôn biết mình còn bao nhiêu coin.

---

## 15. Trang ví coin

### Mục tiêu UX

Giúp người dùng kiểm tra số dư và đi đến nạp coin nhanh.

### Mô tả UI

Phần đầu trang là card số dư lớn:

**Số dư coin hiện tại: 100 coin**

Bên dưới có các nút:

* Nạp coin
* Xem lịch sử giao dịch

Có thể thêm thống kê nhanh:

* Coin đã nạp
* Coin đã dùng
* Coin được hoàn

Bên dưới là gợi ý các gói coin phổ biến, ví dụ:

* Gói 100 coin
* Gói 600 coin
* Gói 1500 coin

### Cảm giác cần đạt

Người dùng cần thấy ngay số dư và hành động nạp coin.

---

## 16. Trang nạp coin

### Mục tiêu UX

Giúp người dùng chọn gói coin và tạo giao dịch thanh toán rõ ràng.

### Mô tả UI

Trang chia thành 2 phần:

### Danh sách gói coin

Hiển thị dạng card:

**Gói cơ bản**
10.000 VNĐ
Nhận 100 coin
Nút: Chọn gói

**Gói phổ biến**
50.000 VNĐ
Nhận 600 coin
Badge: Phổ biến
Nút: Chọn gói

**Gói tiết kiệm**
100.000 VNĐ
Nhận 1.500 coin
Nút: Chọn gói

### Tóm tắt thanh toán

Sau khi chọn gói, bên phải hoặc bên dưới hiển thị:

* Gói đã chọn
* Số tiền
* Số coin nhận được
* Phương thức thanh toán
* Nút xác nhận thanh toán

Trạng thái giao dịch gồm:

* Đang chờ thanh toán
* Thanh toán thành công
* Thanh toán thất bại
* Đã hủy

### Gợi ý UX

Gói phổ biến nên được làm nổi bật bằng badge hoặc viền nổi bật.

---

## 17. Trang lịch sử giao dịch coin

### Mục tiêu UX

Cho người dùng kiểm tra coin đã được cộng, trừ hoặc hoàn vì lý do gì.

### Mô tả UI

Trang hiển thị bảng giao dịch.

Các cột:

* Thời gian
* Loại giao dịch
* Số coin
* Số dư trước
* Số dư sau
* Lý do
* Trạng thái

Bộ lọc phía trên:

* Loại giao dịch
* Trạng thái
* Khoảng thời gian

Trên mobile, mỗi giao dịch nên hiển thị dạng card thay vì bảng ngang.

---

## 18. Trang lịch sử thanh toán

### Mục tiêu UX

Cho người dùng xem lại các lần nạp tiền mua coin.

### Mô tả UI

Bảng thanh toán gồm:

* Mã giao dịch
* Gói coin
* Số tiền
* Số coin
* Phương thức thanh toán
* Trạng thái
* Thời gian tạo
* Thời gian thanh toán thành công

Hành động:

* Xem chi tiết
* Hủy giao dịch nếu còn pending
* Gửi khiếu nại nếu có lỗi

### Cảm giác cần đạt

Minh bạch, dễ đối chiếu khi có vấn đề về thanh toán.

---

## 19. Trang lịch sử convert

### Mục tiêu UX

Cho người dùng xem lại các file đã convert và tải lại nếu file còn hạn.

### Mô tả UI

Bảng lịch sử gồm:

* Tên file PDF gốc
* Tên file DOCX
* Chế độ convert
* Loại xử lý
* Số trang
* Số coin đã dùng
* Trạng thái
* Thời gian tạo
* Thời gian hoàn thành
* Thời gian hết hạn
* Hành động

Hành động theo trạng thái:

* Thành công và còn hạn: Tải file
* Hết hạn: Hiển thị “Đã hết hạn”
* Thất bại: Xem lỗi / Gửi khiếu nại
* Đang xử lý: Xem trạng thái

Bộ lọc:

* Trạng thái
* Chế độ convert
* Loại xử lý
* Thời gian

### Gợi ý UX

Trạng thái nên dùng badge màu:

* Thành công
* Đang xử lý
* Thất bại
* Hết hạn

---

## 20. Chi tiết một lần convert

### Mục tiêu UX

Cho người dùng xem toàn bộ thông tin của một yêu cầu convert.

### Mô tả UI

Trang chi tiết hiển thị theo dạng card thông tin.

Nội dung gồm:

* Mã yêu cầu convert
* Tên file gốc
* Dung lượng
* Số trang
* Chế độ convert
* Loại xử lý
* Coin dự kiến
* Coin thực tế đã trừ
* Trạng thái
* Lỗi nếu có
* Thời gian upload
* Thời gian bắt đầu xử lý
* Thời gian hoàn thành
* Thời gian hết hạn

Nút hành động:

* Tải file
* Gửi khiếu nại
* Quay lại lịch sử

---

## 21. Chatbot AI

### Mục tiêu UX

Giúp người dùng hỏi nhanh các vấn đề phổ biến mà không cần tạo ticket.

### Mô tả UI

Chatbot là nút nổi ở góc dưới bên phải. Nút có icon chat và text nhỏ như:

“Cần hỗ trợ?”

Khi mở, chatbot hiển thị cửa sổ nhỏ gồm:

* Header: “Hỗ trợ nhanh”
* Khu vực tin nhắn
* Ô nhập câu hỏi
* Nút gửi

Chatbot nên gợi ý sẵn các câu hỏi:

* Cách upload file PDF?
* Cách convert PDF sang Word?
* Cách tính coin?
* Tại sao convert thất bại?
* File được lưu bao lâu?
* Làm sao gửi khiếu nại?

Nếu chatbot không giải quyết được, hiển thị nút:

“Tạo yêu cầu hỗ trợ”

### Lưu ý UX

Chatbot chỉ hỗ trợ thông tin chung. Các vấn đề liên quan đến coin, thanh toán hoặc khiếu nại cần chuyển sang hỗ trợ viên.

---

## 22. Trang hỗ trợ / khiếu nại của người dùng

### Mục tiêu UX

Cho người dùng gửi yêu cầu khi gặp lỗi convert, lỗi thanh toán hoặc lỗi coin.

### Mô tả UI

Trang gồm 2 phần:

### Danh sách ticket

Hiển thị:

* Mã ticket
* Tiêu đề
* Loại vấn đề
* Trạng thái
* Thời gian tạo
* Hành động xem chi tiết

Có nút:

**Tạo ticket mới**

### Form tạo ticket

Các trường:

* Tiêu đề
* Loại vấn đề
* Nội dung mô tả
* Conversion job liên quan nếu có
* Payment liên quan nếu có
* File đính kèm nếu cần

Nút chính:

**Gửi yêu cầu**

Trạng thái ticket:

* Mới tạo
* Đang xử lý
* Đã phản hồi
* Đã giải quyết
* Đã hủy

---

## 23. Chi tiết ticket hỗ trợ

### Mục tiêu UX

Cho người dùng và hỗ trợ viên trao đổi trong một luồng hội thoại rõ ràng.

### Mô tả UI

Trang chi tiết ticket gồm:

* Mã ticket
* Tiêu đề
* Loại vấn đề
* Trạng thái
* Mức độ ưu tiên
* Thông tin payment hoặc conversion liên quan nếu có
* Khung chat
* Ô nhập tin nhắn
* Nút gửi
* Nút đánh dấu đã giải quyết nếu được phép

Khung chat nên phân biệt tin nhắn của user và hỗ trợ viên bằng vị trí trái/phải hoặc màu nền khác nhau.

---

## 24. Support dashboard

### Mục tiêu UX

Giúp hỗ trợ viên xem nhanh các ticket cần xử lý.

### Mô tả UI

Dashboard hỗ trợ có các card thống kê:

* Ticket mới
* Ticket đang xử lý
* Ticket đã phản hồi
* Ticket khẩn cấp

Bên dưới là danh sách ticket mới nhất.

Mỗi ticket hiển thị:

* Mã ticket
* Người gửi
* Tiêu đề
* Loại vấn đề
* Trạng thái
* Mức độ ưu tiên
* Thời gian tạo

Có bộ lọc nhanh:

* Mới
* Đang xử lý
* Đã phản hồi
* Đã giải quyết

---

## 25. Danh sách ticket cho hỗ trợ viên

### Mục tiêu UX

Giúp hỗ trợ viên tìm, lọc và xử lý ticket hiệu quả.

### Mô tả UI

Bảng ticket gồm:

* Mã ticket
* Người gửi
* Tiêu đề
* Loại vấn đề
* Trạng thái
* Mức độ ưu tiên
* Người phụ trách
* Thời gian tạo
* Hành động xem chi tiết

Bộ lọc:

* Trạng thái
* Loại vấn đề
* Mức độ ưu tiên
* Người phụ trách
* Thời gian

Nên có thanh tìm kiếm theo mã ticket hoặc email người dùng.

---

## 26. Chi tiết ticket cho hỗ trợ viên

### Mục tiêu UX

Cho hỗ trợ viên xem đầy đủ ngữ cảnh và phản hồi người dùng nhanh.

### Mô tả UI

Trang chia thành 2 vùng:

### Vùng chính

* Lịch sử tin nhắn
* Ô trả lời
* Nút gửi
* Nút nhận xử lý
* Nút cập nhật trạng thái
* Nút chuyển admin

### Sidebar thông tin

* Thông tin ticket
* Thông tin người dùng
* Conversion job liên quan
* Payment liên quan
* Lịch sử xử lý

### Gợi ý UX

Hỗ trợ viên cần xem được dữ liệu liên quan mà không phải mở quá nhiều tab.

---

## 27. Admin layout

### Mục tiêu UX

Tạo giao diện quản trị rõ ràng, ưu tiên bảng dữ liệu, bộ lọc và thao tác nhanh.

### Mô tả UI

Admin layout gồm:

* Sidebar bên trái
* Topbar phía trên
* Main content ở giữa
* User menu ở góc phải
* Notification nếu có

Sidebar gồm:

* Dashboard
* Người dùng
* Gói coin
* Thanh toán
* Giao dịch coin
* Lịch sử convert
* Khiếu nại
* Hỗ trợ viên
* Cấu hình
* Audit log
* Đăng xuất

---

## 28. Admin dashboard

### Mục tiêu UX

Cho admin xem tổng quan tình hình hệ thống.

### Mô tả UI

Phần đầu là các card thống kê:

* Tổng người dùng
* Tổng lượt convert
* Lượt convert miễn phí
* Lượt convert nâng cao
* Tổng coin đã nạp
* Tổng coin đã sử dụng
* Doanh thu
* Giao dịch pending
* Convert lỗi
* Ticket đang xử lý

Bên dưới là biểu đồ:

* Lượt convert theo ngày
* Doanh thu theo ngày
* Coin sử dụng theo ngày
* Tỷ lệ convert thành công/thất bại

Cuối trang có bảng hoạt động gần đây:

* Convert mới
* Thanh toán mới
* Ticket mới
* Lỗi hệ thống gần đây

---

## 29. Quản lý người dùng

### Mục tiêu UX

Cho admin xem, tìm kiếm và thao tác với tài khoản người dùng.

### Mô tả UI

Bảng người dùng gồm:

* ID
* Họ tên
* Email
* Vai trò
* Số dư coin
* Trạng thái
* Ngày tạo
* Lần đăng nhập gần nhất
* Hành động

Hành động:

* Xem chi tiết
* Khóa / mở khóa tài khoản
* Cập nhật vai trò
* Cộng / trừ coin thủ công
* Xem lịch sử convert
* Xem lịch sử giao dịch coin

Bộ lọc:

* Vai trò
* Trạng thái
* Ngày tạo
* Số dư coin

---

## 30. Quản lý gói coin

### Mục tiêu UX

Cho admin tạo và chỉnh sửa các gói nạp coin.

### Mô tả UI

Bảng gói coin gồm:

* Tên gói
* Giá tiền
* Số coin
* Mô tả
* Trạng thái hoạt động
* Thứ tự hiển thị
* Hành động

Hành động:

* Thêm gói
* Sửa gói
* Bật / tắt gói
* Xóa mềm

Form thêm/sửa gói gồm:

* Tên gói
* Giá tiền
* Số coin
* Mô tả
* Trạng thái
* Thứ tự hiển thị

---

## 31. Quản lý thanh toán

### Mục tiêu UX

Cho admin theo dõi và xác nhận các giao dịch nạp coin.

### Mô tả UI

Bảng thanh toán gồm:

* Mã giao dịch
* Người dùng
* Gói coin
* Số tiền
* Số coin
* Phương thức
* Trạng thái
* Thời gian tạo
* Thời gian thanh toán
* Hành động

Hành động:

* Xem chi tiết
* Xác nhận thành công
* Đánh dấu thất bại
* Hủy giao dịch
* Xem giao dịch coin liên quan

Trạng thái nên có badge màu:

* Pending
* Success
* Failed
* Canceled

---

## 32. Quản lý lịch sử convert

### Mục tiêu UX

Cho admin theo dõi toàn bộ conversion job và xử lý lỗi.

### Mô tả UI

Bảng conversion job gồm:

* Mã yêu cầu
* Người dùng
* Tên file
* Dung lượng
* Số trang
* Chế độ
* Loại xử lý
* Coin đã trừ
* Trạng thái
* Thời gian tạo
* Thời gian hoàn thành
* Hành động

Bộ lọc:

* Trạng thái
* Chế độ
* Loại xử lý
* Người dùng
* Thời gian

Hành động:

* Xem chi tiết
* Xem lỗi
* Xem ticket liên quan
* Đánh dấu xóa file nếu cần

---

## 33. Quản lý giao dịch coin

### Mục tiêu UX

Cho admin kiểm tra mọi biến động coin trong hệ thống.

### Mô tả UI

Bảng gồm:

* Mã giao dịch coin
* Người dùng
* Loại giao dịch
* Số coin
* Số dư trước
* Số dư sau
* Lý do
* Trạng thái
* Thời gian

Bộ lọc:

* Người dùng
* Loại giao dịch
* Trạng thái
* Thời gian

### Gợi ý UX

Các giao dịch trừ coin, cộng coin và hoàn coin nên có màu hoặc icon khác nhau để dễ phân biệt.

---

## 34. Quản lý khiếu nại cho admin

### Mục tiêu UX

Cho admin giám sát toàn bộ ticket và xử lý các vấn đề cần quyền cao hơn.

### Mô tả UI

Admin xem danh sách ticket giống hỗ trợ viên nhưng có thêm quyền:

* Gán ticket cho hỗ trợ viên
* Đổi mức độ ưu tiên
* Đóng ticket
* Xem dữ liệu payment
* Xem dữ liệu conversion job
* Xem lịch sử giao dịch coin
* Điều chỉnh coin nếu cần

Trang chi tiết ticket nên có sidebar dữ liệu liên quan để admin đối chiếu nhanh.

---

## 35. Cấu hình hệ thống

### Mục tiêu UX

Cho admin điều chỉnh giới hạn và chi phí convert mà không cần sửa code.

### Mô tả UI

Trang cấu hình hiển thị form chia nhóm rõ ràng.

### Nhóm giới hạn miễn phí

* Dung lượng file miễn phí tối đa
* Số trang miễn phí tối đa
* Số lần convert miễn phí mỗi ngày
* Thời gian lưu file miễn phí

### Nhóm nâng cao

* Thời gian lưu file nâng cao
* Coin cho convert thường mỗi trang
* Coin cho OCR mỗi trang
* Coin cho mỗi trang sau trang 30
* Bật / tắt OCR

### Nhóm hệ thống

* Bật / tắt convert miễn phí
* Cấu hình hàng đợi nếu có
* Khôi phục mặc định

Nút hành động:

* Lưu cấu hình
* Khôi phục mặc định

### Gợi ý UX

Các thay đổi liên quan đến coin nên có modal xác nhận trước khi lưu.

---

## 36. Footer

### Mục tiêu UX

Cung cấp liên kết phụ và tạo cảm giác đáng tin cậy.

### Mô tả UI

Footer nằm cuối trang, gồm:

* Logo hoặc tên website
* Mô tả ngắn
* Link nhanh:
  * Upload PDF
  * Bảng giá
  * Hướng dẫn
  * Hỗ trợ
* Chính sách:
  * Điều khoản sử dụng
  * Chính sách bảo mật
  * Chính sách lưu trữ file
* Thông tin liên hệ nếu có

Footer nên đơn giản, không quá nặng.

---

## 37. Responsive design

### Mobile

Trên mobile, giao diện cần ưu tiên thao tác một tay:

* Upload box rộng gần full màn hình
* Nút lớn, dễ bấm
* Form ngắn gọn
* Bảng chuyển thành card
* Sidebar admin có thể chuyển thành menu drawer
* Chatbot không che nút chính

### Tablet

Tablet có thể dùng layout 2 cột cho các trang như nạp coin, ví coin, thông tin file.

### Desktop

Desktop ưu tiên hiển thị nhiều thông tin hơn:

* Dashboard dạng bảng
* Sidebar rõ ràng
* Bộ lọc đầy đủ
* Card thống kê và biểu đồ

---

## 38. Nguyên tắc UX quan trọng

1. Luôn làm rõ bước tiếp theo cho người dùng.
2. Không trừ coin nếu người dùng chưa xác nhận.
3. Luôn hiển thị số coin dự kiến trước khi convert nâng cao.
4. Lỗi phải viết bằng ngôn ngữ dễ hiểu.
5. File hết hạn phải được thông báo rõ.
6. Chế độ miễn phí và nâng cao phải khác biệt rõ bằng giao diện.
7. Người dùng phải luôn có đường quay lại upload file khác.
8. Các thao tác liên quan đến tiền, coin và thanh toán cần có xác nhận.
9. Trên mobile, ưu tiên card thay vì bảng ngang.
10. Admin và support cần giao diện nhiều bộ lọc, dễ tìm kiếm, dễ xử lý.
