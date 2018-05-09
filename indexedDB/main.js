let inputTitle = document.querySelector('#title');
let inputContent = document.querySelector('#content');
let submitBtn = document.querySelector('#send');
let form = document.querySelector('form');
let section = document.querySelector('#show');

let db;

window.onload = function(){
    let request = indexedDB.open('test',1);

    request.onsuccess = function(){
        db = request.result;
        console.log('Database opened successfully');

        displayItem();
    }
    
    request.onupgradeneeded = function(e){
        let db = e.target.result;
    
        let objectStore = db.createObjectStore('text',{keyPath: 'id', autoIncrement:true});
    
        objectStore.createIndex('title','title',{unique: false});
        objectStore.createIndex('content','content',{unique: false});

        console.log('Databese setup complete')
    }
    
    request.onerror = function(){
        console.log('Database failed to open');
    }
}

form.onsubmit = addItems;

function addItems(e){
    e.preventDefault();

    let newItem = {title: inputTitle.value, content: inputContent.value};

    let transaction = db.transaction(['text'], 'readwrite');

    let objectStore = transaction.objectStore('text');

    let request = objectStore.add(newItem);

    request.onsuccess = function(){
        inputTitle.value = '';
        inputContent.value = '';
        console.log('Onsuc');
    }

    transaction.oncomplete = function(){
        console.log('Transaction completed: database modification finished.');

        displayItem();
    }

}

function displayItem(){

    while(section.firstChild){
        section.removeChild(section.firstChild);
    }

    let objectStore = db.transaction(['text'],'readonly').objectStore('text');

    objectStore.openCursor().onsuccess = function(e){
        let cursor = e.target.result;

        if (cursor){
            let para = document.createElement('p');
            para.textContent = cursor.value.title + " : " + cursor.value.content;

            section.appendChild(para);

            cursor.continue();
        }

    }
}


