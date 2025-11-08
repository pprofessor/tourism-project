import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n/config";
import "./index.css";
import App from "./App";

// ثبت Service Worker برای PWA - فقط در production
const registerServiceWorker = async (): Promise<void> => {
  if ("serviceWorker" in navigator && navigator.serviceWorker) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("✅ Service Worker ثبت شد:", registration);

      // بررسی به‌روزرسانی‌ها
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("🔄 نسخه جدید آماده است!");
            }
          });
        }
      });
    } catch (error) {
      console.error("❌ خطا در ثبت Service Worker:", error);
    }
  }
};

// مدیریت خطاهای全局
const setupErrorHandling = (): void => {
  // مدیریت خطاهای catch نشده
  window.addEventListener("error", (event) => {
    console.error("🚨 خطای全局:", event.error);
  });

  // مدیریت Promiseهای reject نشده
  window.addEventListener("unhandledrejection", (event) => {
    console.error("🚨 Promise رد شده:", event.reason);
  });
};

// راه‌اندازی اولیه
const initializeApp = async (): Promise<void> => {
  // تنظیمات اولیه
  console.log("🚀 راه‌اندازی اپلیکیشن تورینو...");

  // ثبت Service Worker فقط در production
  if (import.meta.env.PROD) {
    await registerServiceWorker();
  }

  // تنظیم مدیریت خطا
  setupErrorHandling();
};

// رندر اپلیکیشن
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// راه‌اندازی و رندر
initializeApp()
  .then(() => {
    root.render(
      <App />
    );
  })
  .catch((error) => {
    console.error("❌ خطا در راه‌اندازی اپلیکیشن:", error);
    // رندر حتی با خطا
    root.render(
      <App />
    );
  });

// تایپ‌های اضافی برای Vite
declare global {
  interface Window {
    ENV: string;
  }
  
  interface ImportMeta {
    readonly env: {
      readonly PROD: boolean;
      readonly DEV: boolean;
    };
  }
}

export {};