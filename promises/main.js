let images = [
    'images/img (1).jpeg',
    'images/img (2).jpg',
    'images/img (3).jpg',
    'images/img (4).jpg',
    'images/img (5).jpg',
    'images/img (6).jpg',
    'images/img (7).jpg',
    'images/img (8).jpg',
];
let section = document.querySelector('section');


function loadImage(url){
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();

        xhr.onload = function(){
            if (xhr.status === 200){
                resolve(xhr.response);
            } else {
                reject('Error: ' + xhr.statusText);
            }
            
        }

        xhr.onerror = function(){
            reject(Error('Network error'));
        }
    });
}

function show(){
    let promiseArr = images.map(loadImage);
    let loaded = [];
    let notLoaded = [];

    return Promise.resolve().then(() => {promiseArr.map(function(element){
        return element.then((file) => {
            let img = document.createElement('img');
            let figure = document.createElement('figure');
        
            img.src = URL.createObjectURL(file);
        
            figure.appendChild(img);
            section.appendChild(figure);

            loaded.push(file);

            return Promise.resolve(file);
        }, (file) => {
            console.log('Coudn`t show image. ' + file);
            notLoaded.push(file);
            return Promise.resolve(file);
        })})})
}

show().then(file => {console.log('Uploaded file: ' + file)}).catch(file => console.log('Error: ' + file))

/*Promise.all(images.map(function(element){
    return loadImage(element);
})).then(function(response){
    response.forEach(element => {
        let img = document.createElement('img');
        let figure = document.createElement('figure');
    
        img.src = URL.createObjectURL(element);
    
        figure.appendChild(img);
        section.appendChild(figure) 
    });
}).catch(error => {console.log(error)})*/

/*for (var i = 0; i < images.length; i++){
    loadImage(images[i]).then(function(response){
        let img = document.createElement('img');
        let figure = document.createElement('figure');

        img.src = URL.createObjectURL(response);

        figure.appendChild(img);
        section.appendChild(figure);
    }, function(error){
        console.log(error);
    })
}*/