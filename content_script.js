// content_script.js - Version 3.0

// 1. Tiêm injector (Giữ nguyên)
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
script.onload = function() { this.remove(); };
(document.head || document.documentElement).appendChild(script);

let pdfData = null;

// --- TÍNH NĂNG 1: ĐẶT TÊN FILE THÔNG MINH ---
function getSmartFilename() {
    let filename = "Tai_lieu_HCMUTE";

    // Thử lấy tiêu đề từ thẻ title của trang web
    if (document.title) {
        filename = document.title;
    }
    
    // Thử tìm thẻ tiêu đề trong nội dung (thường là .page-title hoặc h1)
    // Bạn có thể inspect web trường để tìm class chính xác hơn
    const h1 = document.querySelector('h1') || document.querySelector('.page-title');
    if (h1 && h1.innerText.trim().length > 0) {
        filename = h1.innerText.trim();
    }

    // Làm sạch tên file (Xóa ký tự cấm trong Windows/Linux: / : * ? " < > |)
    filename = filename.replace(/[/\\?%*:|"<>]/g, '-');
    // Xóa bớt khoảng trắng thừa
    filename = filename.replace(/\s+/g, ' ').trim();

    return filename + ".pdf";
}

// --- TÍNH NĂNG 2: XỬ LÝ KÉO THẢ (DRAGGABLE) ---
function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.querySelector(".hcmute-header");

    if (header) {
        // Nếu có header, chỉ cho phép kéo khi nắm vào header
        header.onmousedown = dragMouseDown;
    } else {
        // Nếu không thì nắm đâu cũng kéo được
        el.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e.preventDefault();
        // Lấy vị trí chuột ban đầu
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // Tính toán vị trí mới
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Gán vị trí mới cho element
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        
        // Xóa thuộc tính 'right' để tránh xung đột với 'left' khi kéo
        el.style.right = 'auto'; 
    }

    function closeDragElement() {
        // Dừng kéo khi thả chuột
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// --- XỬ LÝ DỮ LIỆU PDF ---
window.addEventListener('PDF_INTERCEPTED', function(e) {
    pdfData = e.detail;
    const btn = document.getElementById('hcmute-download-btn');
    if (btn) {
        // Lấy tên file để hiển thị cho ngầu
        const smartName = getSmartFilename();
        // Cắt ngắn nếu tên quá dài để vừa nút bấm
        const displayName = smartName.length > 20 ? smartName.substring(0, 17) + "..." : smartName;
        
        btn.innerHTML = `📥 Tải về: <b>${displayName}</b>`;
        btn.title = "Tên đầy đủ: " + smartName; // Hover vào sẽ thấy tên full
        btn.style.backgroundColor = "#28a745";
        btn.style.color = "white";
        btn.disabled = false;
    }
});

// --- UI CHÍNH ---
function createUI() {
    if (document.getElementById('hcmute-tool-panel')) return;

    const container = document.createElement('div');
    container.id = 'hcmute-tool-panel';
    container.innerHTML = `
        <div class="hcmute-header">Enhance Library v3.0</div>
        <button id="hcmute-download-btn" class="hcmute-btn" disabled>⏳ Đang đợi dữ liệu...</button>
        <button id="hcmute-darkmode-btn" class="hcmute-btn">🌙 Chế độ tối</button>
        <div class="hcmute-footer">Kéo thả tôi đi đâu tùy thích!</div>
    `;
    document.body.appendChild(container);

    // Kích hoạt tính năng kéo thả cho panel
    makeDraggable(container);

    // Logic nút Download
    document.getElementById('hcmute-download-btn').addEventListener('click', () => {
        if (!pdfData) {
            alert("Chưa có dữ liệu! Hãy F5 lại trang.");
            return;
        }
        try {
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Sử dụng tên file thông minh
            a.download = getSmartFilename();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("Lỗi tải file: " + err);
        }
    });

    // Logic Dark Mode
    let isDark = false;
    document.getElementById('hcmute-darkmode-btn').addEventListener('click', () => {
        isDark = !isDark;
        const btn = document.getElementById('hcmute-darkmode-btn');
        const root = document.documentElement;
        
        if (isDark) {
            root.style.filter = "invert(1) hue-rotate(180deg)";
            btn.innerText = "☀️ Chế độ sáng";
            
            // Fix ảnh bị âm bản
            const style = document.createElement('style');
            style.id = "dark-mode-fix";
            style.textContent = `img, video, iframe, canvas, #hcmute-tool-panel { filter: invert(1) hue-rotate(180deg); }`;
            document.head.appendChild(style);
        } else {
            root.style.filter = "";
            btn.innerText = "🌙 Chế độ tối";
            const style = document.getElementById("dark-mode-fix");
            if(style) style.remove();
        }
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUI);
else createUI();