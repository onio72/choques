const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const mass1Slider = document.getElementById('mass1');
const mass2Slider = document.getElementById('mass2');
const speed1Slider = document.getElementById('speed1');

const mass1Value = document.getElementById('mass1Value');
const mass2Value = document.getElementById('mass2Value');
const speed1Value = document.getElementById('speed1Value');

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const slowButton = document.getElementById('slowButton');

const correctAnswers = document.getElementById('correctAnswers');
const progressBar = document.getElementById('progressBar');

let correctAnswerCount = 0;
let currentQuestion = 1;
const totalQuestions = 10;

let mass1 = parseInt(mass1Slider.value);
let mass2 = parseInt(mass2Slider.value);
let speed1 = parseInt(speed1Slider.value);

let radius1 = 20 + (mass1 * 3);
let radius2 = 20 + (mass2 * 3);

let x1 = 100;
let x2 = 500;

let v1 = speed1;
let v2 = 0;
let collided = false;

let animationId;
let paused = false;
let slowMotion = false;

mass1Slider.oninput = () => {
  mass1 = parseInt(mass1Slider.value);
  mass1Value.textContent = mass1;
  radius1 = 20 + (mass1 * 3);
  draw();
};

mass2Slider.oninput = () => {
  mass2 = parseInt(mass2Slider.value);
  mass2Value.textContent = mass2;
  radius2 = 20 + (mass2 * 3);
  draw();
};

speed1Slider.oninput = () => {
  speed1 = parseInt(speed1Slider.value);
  speed1Value.textContent = speed1;
  v1 = speed1;
  draw();
};

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (let x = 0; x <= canvas.width; x += 20) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y <= canvas.height; y += 20) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.strokeStyle = '#ddd';
  ctx.stroke();
}

function drawBalls() {
  ctx.beginPath();
  ctx.arc(x1, canvas.height / 2, radius1, 0, Math.PI * 2);
  ctx.fillStyle = 'blue';
  ctx.fill();
  ctx.stroke();
  ctx.font = '16px Arial';
  ctx.fillText(`v=${v1.toFixed(2)} m/s`, x1 - 10, canvas.height / 2 - radius1 - 10);

  ctx.beginPath();
  ctx.arc(x2, canvas.height / 2, radius2, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.stroke();
  ctx.font = '16px Arial';
  ctx.fillText(`v=${v2.toFixed(2)} m/s`, x2 - 10, canvas.height / 2 - radius2 - 10);
}

function draw() {
  drawGrid();
  drawBalls();
}

function updatePositions() {
  if (!collided && x1 + radius1 >= x2 - radius2) {
    const vFinal = (mass1 * v1 + mass2 * v2) / (mass1 + mass2);
    v1 = v2 = vFinal;
    collided = true;
    x1 = x2 - radius1 - radius2; // Coloca las bolas juntas
  }

  if (!collided) {
    x1 += v1;
  } else {
    x1 += v1;
    x2 = x1 + radius1 + radius2;
  }

  // Si las bolas han salido del borde derecho, detener la animación
  if (x1 - radius1 > canvas.width && x2 - radius2 > canvas.width) {
    paused = true;
    cancelAnimationFrame(animationId);
  }
}

function animate() {
  if (!paused) {
    updatePositions();
    draw();
    if (slowMotion) {
      setTimeout(() => {
        animationId = requestAnimationFrame(animate);
      }, 100);
    } else {
      animationId = requestAnimationFrame(animate);
    }
  }
}

startButton.onclick = () => {
  paused = false;
  slowMotion = false;
  draw(); // Asegura que las bolas se dibujen al iniciar
  animate();
};

pauseButton.onclick = () => {
  paused = true;
  cancelAnimationFrame(animationId);
};

resetButton.onclick = () => {
  paused = true;
  cancelAnimationFrame(animationId);
  x1 = 100;
  x2 = 500;
  v1 = speed1;
  v2 = 0;
  collided = false;
  draw();
};

slowButton.onclick = () => {
  paused = false;
  slowMotion = true;
  animate();
};

// Preguntas y respuestas

function checkAnswer(questionNumber, correctAnswer) {
  const answerInput = document.getElementById(`answer${questionNumber}`);
  const feedback = document.getElementById(`feedback${questionNumber}`);
  const userAnswer = questionNumber <= 4 ? parseFloat(answerInput.value) : answerInput.value.trim().toLowerCase();

  if (userAnswer === correctAnswer || userAnswer === String(correctAnswer).toLowerCase()) {
    feedback.textContent = 'Correcto!';
    correctAnswerCount++;
    correctAnswers.textContent = correctAnswerCount;
    showNextQuestion();
  } else {
    let hint = '';
    if (questionNumber === 1 || questionNumber === 2) {
      hint = ' Para calcular el momento lineal debes multiplicar la masa por la velocidad.';
    }
    feedback.textContent = `Incorrecto.${hint}`;
  }
}

function showNextQuestion() {
  const currentQuestionElement = document.getElementById(`question${currentQuestion}`);
  currentQuestionElement.style.display = 'none';
  currentQuestion++;
  updateProgressBar();
  if (currentQuestion <= totalQuestions) {
    const nextQuestionElement = document.getElementById(`question${currentQuestion}`);
    nextQuestionElement.style.display = 'block';
  }
}

function updateProgressBar() {
  const progress = (currentQuestion - 1) / totalQuestions * 100;
  progressBar.style.width = progress + '%';
}

submitAnswer1.onclick = () => checkAnswer(1, mass1 * v1);
submitAnswer2.onclick = () => checkAnswer(2, 0); // La bola roja tiene velocidad 0 antes de la colisión
submitAnswer3.onclick = () => checkAnswer(3, mass1 * v1);
submitAnswer4.onclick = () => checkAnswer(4, (mass1 + mass2) * v1);
submitAnswer5.onclick = () => checkAnswer(5, 'sí');
submitAnswer6.onclick = () => checkAnswer(6, 0.5 * mass1 * Math.pow(v1, 2));
submitAnswer7.onclick = () => checkAnswer(7, 0); // La bola roja tiene velocidad 0 antes de la colisión
submitAnswer8.onclick = () => checkAnswer(8, 0.5 * mass1 * Math.pow(v1, 2));
submitAnswer9.onclick = () => checkAnswer(9, 0.5 * (mass1 + mass2) * Math.pow(v1, 2));
submitAnswer10.onclick = () => checkAnswer(10, 'no');

draw();
