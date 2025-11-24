// Reusing the same interactive script pattern
function createFloatingObjects() {
    const container = document.getElementById('floatingContainer');
    const emojis = ['💚', '⚡', '🌟', '✨', '🚀', '💻', '📦', '🌟', '⭐', '💫'];
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

function createSparkles() {
    const container = document.getElementById('sparklesContainer');
    const sparkles = ['✨', '⭐', '💫', '🌟', '🔥'];
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .project-card, .love-card, .resource-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

window.addEventListener('load', () => {
    createFloatingObjects();
    createSparkles();
});
