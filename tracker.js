// tracker.js - Version 6.1 (Fix Redirect Logic)
(function () {
    const url = window.location.href;
    console.log("[HCMUTE Tracker] Đang kiểm tra: " + url);

    // --- NHIỆM VỤ 1: LƯU TÊN (Chỉ chạy ở trang giới thiệu /doc/) ---
    if (url.includes('/doc/')) {
        // Tìm ID trong URL
        const match = url.match(/-(\d+)\.html/);
        // Tìm tiêu đề trong thẻ H1 class title
        const h1 = document.querySelector('h1.title') || document.querySelector('h1');

        if (match && h1) {
            const docId = match[1];
            const docTitle = h1.innerText.trim();

            // Lưu vào bộ nhớ
            const data = {};
            data['doc_' + docId] = docTitle;

            chrome.storage.local.set(data, function () {
                console.log(`[Tracker] Đã lưu thành công: [${docId}] -> ${docTitle}`);
            });
        }
    }

    // --- NHIỆM VỤ 2: CHUYỂN HƯỚNG (Chạy ở trang wrapper /document/) ---
    if (url.includes('/document/')) {
        // Tìm iframe chứa link view.php
        const iframe = document.querySelector('iframe[src*="view.php"]');

        if (iframe && iframe.src) {
            console.log("[Tracker] Tìm thấy iframe, đang chuyển hướng...");
            // Chuyển hướng NGAY LẬP TỨC mà không cần điều kiện tiêu đề
            window.location.href = iframe.src;
        } else {
            console.warn("[Tracker] Không tìm thấy iframe tài liệu!");
        }
    }
})();