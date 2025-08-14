const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const scoreDisplayElement = document.getElementById('scoreDisplay');
const restartBtn = document.getElementById('restartBtn');

// Mobile control buttons
const btnUp = document.getElementById('btn-up');
const btnLeft = document.getElementById('btn-left');
const btnDown = document.getElementById('btn-down');
const btnRight = document.getElementById('btn-right');

const grid = 16;
let count = 0;
let score = 0;
let gameRunning = true;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

let apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function updateScore() {
  scoreElement.textContent = 'Score: ' + score;
}

function gameOver() {
  gameRunning = false;
  scoreDisplayElement.textContent = score;
  gameOverElement.style.display = 'block';
}

function restartGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  
  score = 0;
  updateScore();
  gameRunning = true;
  
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  
  gameOverElement.style.display = 'none';
  requestAnimationFrame(loop);
}

function loop() {
  if (!gameRunning) {
    return;
  }
  
  requestAnimationFrame(loop);

  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      updateScore();
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        return;
      }
    }
  });
}

// --- Event Listeners for Controls ---

// Keyboard controls
document.addEventListener('keydown', function(e) {
  if (!gameRunning) return;

  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Mobile button controls
btnLeft.addEventListener('click', function() {
  if (snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
});

btnUp.addEventListener('click', function() {
  if (snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
});

btnRight.addEventListener('click', function() {
  if (snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
});

btnDown.addEventListener('click', function() {
  if (snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Restart button
restartBtn.addEventListener('click', restartGame);

// --- Initialize Game ---
updateScore();
requestAnimationFrame(loop);