const staticCacheName = "site-static";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/",
  "/index.html",
  "/register.js",
  "/app.js",
  "/styles.css",
  "/image-main/Logonya.png",
  "/image-main/mtr1 (1).jpg",
  "/image-main/mtr1 (2).jpg",
  "/image-main/mtr1 (3).jpg",
  "/image-main/mtr1 (4).jpg",
  "/image-main/mtr1 (5).jpg",
  "/image-main/mtr1 (6).jpg",
  "/image-main/mtr2 (1).jpg",
  "/image-main/mtr2 (2).jpg",
  "/image-main/mtr3 (1).jpg",
  "/image-main/mtr3 (2).jpg",
  "/image-main/mtr3 (3).jpg",
  "/image-main/card-1.jpeg",
  "/image-main/card-2.jpeg",
  "/image-main/card-3.jpeg",
  "/image-main/coth1.png",
  "/image-main/tali.png",
  "/image-main/logobergi.gif",
  "/image-main/section2GANTI.png",
  "/images-back/1.png",
  "/images-back/2.png",
  "/images-back/3.png",
  "/images-back/4.png",
  "/images-back/5.png",
  "/images-back/6.png",
  "/section-back/background.jpg",
  "/section-back/gb1.jpg",
  "/section-back/sec-1.jpg",
  "/section-back/sec-2.jpg",
  "/section-back/sec-3.jpg",
  "/responsive.css",
  "/animations.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&",
  "/materi.html",
  "/materi2.html",
  "/materi3.html",
  "/gsap.min.js",
  "/scroll.js",
  "/ScrollTrigger.min.js",
  "/materinya.css",
  "https://fonts.googleapis.com/css2?family=Boldonse&family=Maven+Pro:wght@400..900&family=Patrick+Hand&family=Sigmar&family=Winky+Sans:ital,wght@0,300..900;1,300..900&display=swap",
  "/fallback.html",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

//install service worker
self.addEventListener("install", (evt) => {
  //console.log("service worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      // if exist
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

//activate service worker
self.addEventListener("activate", (evt) => {
  //console.log("service worker has been activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

//fetch event
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheResponse) => {
        return (
          cacheResponse ||
          fetch(evt.request).then((fetchResponse) => {
            return caches.open(dynamicCacheName).then((cache) => {
              cache.put(evt.request.url, fetchResponse.clone());
              limitCacheSize(dynamicCacheName, 15);
              return fetchResponse;
            });
          })
        );
      })
      .catch(() => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("/fallback.html");
        }
      })
  );
});
