self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open('ver1')
        .then(cache => {
            cache.addAll([
                '/jQuery/index.html',
                '/jQuery/sw.js'
            ])
        })
    );
})

self.addEventListener('activate', function(e){
    let myCache = ['ver1'];
    
    e.waitUntil(
        caches.keys()
        .then(cacheList => {
            cacheList.map(function(cache){
                if(myCache.indexOf(cache) === -1){
                    console.log('Deleted cache: ' + cache);
                    caches.delete(cache);
                }
            });
        })
    );
})