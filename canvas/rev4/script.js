let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

function degToRad(deg){
    return deg * (Math.PI/180);
}

function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = animation;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, width, height);
ctx.translate(width/2, height/2);

let moveOffset = 20;
let length = 250;
let color = 0;

function animation(){
        ctx.fillStyle = 'rgba(' + (0 + color) + ',' + (255 - color) + ',' + (255 - color) + ', 0.5)'; 
        ctx.beginPath();
        ctx.moveTo(moveOffset,moveOffset);
        ctx.lineTo(moveOffset + length,moveOffset);
        let triHeight = length/2 * Math.tan(degToRad(60));
        ctx.lineTo(moveOffset + length/2,moveOffset + triHeight);
        ctx.lineTo(moveOffset,moveOffset);
        ctx.fill();

        length--;
        moveOffset += 0.8;
        color++;

        ctx.rotate(degToRad(5));

        requestAnimationFrame(animation);
}