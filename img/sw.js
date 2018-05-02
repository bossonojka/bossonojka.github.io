self.addEventListener('install',function(e){
    console.log(e.target);
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