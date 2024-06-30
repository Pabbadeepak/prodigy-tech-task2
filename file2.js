let timer;
let running = false;
let elapsedTime = 0;
let startTime = 0;

const display = document.getElementById('display');
const startStopButton = document.getElementById('startStop');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');
const laps = document.getElementById('laps');
const clock = document.getElementById('clock');
const analogClock = document.getElementById('analogClock');
const ctx = analogClock.getContext('2d');

startStopButton.addEventListener('click', () => {
    if (running) {
        clearInterval(timer);
        startStopButton.textContent = 'Start';
    } else {
        startTime = Date.now();
        timer = setInterval(updateDisplay, 10);
        startStopButton.textContent = 'Stop';
    }
    running = !running;
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    running = false;
    elapsedTime = 0;
    startTime = 0;
    startStopButton.textContent = 'Start';
    display.textContent = '00:00:00'; // Reset display time to 00:00:00
    laps.innerHTML = '';
});

lapButton.addEventListener('click', () => {
    if (running) {
        const lapTime = formatTime(elapsedTime);
        const li = document.createElement('li');
        li.textContent = lapTime;
        laps.appendChild(li);
    }
});

function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    display.textContent = formatTime(elapsedTime);
}

function formatTime(time) {
    const date = new Date(time);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    clock.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    drawAnalogClock(hours, minutes, seconds);
}

function drawAnalogClock(hours, minutes, seconds) {
    ctx.clearRect(0, 0, analogClock.width, analogClock.height);

    const centerX = analogClock.width / 2;
    const centerY = analogClock.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000';
    ctx.stroke();

    ctx.font = `${radius * 0.15}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    for (let num = 1; num <= 12; num++) {
        const ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), centerX, centerY);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }

    let hour = hours % 12;
    hour = (hour * Math.PI / 6) + (minutes * Math.PI / (6 * 60)) + (seconds * Math.PI / (360 * 60));
    drawHand(ctx, centerX, centerY, hour, radius * 0.5, 6);


    const minute = (minutes * Math.PI / 30) + (seconds * Math.PI / (30 * 60));
    drawHand(ctx, centerX, centerY, minute, radius * 0.8, 4);


    const second = (seconds * Math.PI / 30);
    drawHand(ctx, centerX, centerY, second, radius * 0.9, 2, '#f00');
}

function drawHand(ctx, posX, posY, pos, length, width, color = '#000') {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.moveTo(posX, posY);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

updateClock();
setInterval(updateClock, 1000);