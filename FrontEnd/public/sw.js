/* eslint-disable no-restricted-globals */
/* service worker environment */

// Service Worker for Turino PWA
const CACHE_NAME = "turino-v1.0";
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
];

// نصب Service Worker
self.addEventListener("install", (event) => {
  console.log("🚀 Service Worker installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
});

// فعال‌سازی Service Worker
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// مدیریت درخواست‌ها
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // بازگرداندن از کش اگر موجود باشد
      if (response) {
        return response;
      }

      // در غیر این صورت از شبکه دریافت کن
      return fetch(event.request)
        .then((response) => {
          // بررسی معتبر بودن پاسخ
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // کلون پاسخ برای ذخیره در کش
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // fallback برای آفلاین
          return new Response("🦺 شما آفلاین هستید", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain; charset=utf-8",
            }),
          });
        });
    })
  );
});

// مدیریت پیام‌ها
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
