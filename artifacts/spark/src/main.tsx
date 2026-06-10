import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";

import App from "./App";
import "./index.css";

setBaseUrl(import.meta.env.VITE_API_URL);

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        // Best-effort PWA registration
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <App />
);