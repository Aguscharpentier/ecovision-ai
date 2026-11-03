/* =========================================================
   EcoVision AI · Service worker de la app
   ---------------------------------------------------------
   - Al instalarse guarda la app, las librerías, la fuente y
     el modelo (../model) para que todo funcione sin internet.
   - Sirve primero desde lo guardado. Para publicar cambios
     (código o modelo nuevo), cambia VERSION: el celular baja
     todo de nuevo y la app ofrece "Actualizar".
   - VERSION debe coincidir con el ?v= de app.css y app.js en
     index.html.
   ========================================================= */
var VERSION = "20261103";
var CACHE = "ecovision-app-" + VERSION;

var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./app.css?v=" + VERSION,
  "./app.js?v=" + VERSION,
  "./vendor/tf-1.3.1.min.js",
  "./vendor/teachablemachine-image-0.8.5.min.js",
  "./fonts/archivo-latin.woff2",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "../images/logo.svg",
  "../model/model.json",
  "../model/metadata.json",
  "../model/model.weights.bin"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // cache: "reload" evita copiar versiones viejas de la caché HTTP de GitHub Pages
      return cache.addAll(PRECACHE.map(function (url) { return new Request(url, { cache: "reload" }); }));
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k.indexOf("ecovision-app-") === 0 && k !== CACHE;
      }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// La app pide activar la versión nueva cuando la persona toca "Actualizar"
self.addEventListener("message", function (event) {
  if (event.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  // Abrir la app (también sin conexión) siempre entrega index.html
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html", { cacheName: CACHE }).then(function (hit) {
        return hit || fetch(req);
      })
    );
    return;
  }

  // Lo demás: primero lo guardado; si no está, se baja y se guarda
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          if (res.ok) cache.put(req, res.clone());
          return res;
        });
      });
    })
  );
});
