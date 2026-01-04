// redirector.js - Tự động nhảy vào trang view.php

(function() {
    console.log("[HCMUTE Redirector] Đang tìm kiếm link tài liệu gốc...");

    // Tìm thẻ iframe chứa link view.php
    // Dựa vào HTML bạn cung cấp, nó nằm trong div id="a" hoặc có src chứa "view.php"
    const iframe = document.querySelector('iframe[src*="view.php"]');

    if (iframe && iframe.src) {
        console.log("[HCMUTE Redirector] 🎯 Đã thấy link gốc:", iframe.src);
        console.log("Đang chuyển hướng...");
        
        // Thực hiện chuyển hướng ngay lập tức
        window.location.href = iframe.src;
    } else {
        console.log("[HCMUTE Redirector] Không tìm thấy iframe tài liệu nào.");
    }
})();