// ── Proplio Service Worker (PWA) ──
const CACHE = 'proplio-v1'
const ASSETS = [
  '/proplio/',
  '/proplio/index.html',
  '/proplio/proplio-login.html',
  '/proplio/proplio-dashboard.html',
  '/proplio/inscription.html',
  '/proplio/paiement.html',
  '/proplio/admin-login.html',
  '/proplio/admin.html',
  '/proplio/reset-password.html',
]

// Installation — mise en cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  )
})

// Activation — nettoyage ancien cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch — réseau d'abord, cache en fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE).then(cache => cache.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})
