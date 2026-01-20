import {  CommandLineIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type CreditItem = {
  label: string;
  value: string;
  icon?: string;
};

export default function CreditsWidget() {
  const [open, setOpen] = useState(false);

  const style = {
    bg: "#ffffff",
    color: "#0f172a",
    accent: "#6366f1",
    radius: "10px",
    font: "'Inter', system-ui, sans-serif",
  };

  const credits: CreditItem[] = [
    { label: "ITM", value: "Sadakkthulla", icon: "security" },
    { label: "Developer", value: "Muhammed Anas", icon: "code" },
    { label: "Database Developer", value: "Mohammed Musfir", icon: "database" },
    { label: "Database Developer", value: "Muhammed Midlaj", icon: "database" },
    { label: "Data Analysis", value: "Yahya Parayil", icon: "frontend" },
  ];

  const getIcon = (type?: string) => {
    const icons: Record<string, string> = {
      code: `<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>`,
      database: `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>`,
      frontend: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="12" y1="17" x2="12" y2="21"/>`,
      security: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
      user: `<circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>`,
    };

    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: style.accent, marginBottom: 8 }}
        dangerouslySetInnerHTML={{
          __html: icons[type || "user"] || icons.user,
        }}
      />
    );
  };

  return (
    <>
      {/* Trigger */}
      <div className="flex justify-center mb-2">
        <div
          onClick={() => setOpen(true)}
          className="relative w-full h-10 rounded-md !shadow-2xl flex items-center justify-center cursor-pointer group border border-gray-200"
        >
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-green-400 to-yellow-300 transition-all duration-500 group-hover:w-full" />
          <div className="relative z-10 font-bold text-gray-800 text-sm flex justify-center items-center gap-1">
            About Us <CommandLineIcon className=" text-blue-800
                                  dark:group-hoverbg-blue-700
                                  dark:group-hover:text-blue-200 !rounded-2xl" height={15} widths={15}/>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.4)",
            backdropFilter: "blur(12px)",
            zIndex: 10000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: style.bg,
              color: style.color,
              padding: "40px 32px",
              borderRadius: style.radius,
              width: "90%",
              maxWidth: "380px",
              textAlign: "center",
              fontFamily: style.font,
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                marginBottom: 32,
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              Developed By
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {credits.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {getIcon(item.icon)}
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#94a3b8",
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: 24,
                width: "100%",
                padding: 14,
                background: style.accent,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
