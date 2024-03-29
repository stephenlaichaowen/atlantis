// SW Version
const version = '1.0'

// Static Cache - App Shell
const appAssets = [
  'index.html',  
  'src/phaser.min.js',
  'src/GamePlay.js',
  'assets/images/background.png',
  'assets/images/booble1.png',
  'assets/images/booble2.png',
  'assets/images/diamonds.png',
  'assets/images/explosion.png',
  'assets/images/fishes.png',
  'assets/images/horse.png',
  'assets/images/mollusk.png',
  'assets/images/shark.png',
  'assets/sounds/musicLoop.mp3',
  'assets/sounds/sfxPop.mp3'
]

// SW Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(`static-${version}`)
      .then(cache => cache.addAll(appAssets))
  )
})

// SW Activate
self.addEventListener('activate', e => {
  // Clean static cache
  let cleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== `static-${version}` && key.match('static-')) {
        return caches.delete(key)
      }
    })
  })
  e.waitUntil(cleaned)
})

// SW Fetch
self.addEventListener('fetch', e => {
  // App shell
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request))
  }
})

// Static cache strategy - Cache First / Cache with Network Fallback
const staticCache = req => {
  return caches.match(req).then(cacheRes => {
    
    // Return cached response if found
    if(cacheRes) return cacheRes

    // Fall back to network
    return fetch(req).then(networkRes => {

      // Update cache with new response
      caches.open(`static-${version}`)
      .then(cache => cache.put(req, networkRes))

      // Return Clone of Network Response
      return networkRes.clone()
    })

  })
}