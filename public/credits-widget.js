(function () {
    function initCreditsWidget(options = {}) {
        const containerSelector = options.container || "#credits-area";
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const style = {
            bg: options.style?.bg || "#ffffff",
            color: options.style?.color || "#1a1a1a",
            accent: options.style?.accent || "#6366f1",
            radius: options.style?.radius || "20px",
            font: options.style?.font || "'Inter', system-ui, sans-serif",
        };

        // Helper to render simple modern SVG icons
        const getIconHtml = (iconType) => {
            const icons = {
                // Original icons
                design: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
                code: `<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>`,
                copy: `<path d="M17 3a2.82 2.82 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>`,
                user: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
                star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,

                // New Additions
                database: `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>`,
                backend: `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`, // Server racks
                cloud: `<path d="M17.5 19a5.5 5.5 0 0 0 2.5-10.5 8.5 8.5 0 1 0-15.5 1.5A7 7 0 1 0 5 20h12.5"/>`,
                frontend: `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`, // Monitor
                marketing: `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>`, // Megaphone
                security: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>` // Shield
            };

            const path = icons[iconType?.toLowerCase()] || icons.user;
            return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${style.accent}; margin-bottom: 8px;">${path}</svg>`;
        };

        const modal = document.createElement("div");
        Object.assign(modal.style, {
            display: "none",
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(12px)",
            webkitBackdropFilter: "blur(12px)",
            zIndex: 10000,
            justifyContent: "center",
            alignItems: "center",
            opacity: 0,
            transition: "opacity 0.4s ease",
        });

        const box = document.createElement("div");
        Object.assign(box.style, {
            background: style.bg,
            color: style.color,
            padding: "40px 32px",
            borderRadius: style.radius,
            width: "90%",
            maxWidth: "380px",
            textAlign: "center",
            fontFamily: style.font,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            transform: "scale(0.9) translateY(20px)",
            transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        });

        const rows = (options.credits || [])
            .map((item) => `
        <div style="margin-bottom: 24px; display: flex; flex-direction: column; align-items: center;">
          ${getIconHtml(item.icon)}
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700; margin-bottom: 4px;">${item.label || "Member"}</span>
          <span style="font-size: 18px; font-weight: 600; color: ${style.color};">${item.value || "-"}</span>
        </div>
      `).join("");

        box.innerHTML = `
      ${options.logo ? `<div style="display: flex; justify-content: center; width: 100%; margin-bottom: 24px;">
      <img src="${options.logo}" style="height: 50px; width: auto; object-fit: contain;" />
    </div>` : ""}
      <h3 style="margin:0 0 32px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.03em;">${options.title || "Credits"}</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">${rows}</div>
      <button id="credits-close" style="
        width: 100%; margin-top: 20px; padding: 14px; background: ${style.accent}; color: white;
        border: none; border-radius: 12px; cursor: pointer; font-size: 15px; font-weight: 600;
        font-family: ${style.font}; transition: all 0.2s;
      ">Close</button>
    `;

        modal.appendChild(box);
        document.body.appendChild(modal);

        function showModal() {
            modal.style.display = "flex";
            setTimeout(() => { modal.style.opacity = 1; box.style.transform = "scale(1) translateY(0)"; }, 10);
        }

        function hideModal() {
            modal.style.opacity = 0;
            box.style.transform = "scale(0.9) translateY(20px)";
            setTimeout(() => (modal.style.display = "none"), 400);
        }

        const trigger = container.querySelector("button") || container;
        trigger.onclick = (e) => { e.preventDefault(); showModal(); };
        modal.onclick = (e) => { if (e.target === modal || e.target.id === "credits-close") hideModal(); };
    }

    // Exposed globally
    window.initCreditsWidget = initCreditsWidget;
})();