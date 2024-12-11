// Configuración inicial
const objectGrid = document.getElementById("object-grid");
const options = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.querySelector(".lives");
const timerDisplay = document.getElementById("time");

let score = 0;
let lives = 3;
let level = 1;
let timeLeft = 30;
let timerInterval;

// Array de emojis de objetos
const objects = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍍", "🍑", "🍒", "🥝", "🍐", "🍋"];
let currentObject = "";

// Configuración de niveles
const levels = [
    { maxObjects: 5 },  // Nivel 1
    { maxObjects: 7 },  // Nivel 2
    { maxObjects: 10 }, // Nivel 3
    { maxObjects: 15 }, // Nivel 4
    { maxObjects: 20 }, // Nivel 5
    { maxObjects: 25 }, // Nivel 6
    { maxObjects: 30 }, // Nivel 7
];

// Seleccionar un objeto al azar, asegurando que no se repita consecutivamente
function selectRandomObject() {
    let newObject;
    do {
        const randomIndex = Math.floor(Math.random() * objects.length);
        newObject = objects[randomIndex];
    } while (newObject === currentObject); // Evitar que el mismo objeto se repita consecutivamente
    currentObject = newObject;
}

// Generar objetos y opciones
function generateObjects() {
    const { maxObjects } = levels[level - 1];
    const totalObjects = Math.floor(Math.random() * maxObjects) + 1;

    // Cambiar el objeto al inicio de cada nivel
    selectRandomObject();
    objectGrid.innerHTML = "";

    for (let i = 0; i < totalObjects; i++) {
        const obj = document.createElement("div");
        obj.textContent = currentObject;
        objectGrid.appendChild(obj);
    }

    generateOptions(totalObjects);
}

// Generar opciones de respuesta
function generateOptions(correctAnswer) {
    options.innerHTML = "";
    const correctIndex = Math.floor(Math.random() * 3);

    for (let i = 0; i < 3; i++) {
        const btn = document.createElement("button");
        btn.textContent = i === correctIndex ? correctAnswer : Math.floor(Math.random() * 40) + 1;

        // Evitar múltiples clics
        btn.addEventListener("click", () => handleOptionClick(btn, btn.textContent, correctAnswer), {
            once: true, // Solo permite un clic por botón
        });

        options.appendChild(btn);
    }
}

// Manejar clic en una opción
function handleOptionClick(button, selected, correctAnswer) {
    // Desactivar todos los botones inmediatamente tras la selección
    Array.from(options.children).forEach((btn) => (btn.disabled = true));

    if (parseInt(selected) === correctAnswer) {
        score++;
        scoreDisplay.textContent = score;
        setTimeout(levelUp, 300); // Reducir tiempo de transición
    } else {
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
        }, 2000);
    }
}

// Avanzar al siguiente nivel
function levelUp() {
    if (level === levels.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            window.location.href = "../juegos/win.html"; // Ruta corregida
        }, 2000);
    } else {
        level++;
        timeLeft = 30; // Reiniciar el temporizador
        generateObjects();
    }
}

// Temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            timeLeft = 30; // Reiniciar el temporizador
            lives--;
            updateLives();
            if (lives > 0) {
                generateObjects();
            } else {
                clearInterval(timerInterval);
                setTimeout(() => {
                    window.location.href = "../juegos/lose.html"; // Ruta corregida
                }, 2000);
            }
        }
    }, 1000);
}

// Iniciar juego
generateObjects();
startTimer();
