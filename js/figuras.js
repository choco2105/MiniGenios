const referenceShape = document.getElementById("reference-shape");
const shapeGrid = document.getElementById("shape-grid");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.querySelector(".lives");
const timerDisplay = document.getElementById("time");

let score = 0;
let lives = 3;
let level = 1;
let timeLeft = 30;
let timerInterval;

const shapes = {
    "●": ["🌑", "🌞", "⚽", "🏀", "🎱", "🌎"],
    "▲": ["▶", "🔺", "⛺", "🎪", "🍕"],
    "■": ["🚪", "📦", "🖼", "🛏", "🧱"],
    "◆": ["♦", "🪁", "💎", "🕹"]
};

const levels = [
    { gridSize: 3 },
    { gridSize: 4 },
    { gridSize: 5 },
    { gridSize: 6 },
    { gridSize: 7 }
];

function selectRandomShape() {
    const shapeKeys = Object.keys(shapes);
    const shapeIndex = Math.floor(Math.random() * shapeKeys.length);
    const selectedShape = shapeKeys[shapeIndex];
    const relatedShapes = shapes[selectedShape];
    return { selectedShape, relatedShapes };
}

function generateShapes() {
    const { gridSize } = levels[Math.min(level - 1, levels.length - 1)];
    const totalShapes = gridSize * gridSize;

    const { selectedShape, relatedShapes } = selectRandomShape();
    referenceShape.textContent = selectedShape;

    shapeGrid.innerHTML = "";
    shapeGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const correctCount = Math.floor(totalShapes * 0.3); // 30% correct shapes
    let correctAdded = 0;

    for (let i = 0; i < totalShapes; i++) {
        const shape = document.createElement("div");

        const isCorrect = correctAdded < correctCount && Math.random() < 0.5;
        let randomShape;

        if (isCorrect) {
            randomShape =
                relatedShapes[Math.floor(Math.random() * relatedShapes.length)];
            correctAdded++;
        } else {
            // Randomly pick a shape from all unrelated shapes
            const unrelatedShapes = Object.keys(shapes).flatMap(
                (key) => key !== selectedShape && shapes[key]
            );

            do {
                randomShape =
                    unrelatedShapes[
                        Math.floor(Math.random() * unrelatedShapes.length)
                    ];
            } while (!randomShape); // Ensure randomShape is valid
        }

        shape.textContent = randomShape || "❓"; // Fallback to "❓" if undefined
        shape.classList.add("shape");
        shape.addEventListener("click", () =>
            handleShapeClick(shape, randomShape, relatedShapes)
        );

        shapeGrid.appendChild(shape);
    }
}

function handleShapeClick(shape, clickedShape, relatedShapes) {
    if (relatedShapes.includes(clickedShape)) {
        score++;
        scoreDisplay.textContent = score;
        shape.style.visibility = "hidden";

        const remainingCorrect = [...shapeGrid.children].filter(
            (child) =>
                relatedShapes.includes(child.textContent) &&
                child.style.visibility !== "hidden"
        );

        if (remainingCorrect.length === 0) {
            levelUp();
        }
    } else {
        lives--;
        updateLives();
    }
}

function levelUp() {
    level++;
    timeLeft = 30;
    if (level > levels.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
            window.location.href = "../juegos/win.html";
        }, 3000);
    } else {
        generateShapes();
    }
}

function updateLives() {
    livesDisplay.textContent = "❤️".repeat(lives);
    if (lives === 0) {
        clearInterval(timerInterval);
        setTimeout(() => {
            window.location.href = "../juegos/lose.html";
        }, 3000);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            lives--;
            updateLives();
            if (lives > 0) {
                timeLeft = 30;
                generateShapes();
            } else {
                clearInterval(timerInterval);
                setTimeout(() => {
                    window.location.href = "../juegos/lose.html";
                }, 3000);
            }
        }
    }, 1000);
}

generateShapes();
startTimer();
