let canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

function degToRad(deg){
    return deg * Math.PI / 180;
}

//Initiallize image
let image = new Image();
image.src = 'capguy-walk.png';

//Width and height for hole image
let sheetWidth = 1472;
let sheetHeight = 325;

//Quantity of images
let imgInRow = 8;
let imgInColum = 1;

//Width and height for one sprite
let imgWidth = sheetWidth / imgInRow;
let imgHeight = sheetHeight / imgInColum;

//Movement speed of sprite
let xSpeed = 10;
let ySpeed = 1;

//Number of sprite for animation
let spriteX = 0;
let spriteY = 0;

//For animation along X and Y
let xPos = 0;
let yPos = 0;

//Start main function
image.onload = drawSprite;

//Main function
function drawSprite(){

    ctx.fillStyle = 'white';
    ctx.clearRect(0,0,width,height);

    ctx.drawImage(image, spriteX * sheetWidth/imgInRow, spriteY * sheetHeight/imgInColum, sheetWidth/imgInRow, sheetHeight/imgInColum, xPos, yPos, imgWidth, imgHeight);
    
    if (xPos % 13 == 0){
        if (spriteX === 3){
            spriteX = 0;
        } else {
            spriteX++;
        }
    }

    if (xPos + imgWidth > width){
        xSpeed = -xSpeed;
    } 
    if (xPos < 0) {
        xSpeed = -xSpeed; 
    }
    
    xPos += xSpeed;
    
    requestAnimationFrame(drawSprite);
}






