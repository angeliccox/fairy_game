const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024; // 1024
canvas.height = 64 * 9; // 576
let acorns = [];
let acornCount = 0; 
let parsedCollisions;
let collisionBlocks;
let background;
let doors;
// Load and set up the background music
const backgroundMusic = new Audio('./music/calmingmusic.mp3');  // Set the path to your music file
backgroundMusic.loop = true;  // Make it loop continuously
backgroundMusic.volume = 0.09;  // Adjust volume

const player = new Player({
  imageSrc: './img/queen/idle.png',
  frameRate: 11,
  animations: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/queen/idle.png',
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/queen/idleLeft.png',
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/queen/runRight.png',
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/queen/runLeft.png',
    },
    enterDoor: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: './img/queen/enterDoor.png',
      onComplete: () => {
        console.log('completed animation');

        // Apply GSAP fade-out effect after the door animation completes
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++
            levels[level].init()
            player.switchSprite('idleRight')
            player.preventInput= false
            gsap.to(overlay,{
              opacity:0
            })
          }
        });
      }
    },
  },
});


let level = 1;
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      if (player.currentAnimation) player.currentAnimation.isActive = false
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundlevel1.png',
      });
      doors = [
        new Sprite({
          position: {
            x: 485,
            y: 325,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];
      acorns = [
        new Acorn({ position: { x: 300, y: 200}, imageSrc: './img/acorn.png' }),
        new Acorn({ position: { x: 500, y: 300 }, imageSrc: './img/acorn.png' }),
      ];
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 96
      player.position.y = 300
      if (player.currentAnimation)
        player.currentAnimation.isActive = false
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundlevel2.png',
      });
      doors = [
        new Sprite({
          position: {
            x: 835,
            y: 155,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];
      acorns = [
        new Acorn({ position: { x: 700, y: 200 }, imageSrc: './img/acorn.png' }),
        new Acorn({ position: { x: 100, y: 400}, imageSrc: './img/acorn.png' }),
      ];
    },
  },
3: {
  init: () => {
    parsedCollisions = collisionsLevel3.parse2D();
    collisionBlocks = parsedCollisions.createObjectsFrom2D();
    player.collisionBlocks = collisionBlocks;
    player.position.x = 96
    player.position.y = 300
    if (player.currentAnimation)
      player.currentAnimation.isActive = false
    background = new Sprite({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: './img/backgroundlevel3.png',
    });
    doors = [
      new Sprite({
        position: {
          x: 900,
          y: 155,
        },
        imageSrc: './img/doorOpen.png',
        frameRate: 5,
        frameBuffer: 5,
        loop: false,
        autoplay: false,
      }),
    ];
    acorns = [
      new Acorn({ position: { x: 300, y: 400 }, imageSrc: './img/acorn.png' }),
      new Acorn({ position: { x: 500, y: 300 }, imageSrc: './img/acorn.png' }),
    ];
    
  },

}
}







const keys = {
  w: {
    pressed: false,
  },
  a:{
    pressed: false,
  },
  d:{
   pressed:false,
  },
}
const overlay = {
  opacity:0,
}

function animate() {
  window.requestAnimationFrame(animate);

  background.draw(c);

  acorns.forEach((acorn) => {
    acorn.draw(c);
    if (acorn.checkCollision(player) && !acorn.collected) {
      acorn.collected = true;
      acornCount++;
      console.log(`Acorns collected: ${acornCount}`);
    }
  });

  doors.forEach((door) => { door.draw(); });

  player.handleInput(keys);
  player.update();
  player.draw(c);

  drawAcornCount();

  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}

// Display the acorn count
function drawAcornCount() {
  c.font = '24px Arial';
  c.fillStyle = 'white';
  c.fillText(`Acorns: ${acornCount}`, 20, 40);
}

// Function to stop the music
function stopMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;  // Reset the track to the beginning
}

// Game start function
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  levels[level].init();
  backgroundMusic.play();  // Play the background music when the game starts
  animate();  // Start the animation loop
});

// Example: Stop music on game over or level transition
function gameOver() {
  stopMusic();  // Stop the background music
  console.log("Game Over");
  // Additional game-over logic here
}

levels[level].init();  // Initialize the first level when the game loads