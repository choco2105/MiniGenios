// Configuración inicial
const targetLetterDisplay = document.getElementById("target-letter");
const grid = document.getElementById("letter-grid");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.querySelector(".lives");
const timerDisplay = document.getElementById("time");

let score = 0;
let lives = 3;
let level = 1;
let timeLeft = 30;
let timerInterval;

const letters = "abcdefghijklmnopqrstuvwxyz";

// Niveles configurados
const levels = [
    { gridSize: 3, targetCount: 2 }, // Nivel 1
    { gridSize: 4, targetCount: 4 }, // Nivel 2
    { gridSize: 5, targetCount: 6 }, // Nivel 3
    { gridSize: 6, targetCount: 8 }, // Nivel 4
    { gridSize: 7, targetCount: 10 }, // Nivel 5
];

// Generar letras aleatorias
function generateLetters() {
    const { gridSize, targetCount } = levels[level - 1];
    const targetLetter = letters[Math.floor(Math.random() * letters.length)];
    targetLetterDisplay.textContent = targetLetter;

    grid.innerHTML = ""; // Limpiar la cuadrícula
    const totalCells = gridSize * gridSize;
    let targetPlaced = 0;

    for (let i = 0; i < totalCells; i++) {
        const letter = targetPlaced < targetCount && Math.random() < 0.5
            ? targetLetter
            : letters[Math.floor(Math.random() * letters.length)];
        const cell = document.createElement("div");
        cell.textContent = letter;
        cell.addEventListener("click", () => handleLetterClick(cell, letter, targetLetter));
        grid.appendChild(cell);
        if (letter === targetLetter) targetPlaced++;
    }

    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
}

// Manejar clic en una letra
function handleLetterClick(cell, letter, targetLetter) {
    if (letter === targetLetter) {
        cell.classList.add("correct");
        score++;
        scoreDisplay.textContent = score;

        // Verificar si todas las letras objetivo han sido seleccionadas
        const remainingTargets = Array.from(grid.children).some(
            (cell) => cell.textContent === targetLetter && !cell.classList.contains("correct")
        );
        if (!remainingTargets) {
            setTimeout(levelUp, 500); // Transición al siguiente nivel
        }
    } else {
        cell.classList.add("incorrect");
        lives--;
        updateLives();
    }
}

// Actualizar vidas
function updateLives() {
    livesDisplay.textContent = "❤️".repeat(lives);
    if (lives === 0) {
        clearInterval(timerInterval);
        setTimeout(() => {
            window.location.href = "../juegos/lose.html"; // Ruta corregida
        }, 3000);
    }
}

// Niveles
function levelUp() {
    if (level === levels.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            window.location.href = "../juegos/win.html"; // Ruta corregida
        }, 3000);
    } else {
        level++;
        timeLeft = 30; // Reiniciar el temporizador
        generateLetters();
    }
}

// Temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            timeLeft = 30; // Reiniciar el temporizador
            lives--; // Quita una vida
            updateLives();
            if (lives > 0) {
                generateLetters(); // Regenera letras si aún quedan vidas
            } else {
                clearInterval(timerInterval);
                setTimeout(() => {
                    window.location.href = "../juegos/lose.html"; // Ruta corregida
                }, 3000);
            }
        }
    }, 1000);
}

// Iniciar juego
generateLetters();
startTimer();
