self.addEventListener('install',function(e){
    console.info("Install event...");
    e.waitUntil(
        caches.open('v2').then(function(cache){
            return cache.addAll([
                '/img/',
                '/img/sw.js',
                '/img/index.html',
                '/img/main.css',
                '/img/main.js',
                '/img/gallery.js',
            ]);
        })
    );
});

self.addEventListener('activate', function(e){
    console.info("Activate event...");

    let trueCache = ['v2'];

    e.waitUntil(
        caches.keys().then(keyList => {
            keyList.map(key =>{
                if (trueCache.indexOf(key) === -1){
                    console.log("Deleted key: " + key);
                    caches.delete(key);
                }
            })
        })
    );
})

self.addEventListener('fetch', function(e){
    console.info("Fetch event...");

    e.respondWith(
        caches.match(e.request).then(function(resp){
            return resp || fetch(e.request).then(function(response){
                caches.open('v2').then(function(cache){
                    cache.put(e.request, response.clone());
                    return response;
                })
            });
        })
    );
})