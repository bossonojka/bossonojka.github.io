function showImg(url){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();

    xhr.onload = function(){
        if (xhr.status == 200){
            let img = new Image();
            img.src = URL.createObjectURL(xhr.response);
            document.body.appendChild(img);
        } else {
            console.log(xhr.statusText);
        }
    }

    xhr.onerror = function(){
        console.error('Network error');
    }
}

let images = ['images/Nature_1.jpg','images/Nature_2.jpg','images/Nature_3.jpg'];

for (var i = 0; i < images.length; i++){
    showImg(images[i]);
}

