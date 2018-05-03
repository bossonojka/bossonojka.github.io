self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('notes-store').then(function(cache) {
     return cache.addAll([
       '/notes/',
       '/notes/index.html',
       '/notes/style.css',
       '/notes/index-start.js',
       '/notes/sw.js'
     ]);
   })
 );
});
self.addEventListener('fetch',function(e){
    console.log(e);
    console.log(e.request.url);
    e.respondWith(caches.match(e.request).then(function(response){
        return response || fetch(e.request).then(function(response){
          return caches.open('notes-store').then(function(cache){
            cache.put(e.request, response.clone());
            return response;
          })
        });
    }))
})