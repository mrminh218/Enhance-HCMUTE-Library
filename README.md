# 📚 Enhance HCMUTE Library

Tiện ích mở rộng (Extension) dành cho trình duyệt Chrome/Edge, hỗ trợ sinh viên trường ĐH Công Nghệ Kỹ Thuật TP.HCM (HCMUTE) tải tài liệu từ Thư viện số phục vụ mục đích học tập và nghiên cứu.

## ✨ Tính năng chính

* **📥 Tải PDF gốc:** Tự động bắt link và cho phép tải xuống file PDF chất lượng gốc (không bị watermark che nội dung).
* **🔓 Mở khóa thao tác:** Cho phép chuột phải, copy (Ctrl+C), in ấn (Ctrl+P) và bôi đen văn bản trên trang web bị chặn.
* **🌙 Chế độ tối (Dark Mode):** Đảo màu giao diện giúp đọc tài liệu ban đêm không bị mỏi mắt.
* **⚡ Hiệu năng cao:** Sử dụng cơ chế "Bắt đáy" (Hooking) thông minh, đảm bảo bắt được dữ liệu 100% ngay cả khi mạng chậm.

## 📂 Cấu trúc thư mục

Đảm bảo thư mục cài đặt của bạn có đầy đủ các file sau:

* `manifest.json`: Cấu hình chính của Extension.
* `injector.js`: Script lõi để lấy dữ liệu PDF.
* `content_script.js`: Script tạo giao diện nút bấm.
* `redirector.js`: Script tự động chuyển hướng.
* `styles.css`: Giao diện cho thanh công cụ.
* `README.md`: File hướng dẫn.

## 🚀 Hướng dẫn cài đặt

Vì đây là Extension tự phát triển (chưa đưa lên Chrome Store), bạn cần cài đặt thủ công theo chế độ dành cho nhà phát triển:

1.  **Tải mã nguồn:** Tải toàn bộ các file code về (hoặc file zip ở Releases) và lưu vào một thư mục (ví dụ: `Enhance HCMUTE Library`).
2.  **Mở trình quản lý Extension:**
    * Mở trình duyệt (Chrome, Edge, Cốc Cốc...).
    * Nhập vào thanh địa chỉ: `chrome://extensions` và nhấn Enter.
3.  **Bật chế độ Developer:**
    * Tìm nút gạt **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải màn hình và **BẬT** nó lên.
4.  **Tải Extension vào trình duyệt:**
    * Nhấn vào nút **Load unpacked** (Tải tiện ích đã giải nén) ở góc trên bên trái.
    * Chọn thư mục `Enhance HCMUTE Library` bạn đã tạo ở bước 1.
5.  **Hoàn tất:** Extension sẽ xuất hiện trong danh sách và sẵn sàng sử dụng.

## 📖 Hướng dẫn sử dụng
1.  Truy cập vào trang web https://thuvienso.hcmute.edu.vn/ , đăng nhập và tìm tài liệu mong muốn.
2.  Nhấp vào link *Xem toàn văn*.
3.  Nhìn sang góc phải màn hình, bạn sẽ thấy bảng điều khiển **HCMUTE Tools**.
4.  Đợi vài giây để trang tải dữ liệu. Khi nút bấm chuyển sang màu xanh lá **"📥 Tải PDF Ngay"**, hãy nhấn vào để lưu file về máy.

## ⚠️ Lưu ý & Khắc phục lỗi

* **Nút tải không hiện màu xanh:** Hãy nhấn **F5** để tải lại trang và đợi cho đến khi thanh loading của trang web chạy xong.
* **Lỗi trắng trang:** Do cơ chế bảo mật của trình duyệt đôi khi xung đột. Hãy F5 lại trang một lần nữa.
* **Quyền riêng tư:** Extension này chỉ chạy cục bộ trên trình duyệt của bạn, không gửi dữ liệu đi bất cứ đâu.

## ⚖️ Tuyên bố miễn trừ trách nhiệm

Công cụ này được phát triển với mục đích **hỗ trợ học tập cá nhân**.
* Vui lòng tôn trọng bản quyền của tác giả và nhà trường.
* Không sử dụng tài liệu tải về cho mục đích thương mại hoặc chia sẻ trái phép.
* Tác giả không chịu trách nhiệm về việc sử dụng công cụ sai mục đích.

---
**Design by mrminh218 & Gemini AI**