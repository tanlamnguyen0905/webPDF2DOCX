# Yêu cầu hệ thống website Convert PDF to Word

Software Requirement Specification

## 1. Mục tiêu hệ thống

Website cho phép người dùng tải lên file PDF và chuyển đổi sang file Word định dạng `.docx`. Hệ thống có hai chế độ chuyển đổi:

* **Chế độ cơ bản**: miễn phí, không tốn coin, phù hợp với nhu cầu chuyển đổi đơn giản.
* **Chế độ nâng cao**: tốn coin, dành cho các file lớn hơn, chất lượng chuyển đổi tốt hơn hoặc có thêm tính năng như OCR, giữ định dạng tốt hơn, xử lý nhanh hơn.

Ngoài chức năng chuyển đổi file, website có hệ thống **coin** để quản lý tài nguyên sử dụng và hệ thống **nạp tiền** để người dùng mua thêm coin.

---

## 2. Đối tượng sử dụng

Hệ thống có thể có các nhóm người dùng sau:

### 2.1. Khách chưa đăng nhập

Khách có thể truy cập website, xem giới thiệu dịch vụ và có thể dùng thử chức năng convert cơ bản nếu hệ thống cho phép.

Giới hạn đề xuất:

* Chỉ convert file nhỏ.
* Giới hạn số lần convert trong ngày.
* Không lưu lịch sử chuyển đổi.
* Không sử dụng được chế độ nâng cao.

### 2.2. Người dùng đã đăng ký

Người dùng có tài khoản có thể:

* Đăng nhập, đăng ký tài khoản.
* Upload file PDF.
* Convert PDF sang DOCX.
* Sử dụng chế độ miễn phí hoặc chế độ tốn coin.
* Xem số dư coin.
* Nạp tiền để mua coin.
* Xem lịch sử chuyển đổi.
* Tải lại file đã convert trong một khoảng thời gian nhất định.

### 2.3. Quản trị viên

Admin có thể:

* Quản lý người dùng.
* Quản lý gói coin.
* Quản lý giao dịch nạp tiền.
* Theo dõi lịch sử convert.
* Cấu hình giới hạn upload, giới hạn số trang, giới hạn dung lượng file.
* Theo dõi tài nguyên hệ thống.
* Xử lý lỗi hoặc khiếu nại của người dùng.

---

## 3. Yêu cầu chức năng

## 3.1. Chức năng đăng ký, đăng nhập

Hệ thống cần cho phép người dùng tạo tài khoản và đăng nhập để sử dụng các chức năng cá nhân.

Các chức năng gồm:

* Đăng ký tài khoản bằng email và mật khẩu.
* Đăng nhập.
* Đăng xuất.
* Quên mật khẩu.
* Cập nhật thông tin cá nhân.
* Xem số dư coin hiện tại.

---

## 3.2. Chức năng upload file PDF

Người dùng có thể tải file PDF từ thiết bị lên hệ thống.

Yêu cầu chi tiết:

* Chỉ cho phép upload file có định dạng `.pdf`.
* Kiểm tra dung lượng file trước khi upload.
* Kiểm tra file có bị lỗi hoặc không đọc được không.
* Hiển thị tên file, dung lượng file và số trang và phí (coin cho lần chuyển đổi).
* Cho phép người dùng xóa file đã chọn trước khi convert.
* Có thông báo lỗi nếu file không hợp lệ.

---

## 3.3. Chức năng convert PDF sang Word

Đây là chức năng chính của hệ thống.

Người dùng sau khi upload file có thể chọn một trong hai chế độ convert:

### Chế độ 1: Convert cơ bản miễn phí

Chế độ này không tốn coin.

Đặc điểm:

* Không yêu cầu coin.
* Giới hạn dung lượng file bé hơn 5mb.
* Giới hạn số trang bé hơn 30 trang.
* Có thể không hỗ trợ OCR nâng cao.
* Phù hợp với PDF có nội dung văn bản đơn giản.
* Giới hạn 5 lần chuyển đổi mỗi ngày.

### Chế độ 2: Convert nâng cao tốn coin

Chế độ này yêu cầu người dùng có đủ coin.

Đặc điểm:

* Tốn coin theo số trang, dung lượng file hoặc loại xử lý.
* Ưu tiên tốc độ xử lý.
* Hỗ trợ file lớn hơn.
* Có thể hỗ trợ OCR cho PDF scan.
* Giữ định dạng tốt hơn.
* Có thể hỗ trợ bảng biểu, hình ảnh, font chữ tốt hơn.

Ví dụ cách tính coin:

* Convert thường: 1 coin / 1 trang.
* Convert có OCR: 2 coin / 1 trang.
* Nếu file lớn hơn 30 trang thì mỗi trang phía sau là 3 coin / 1 trang

Trước khi convert, hệ thống cần hiển thị số coin dự kiến bị trừ để người dùng xác nhận.

---

## 3.4. Chức năng quản lý coin

Coin được dùng để kiểm soát tài nguyên chuyển đổi nâng cao.

Người dùng có thể:

* Xem số dư coin.
* Xem lịch sử cộng coin.
* Xem lịch sử trừ coin.
* Biết lý do coin bị trừ, ví dụ: convert file, OCR, xử lý ưu tiên.
* Được hoàn coin nếu quá trình convert thất bại do lỗi hệ thống.

Hệ thống cần đảm bảo:

* Không cho convert nâng cao nếu không đủ coin.
* Trừ coin sau khi người dùng xác nhận.
* Có cơ chế hoàn coin nếu convert lỗi.
* Lưu lại lịch sử giao dịch coin.

---

## 3.5. Chức năng nạp tiền mua coin

Người dùng có thể nạp tiền để mua thêm coin.

Các chức năng gồm:

* Hiển thị các gói coin.
* Chọn gói coin muốn mua.
* Thanh toán qua phương thức được hỗ trợ.
* Sau khi thanh toán thành công, hệ thống tự động cộng coin vào tài khoản.
* Lưu lịch sử nạp tiền.
* Hiển thị trạng thái giao dịch: đang xử lý, thành công, thất bại, đã hủy.

Ví dụ gói coin:

* Gói 1: 10.000 VNĐ = 100 coin.
* Gói 2: 50.000 VNĐ = 600 coin.
* Gói 3: 100.000 VNĐ = 1.500 coin.

Admin có thể thay đổi giá và số coin của từng gói.

---

## 3.6. Chức năng tải file sau khi convert

Sau khi convert thành công, người dùng có thể tải file `.docx`.

Yêu cầu:

* Hiển thị nút tải file Word.
* File đầu ra có định dạng `.docx`.
* Tên file đầu ra nên dựa trên tên file gốc.
* File sau khi convert chỉ được lưu trong một khoảng thời gian nhất định.
* Người dùng có thể tải lại file từ lịch sử nếu file chưa hết hạn.

Ví dụ:

* File miễn phí lưu trong 1 giờ.
* File khi dùng coin chuyển đổi thì lưu trong 24 giờ.

---

## 3.7. Chức năng lịch sử chuyển đổi

Người dùng đã đăng nhập có thể xem lịch sử các lần convert.

Thông tin cần lưu:

* Tên file PDF gốc.
* Tên file DOCX sau khi convert.
* Thời gian convert.
* Chế độ convert: miễn phí hoặc nâng cao.
* Số coin đã sử dụng.
* Trạng thái: thành công, thất bại, đang xử lý.
* Link tải file nếu còn hạn.

---

## 3.8. Chức năng quản trị

Admin cần có trang quản trị để quản lý hệ thống.

Các chức năng chính:

* Quản lý tài khoản người dùng.
* Xem số dư coin của người dùng.
* Cộng hoặc trừ coin thủ công khi cần.
* Quản lý gói nạp coin.
* Xem danh sách giao dịch nạp tiền.
* Xem lịch sử convert.
* Cấu hình giới hạn convert miễn phí.
* Cấu hình chi phí coin cho từng loại convert.
* Theo dõi lỗi convert.
* Theo dõi tài nguyên hệ thống.
* Thống kê lượng nạp coin

## 3.9. Chức năng hỗ trợ viên

* Xem và nhắn tin hỗ trợ các đoạn chat với khách hàng nhắn khiếu nại

## **3.9. Chức năng nhắn tin hỗ trợ hoặc khiếu nại**

* Hỗ trợ chat box (ai) để người dùng hỏi về thông tin trang web
* có phần khiếu nại nhắn tin với 

---

## 4. Yêu cầu phi chức năng

## 4.1. Bảo mật

Hệ thống cần đảm bảo an toàn cho tài khoản, file và giao dịch của người dùng.

Yêu cầu:

* Mật khẩu phải được mã hóa.
* File upload cần được kiểm tra định dạng.
* Không cho upload file độc hại.
* Người dùng chỉ được xem và tải file của chính mình.
* Giao dịch coin phải được lưu lại rõ ràng.
* Không được trừ coin sai hoặc trừ coin nhiều lần cho cùng một yêu cầu.
* Có HTTPS khi triển khai thật.
* File người dùng nên được tự động xóa sau một khoảng thời gian.

---

## 4.2. Hiệu năng

Website cần xử lý convert ổn định, đặc biệt khi có nhiều người dùng.

Yêu cầu:

* Upload file không bị treo giao diện.
* Có thanh tiến trình hoặc trạng thái xử lý.
* Convert nên chạy dưới dạng tác vụ nền.
* Hệ thống cần có hàng đợi xử lý file.
* Chế độ nâng cao có thể được ưu tiên trong hàng đợi.
* Tránh để một file lớn làm ảnh hưởng toàn bộ hệ thống.

---

## 4.3. Khả năng mở rộng

Hệ thống nên được thiết kế để sau này có thể mở rộng thêm các chức năng khác.

Ví dụ:

* Convert Word sang PDF.
* Nén PDF.
* Ghép PDF.
* Tách PDF.
* Convert PDF sang Excel.
* Convert PDF sang PowerPoint.
* Gói thành viên theo tháng.
* API cho bên thứ ba sử dụng dịch vụ convert.

---

## 4.4. Trải nghiệm người dùng

Giao diện cần đơn giản, dễ dùng.

Yêu cầu:

* Người dùng có thể upload và convert trong ít bước.
* Hiển thị rõ sự khác nhau giữa miễn phí và nâng cao.
* Hiển thị rõ số coin cần dùng trước khi convert.
* Thông báo lỗi dễ hiểu.
* Giao diện tương thích với điện thoại, máy tính bảng và máy tính.
* Có trang hướng dẫn sử dụng.

---

## 5. Quy trình hoạt động chính

## 5.1. Quy trình convert miễn phí

1. Người dùng truy cập website.
2. Người dùng upload file PDF.
3. Hệ thống kiểm tra định dạng file, dung lượng file và số trang.
4. Hệ thống hiển thị thông tin file gồm tên file, dung lượng, số trang và phí chuyển đổi.
5. Người dùng chọn chế độ convert miễn phí.
6. Hệ thống kiểm tra điều kiện của chế độ miễn phí:

   * File phải có dung lượng bé hơn 5MB.
   * File phải có số trang bé hơn 30 trang.
   * Người dùng không vượt quá 5 lần chuyển đổi miễn phí trong ngày.
7. Nếu file không hợp lệ hoặc vượt giới hạn, hệ thống hiển thị thông báo lỗi và gợi ý người dùng sử dụng chế độ nâng cao.
8. Nếu file hợp lệ, hệ thống đưa file vào hàng đợi xử lý.
9. Hệ thống tiến hành convert PDF sang DOCX.
10. Sau khi convert thành công, hệ thống hiển thị nút tải file Word.
11. Người dùng tải file DOCX về thiết bị.
12. File kết quả của chế độ miễn phí được lưu trong 1 giờ.
13. Nếu người dùng đã đăng nhập, hệ thống lưu lịch sử chuyển đổi.

---

## 5.2. Quy trình convert nâng cao bằng coin

1. Người dùng đăng nhập vào hệ thống.
2. Người dùng upload file PDF.
3. Hệ thống kiểm tra định dạng file, dung lượng file và số trang.
4. Hệ thống hiển thị thông tin file gồm tên file, dung lượng, số trang và phí coin dự kiến.
5. Người dùng chọn chế độ convert nâng cao.
6. Hệ thống tính số coin cần sử dụng dựa trên số trang, dung lượng file và loại xử lý.
7. Cách tính coin đề xuất:

   * Convert thường: 1 coin / 1 trang.
   * Convert có OCR: 2 coin / 1 trang.
   * Nếu file lớn hơn 30 trang thì mỗi trang phía sau tính 3 coin / 1 trang.
8. Hệ thống hiển thị tổng số coin cần trừ để người dùng xác nhận.
9. Người dùng xác nhận sử dụng coin.
10. Hệ thống kiểm tra số dư coin của người dùng.
11. Nếu không đủ coin, hệ thống thông báo số coin còn thiếu và gợi ý người dùng nạp thêm coin.
12. Nếu đủ coin, hệ thống đưa file vào hàng đợi xử lý ưu tiên.
13. Hệ thống tiến hành convert PDF sang DOCX.
14. Nếu convert thành công, hệ thống trừ coin khỏi tài khoản người dùng.
15. Nếu convert thất bại do lỗi hệ thống, hệ thống không trừ coin hoặc hoàn lại coin nếu đã trừ trước đó.
16. Người dùng tải file DOCX sau khi convert thành công.
17. File kết quả của chế độ nâng cao được lưu trong 24 giờ.
18. Hệ thống lưu lịch sử chuyển đổi và lịch sử giao dịch coin.

---

## 5.3. Quy trình nạp coin

1. Người dùng đăng nhập vào hệ thống.
2. Người dùng truy cập trang ví coin hoặc trang nạp coin.
3. Hệ thống hiển thị số dư coin hiện tại.
4. Hệ thống hiển thị danh sách các gói coin đang hoạt động.
5. Người dùng chọn gói coin muốn mua.
6. Hệ thống hiển thị thông tin gói coin gồm giá tiền, số coin nhận được và phương thức thanh toán.
7. Người dùng thực hiện thanh toán.
8. Hệ thống nhận kết quả thanh toán từ cổng thanh toán.
9. Nếu thanh toán thành công, hệ thống cộng coin vào tài khoản người dùng.
10. Nếu thanh toán thất bại hoặc bị hủy, hệ thống không cộng coin và hiển thị trạng thái giao dịch.
11. Hệ thống lưu lịch sử nạp tiền.
12. Admin có thể xem thống kê lượng coin đã nạp và doanh thu từ các giao dịch nạp coin.

---

## 5.4. Quy trình xem lịch sử chuyển đổi

1. Người dùng đăng nhập vào hệ thống.
2. Người dùng truy cập trang lịch sử chuyển đổi.
3. Hệ thống hiển thị danh sách các file đã từng convert.
4. Mỗi bản ghi lịch sử hiển thị:

   * Tên file PDF gốc.
   * Tên file DOCX sau khi convert.
   * Thời gian convert.
   * Chế độ convert.
   * Số coin đã sử dụng.
   * Trạng thái xử lý.
   * Thời gian hết hạn file.
   * Link tải file nếu file còn hạn.
5. Nếu file đã hết hạn, hệ thống ẩn hoặc vô hiệu hóa nút tải file.
6. Người dùng có thể lọc lịch sử theo trạng thái, thời gian hoặc chế độ convert.

---

## 5.5. Quy trình nhắn tin hỗ trợ hoặc khiếu nại

1. Người dùng truy cập chức năng hỗ trợ trên website.
2. Người dùng có thể chọn một trong hai hình thức:

   * Hỏi nhanh qua chatbot AI.
   * Gửi khiếu nại hoặc nhắn tin với hỗ trợ viên.
3. Nếu người dùng hỏi chatbot AI, hệ thống trả lời các câu hỏi phổ biến về:

   * Cách upload file.
   * Cách convert PDF sang Word.
   * Cách tính coin.
   * Cách nạp coin.
   * Lỗi thường gặp khi convert.
   * Thời gian lưu file sau khi convert.
4. Nếu chatbot AI không giải quyết được vấn đề, người dùng có thể tạo yêu cầu hỗ trợ hoặc khiếu nại.
5. Người dùng nhập nội dung khiếu nại và có thể đính kèm thông tin liên quan như mã giao dịch, tên file hoặc thời gian convert.
6. Hệ thống tạo cuộc trò chuyện hỗ trợ.
7. Hỗ trợ viên xem danh sách các cuộc trò chuyện/khiếu nại.
8. Hỗ trợ viên phản hồi người dùng trong giao diện hỗ trợ.
9. Người dùng nhận phản hồi và tiếp tục trao đổi nếu cần.
10. Khi vấn đề đã được xử lý, hỗ trợ viên hoặc người dùng có thể đánh dấu cuộc trò chuyện là đã hoàn tất.

---

## 5.6. Quy trình quản trị hệ thống

1. Admin đăng nhập vào trang quản trị.
2. Admin có thể quản lý tài khoản người dùng.
3. Admin có thể xem số dư coin của từng người dùng.
4. Admin có thể cộng hoặc trừ coin thủ công khi cần.
5. Admin quản lý các gói nạp coin.
6. Admin theo dõi danh sách giao dịch nạp tiền.
7. Admin xem thống kê lượng nạp coin và doanh thu.
8. Admin xem lịch sử convert của người dùng.
9. Admin theo dõi lỗi convert để xử lý sự cố.
10. Admin cấu hình giới hạn convert miễn phí.
11. Admin cấu hình chi phí coin cho từng loại convert.
12. Admin theo dõi tài nguyên hệ thống như số lượng file xử lý, trạng thái hàng đợi và số lượt convert.
13. Admin hoặc hỗ trợ viên có thể xem các khiếu nại và đoạn chat hỗ trợ của người dùng.

---

## 6. Các màn hình chính của website

Website nên có các màn hình sau:

* Trang chủ.
* Trang upload và convert PDF.
* Trang hiển thị thông tin file trước khi convert.
* Trang chọn chế độ convert.
* Trang đăng nhập.
* Trang đăng ký.
* Trang quên mật khẩu.
* Trang tài khoản cá nhân.
* Trang ví coin.
* Trang nạp coin.
* Trang lịch sử giao dịch coin.
* Trang lịch sử convert.
* Trang tải file sau khi convert.
* Trang bảng giá hoặc gói dịch vụ.
* Trang hướng dẫn sử dụng.
* Trang chatbot AI hỗ trợ.
* Trang khiếu nại hoặc nhắn tin hỗ trợ.
* Trang quản trị dành cho admin.
* Trang quản lý người dùng.
* Trang quản lý gói coin.
* Trang quản lý giao dịch nạp tiền.
* Trang thống kê lượng nạp coin.
* Trang theo dõi lịch sử convert.
* Trang quản lý khiếu nại và chat hỗ trợ.
* Trang dành cho hỗ trợ viên.

---

## 7. Dữ liệu cần quản lý

Hệ thống có thể cần các nhóm dữ liệu sau:

### Người dùng

* ID người dùng.
* Họ tên.
* Email.
* Mật khẩu đã mã hóa.
* Vai trò: khách, user, admin hoặc support.
* Số dư coin.
* Số lần convert miễn phí trong ngày.
* Trạng thái tài khoản.
* Ngày tạo tài khoản.
* Ngày cập nhật tài khoản.

### File convert

* ID file.
* ID người dùng.
* Tên file PDF gốc.
* Tên file DOCX sau khi convert.
* Dung lượng file.
* Số trang.
* Chế độ convert: miễn phí hoặc nâng cao.
* Loại xử lý: thường hoặc OCR.
* Số coin dự kiến.
* Số coin thực tế đã trừ.
* Trạng thái xử lý: đang chờ, đang xử lý, thành công, thất bại.
* Thông báo lỗi nếu convert thất bại.
* Thời gian upload.
* Thời gian bắt đầu xử lý.
* Thời gian hoàn thành.
* Link lưu file PDF gốc nếu cần.
* Link lưu file DOCX kết quả.
* Thời gian hết hạn file.
* Thời gian tự động xóa file.

### Giao dịch coin

* ID giao dịch coin.
* ID người dùng.
* Loại giao dịch: cộng coin, trừ coin hoặc hoàn coin.
* Số coin.
* Số dư trước giao dịch.
* Số dư sau giao dịch.
* Lý do giao dịch.
* ID file convert liên quan nếu có.
* ID thanh toán liên quan nếu có.
* Thời gian giao dịch.
* Trạng thái giao dịch.

### Gói coin

* ID gói coin.
* Tên gói.
* Giá tiền.
* Số coin nhận được.
* Mô tả gói.
* Trạng thái hoạt động.
* Ngày tạo.
* Ngày cập nhật.

### Thanh toán

* ID thanh toán.
* ID người dùng.
* ID gói coin.
* Số tiền.
* Số coin nhận được.
* Phương thức thanh toán.
* Trạng thái thanh toán: đang xử lý, thành công, thất bại, đã hủy.
* Mã giao dịch từ cổng thanh toán.
* Nội dung thanh toán.
* Thời gian tạo giao dịch.
* Thời gian thanh toán thành công.

### Lịch sử convert miễn phí

* ID lịch sử.
* ID người dùng hoặc thông tin định danh khách nếu chưa đăng nhập.
* Ngày sử dụng.
* Số lần đã convert miễn phí.
* Giới hạn convert miễn phí trong ngày.
* Địa chỉ IP hoặc thiết bị nếu cần kiểm soát lạm dụng.

### Chatbot AI

* ID cuộc trò chuyện.
* ID người dùng nếu đã đăng nhập.
* Nội dung câu hỏi.
* Nội dung trả lời của chatbot.
* Thời gian gửi câu hỏi.
* Trạng thái xử lý.
* Đánh giá của người dùng nếu có.

### Khiếu nại và hỗ trợ

* ID khiếu nại/cuộc trò chuyện.
* ID người dùng.
* ID hỗ trợ viên phụ trách.
* Tiêu đề khiếu nại.
* Nội dung khiếu nại.
* Loại vấn đề: lỗi convert, lỗi thanh toán, lỗi trừ coin, lỗi tài khoản hoặc vấn đề khác.
* Trạng thái: mới, đang xử lý, đã phản hồi, đã hoàn tất, đã hủy.
* Mức độ ưu tiên.
* Thời gian tạo.
* Thời gian cập nhật.
* Thời gian hoàn tất.

### Tin nhắn hỗ trợ

* ID tin nhắn.
* ID cuộc trò chuyện hỗ trợ.
* ID người gửi.
* Vai trò người gửi: user, support, admin hoặc bot.
* Nội dung tin nhắn.
* File đính kèm nếu có.
* Thời gian gửi.
* Trạng thái đã đọc.

### Thống kê hệ thống

* Tổng số người dùng.
* Tổng số lượt convert.
* Số lượt convert miễn phí.
* Số lượt convert nâng cao.
* Tổng số coin đã nạp.
* Tổng số coin đã sử dụng.
* Tổng doanh thu từ nạp coin.
* Số giao dịch thành công.
* Số giao dịch thất bại.
* Số lỗi convert.
* Số khiếu nại đang xử lý.

---

## 8. Phân loại phiên bản phát triển

## 8.1. Phiên bản MVP

Phiên bản đầu tiên nên tập trung vào các chức năng cốt lõi để hệ thống có thể hoạt động được.

Các chức năng nên có trong MVP:

* Đăng ký, đăng nhập.
* Upload PDF.
* Kiểm tra định dạng file PDF.
* Kiểm tra dung lượng file và số trang.
* Hiển thị thông tin file và phí coin dự kiến.
* Convert PDF sang DOCX.
* Chế độ convert miễn phí với giới hạn:

  * Dung lượng bé hơn 5MB.
  * Số trang bé hơn 30 trang.
  * Tối đa 5 lần chuyển đổi mỗi ngày.
* Chế độ convert nâng cao tốn coin.
* Tính coin theo số trang.
* Kiểm tra số dư coin trước khi convert nâng cao.
* Trừ coin hoặc hoàn coin khi convert lỗi.
* Tải file DOCX sau khi convert.
* Lưu file miễn phí trong 1 giờ.
* Lưu file nâng cao trong 24 giờ.
* Xem số dư coin.
* Lịch sử giao dịch coin.
* Lịch sử convert cơ bản.
* Nạp coin thủ công hoặc giả lập thanh toán.
* Trang admin đơn giản.
* Admin quản lý người dùng.
* Admin quản lý gói coin.
* Admin xem lịch sử convert.
* Admin xem lịch sử nạp coin.
* Chức năng khiếu nại cơ bản bằng form hoặc hộp tin nhắn đơn giản.

---

## 8.2. Phiên bản nâng cấp

Sau khi MVP hoạt động ổn định, có thể phát triển thêm các chức năng nâng cao:

* Thanh toán tự động qua cổng thanh toán.
* OCR cho PDF scan.
* Hàng đợi xử lý file chuyên nghiệp.
* Ưu tiên xử lý cho người dùng dùng coin.
* Convert nhiều file cùng lúc.
* Convert file dung lượng lớn.
* Cải thiện khả năng giữ định dạng, bảng biểu, hình ảnh và font chữ.
* Chatbot AI hỗ trợ người dùng.
* Hệ thống nhắn tin trực tiếp giữa người dùng và hỗ trợ viên.
* Phân quyền hỗ trợ viên.
* Quản lý khiếu nại theo trạng thái.
* Thống kê lượng nạp coin.
* Thống kê doanh thu.
* Thống kê lượt convert.
* Thống kê lỗi convert.
* Gói thành viên theo tháng.
* API cho bên thứ ba sử dụng dịch vụ convert.
* Tự động xóa file sau thời gian hết hạn.
* Gửi email thông báo khi convert hoàn tất.
* Gửi email xác nhận khi nạp coin thành công.
* Tối ưu chất lượng file Word đầu ra.

---

## 9. Ràng buộc và lưu ý quan trọng

* PDF dạng text thường dễ convert hơn PDF scan ảnh.
* Nếu muốn convert PDF scan sang Word, hệ thống cần OCR.
* Việc giữ nguyên bố cục, font chữ, bảng biểu và hình ảnh có thể phức tạp.
* File người dùng có thể chứa dữ liệu nhạy cảm, nên cần chính sách bảo mật và tự động xóa file.
* Hệ thống cần phân biệt rõ file miễn phí và file nâng cao để áp dụng thời gian lưu trữ khác nhau.
* File convert miễn phí chỉ nên lưu trong 1 giờ.
* File convert bằng coin nên lưu trong 24 giờ.
* Hệ thống coin cần thiết kế cẩn thận để tránh sai lệch số dư.
* Không được trừ coin nhiều lần cho cùng một yêu cầu convert.
* Nên có cơ chế hoàn coin nếu convert thất bại do lỗi hệ thống.
* Thanh toán cần có cơ chế xác nhận giao dịch an toàn.
* Cần lưu lịch sử giao dịch để đối chiếu khi người dùng khiếu nại.
* Chức năng hỗ trợ viên cần phân quyền rõ ràng, tránh để hỗ trợ viên truy cập vào chức năng quản trị không liên quan.
* Chatbot AI chỉ nên hỗ trợ trả lời thông tin chung, không nên tự ý can thiệp vào coin, giao dịch hoặc dữ liệu người dùng.
* Các khiếu nại liên quan đến thanh toán, trừ coin hoặc lỗi convert cần được lưu lại để admin/hỗ trợ viên xử lý.
* Convert file lớn nên xử lý bằng tác vụ nền, không nên xử lý trực tiếp trong request web thông thường.
* Hệ thống cần có cơ chế giới hạn để tránh người dùng lạm dụng convert miễn phí.
* Khi triển khai thật, nên dùng HTTPS và kiểm tra bảo mật đối với file upload.
