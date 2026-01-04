// content_script.js

// Tiêm injector
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
script.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(script);

let pdfData = null;

// Lắng nghe dữ liệu
window.addEventListener('PDF_INTERCEPTED', function(e) {
    // e.detail là Uint8Array nhờ hàm convert bên injector
    pdfData = e.detail; 
    
    const btn = document.getElementById('hcmute-download-btn');
    if (btn) {
        btn.innerText = "📥 Tải PDF Ngay (Size: " + (pdfData.length / 1024 / 1024).toFixed(2) + " MB)";
        btn.style.backgroundColor = "#28a745";
        btn.style.color = "white";
        btn.disabled = false;
    }
});

// Giao diện
function createUI() {
    if (document.getElementById('hcmute-tool-panel')) return;

    const container = document.createElement('div');
    container.id = 'hcmute-tool-panel';
    container.innerHTML = `
        <div class="hcmute-header">Enhance HCMUTE Library</div>
        <button id="hcmute-download-btn" class="hcmute-btn" disabled>⏳ Đang đợi dữ liệu...</button>
        <button id="hcmute-darkmode-btn" class="hcmute-btn">🌙 Chế độ tối</button>
    `;
    document.body.appendChild(container);

    document.getElementById('hcmute-download-btn').addEventListener('click', () => {
        if (!pdfData) {
            alert("Chưa có dữ liệu! Hãy F5 lại trang.");
            return;
        }
        try {
            // Tạo Blob từ Uint8Array -> Đảm bảo file PDF không bị lỗi font/trắng
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = (document.title || "tailieu") + ".pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("Lỗi tải file: " + err);
        }
    });

    // Darkmode đơn giản
    let isDark = false;
    document.getElementById('hcmute-darkmode-btn').addEventListener('click', () => {
        isDark = !isDark;
        document.documentElement.style.filter = isDark ? "invert(1) hue-rotate(180deg)" : "";
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUI);
else createUI();