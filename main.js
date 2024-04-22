const currentScoreText = document.querySelector('#currentScore');
const highScoreText = document.querySelector('#highScore');
const board = document.querySelector('.game-board');
const instructionContainer = document.querySelector('.instruction-container');

// Game Variables
const gridSize = 20;
let direction = 'down';
let gameInterval;
let highScore = Number(localStorage.getItem('highScore')) || 0;
let gameStarted = false;
let gameSpeedDelay = 200;
let snakePosition = [{ x: 10, y: 10 }];
let foodPosition = generateFoodPosition();

// draw snake and the food
function draw() {
    board.innerHTML = ``;
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    snakePosition.forEach((segment) => {
        const snakeEl = createGameElement('div', 'snake');
        setPosition(snakeEl, segment);
        board.appendChild(snakeEl);
    });
}

function moveSnake() {
    const head = { ...snakePosition[0] };
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'down':
            head.y++;
            break;

        default:
            break;
    }

    snakePosition.unshift(head);

    // collected the food
    if (head.x === foodPosition.x && head.y === foodPosition.y) {
        foodPosition = generateFoodPosition();
        clearInterval(gameInterval);
        increaseSpeed();
        intervalLoop();
    } else {
        snakePosition.pop();
    }
}

function drawFood() {
    const foodEl = createGameElement('div', 'food');
    setPosition(foodEl, foodPosition);
    board.appendChild(foodEl);
}

function createGameElement(tag, className) {
    const el = document.createElement(tag);
    el.classList.add(className);
    return el;
}

function generateFoodPosition() {
    const x = Math.floor(Math.random() * gridSize + 1);
    const y = Math.floor(Math.random() * gridSize + 1);

    return { x, y };
}

// Set position of snake or food
function setPosition(el, position) {
    el.style.gridColumn = position.x;
    el.style.gridRow = position.y;
}

function toggleGameState() {
    gameStarted = !gameStarted;
    instructionContainer.classList.toggle('hidden');
    board.classList.toggle('hidden');
}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function intervalLoop() {
    // board.firstChild.classList.add('head');
    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function checkCollision() {
    const head = snakePosition[0];

    if (
        head.x <= -1 ||
        head.x >= gridSize + 1 ||
        head.y <= -1 ||
        head.y >= gridSize + 1
    ) {
        resetGame();
    }

    for (let i = 1; i < snakePosition.length; i++) {
        if (head.x === snakePosition[i].x && head.y === snakePosition[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snakePosition = [{ x: 10, y: 10 }];
    foodPosition = generateFoodPosition();
    direction = 'right';
    gameSpeedDelay = 200;

    updateScore();
}

function updateHighScore() {
    const score = snakePosition.length - 1;
    if (score > highScore) {
        highScore = String(score);
        localStorage.setItem('highScore', highScore);
        highScoreText.textContent = highScore.padStart(3, '0');
    }
}

function updateScore() {
    const score = snakePosition.length - 1;
    currentScoreText.textContent = String(score).padStart(3, '0');
}

function startGame() {
    toggleGameState();
    draw();
    intervalLoop();
}

function stopGame() {
    clearInterval(gameInterval);
    toggleGameState();
}

function handleKeyPress(e) {
    if (
        (!gameStarted && e.code === 'Space') ||
        (!gameStarted && e.code === ' ')
    ) {
        startGame();
    } else {
        switch (e.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            default:
                break;
        }
    }
}

highScoreText.textContent = String(highScore).padStart(3, '0');

// Start here
document.addEventListener('keydown', (e) => {
    handleKeyPress(e);
});
