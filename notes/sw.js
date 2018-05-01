self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('notes-store').then(function(cache) {
     let setCashe = cache.addAll([
       '/notes/',
       '/notes/index.html',
       '/notes/style.css',
       '/notes/index-start.js',
       '/notes/sw.js'
     ]);
     return setCashe;
   })
 );
});
self.addEventListener('fetch',function(e){
    console.log(e);
    console.log(e.request.url);
    e.respondWith(caches.match(e.request).then(function(response){
        return response || fetch(e.request);
    }))
})