// injector.js - Phiên bản V2: Hook atob (Chốt chặn cuối cùng)

(function() {
    console.log("%c[HCMUTE Unlocker] 🚀 Đang khởi động...", "color: purple; font-weight: bold");

    // Lưu giữ hàm atob gốc của trình duyệt
    const originalAtob = window.atob;

    // Định nghĩa lại hàm atob để "nghe lén"
    window.atob = function(input) {
        // 1. Gọi hàm gốc để giải mã ra chuỗi Binary String
        // (Chúng ta phải để trang web chạy bình thường, không được làm hỏng nó)
        const result = originalAtob(input);

        try {
            // 2. Kiểm tra xem kết quả giải mã có phải là PDF không
            // - Dữ liệu phải lớn (trên 1KB)
            // - Bắt đầu bằng chữ "%PDF-" (Dấu hiệu nhận biết file PDF)
            if (result && result.length > 1000 && result.startsWith('%PDF-')) {
                console.log("%c[HCMUTE Unlocker] ⚡ ĐÃ BẮT ĐƯỢC TẠI atob()! Size: " + result.length, "color: red; font-weight: bold; font-size: 16px");

                // 3. Chuyển đổi Binary String sang Uint8Array (để lưu file không lỗi)
                const len = result.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = result.charCodeAt(i);
                }

                // 4. Bắn dữ liệu ra ngoài cho content_script
                window.dispatchEvent(new CustomEvent('PDF_INTERCEPTED', {
                    detail: bytes
                }));
            }
        } catch (e) {
            console.error("[HCMUTE Unlocker] Lỗi trong quá trình kiểm tra atob:", e);
        }

        // 5. Trả về kết quả cho trang web (như chưa có gì xảy ra)
        return result;
    };

    // --- CÁC TÍNH NĂNG PHỤ ---

    // Mở khóa chuột phải, chống in
    function unlockUI() {
        const events = ['contextmenu', 'copy', 'cut', 'paste', 'selectstart', 'mousedown'];
        events.forEach(evt => {
            window.addEventListener(evt, (e) => { e.stopPropagation(); }, true);
        });
        
        if (document.body) {
            document.body.oncontextmenu = null;
            document.body.oncopy = null;
        }
        
        // Xóa CSS chặn in
        const styleList = document.querySelectorAll('style[media="print"]');
        styleList.forEach(s => s.remove());
    }

    // Chạy dọn dẹp UI mỗi giây
    setInterval(unlockUI, 1000);

})();