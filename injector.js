// injector.js - V4 Stable (Hook atob)
(function() {
    console.log("%c[HCMUTE V5] Injector Started", "color: purple; font-weight: bold");
    const originalAtob = window.atob;
    window.atob = function(input) {
        const result = originalAtob(input);
        try {
            if (result && result.length > 1000 && result.startsWith('%PDF-')) {
                console.log("%c[HCMUTE V5] PDF Captured!", "color: green");
                const len = result.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) bytes[i] = result.charCodeAt(i);
                window.dispatchEvent(new CustomEvent('PDF_INTERCEPTED', { detail: bytes }));
            }
        } catch (e) {}
        return result;
    };
    
    // Mở khóa UI
    setInterval(() => {
        document.body.oncontextmenu = null;
        document.body.oncopy = null;
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.style.display = 'none';
    }, 1000);
})();