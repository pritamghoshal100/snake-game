const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const scoreDisplayElement = document.getElementById('scoreDisplay');
const restartBtn = document.getElementById('restartBtn');

// The canvas width & height, snake x & y, and the apple x & y, all need to be a multiple of the grid size for collision detection to work
const grid = 16;
let count = 0;
let score = 0;
let gameRunning = true;

let snake = {
  x: 160,
  y: 160,
  // snake velocity: moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,
  // keep track of all grids the snake body occupies
  cells: [],
  // length of the snake; grows when eating an apple
  maxCells: 4
};

let apple = {
  x: 320,
  y: 320
};

// get random whole numbers in a specific range
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
  // Reset game state
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  
  score = 0;
  updateScore();
  gameRunning = true;
  
  // Generate new apple position
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  
  gameOverElement.style.display = 'none';
  requestAnimationFrame(loop); // Restart the game loop
}

// game loop
function loop() {
  if (!gameRunning) {
    return;
  }
  
  requestAnimationFrame(loop);

  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move snake by its velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    // drawing 1 px smaller than the grid creates a grid effect
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      updateScore();

      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // check collision with all cells after this one
    for (let i = index + 1; i < snake.cells.length; i++) {
      // snake occupies same space as a body part. game over!
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver();
        return;
      }
    }
  });
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
  if (!gameRunning) {
    return;
  }

  // prevent snake from backtracking on itself
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

// listen for click on restart button
restartBtn.addEventListener('click', restartGame);

// Initialize score display
updateScore();

// start the game
requestAnimationFrame(loop);