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

self.addEventListener('activate', function(e){
  console.info("Activate event...");

  let trueCache = ['notes-store'];

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

self.addEventListener('fetch',function(e){
    console.log(e);
    console.log(e.request.url);
    e.respondWith(caches.match(e.request).then(function(res){
        return res || fetch(e.request).then(function(response){
          caches.open('notes-store').then(function(cache){
            cache.put(e.request, response.clone());
            return response;
          })
        });
    }))
})