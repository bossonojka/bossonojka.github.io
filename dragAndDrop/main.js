// Локальное хранилище. Настройка.

var color;
var setColor = document.querySelector("#setCol");

setColor.onclick = function(e){
    e.preventDefault();
    color = colors();

    populateStorage();

    function populateStorage(){
        localStorage.setItem("dropbox", color);
        setStyles();
    }

    function setStyles(){
        var currentCol = localStorage.getItem("dropbox");
        dropbox.style.border = "10px solid " + currentCol;
        mainTitle.style.border = "10px solid " + currentCol;
        mainTitle.style.borderTop = "none";
        setColor.style.backgroundColor = currentCol;
        var delBtn = document.querySelectorAll(".del");
            for (var i = 0; i < delBtn.length; i++){
                delBtn[i].style.backgroundColor = currentCol;
            }
        var btnMin = document.querySelectorAll(".mini");
            for (var i = 0; i < btnMin.length; i++){
                btnMin[i].style.backgroundColor = currentCol;
                }
        var img = document.querySelectorAll("img");
            for (var i = 0; i < img.length; i++){
                img[i].style.border = "3px solid " + currentCol;
            }
        var video = document.querySelectorAll("video");
            for (var i = 0; i < video.length; i++){
                video[i].style.border = "3px solid " + currentCol;
            }
        }
}

// Автоматическое изменение размера.

var mainTitle = document.querySelector(".mainTitle");
var authorTitle = document.querySelector(".authorTitle");
var ul = document.querySelector(".uploadedFiles");
var inc, dec, isHide = true;

var dropbox = document.querySelector(".dropbox");
dropbox.addEventListener("dragenter", dragenter);
dropbox.addEventListener("dragover", dragover);
dropbox.addEventListener("drop", drop);
dropbox.addEventListener("dragleave", function (){
    dropbox.style.opacity = "";
    mainTitle.style.opacity = "";
})

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
dropbox.style.width = WIDTH/1.5 + "px";
dropbox.style.height = HEIGHT/1.5 + "px";
dropbox.style.top = HEIGHT/6 + "px";

window.onresize = function(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    dropbox.style.width = WIDTH/1.5 + "px";
    dropbox.style.height = HEIGHT/1.5 + "px";
    dropbox.style.top = HEIGHT/6 + "px";
} 

// Основная логика программы.

dropbox.style.border = "10px solid " + localStorage.getItem("dropbox");
mainTitle.style.border = "10px solid " + localStorage.getItem("dropbox");
mainTitle.style.borderTop = "none";
setColor.style.backgroundColor = localStorage.getItem("dropbox");

function dragenter(e){
    e.stopPropagation();
    e.preventDefault();
    
}

function dragover(e){
    e.stopPropagation();
    e.preventDefault(); 
    dropbox.style.opacity = .5;
}

function showInfo(files, isMedia){
    if (isMedia){
        return '<strong>Name: </strong>' + files.name + ' ' + '<strong>Size: </strong>' + files.size + ' bytes' + '<br/>';
    } else {
        return 'You can upload here only pictures and videos.<br/>';
    }  
}

function zoomMedia(e){
    if ($(e.target).css("width") != "200px"){
        $(e.target).animate({width: "200px"},1000);
        e.target.controls = false;
        e.target.muted = true;
    } else {
        $(e.target).animate({width: "90%"},1000);
        e.target.controls = "controls";
        e.target.muted = false;
    }
}

function drop(e){
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    
    showMedia(files);
}

function onPageLoad(){
    var request = new XMLHttpRequest();
    request.open("GET", "engine.php?load=2", true);
    request.onreadystatechange = function(){
        if (this.readyState == 4){
            if (this.status == 200){
                if (this.response != null){
                    console.log(JSON.parse(this.response));
                    var response = JSON.parse(this.response);
                    if (!response.length){
                        console.log("Error!");
                    } else {
                        showMedia(response);
                    }
                }
            }
        }
    }
    request.send(null);
}

function showMedia(files){
    for (var i = 0; i < files.length; i++){
        var isBlob = false;
        if (files[i] instanceof Blob){
            var blob = URL.createObjectURL(files[i]);
            isBlob = true;
            var request = new XMLHttpRequest();
        
            request.open("POST", "engine.php", true);
            request.onreadystatechange = function(){
                if (this.readyState == 4){
                    if (this.status = 200){
                        console.log(this.response);
                    }
                }
            }
        
            var data = new FormData();

            data.append("userfile", files[i]);
            console.log(data.get("userfile"));
        } else {
            var blob = files[i].dir + files[i].name;
        }

        var li = document.createElement("li");
        var btn = document.createElement("button");
        //let file = files[i];

        btn.textContent = "Delete";
        btn.className = "del";
        btn.style.backgroundColor = localStorage.getItem("dropbox");
        btn.onclick = deleteFile(files[i]);

        if (files[i].type === "image/jpeg" || files[i].type === "image/png"){
            var img = document.createElement("img");
            
            li.innerHTML = showInfo(files[i],true);
            img.id = "img" + i;
            img.src = blob;
            img.style.border = "3px solid " + localStorage.getItem("dropbox");
            
            img.onclick = function(e){
                zoomMedia(e);
            }
            
            li.appendChild(img);

            if (isBlob){
                request.send(data);
            }
        } else if (files[i].type === "video/mp4") {
            var video = document.createElement("video");
            
            li.innerHTML = showInfo(files[i],true);
            video.src = blob;
            video.className = "yourVid";
            video.style.border = "3px solid " + localStorage.getItem("dropbox");
            video.autoplay = true;
            video.muted = true;
            
            video.onclick = function(e){
                zoomMedia(e);
                if ($(e.target).css("width") !== "200px"){
                $(e.target).siblings(".mini").hide();
                } else {
                $(e.target).siblings(".mini").show();
                }
            }
            
            li.appendChild(video);
            if (isBlob){
                request.send(data);
            }
        } else {
            var img = document.createElement("img");
            var a = document.createElement("a");
            
            a.href = blob;
            a.download = true;
            img.style.border = "none";
            img.style.width = "64px";
            img.src = "unknown.png";
            li.innerHTML = showInfo();
            a.appendChild(img);
            li.appendChild(a);
        }
        ul.appendChild(li);
        li.appendChild(btn);
        dropbox.style.opacity = "";

        var btnMin = document.createElement("button");
        
        btnMin.textContent = "Minimize";
        btnMin.className = "mini";
        btnMin.style.backgroundColor = localStorage.getItem("dropbox");
        btnMin.style.display = "none";
        
        btnMin.onclick = function(e){
            $(e.target).siblings("video").animate({width: "200px"},1000);
            $(e.target).siblings(".yourVid").prop({"muted": true, "controls": false});
            e.target.style.display = "none";
        }
        
        li.appendChild(btnMin);
    }
}

// Дополнительные функции.

function colors(){
    return 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
}

function random(min,max) {
    var num = Math.floor(Math.random()*(max-min)) + min;
    return num;
}

function load(blob){
    var fd = new FormData();
    fd.append('image', blob);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "engine.php", true);
    xhr.setRequestHeader("Content-type", "multipart/form-data");
    xhr.send(fd);
}

function deleteFile(file){
    return function (){
        var filename = file.name;
        this.parentElement.remove();
        
        var request = new XMLHttpRequest();
            
        request.open("POST", "engine.php", true);
        request.onreadystatechange = function(){
            if (this.readyState == 4){
                if (this.status = 200){
                    console.log(this.response);
                }
            }
        }
        
        var data = new FormData();
        
        data.append("fordeleting", filename);
        request.send(data);
    }
}

onPageLoad();