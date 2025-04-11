const bloomCanvas = document.getElementById('bloomCanvas');
const bloomCtx = bloomCanvas.getContext('2d');
bloomCanvas.width = window.innerWidth;
bloomCanvas.height = window.innerHeight;

const emojiCanvas = document.getElementById('emojiCanvas');
const emojiCtx = emojiCanvas.getContext('2d');
emojiCanvas.width = window.innerWidth;
emojiCanvas.height = window.innerHeight;

let particles = [];
const particleCount = 200;
const center = { x: bloomCanvas.width / 2, y: bloomCanvas.height / 2 };
const mouse = { x: bloomCanvas.width / 2, y: bloomCanvas.height / 2 };

let emojiIndex = 0;
const emojis = [
    { type: 'sigma' },
    { type: 'smile' },
    { type: 'wink' },
    { type: 'cool' },
];
let emojiTimer = 0;

window.addEventListener('resize', () => {
    bloomCanvas.width = window.innerWidth;
    bloomCanvas.height = window.innerHeight;
    emojiCanvas.width = window.innerWidth;
    emojiCanvas.height = window.innerHeight;
    center.x = bloomCanvas.width / 2;
    center.y = bloomCanvas.height / 2;
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        const angle = Math.random() * Math.PI * 2; 
        const speed = Math.random() * 3 + 1; 
        this.speedX = Math.cos(angle) * speed; 
        this.speedY = Math.sin(angle) * speed; 
        this.hue = Math.random() * 360;
        this.alpha = 1;
        this.trail = [];
    }

    update() {
        this.x += this.speedX + (mouse.x - center.x) * 0.005;
        this.y += this.speedY + (mouse.y - center.y) * 0.005;
        this.alpha -= 0.005;

        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > 20) {
            this.trail.shift();
        }
    }

    draw() {
        bloomCtx.beginPath();
        bloomCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bloomCtx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
        bloomCtx.fill();

        this.trail.forEach((point, index) => {
            bloomCtx.beginPath();
            bloomCtx.arc(point.x, point.y, this.size * (1 - index / this.trail.length), 0, Math.PI * 2);
            bloomCtx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${point.alpha})`;
            bloomCtx.fill();
        });
    }
}

function initBloom() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(center.x, center.y));
    }
}

function animateBloom() {
    bloomCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    bloomCtx.fillRect(0, 0, bloomCanvas.width, bloomCanvas.height);

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.alpha <= 0) {
            particles.splice(index, 1);
            particles.push(new Particle(center.x, center.y));
        }
    });

    requestAnimationFrame(animateBloom);
}

function drawEmoji(emojiType) {
    emojiCtx.clearRect(0, 0, emojiCanvas.width, emojiCanvas.height);

    const centerX = emojiCanvas.width / 2;
    const centerY = emojiCanvas.height / 2;

    emojiCtx.fillStyle = 'yellow';
    emojiCtx.beginPath();
    emojiCtx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    emojiCtx.fill();
    emojiCtx.stroke();

    emojiCtx.fillStyle = 'black';

    if (emojiType === 'sigma') {
        emojiCtx.beginPath();
        emojiCtx.arc(centerX - 30, centerY - 30, 10, 0, Math.PI * 2);
        emojiCtx.fill();
        emojiCtx.beginPath();
        emojiCtx.arc(centerX + 30, centerY - 30, 10, 0, Math.PI * 2);
        emojiCtx.fill();
        emojiCtx.beginPath();
        emojiCtx.moveTo(centerX - 50, centerY + 20);
        emojiCtx.quadraticCurveTo(centerX, centerY + 50, centerX + 50, centerY + 20);
        emojiCtx.stroke();

    } else if (emojiType === 'smile') {
        emojiCtx.beginPath();
        emojiCtx.arc(centerX - 30, centerY - 30, 10, 0, Math.PI * 2);
        emojiCtx.fill();
        emojiCtx.beginPath();
        emojiCtx.arc(centerX + 30, centerY - 30, 10, 0, Math.PI * 2);
        emojiCtx.fill();
        emojiCtx.beginPath();
        emojiCtx.arc(centerX, centerY + 20, 50, 0, Math.PI);
        emojiCtx.stroke();
    } else if (emojiType === 'wink'){
        emojiCtx.beginPath();
        emojiCtx.arc(centerX - 30, centerY - 30, 10, 0, Math.PI * 2);
        emojiCtx.fill();
        emojiCtx.fillRect(centerX + 20, centerY - 35, 20, 5);
        emojiCtx.beginPath();
        emojiCtx.arc(centerX, centerY + 20, 50, 0, Math.PI);
        emojiCtx.stroke();
    } else if (emojiType === 'cool') {
        emojiCtx.beginPath();
        emojiCtx.fillRect(centerX - 40, centerY - 35, 20, 5);
        emojiCtx.fillRect(centerX + 20, centerY - 35, 20, 5);
        emojiCtx.beginPath();
        emojiCtx.arc(centerX, centerY + 20, 50, 0, Math.PI);
        emojiCtx.stroke();
    }
}

function animateEmoji() {
    emojiTimer++;
    if (emojiTimer > 10) { 
        emojiIndex = (emojiIndex + 1) % emojis.length;
        emojiTimer = 0;
    }

    drawEmoji(emojis[emojiIndex].type);
    requestAnimationFrame(animateEmoji);
}

initBloom();
animateBloom();
animateEmoji();