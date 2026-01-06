// load-widget.js
declare global {
  interface Window {
    CreditsWidget?: {
      init: (elementId: string, options: Record<string, unknown>) => void;
    };
  }
}

const host = import.meta.env.VITE_API_HOST; // "172.16.4.167:8000"
const script = document.createElement("script");
script.src = `http://${host}/credits-widget.js`;
script.onload = () => {
  console.log("Credits widget loaded");
  // You can call the widget if needed
  if (window.CreditsWidget) {
    window.CreditsWidget.init("credits", { text: "Loaded via VITE_API_HOST" });
  }
};
document.body.appendChild(script);
