importScripts("/workbox-sw.js")

workbox.setConfig({
  debug: false
})

workbox.core.setCacheNameDetails({
  prefix: "stth",
  suffix: "v1.7.0",
  precache: "install-time",
  runtime: "run-time",
  googleAnalytics: "ga"
})

const oldCache = []
for (let k in oldCache) {
  caches.delete(`stth-install-time-${oldCache[k]}`).then(function() {})
}

workbox.precaching.precacheAndRoute([])
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

workbox.core.skipWaiting()
workbox.core.clientsClaim()

// workbox.routing.registerRoute("/", workbox.strategies.networkFirst())
workbox.routing.registerRoute(
  new RegExp("\\.(png|gif|jpg|jpeg)$"),
  new workbox.strategies.CacheFirst()
)
