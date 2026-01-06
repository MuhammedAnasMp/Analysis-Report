import { useEffect, useRef } from "react";

export default function CreditsWidget() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Check if the global function exists
        if (typeof (window as any).initCreditsWidget === 'function') {
            (window as any).initCreditsWidget({
                container: "#credits-area",
                title: "Developed By",
                // logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr1scT2B1dbdE04Kvv4KkEdors19ChgVQAdKSazi3dlg&s", 
                credits: [
                    { label: "ITM", value: "Sadakkthulla", icon: "security" },
                    { label: "Developer", value: "Muhammed Anas", icon: "code" },
                    { label: "Database Developer", value: "Mohammed Musfir", icon: "database" },
                    { label: "Database Developer", value: "Muhammed Midlag", icon: "database" },
                    { label: "Data Analysis", value: "Yahya Parayil ", icon: "frontend" }
                ],
                style: {
                    bg: "#ffffff",
                    color: "#0f172a",
                    accent: "#6366f1",
                    radius: "10px",
                    font: "'Inter', sans-serif"
                }
            });
        }
    }, []);

    return (
        <>


            <div id="credits-area" ref={containerRef} className="flex justify-center items-center mb-2">
                <div className="relative w-full border border-gray-300 h-10  rounded overflow-hidden shadow-lg flex items-center justify-center cursor-pointer group">
                    {/* Gradient background */}
                    <div className="absolute top-0 left-0 w-0 h-full bg-gradient-to-r from-green-400 to-yellow-300 transition-all duration-500 group-hover:w-full rounded"></div>
                    <button className="relative z-10 text-xl  text-gray-800 font-bold">
                        About US
                    </button>
                </div>
            </div>
        </>
    );
}
