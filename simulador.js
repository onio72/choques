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

const question1 = document.getElementById('question1');
const answer1 = document.getElementById('answer1');
const submitAnswer1 = document.getElementById('submitAnswer1');
const feedback1 = document.getElementById('feedback1');

const question2 = document.getElementById('question2');
const answer2 = document.getElementById('answer2');
const submitAnswer2 = document.getElementById('submitAnswer2');
const feedback2 = document.getElementById('feedback2');

const correctAnswers = document.getElementById('correctAnswers');

let correctAnswerCount = 0;

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
    x1 = x2 - radius1 - radius2; // Coloca las bolas junta
