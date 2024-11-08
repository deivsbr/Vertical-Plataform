const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024; //Largura canvas
canvas.height = 576; // Altura canvas

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}
const floorCollisions2D = [];
for(let i =0; i<floorCollisions.length;i+= 36){
    floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}
const collisionBlocks = [];
floorCollisions2D.forEach((row, y )=>{
    row.forEach((symbol, x) =>{
       if(symbol === 202) {
        console.log("Desenhe um bloco aqui!");
        collisionBlocks.push(new CollisionBlock({
            position: {
                x: x * 16,
                y: y * 16,
            }
        }))
       }
    })
})
const platformCollisions2D = [];
for(let i =0; i<platformCollisions.length;i+= 36){
    platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionsBlocks = [];
platformCollisions2D.forEach((row, y )=>{
    row.forEach((symbol, x) =>{
       if(symbol === 202) {
        console.log("Desenhe um bloco aqui!");
        platformCollisionsBlocks.push(new CollisionBlock({
            position: {
                x: x * 16,
                y: y * 16,
            },
            height: 4,
        }))
       }
    })
})

const gravity = 0.1; // Velocidade da gravidade

const player = new Player({
    position: {
        x:100,
        y:300,
    },
    collisionBlocks,
    platformCollisionsBlocks,
    imageSrc: './IMG/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle:{
            imageSrc: './IMG/warrior/Idle.png',
            frameRate: 8,
            frameBuffer:3,
        },
        Run:{
            imageSrc: './IMG/warrior/Run.png',
            frameRate: 8,
            frameBuffer:5,
        },
        Jump:{
            imageSrc: './IMG/warrior/Jump.png',
            frameRate: 2,
            frameBuffer:3,
        },
        Fall:{
            imageSrc: './IMG/warrior/Fall.png',
            frameRate: 2,
            frameBuffer:3,
        },
        FallLeft:{
            imageSrc: './IMG/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer:3,
        },
        RunLeft:{
            imageSrc: './IMG/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer:3,
        },
        IdleLeft:{
            imageSrc: './IMG/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer:3,
        },
        JumpLeft:{
            imageSrc: './IMG/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer:3,
        },
    }
});


const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}

const background = new Sprite({
    position: {
        x:0,
        y:0,
    },
    imageSrc:'./IMG/background.png',
})

const backgroundImageHeight = 432;

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    }
}

function animate(){
    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(4,4);
    ctx.translate(camera.position.x, camera.position.y);
    background.update();
    collisionBlocks.forEach(collisionBlock =>{
        collisionBlock.update();
    })

    platformCollisionsBlocks.forEach((block) =>{
        block.update();
    })

    player.checkForHorizontalCanvasCollision();
    player.checkForVerticalCanvasCollision();
    player.update();

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Run');
        player.velocity.x = 2;
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({canvas,camera});
    } else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2;
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({canvas,camera});
    } else if (player.velocity.y === 0) {
        if(player.lastDirection === 'right') 
            player.switchSprite('Idle')
        else
        player.switchSprite('IdleLeft');
    }
    
    if(player.velocity.y < 0) {
        player.shouldPanCameraDown({camera,canvas})
        if(player.lastDirection === 'right')
        player.switchSprite('Jump')
        else
        player.switchSprite('JumpLeft');
    } 
        else if (player.velocity.y > 0) {
            player.shouldPanCameraUp({camera,canvas})
            if(player.lastDirection === 'right')
            player.switchSprite('Fall')
              else
            player.switchSprite('FallLeft')
        }
    ctx.restore();
    
}

animate()

window.addEventListener('keydown', (event) =>{
    switch(event.key){
        case 'd':
        keys.d.pressed = true
        break;
        case 'a':
        keys.a.pressed = true
        break;
        case 'w':
        player.velocity.y = -4;
        break;
    }
});

window.addEventListener('keyup', (event) =>{
    switch(event.key){
        case 'd':
        keys.d.pressed = false
        break;
        case 'a':
        keys.a.pressed = false
        break;
    }
});

