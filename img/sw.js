self.addEventListener('install',function(e){
    e.waitUntil(
        caches.open('img-store').then(function(cache){
            console.log('Filling cache...');
            return cache.addAll([
                '/img/',
                '/img/index.html',
                '/img/main.css',
                '/img/main.js',
                '/img/gallery.js',
                '/img/images/Nature_1.jpg',
                '/img/images/Nature_2.jpg',
                '/img/images/Nature_3.jpg'
            ]);
        })
    );
});

self.addEventListener('fetch', function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            console.log(response);
            return new Response(response) || fetch(e.request) || caches.match('/img/index.html');
        })
    );
})