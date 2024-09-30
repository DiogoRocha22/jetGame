const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playerImg = document.getElementById("playerImage");
const obstacleImg = document.getElementById("obstacleImage");
const backgroundImg = document.getElementById("backgroundImage");
let obstacleCreationInterval;

let backgroundX = 0;
const backgroundSpeed = 2;

const playerWidth = 30;
const playerHeight = 30;
let playerX = 10;
let playerY = canvas.height / 2 - playerHeight / 2;
let playerSpeed = 15;

let obstacles = [];
let obstacleSpeed = 2;
let obstacleInterval = 2000;
let difficultyIncreaseRate = 0.35;

let score = 0;
let gameRunning = true;

const bgMusic = document.getElementById('bgMusic');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
bgMusic.play();

document.addEventListener("keydown", movePlayer);

function movePlayer(e) {
  if (e.key === "ArrowUp" && playerY > 0) playerY -= playerSpeed;
  if (e.key === "ArrowDown" && playerY < canvas.height - playerHeight) playerY += playerSpeed;
  if (e.key === "ArrowLeft" && playerX > 0) playerX -= playerSpeed;
  if (e.key === "ArrowRight" && playerX < canvas.width - playerWidth) playerX += playerSpeed;
}

function createObstacle() {
  let randomSize = Math.floor(Math.random() * 40) + 20;
  let obstacleY = Math.floor(Math.random() * (canvas.height - randomSize));
  obstacles.push({ x: canvas.width, y: obstacleY, width: randomSize, height: randomSize });
}

function moveObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacleSpeed;
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      document.getElementById("score").textContent = score;
    }
  }
}

function drawRotatedImage(image, x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle * Math.PI / 180);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawRotatedImage(playerImg, playerX, playerY, playerWidth, playerHeight, 90);
  for (let i = 0; i < obstacles.length; i++) {
    ctx.drawImage(obstacleImg, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
  }
}

function drawBackground() {
  ctx.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
  backgroundX -= backgroundSpeed;
  if (backgroundX <= -canvas.width) backgroundX = 0;
}

function detectCollision() {
  for (let i = 0; i < obstacles.length; i++) {
    if (playerX < obstacles[i].x + obstacles[i].width &&
        playerX + playerWidth > obstacles[i].x &&
        playerY < obstacles[i].y + obstacles[i].height &&
        playerY + playerHeight > obstacles[i].y) {
      endGame();
    }
  }
}

function increaseDifficulty() {
  if (obstacleInterval > 500) {
    obstacleInterval -= 50;
  }
  obstacleSpeed += difficultyIncreaseRate;
}

function resetGameVariables() {
  playerX = 10;
  playerY = canvas.height / 2 - playerHeight / 2;
  obstacles = [];
  score = 0;
  obstacleSpeed = 2;
  obstacleInterval = 2000;
}


function endGame() {
  gameRunning = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;
  finalScore.textContent = score;
  resetGameVariables();
  gameOverScreen.style.display = "flex";
}

function gameLoop() {
  if (gameRunning) {
    bgMusic.play();
    moveObstacles();
    drawGame();
    detectCollision();
    requestAnimationFrame(gameLoop);
  }
}

function createObstaclesPeriodically() {
  obstacleCreationInterval = setInterval(createObstacle, obstacleInterval);
}

setInterval(() => {
  increaseDifficulty();
  clearInterval(createObstaclesPeriodically);  
  createObstaclesPeriodically();
}, 10000);

gameLoop();
createObstaclesPeriodically();

function restartGame() {
  resetGameVariables();
  gameRunning = true;
  document.getElementById("score").textContent = score;
  gameOverScreen.style.display = "none";
  bgMusic.play();
  clearInterval(obstacleCreationInterval);
  createObstaclesPeriodically(); 
  gameLoop();
}

