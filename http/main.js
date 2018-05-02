function showImg(obj){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', obj.url);
    xhr.responseType = 'blob';
    xhr.send();

    xhr.onload = function(){
        if (xhr.status == 200){
            let responseArr = [];
            responseArr[0] = xhr.response;
            responseArr[1] = obj;
            console.log(xhr.responseURL);

            let img = new Image();
            let figure = document.createElement('figure');
            let caption = document.createElement('caption');
            let section = document.querySelector('section');

            img.src = URL.createObjectURL(responseArr[0]);
            caption.innerHTML = '<strong>' + responseArr[1].name + '</strong>';

            figure.appendChild(img);
            figure.appendChild(caption);
            section.appendChild(figure);
        } else {
            console.log(xhr.statusText);
        }
    }

    xhr.onerror = function(){
        console.error('Network error');
    }
}

let gallery = {images: [
    {name: "Forest",
    url: 'images/Nature_1.jpg'},
    {name: "Mountains",
    url: 'images/Nature_2.jpg'},
    {name: "River",
    url: 'images/Nature_3.jpg'}
]};

for (var i = 0; i < gallery.images.length; i++){
    showImg(gallery.images[i]);
    console.log("Fetching image " + i + "...");
}

