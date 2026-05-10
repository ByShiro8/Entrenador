const CACHE = 'fittracker-v1';

// Al instalar: guarda el HTML en caché y activa inmediatamente
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Al activar: toma el control de todas las pestañas/ventanas abiertas
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Estrategia: para el HTML siempre pide la red primero (versión más nueva)
// Si no hay red, sirve desde caché (offline)
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // Resto de recursos: caché primero, red si no está
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
