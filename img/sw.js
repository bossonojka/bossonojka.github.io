self.addEventListener('install',function(e){
    e.waitUntil(
        caches.open('images-store').then(function(cache){
            console.log('Filling cache...');
            return cache.addAll([
                '/img/',
                '/img/index.html',
                '/img/main.css',
                '/img/main.js',
                '/img/gallery.js',
                '/img/images/',
                '/img/images/Nature_1.jpg',
                '/img/images/Nature_2.jpg',
                '/img/images/Nature_3.jpg'
            ]);
        })
    );
});