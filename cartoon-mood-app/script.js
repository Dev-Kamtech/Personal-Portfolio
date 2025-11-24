// ===== DRAGGABLE FLOATING OBJECTS =====
function createFloatingObjects() {
    const container = document.getElementById('floatingContainer');
    const cuteEmojis = ['🌈', '☁️', '🦄', '🌸', '🍭', '🎈', '🌟', '💫', '🍰', '🎀', '🦋', '🌺'];
    const count = 15;

    for (let i = 0; i < count; i++) {
        const emoji = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];
        const obj = document.createElement('div');
        obj.classList.add('floating-object');
        obj.textContent = emoji;

        obj.style.left = Math.random() * 90 + 5 + '%';
        obj.style.top = Math.random() * 90 + 5 + '%';
        obj.style.animationDelay = Math.random() * 5 + 's';
        obj.style.animationDuration = (Math.random() * 4 + 6) + 's';

        makeDraggable(obj);
        container.appendChild(obj);
    }
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;

    element.addEventListener('mousedown', dragMouseDown);
    element.addEventListener('touchstart', dragTouchStart, { passive: false });

    function dragMouseDown(e) {
        e.preventDefault();
        isDragging = true;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.classList.add('dragging');
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
    }

    function dragTouchStart(e) {
        e.preventDefault();
        isDragging = true;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        element.classList.add('dragging');
        document.addEventListener('touchmove', elementTouchDrag, { passive: false });
        document.addEventListener('touchend', closeDragElement);
    }

    function elementDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function elementTouchDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        pos1 = pos3 - e.touches[0].clientX;
        pos2 = pos4 - e.touches[0].clientY;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        isDragging = false;
        element.classList.remove('dragging');
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('touchmove', elementTouchDrag);
        document.removeEventListener('touchend', closeDragElement);
    }
}

// ===== SPARKLES ANIMATION =====
function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💖', '💕'];

    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 1 + 1.5) + 's';

        container.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 2500);
    }, 500);
}

// ===== BUBBLES ANIMATION =====
function createBubbles() {
    const container = document.getElementById('bubblesContainer');

    setInterval(() => {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.width = (Math.random() * 30 + 20) + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.animationDuration = (Math.random() * 4 + 6) + 's';
        bubble.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(bubble);

        setTimeout(() => {
            bubble.remove();
        }, 10000);
    }, 800);
}

// ===== INTERACTIVE BUTTONS =====
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Create confetti effect
        createConfetti(btn);

        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    });
});

// ===== CONFETTI EFFECT =====
function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const confettiCount = 30;
    const confettiEmojis = ['🎉', '🎊', '✨', '🌟', '💖', '🎈', '🌈'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = rect.left + rect.width / 2 + 'px';
        confetti.style.top = rect.top + rect.height / 2 + 'px';
        confetti.style.fontSize = '1.5rem';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

        document.body.appendChild(confetti);

        const angle = (Math.PI * 2 * i) / confettiCount;
        const velocity = Math.random() * 200 + 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 100;

        animateConfetti(confetti, vx, vy);
    }
}

function animateConfetti(element, vx, vy) {
    let x = 0;
    let y = 0;
    let opacity = 1;
    const gravity = 5;
    let rotation = 0;

    function update() {
        vy += gravity;
        x += vx * 0.016;
        y += vy * 0.016;
        opacity -= 0.02;
        rotation += 10;

        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        element.style.opacity = opacity;

        if (opacity > 0) {
            requestAnimationFrame(update);
        } else {
            element.remove();
        }
    }

    update();
}

// ===== CARD HOVER EFFECTS =====
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const character = card.querySelector('.card-character');
        character.style.transform = 'scale(1.2) rotate(10deg)';
    });

    card.addEventListener('mouseleave', () => {
        const character = card.querySelector('.card-character');
        character.style.transform = '';
    });

    // Add click animation
    card.addEventListener('click', () => {
        createMiniSparkles(card);
    });
});

// ===== MINI SPARKLES ON CARD CLICK =====
function createMiniSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkles = ['✨', '💫', '⭐', '🌟'];

    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
        sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
        sparkle.style.fontSize = '2rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];

        document.body.appendChild(sparkle);

        let opacity = 1;
        let y = 0;
        let scale = 1;

        function animate() {
            opacity -= 0.02;
            y -= 2;
            scale += 0.02;

            sparkle.style.transform = `translateY(${y}px) scale(${scale})`;
            sparkle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                sparkle.remove();
            }
        }

        setTimeout(() => animate(), i * 100);
    }
}

// ===== FEATURE ITEMS ANIMATION =====
const featureItems = document.querySelectorAll('.feature-item');
featureItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('.feature-icon');
        icon.style.transform = 'scale(1.3) rotate(15deg)';
    });

    item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('.feature-icon');
        icon.style.transform = '';
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all major sections
document.querySelectorAll('.features, .cta-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

// ===== INITIALIZE ON PAGE LOAD =====
window.addEventListener('load', () => {
    createFloatingObjects();
    createSparkles();
    createBubbles();

    // Add rainbow effect on logo
    const logo = document.querySelector('.logo-text');
    if (logo) {
        setInterval(() => {
            logo.style.backgroundPosition = Math.random() * 100 + '% center';
        }, 3000);
    }
});

// ===== CURSOR TRAIL EFFECT =====
let cursorTrail = [];
const maxTrailLength = 15;

document.addEventListener('mousemove', (e) => {
    // Create trail dot
    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '50%';
    dot.style.background = `linear-gradient(135deg, #FF9ECD, #4DD0E1, #FFD54F)`;
    dot.style.pointerEvents = 'none';
    dot.style.zIndex = '9998';
    dot.style.transition = 'all 0.3s ease';

    document.body.appendChild(dot);
    cursorTrail.push(dot);

    if (cursorTrail.length > maxTrailLength) {
        const oldDot = cursorTrail.shift();
        oldDot.remove();
    }

    // Fade out and shrink
    setTimeout(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
    }, 100);

    setTimeout(() => {
        dot.remove();
    }, 400);
});

// ===== RANDOM EMOJI RAIN (OCCASIONAL) =====
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance every interval
        createEmojiRain();
    }
}, 10000);

function createEmojiRain() {
    const emojis = ['🌈', '✨', '💖', '🌸', '🦋', '🌟'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const rain = document.createElement('div');
    rain.style.position = 'fixed';
    rain.style.left = Math.random() * 100 + '%';
    rain.style.top = '-50px';
    rain.style.fontSize = '2rem';
    rain.style.pointerEvents = 'none';
    rain.style.zIndex = '1';
    rain.textContent = emoji;

    document.body.appendChild(rain);

    let y = -50;
    let rotation = 0;

    function fall() {
        y += 3;
        rotation += 5;

        rain.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;

        if (y < window.innerHeight + 50) {
            requestAnimationFrame(fall);
        } else {
            rain.remove();
        }
    }

    fall();
}