const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const player = document.getElementById('player');
const playerSpeed = 5;

let paddleX = gameArea.offsetWidth / 2 - paddle.offsetWidth / 2;
let ballX = gameArea.offsetWidth / 2 - ball.offsetWidth / 2;
let ballY = 0;
let ballSpeedY = 2;
let ballSpeedX = 2;

document.addEventListener('mousemove', (e) => {
    const rect = gameArea.getBoundingClientRect();
    paddleX = e.clientX - rect.left - paddle.offsetWidth / 2;
    if (paddleX < 0) paddleX = 0;
    if (paddleX + paddle.offsetWidth > gameArea.offsetWidth) paddleX = gameArea.offsetWidth - paddle.offsetWidth;
    paddle.style.left = `${paddleX}px`;
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    if (key === 'w' && playerRect.top > gameAreaRect.top) {
        player.style.top = `${player.offsetTop - playerSpeed}px`;
    } else if (key === 's' && playerRect.bottom < gameAreaRect.bottom) {
        player.style.top = `${player.offsetTop + playerSpeed}px`;
    } else if (key === 'a' && playerRect.left > gameAreaRect.left) {
        player.style.left = `${player.offsetLeft - playerSpeed}px`;
    } else if (key === 'd' && playerRect.right < gameAreaRect.right) {
        player.style.left = `${player.offsetLeft + playerSpeed}px`;
    }
});

function update() {
    ballY += ballSpeedY;
    ballX += ballSpeedX;

    if (ballX <= 0 || ballX + ball.offsetWidth >= gameArea.offsetWidth) {
        ballSpeedX = -ballSpeedX;
    }

    if (ballY <= 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballY + ball.offsetHeight >= gameArea.offsetHeight) {
        if (ballX + ball.offsetWidth >= paddleX && ballX <= paddleX + paddle.offsetWidth) {
            ballSpeedY = -ballSpeedY;
        } else {
            alert('Game Over');
            ballY = 0;
            ballX = gameArea.offsetWidth / 2 - ball.offsetWidth / 2;
        }
    }

    ball.style.top = `${ballY}px`;
    ball.style.left = `${ballX}px`;

    requestAnimationFrame(update);
}

update();
