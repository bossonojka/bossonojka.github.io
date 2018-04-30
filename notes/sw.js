self.addEventListener("install", function(e){
    e.waitUntil(
        caches.open('notes-store').then(function(cache){
            return cache.addAll([
                'index.html',
                'style.css',
                'index-start.js'
            ]);
        })
    )
});
self.addEventListener('fecth',function(e){
    console.log(e.request.url);
    e.respondWith(caches.match(e.request).then(function(response){
        return response || fetch(e.request);
    }))
})