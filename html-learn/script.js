// ===== FLOATING OBJECTS =====
function createFloatingObjects() {
    const container = document.getElementById('floatingContainer');
    const emojis = ['🌐', '📝', '🔗', '✨', '🎨', '💻', '🏗️', '📋', '🌟', '⭐'];

    for (let i = 0; i < 6; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const obj = document.createElement('div');
        obj.classList.add('floating-object');
        obj.textContent = emoji;

        obj.style.left = Math.random() * 90 + 5 + '%';
        obj.style.top = Math.random() * 90 + 5 + '%';
        obj.style.animationDelay = Math.random() * 5 + 's';
        obj.style.animationDuration = (Math.random() * 5 + 7) + 's';

        makeDraggable(obj);
        container.appendChild(obj);
    }
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.addEventListener('mousedown', dragMouseDown);
    element.addEventListener('touchstart', dragTouchStart, { passive: false });

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.classList.add('dragging');
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
    }

    function dragTouchStart(e) {
        e.preventDefault();
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        element.classList.add('dragging');
        document.addEventListener('touchmove', elementTouchDrag, { passive: false });
        document.addEventListener('touchend', closeDragElement);
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function elementTouchDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.touches[0].clientX;
        pos2 = pos4 - e.touches[0].clientY;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        element.classList.remove('dragging');
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('touchmove', elementTouchDrag);
        document.removeEventListener('touchend', closeDragElement);
    }
}

// ===== SPARKLES =====
function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    const sparkles = ['✨', '⭐', '💫', '🌟'];

    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];

        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';

        container.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 2500);
    }, 600);
}

// ===== DEMO BUTTON INTERACTION =====
const demoButton = document.querySelector('.demo-btn');
if (demoButton) {
    demoButton.addEventListener('click', () => {
        // Create confetti
        createConfetti(demoButton);

        // Change text temporarily
        const originalText = demoButton.textContent;
        demoButton.textContent = '🎉 Awesome!';

        setTimeout(() => {
            demoButton.textContent = originalText;
        }, 2000);
    });
}

// ===== CONFETTI =====
function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const confettiEmojis = ['🎉', '✨', '💚', '🌐', '⭐', '💫'];

    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = rect.left + rect.width / 2 + 'px';
        confetti.style.top = rect.top + rect.height / 2 + 'px';
        confetti.style.fontSize = '1.5rem';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

        document.body.appendChild(confetti);

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = Math.random() * 150 + 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 100;

        animateConfetti(confetti, vx, vy);
    }
}

function animateConfetti(element, vx, vy) {
    let x = 0, y = 0, opacity = 1, rotation = 0;
    const gravity = 4;

    function update() {
        vy += gravity;
        x += vx * 0.016;
        y += vy * 0.016;
        opacity -= 0.02;
        rotation += 8;

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

// ===== BASIC CARDS HOVER =====
const basicCards = document.querySelectorAll('.basic-card');
basicCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== LOVE CARDS ANIMATION =====
const loveCards = document.querySelectorAll('.love-card');
loveCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;

    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.love-icon');
        if (icon) {
            icon.style.transform = 'scale(1.3) rotate(20deg)';
        }
    });

    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.love-icon');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

// ===== EXAMPLE CARDS INTERACTION =====
const exampleCards = document.querySelectorAll('.example-card');
exampleCards.forEach(card => {
    card.addEventListener('click', () => {
        // Create sparkle effect on click
        createCardSparkles(card);
    });
});

function createCardSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleEmojis = ['✨', '⭐', '💫', '🌐'];

    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + rect.width / 2 + 'px';
        sparkle.style.top = rect.top + rect.height / 2 + 'px';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];

        document.body.appendChild(sparkle);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = Math.random() * 100 + 80;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 50;

        animateSparkle(sparkle, vx, vy);
    }
}

function animateSparkle(element, vx, vy) {
    let x = 0, y = 0, opacity = 1, rotation = 0;
    const gravity = 3;

    function update() {
        vy += gravity;
        x += vx * 0.016;
        y += vy * 0.016;
        opacity -= 0.025;
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

// ===== RESOURCE CARDS HOVER =====
const resourceCards = document.querySelectorAll('.resource-card');
resourceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.resource-icon');
        if (icon) {
            icon.style.transform = 'scale(1.3) rotate(15deg)';
            icon.style.transition = 'transform 0.3s';
        }
    });

    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.resource-icon');
        if (icon) {
            icon.style.transform = '';
        }
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FEATURE BOXES ANIMATION =====
const featureBoxes = document.querySelectorAll('.feature-box');
featureBoxes.forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'scale(0.8)';

    setTimeout(() => {
        box.style.transition = 'all 0.5s ease-out';
        box.style.opacity = '1';
        box.style.transform = 'scale(1)';
    }, 1500 + (index * 200));
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for scroll reveal
document.querySelectorAll('.basic-card, .example-card, .love-card, .resource-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// ===== INITIALIZE =====
window.addEventListener('load', () => {
    createFloatingObjects();
    createSparkles();
});
