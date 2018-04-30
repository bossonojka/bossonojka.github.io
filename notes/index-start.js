const list = document.querySelector('ul');

const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');

const titleNew = document.querySelector('#title-new');
const bodyNew = document.querySelector('#body-new');

const form = document.querySelectorAll('form');
const sectionEdit = document.querySelector(".note-edit");

const attachBtn = document.querySelector("#attachBtn");
const attachInput = document.querySelector("#attachInput");
const attachBtnEdit = document.querySelector("#attachBtnEdit");
const attachInputEdit = document.querySelector("#attachInputEdit");
const closeBtn = document.querySelector("#closeBtn");

const imgPreview = document.querySelector(".imgPreview");
const imgPreviewEdit = document.querySelector(".imgPreviewEdit");

let db;
let noteId;

window.onload = function(){
    let request = window.indexedDB.open("notes", 1);

    request.onerror = function(){
        console.log("Database failed to open");
    }

    request.onsuccess = function(){
        console.log("Database opened successfully");
        db = request.result;
        displayData();
    }

    request.onupgradeneeded = function(e){
        let db = e.target.result;

        let objectStore = db.createObjectStore("notes", {keyPath: "id", autoIncrement: true});

        objectStore.createIndex("title", "title", {unique: false});
        objectStore.createIndex("body", "body", {unique: false});
        objectStore.createIndex("img", "img", {unique: false});

        console.log("Database setup complete");
    }

    form[0].onsubmit = addData;
    form[1].onsubmit = editItem;

    setControlBtn();

    if ('serviceWorker' in navigator){
        let request = navigator.serviceWorker.register('/notes/sw.js');
        Promise.all([request]).then(function(){console.log('Service Worker Registered')});
    }
}

function setControlBtn(){

    attachBtn.onclick = function(e){
        e.preventDefault();
        attachInput.click();     
    }

    attachInput.onchange = function(e){
        displayPreview(e, imgPreview, attachBtn);
    }

    attachBtnEdit.onclick = function(e){
        e.preventDefault();
        attachInputEdit.click();     
    }

    attachInputEdit.onchange = function(e){
        displayPreview(e, imgPreviewEdit, attachBtnEdit);
    }

    closeBtn.onclick = function(e){
        e.preventDefault();
        sectionEdit.hidden = true;
    }
}

function displayPreview(e, yourImg, nearBtn){
    let blob = URL.createObjectURL(e.target.files[0]);
    yourImg.src = blob;
    yourImg.height = nearBtn.getBoundingClientRect().height;
}

function addData(e){
    e.preventDefault();

    let newItem = {title: title.value, body: body.value, img: attachInput.files[0]};

    let transaction = db.transaction(["notes"], "readwrite");

    let objectStore = transaction.objectStore("notes");

    var request = objectStore.add(newItem);

    request.onsuccess = function(){
        title.value = "";
        body.value = "";
        attachInput.value = "";
        imgPreview.src = "";
    }

    transaction.oncomplete = function(){
        console.log('Transaction completed: database modification finished.');
        displayData();
    }

    transaction.onerror = function(){
        console.log('Transaction not opened due to error');
    }
}

function displayData(){
    let objectStore = db.transaction('notes').objectStore('notes');

    while (list.firstChild){
        list.removeChild(list.firstChild);
    }
    
    objectStore.openCursor().onsuccess = function(e){
        let cursor = e.target.result;

        if (cursor){
            let listItem = document.createElement('li');
            let h3 = document.createElement('h3');
            let para = document.createElement('p');
            
            listItem.appendChild(h3);
            listItem.appendChild(para);
            list.appendChild(listItem);

            h3.textContent = cursor.value.title;
            para.textContent = cursor.value.body;
            
            if (cursor.value.img){
                let img = document.createElement("img");
                img.src = URL.createObjectURL(cursor.value.img);
                img.className = "imgNote";
                listItem.appendChild(img);
            }

            listItem.setAttribute("data-note-id",cursor.value.id);

            let deleteBtn = document.createElement("button");

            deleteBtn.className = "secControls";
            deleteBtn.textContent = "Delete";
            listItem.appendChild(deleteBtn);

            deleteBtn.onclick = deleteItem;

            let editBtn = document.createElement("button");

            editBtn.className = "secControls";
            editBtn.textContent = "Edit";
            listItem.appendChild(editBtn);

            editBtn.onclick = function(e){
                noteId = Number(e.target.parentNode.getAttribute('data-note-id'));
                sectionEdit.hidden = false;
            };

            cursor.continue();
        } else {
            
            if (!list.firstChild) {
              let listItem = document.createElement('li');
              listItem.textContent = 'No notes stored in IndexDB';
              list.appendChild(listItem);
            }
        }
    }
}

function deleteItem(e){
    let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

    let transaction = db.transaction(['notes'], 'readwrite');
    let objectStore = transaction.objectStore('notes');
    let request = objectStore.delete(noteId);

    transaction.oncomplete = function(){
        e.target.parentNode.remove();
        console.log('Note ' + noteId + ' deleted.');
        if (!list.firstChild) {
            let listItem = document.createElement('li');
            listItem.textContent = 'No notes stored in IndexDB.';
            list.appendChild(listItem);
        }
    }
}

function editItem(e){
    e.preventDefault();

    let newItem = {title: titleNew.value, body: bodyNew.value, img: attachInputEdit.files[0], id:noteId};

    let transaction = db.transaction(["notes"],"readwrite");
    let objectStore = transaction.objectStore("notes");
    let request = objectStore.put(newItem);


    transaction.oncomplete = function(){
        console.log('Transaction completed: database modification finished.');
        
        titleNew.value = "";
        bodyNew.value = "";
        attachInputEdit.value = "";
        imgPreviewEdit.src = "";
        sectionEdit.hidden = true;
        
        displayData();
    }
}