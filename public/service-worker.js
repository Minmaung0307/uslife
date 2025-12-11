// service-worker.js

const CACHE_NAME = 'uslife-v3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './payment.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Firestore နဲ့ Firebase Auth တွေကို Service Worker က ဝင်မရှုပ်အောင် တားမယ်
  // (ဒါမှ Login ဝင်တာတွေ၊ Data update တွေ ချက်ချင်းသိမှာပါ)
  const url = e.request.url;
  if (url.includes('firestore.googleapis.com') || 
      url.includes('googleapis.com') || 
      url.includes('firebase')) {
      return; 
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
        return cachedResponse || fetch(e.request);
    })
  );
});