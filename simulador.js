const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const mass1Slider = document.getElementById('mass1');
const mass2Slider = document.getElementById('mass2');
const mass1Value = document.getElementById('mass1Value');
const mass2Value = document.getElementById('mass2Value');

const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

let mass1 = parseInt(mass1Slider.value);
let mass2 = parseInt(mass2Slider.value);

let radius1 = 20 + (mass1 * 3);
let radius2 = 20 + (mass2 * 3);

let x1 = 100;
let x2 = 500;

let v1 = 2;
let v2 = 0;

let animationId;
let paused = false;

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
  ctx.fillText(`v=${v1.toFixed(2)}`, x1 - 10, canvas.height / 2 - radius1 - 10);

  ctx.beginPath();
  ctx.arc(x2, canvas.height / 2, radius2, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.stroke();
  ctx.fillText(`v=${v2.toFixed(2)}`, x2 - 10, canvas.height / 2 - radius2 - 10);
}

function draw() {
  drawGrid();
  drawBalls();
}

function updatePositions() {
  if (x1 + radius1 >= x2 - radius2) {
    const v1Final = ((mass1 - mass2) / (mass1 + mass2)) * v1 + ((2 * mass2) / (mass1 + mass2)) * v2;
    const v2Final = ((2 * mass1) / (mass1 + mass2)) * v1 + ((mass2 - mass1) / (mass1 + mass2)) * v2;
    v1 = v1Final;
    v2 = v2Final;
  }
  
  x1 += v1;
  x2 += v2;

  if (x1 - radius1 < 0 || x1 + radius1 > canvas.width) {
    v1 = -v1;
  }
  if (x2 - radius2 < 0 || x2 + radius2 > canvas.width) {
    v2 = -v2;
  }
}

function animate() {
  if (!paused) {
    updatePositions();
    draw();
    animationId = requestAnimationFrame(animate);
  }
}

startButton.onclick = () => {
  paused = false;
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
  v1 = 2;
  v2 = 0;
  draw();
};

draw();
