const CACHE_NAME = 'servera-v1'
const STATIC_ASSETS = ['/', '/offline']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET and non-HTTP requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return

  // API calls: network first, no cache
  if (url.pathname.startsWith('/api/')) return

  // Menu pages: stale-while-revalidate
  if (url.pathname.includes('/table/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const fetchPromise = fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone())
            return response
          })
          return cached || fetchPromise
        })
      )
    )
    return
  }

  // Static assets: cache first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return response
      }).catch(() => {
        // If offline and no cache, return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline')
        }
      })
    })
  )
})
