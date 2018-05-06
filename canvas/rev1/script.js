let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

function Shape(x, y, speed){
    this.x = x;
    this.y = y;
    this.speed = speed;
}

Shape.degToRad = function(deg){
    return deg * Math.PI / 180;
}

function PacMan(x, y, speed, size, startDeg, endDeg, angelSpeed){
    Shape.call(this, x, y, speed);
    this.size = size;
    this.startDeg = startDeg;
    this.endDeg = endDeg;
    this.angelSpeed = angelSpeed;
}

PacMan.prototype = Object.create(Shape.prototype);
PacMan.prototype.constructor = PacMan;

PacMan.prototype.draw = function(){
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    
    ctx.arc(this.x, this.y, this.size, this.startDeg, this.endDeg);
    ctx.lineTo(this.x, this.y);
    
    ctx.fill();
}


PacMan.prototype.animate = function(){
    if (this.startDeg < Shape.degToRad(45)){
        this.startDeg += this.angelSpeed;
    }
}

PacMan.prototype.move = function(){
    let _this = this;
    window.onmousemove = function(e){
        _this.x = e.pageX;
        _this.y = e.pageY;
    }
}

let pacman = new PacMan(150,150,50,100,Shape.degToRad(0),Shape.degToRad(360), Shape.degToRad(1));

function move(){
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);

    pacman.draw(); 
    pacman.animate();
    pacman.move();
    
    requestAnimationFrame(move);
}

move();



