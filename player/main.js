let player = document.querySelector('.player');
let controls = document.querySelector('.controls');
let media = document.querySelector('video');
let play = document.querySelector('#play');
let stop = document.querySelector('#stop');
let mute = document.querySelector('#mute');

let timerWrapper = document.querySelector('.timer');
let timer = document.querySelector('.timer span');
let timerBar = document.querySelector('.timer div');

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

let pressed;

player.style.width = WIDTH/1.3 + "px";
player.style.height = HEIGHT/1.3 + "px";
player.style.top = ((HEIGHT-player.getBoundingClientRect().height)/2) + "px";

controls.style.left = ((player.getBoundingClientRect().width/2 - controls.getBoundingClientRect().width/2)) + 'px';

controls.style.bottom = ((HEIGHT-player.getBoundingClientRect().height)/6) + "px";

window.onresize = function(){
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    
    player.style.width = WIDTH/2 + "px";
    player.style.height = HEIGHT/2 + "px";
    player.style.top = ((HEIGHT-player.getBoundingClientRect().height)/2) + "px";

    controls.style.left = ((player.getBoundingClientRect().width/2 - controls.getBoundingClientRect().width/2)) + 'px';
}

media.addEventListener('timeupdate', setTimer);

function setTimer(){
    let minutes = Math.floor(media.currentTime / 60);
    let seconds = Math.floor(media.currentTime - minutes * 60);
    let minuteVal;
    let secVal;

    if (minutes < 10){
        minuteVal = '0' + minutes;
    } else {
        minuteVal = minutes;
    }

    if (seconds < 10){
        secVal = '0' + seconds;
    } else {
        secVal = seconds;
    }

    timer.textContent = minuteVal + ':' + secVal;

    timerBar.style.width = timerWrapper.clientWidth * (media.currentTime/media.duration) + 'px';

}

function barClick(e){
    if (pressed){
        let barWidth = e.pageX - timerWrapper.getBoundingClientRect().x;
        timerBar.style.width = barWidth + 'px';
        media.currentTime = (media.duration * barWidth) / timerWrapper.clientWidth;
    }
}

player.addEventListener('dragover', dragover);
player.addEventListener('dragleave', function(){
    player.style.opacity = '';
});
player.addEventListener('drop', drop);
player.addEventListener('dragenter', dragenter);
player.addEventListener('dblclick', function(){
    
    if (media.paused){
        media.play();
    } else {
        media.pause();
    }
   
});

function dragenter(e){
    e.preventDefault();
    e.stopPropagation();
    
}

function dragover(e){
    e.preventDefault();
    e.stopPropagation();

    player.style.opacity = .5;
}

function drop(e){
    media.play();

    let dt = e.dataTransfer;
    let file = dt.files;

    media.src = URL.createObjectURL(file[0]);

    timerWrapper.addEventListener('mousemove',barClick);

    timerWrapper.addEventListener('mousedown',function(){
        pressed = true;
    });

    timerWrapper.addEventListener('mouseup',function(){
        pressed = false;
    });

    player.style.opacity = '';
    timerBar.style.width = 0 + 'px';
}
