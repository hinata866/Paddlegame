const gameArea = document.getElementById('gameArea');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
let ballDirectionX = 2;
let ballDirectionY = 2;
let score = 0;
let gameRunning = false;
let balls = [{ element: ball, directionX: 2, directionY: 2 }];

// Create blocks dynamically
function createBlocks() {
    const rows = 7;
    const cols = 24;
    const rewards = ['longer-paddle', 'extra-10-points', 'extra-20-points', 'none'];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.style.top = (50 + row * 30) + 'px';
            block.style.left = (10 + col * 50) + 'px';
            block.dataset.reward = rewards[Math.floor(Math.random() * rewards.length)];
            gameArea.appendChild(block);
        }
    }
}

function resetGame() {
    ball.style.top = '50%';
    ball.style.left = '50%';
    ballDirectionX = 2;
    ballDirectionY = 2;
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    document.querySelectorAll('.block').forEach(block => block.remove());
    createBlocks();
    balls = [{ element: ball, directionX: 2, directionY: 2 }];
}

startButton.addEventListener('click', function() {
    if (!gameRunning) {
        gameRunning = true;
        startButton.style.display = 'none';
        resetGame();
        moveBall();
    }
});

gameArea.addEventListener('mousemove', function(event) {
    const gameAreaRect = gameArea.getBoundingClientRect();
    const paddleWidth = paddle.offsetWidth;
    let paddleX = event.clientX - gameAreaRect.left - paddleWidth / 2;
    paddleX = Math.max(0, Math.min(paddleX, gameAreaRect.width - paddleWidth));
    paddle.style.left = paddleX + 'px';
});

function checkCollision(ball, block) {
    const ballRect = ball.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();

    return !(
        ballRect.top > blockRect.bottom ||
        ballRect.bottom < blockRect.top ||
        ballRect.left > blockRect.right ||
        ballRect.right < blockRect.left
    );
}

function handleReward(reward) {
    switch (reward) {
        case 'longer-paddle':
            paddle.style.width = '150px';
            setTimeout(() => {
                paddle.style.width = '100px';
            }, 10000);
            break;
        case 'extra-10-points':
            score += 10;
            break;
        case 'extra-20-points':
            score += 20;
            break;
    }
}

function increaseSpeed() {
    const speedMultiplier = 1 + Math.floor(score / 100) * 0.01;
    ballDirectionX *= speedMultiplier;
    ballDirectionY *= speedMultiplier;
}

function createExtraBalls() {
    for (let i = 0; i < 2; i++) {
        const newBall = ball.cloneNode(true);
        gameArea.appendChild(newBall);
        balls.push({ element: newBall, directionX: 2, directionY: 2 });
    }
}

function moveBall() {
    if (!gameRunning) return;

    balls.forEach((ballObj, index) => {
        const ball = ballObj.element;
        const ballRect = ball.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();

        if (ballRect.left <= gameAreaRect.left || ballRect.right >= gameAreaRect.right) {
            ballObj.directionX *= -1;
        }
        if (ballRect.top <= gameAreaRect.top) {
            ballObj.directionY *= -1;
        }
        if (ballRect.bottom >= gameAreaRect.bottom) {
            ball.remove();
            balls.splice(index, 1);
            if (balls.length === 0) {
                alert('Game Over');
                gameRunning = false;
                startButton.style.display = 'block';
                return;
            }
        }
        if (ballRect.bottom >= paddleRect.top && ballRect.right >= paddleRect.left && ballRect.left <= paddleRect.right) {
            ballObj.directionY *= -1;
        }

        document.querySelectorAll('.block').forEach(block => {
            if (checkCollision(ball, block)) {
                const reward = block.dataset.reward;
                block.remove();
                ballObj.directionY *= -1;
                score++;
                handleReward(reward);
                scoreDisplay.textContent = 'Score: ' + score;
                increaseSpeed();
                if (score % 5 === 0) {
                    createExtraBalls();
                }
            }
        });

        ball.style.top = (ball.offsetTop + ballObj.directionY) + 'px';
        ball.style.left = (ball.offsetLeft + ballObj.directionX) + 'px';
    });

    requestAnimationFrame(moveBall);
}
