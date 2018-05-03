self.addEventListener('install',function(e){
    e.waitUntil(
        caches.open('img-store').then(function(cache){
            return cache.addAll([
                '/img/',
                '/img/index.html',
                '/img/main.css',
                '/img/main.js',
                '/img/gallery.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request).then(function(response){
                return caches.open('img-store').then(function(cache){
                    cache.put(e.request, response.clone());
                    return response;
                })
            });
        })
    );
})