self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open('ver1')
        .then(cache => {
            return cache.addAll([
                '/jQuery/index.html',
                '/jQuery/sw.js'
            ])
        })
    );
})