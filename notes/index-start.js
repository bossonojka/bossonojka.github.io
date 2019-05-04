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

const videoPreview = document.querySelector(".videoPreview");
const videoPreviewEdit = document.querySelector(".videoPreviewEdit");

let db;
let noteId;

let tempVideo, tempImg = "";

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
        objectStore.createIndex("date", "date", {unique: false});
        objectStore.createIndex("img", "img", {unique: false});
        objectStore.createIndex("video", "video", {unique: false});

        console.log("Database setup complete");
    }

    form[0].onsubmit = addData;
    form[1].onsubmit = editItem;

    setControlBtn();

    if ('serviceWorker' in navigator){
        navigator.serviceWorker.register('/notes/sw.js').then(function(){
            console.log('Service Worker Registered');
        })
    }
}

function setControlBtn(){

    attachBtn.onclick = function(e){
        e.preventDefault();
        attachInput.click();     
    }

    attachInput.onchange = function(e){
        cleanPreviews();
        let file = e.target.files[0];
        (e.target.files[0].type != "video/mp4") ? displayPreviewImg(file, imgPreview, attachBtn) : displayPreviewVideo(file, videoPreview, attachBtn);
    }

    attachBtnEdit.onclick = function(e){ 
        e.preventDefault();
        attachInputEdit.click();     
    }

    attachInputEdit.onchange = function(e){
        cleanPreviews();
        let file = e.target.files[0];
        (e.target.files[0].type != "video/mp4") ? displayPreviewImg(file, imgPreviewEdit, attachBtnEdit) : displayPreviewVideo(file, videoPreviewEdit, attachBtnEdit);
    }

    closeBtn.onclick = function(e){
        e.preventDefault();
        sectionEdit.hidden = true;
    }
}

function cleanPreviews(){
    imgPreview.src = imgPreviewEdit.src = "";
    videoPreview.src = videoPreviewEdit.src = "";
}

function displayPreviewImg(file, yourImg, nearBtn){
    let blob = URL.createObjectURL(file);
    yourImg.src = blob;
    yourImg.height = nearBtn.getBoundingClientRect().height;
}

function displayPreviewVideo(file, yourVideo, nearBtn){
    let blob = URL.createObjectURL(file);
    yourVideo.src = blob;
    yourVideo.height = nearBtn.getBoundingClientRect().height;
    yourVideo.hidden = false;
}

function addData(e){
    e.preventDefault();

    videoPreview.hidden = true;

    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth()+1) + '/' +today.getFullYear() + ' ' + today.toLocaleTimeString();

    let video = "";
    let img = "";

    if (attachInput.files.length != 0){
        if (attachInput.files[0].type != "video/mp4"){
            img = attachInput.files[0];
        } else {
            video = attachInput.files[0];
        }
    }

    let newItem = {title: title.value, body: body.value, date: date, img: img, video: video};

    let transaction = db.transaction(["notes"], "readwrite");

    let objectStore = transaction.objectStore("notes");

    var request = objectStore.add(newItem);

    request.onsuccess = function(){
        title.value = "";
        body.value = "";
        date.value = "";
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
            let dateItem = document.createElement('span');
            
            listItem.appendChild(h3);
            listItem.appendChild(para);
            list.appendChild(listItem);

            h3.textContent = cursor.value.title;
            para.textContent = cursor.value.body;
            
            h3.appendChild(dateItem);
            dateItem.textContent = cursor.value.date;
            if (cursor.value.img){
                let img = document.createElement("img");
                img.src = URL.createObjectURL(cursor.value.img);
                img.className = "imgNote";
                listItem.appendChild(img);
            } else if (cursor.value.video) {
                let video = document.createElement("video");
                video.src = URL.createObjectURL(cursor.value.video);
                video.className = "imgNote";
                video.controls = true;
                listItem.appendChild(video);
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

                attachInputEdit.form.reset();
                imgPreviewEdit.src = "";
                videoPreviewEdit.src = "";

                let result = getNoteData(noteId)
                result.onsuccess = function(e) {
                    titleNew.value = e.target.result.title;
                    bodyNew.value = e.target.result.body;
                   
                    if (e.target.result.img != ""){
                        tempImg = e.target.result.img;
                        displayPreviewImg(e.target.result.img, imgPreviewEdit, attachBtn);
                    }

                    if (e.target.result.video != ""){
                        tempVideo = e.target.result.video;
                        displayPreviewVideo(e.target.result.video, videoPreviewEdit, attachBtn);
                    }
                };
            };

            cursor.continue();
        } else {
            
            if (!list.firstChild) {
              let listItem = document.createElement('li');
              listItem.textContent = 'No notes stored in database.';
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
            listItem.textContent = 'No notes stored in database.';
            list.appendChild(listItem);
        }
    }
}

function getNoteData(id){
    let transaction = db.transaction(["notes"]);
    let objectStore = transaction.objectStore("notes");
    
    let objectStoreRequest = objectStore.get(id);

    return objectStoreRequest;
}

function editItem(e){
    e.preventDefault();

    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth()+1) + '/' +today.getFullYear() + ' ' + today.toLocaleTimeString();

    let video = "";
    let img = "";

    //let newItem;

    let note = getNoteData(noteId)
    note.onsuccess = function(e) {
        if (attachInputEdit.files.length != 0){
            if (attachInputEdit.files[0].type != "video/mp4"){
                img = attachInputEdit.files[0];
                console.log(img);
            } else {
                video = attachInputEdit.files[0];
                console.log(video);
            }
        } else {
            if (e.target.result.img != ""){
                img = e.target.result.img;
                console.log(img);
            } else {
                video = e.target.result.video;
                console.log(video);
            }
        }

        let newItem = {title: titleNew.value, body: bodyNew.value, date: date, img: img, video: video, id: noteId};

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
    
            tempImg = tempVideo = "";
            
            displayData();
        }
    }
}