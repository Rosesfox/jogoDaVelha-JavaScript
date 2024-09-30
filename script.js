const cells = document.querySelectorAll(".cell");
const resultDisplay = document.getElementById("result");
const reiniciarBtn = document.getElementById("reiniciar");
const xWinsDisplay = document.getElementById("x-wins");
const oWinsDisplay = document.getElementById("o-wins");
const drawsDisplay = document.getElementById("draws");
const timerDisplay = document.getElementById("timer");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];
let xWins = 0;
let oWins = 0;
let draws = 0;
let timer;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function startTimer() {
  let timeLeft = 20;
  timerDisplay.textContent = `Tempo: ${timeLeft}s`;
  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Tempo: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      resultDisplay.textContent = `Jogador ${currentPlayer} não jogou a tempo!`;
      gameActive = false;
      setTimeout(resetGame, 2000);
    }
  }, 1000);
}

function handleCellClick(e) {
  const cell = e.target;
  const cellIndex = cell.getAttribute("data-index");

  if (board[cellIndex] !== "" || !gameActive) return;

  board[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "player-x" : "player-o");

  checkResult();
  switchPlayer();
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  startTimer();
}

function checkResult() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    clearInterval(timer);
    resultDisplay.textContent = `Jogador ${currentPlayer} venceu!`;
    launchConfetti();
    gameActive = false;
    updateWins();
    setTimeout(resetGame, 2000);
    return;
  }

  if (!board.includes("")) {
    clearInterval(timer);
    resultDisplay.textContent = "Empate!";
    draws++;
    drawsDisplay.textContent = draws;
    gameActive = false;
    setTimeout(resetGame, 2000);
    return;
  }
}

function updateWins() {
  if (currentPlayer === "X") {
    xWins++;
    xWinsDisplay.textContent = xWins;
  } else {
    oWins++;
    oWinsDisplay.textContent = oWins;
  }
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  board = ["", "", "", "", "", "", "", "", ""];
  resultDisplay.textContent = "";
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("player-x", "player-o");
  });
  timerDisplay.textContent = "";
  clearInterval(timer);
}

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

reiniciarBtn.addEventListener("click", () => {
  xWins = 0;
  oWins = 0;
  draws = 0;
  drawsDisplay.textContent = draws;
  xWinsDisplay.textContent = xWins;
  oWinsDisplay.textContent = oWins;
  resetGame();
});

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
