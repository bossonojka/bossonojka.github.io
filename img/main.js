function imgLoad(obj){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('GET', obj.url);
        request.responseType = 'blob';
        request.send();

        request.onload = function(){
            if (request.status == 200){
                let responseArr = [];
                responseArr[0] = request.response;
                responseArr[1] = obj;
                resolve(responseArr);
                console.log(request.responseURL);
            } else {
                reject(request.statusText);
            }
        }

        request.onerror = function(){
            console.error('Network error.');
        }
    });
}

let section = document.querySelector('section');

for (var i = 0; i < Gallery.images.length; i++){
    imgLoad(Gallery.images[i]).then(function(response){
        let img = new Image();
        let figure = document.createElement('figure');
        let caption = document.createElement('caption')

        img.src = URL.createObjectURL(response[0]);
        caption.innerHTML = '<strong>' + response[1].name + '</strong>';

        figure.appendChild(img);
        figure.appendChild(caption);
        section.appendChild(figure);

    }, function(error){
        console.error(error);
    })
}

if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/img/sw.js').then(function(reg){
        console.log('Registration succeeded. ' + reg.scope);
    }).catch(function(error) {
        console.log('Registration failed with ' + error);
      });
}