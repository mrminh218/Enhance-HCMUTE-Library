// content_script.js - Version 6.0 (Storage Mode)
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
script.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(script);

let pdfData = null;
let finalFileName = "Tai_lieu_HCMUTE.pdf";

// --- 1. TRA CỨU TÊN FILE TỪ STORAGE ---
function fetchFileName() {
    // Lấy ID từ URL view.php (vd: view.php?id=1006995...)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        chrome.storage.local.get(['doc_' + id], function(result) {
            const savedName = result['doc_' + id];
            if (savedName) {
                console.log("[Content] Tìm thấy tên trong bộ nhớ:", savedName);
                finalFileName = savedName.replace(/[/\\?%*:|"<>]/g, '-').trim() + ".pdf";
                
                // Cập nhật lại nút bấm nếu dữ liệu PDF đã có sẵn
                updateDownloadButton();
            }
        });
    }
}

// Gọi hàm lấy tên ngay khi trang tải
fetchFileName();

// --- 2. CẬP NHẬT GIAO DIỆN ---
function updateDownloadButton() {
    const btn = document.getElementById('hcmute-download-btn');
    if (btn && pdfData) {
        const displayName = finalFileName.replace('.pdf', '');
        const shortName = displayName.length > 20 ? displayName.substring(0, 18) + "..." : displayName;
        
        btn.innerHTML = `📥 Tải: <b>${shortName}</b>`;
        btn.title = finalFileName;
        btn.style.backgroundColor = "#28a745";
        btn.style.color = "white";
        btn.disabled = false;
    }
}

// --- 3. XỬ LÝ KÉO THẢ ---
function makeDraggable(el) {
    const header = el.querySelector(".hcmute-header");
    header.onmousedown = function(e) {
        e.preventDefault();
        el.style.right = 'auto'; el.style.bottom = 'auto';
        let startX = e.clientX, startY = e.clientY;
        document.onmousemove = function(e) {
            el.style.top = (el.offsetTop - (startY - e.clientY)) + "px";
            el.style.left = (el.offsetLeft - (startX - e.clientX)) + "px";
            startX = e.clientX; startY = e.clientY;
        };
        document.onmouseup = function() { document.onmousemove = null; document.onmouseup = null; };
    };
}

// --- 4. NHẬN DỮ LIỆU PDF ---
window.addEventListener('PDF_INTERCEPTED', function(e) {
    pdfData = e.detail;
    updateDownloadButton();
});

// --- 5. TẠO UI ---
function createUI() {
    if (document.getElementById('hcmute-tool-panel')) return;
    const container = document.createElement('div');
    container.id = 'hcmute-tool-panel';
    container.style.cssText = "position: fixed; top: 100px; right: 20px; z-index: 999999;";
    container.innerHTML = `
        <div class="hcmute-header" style="cursor: grab;">HCMUTE Library V6</div>
        <button id="hcmute-download-btn" class="hcmute-btn" disabled>⏳ Đang quét dữ liệu...</button>
        <button id="hcmute-darkmode-btn" class="hcmute-btn">🌙 Chế độ tối</button>
    `;
    document.body.appendChild(container);
    makeDraggable(container);

    document.getElementById('hcmute-download-btn').addEventListener('click', () => {
        if (!pdfData) return alert("Chưa có dữ liệu! F5 lại trang.");
        const blob = new Blob([pdfData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });
    
    // Darkmode (Giữ nguyên logic cũ)
    document.getElementById('hcmute-darkmode-btn').addEventListener('click', function() {
        const isDark = document.documentElement.style.filter === "";
        document.documentElement.style.filter = isDark ? "invert(1) hue-rotate(180deg)" : "";
        if(isDark) {
            const style = document.createElement('style');
            style.id = "dark-fix";
            style.textContent = "img, video, iframe, canvas, #hcmute-tool-panel { filter: invert(1) hue-rotate(180deg); }";
            document.head.appendChild(style);
        } else {
            document.getElementById("dark-fix")?.remove();
        }
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUI);
else createUI();