let gameOver = document.getElementById('gameover-screen')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let rows = 20
let cols = 20
let snake = [{ x: 19, y: 3 }]

let isPaused = false

let food

let cellWidth = canvas.width / cols
let cellHeight = canvas.height / rows
let direction = 'LEFT'
let foodCollected = false
placeFood()

let highscore = localStorage.getItem('highscore')

let myInterval = setInterval(gameLoop, 200)
document.addEventListener('keydown', keyDown)
document.addEventListener('keydown', pauseGame)

draw()

function draw() {
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  //Hier wird die schlange gemalt.
  ctx.fillStyle = 'lime'
  add(snake[0].x, snake[0].y)

  restlicheschlange = snake.slice(1)

  ctx.fillStyle = 'white'
  restlicheschlange.forEach((part) => add(part.x, part.y))

  ctx.fillStyle = 'yellow'
  add(food.x, food.y) // Food

  requestAnimationFrame(draw)
}

function testGameOver() {
  let firstPart = snake[0]
  let otherParts = snake.slice(1)
  let duplicatePart = otherParts.find(
    (part) => part.x == firstPart.x && part.y == firstPart.y
  )

  // 1. Schlange läuft gegen die Wand
  if (
    // snake[0].x < 0 ||
    // snake[0].x > cols - 1 ||
    // snake[0].y < 0 ||
    // snake[0].y > rows - 1 ||
    duplicatePart
  ) {
    // placeFood()
    // snake = [{ x: 19, y: 3 }]
    // direction = 'LEFT'
    gameOverScreen()
  }
}

function gameOverScreen() {
  canvas.style.display = 'none'
  gameOver.style.display = 'block'
  document.addEventListener('keydown', restartGame)
  if (snake.length > highscore) {
    localStorage.setItem('highscore', snake.length)
    highscore = localStorage.getItem('highscore')
    showHighscore()
  }
}

function restartGame() {
  canvas.style.display = 'block'
  gameOver.style.display = 'none'
  placeFood()
  snake = [{ x: 19, y: 3 }]
  direction = 'LEFT'
  document.removeEventListener('keydown', restartGame)
  document.getElementById('score').innerHTML = 'Score: 1'
  document.getElementById('field-size').innerHTML = 'playing field size: 39'
}

function startGame() {
  if (isPaused) {
    myInterval = setInterval(gameLoop, 200)
    isPaused = false
  }
  canvas.style.display = 'block'
  gameOver.style.display = 'none'
  start.style.display = 'none'
  placeFood()
  snake = [{ x: 19, y: 3 }]
  direction = 'LEFT'
  document.getElementById('score').style.display = 'block'
  document.getElementById('field-size').style.display = 'block'
}

function pauseGame(e) {
  if (e.keyCode == 27 && start.style.display === 'none') {
    clearInterval(myInterval)
    isPaused = true
    start.style.opacity = 0.7
    // canvas.style.display = 'none'
    gameOver.style.display = 'none'
    start.style.display = 'block'
    start.style.boxShadow = 'none'
    document.getElementById('continue').classList.add('visible')
  }
}

function continueGame() {
  canvas.style.display = 'block'
  gameOver.style.display = 'none'
  start.style.display = 'none'
  myInterval = setInterval(gameLoop, 200)
}

function scoreBoard() {
  let fieldSize = rows + cols - snake.length
  document.getElementById('score').innerHTML = 'Score: ' + snake.length
  document.getElementById('field-size').innerHTML =
    'playing field size: ' + fieldSize
}

function startScoreboard() {
  document.getElementById('score').style.display = 'none'
  document.getElementById('field-size').style.display = 'none'
  document.getElementById('score-board').style.textAlign = 'center'
}

function showHighscore() {
  if (highscore === null) {
    document.getElementById('highscore').innerHTML = 'Highscore: ' + 0
  } else {
    document.getElementById('highscore').innerHTML = 'Highscore: ' + highscore
  }
}

function setHighscore() {
  if (highscore === null) {
    localStorage.setItem('highscore', 0)
  }
}

function goThroughWall() {
  if (snake[0].x > cols - 1) {
    snake[0].x = 0
  }
  if (snake[0].x < 0) {
    snake[0].x = cols - 1
  }
  if (snake[0].y < 0) {
    snake[0].y = rows - 1
  }
  if (snake[0].y > rows - 1) {
    snake[0].y = 0
  }
}

function placeFood() {
  let randomX = Math.floor(Math.random() * cols)
  let randomY = Math.floor(Math.random() * rows)

  food = { x: randomX, y: randomY }

  for (const item of snake) {
    const newItem = { x: 2, y: 0 }
    console.log(item, JSON.stringify(item) == JSON.stringify(newItem))
  }
}

function add(x, y) {
  ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1)
}

function shiftSnake() {
  for (let i = snake.length - 1; i > 0; i--) {
    const part = snake[i]
    const lastPart = snake[i - 1]
    part.x = lastPart.x
    part.y = lastPart.y
  }
}

function gameLoop() {
  testGameOver()
  goThroughWall()
  if (foodCollected) {
    snake[snake.length] = { x: snake[0].x, y: snake[0].y }
    scoreBoard()
    foodCollected = false
  }

  shiftSnake()

  if (direction == 'LEFT') {
    snake[0].x--
  }

  if (direction == 'RIGHT') {
    snake[0].x++
  }

  if (direction == 'UP') {
    snake[0].y--
  }

  if (direction == 'DOWN') {
    snake[0].y++
  }

  if (snake[0].x == food.x && snake[0].y == food.y) {
    foodCollected = true
    placeFood()
  }
}

function keyDown(e) {
  if ((e.keyCode == 37 || e.keyCode == 65) && direction != 'RIGHT') {
    direction = 'LEFT'
  }
  if ((e.keyCode == 38 || e.keyCode == 87) && direction != 'DOWN') {
    direction = 'UP'
  }
  if ((e.keyCode == 39 || e.keyCode == 68) && direction != 'LEFT') {
    direction = 'RIGHT'
  }
  if ((e.keyCode == 40 || e.keyCode == 83) && direction != 'UP') {
    direction = 'DOWN'
  }
}
