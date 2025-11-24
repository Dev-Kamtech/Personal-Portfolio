// ===== GAME STATE =====
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let difficulty = 'medium'; // easy, medium, impossible
let scores = {
    player: 0,
    ai: 0,
    draw: 0
};

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// ===== DOM ELEMENTS =====
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const resetBtn = document.getElementById('resetBtn');
const currentPlayerEl = document.getElementById('currentPlayer');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const drawScoreEl = document.getElementById('drawScore');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const modalOverlay = document.getElementById('modalOverlay');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalBtn = document.getElementById('modalBtn');
const winLine = document.getElementById('winLine');
const confettiContainer = document.getElementById('confettiContainer');
const floatingContainer = document.getElementById('floatingContainer');
const particlesContainer = document.getElementById('particles');

// ===== EVENT LISTENERS =====
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
resetBtn.addEventListener('click', resetScores);
modalBtn.addEventListener('click', closeModalAndRestart);
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.level;
        restartGame();
    });
});

// ===== INITIALIZE =====
window.addEventListener('load', () => {
    loadScores();
    updateScoreDisplay();
    createFloatingObjects();
    createParticles();
});

// ===== GAME LOGIC =====
function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
        return;
    }

    makeMove(index, 'X');

    if (gameActive && currentPlayer === 'O') {
        setTimeout(() => aiMove(), 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add('taken', player.toLowerCase());

    checkGameStatus();

    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayer();
    }
}

function aiMove() {
    if (!gameActive) return;

    let move;

    switch (difficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            move = Math.random() < 0.6 ? getBestMove() : getRandomMove();
            break;
        case 'impossible':
            move = getBestMove();
            break;
    }

    if (move !== -1) {
        makeMove(move, 'O');
    }
}

// ===== AI MINIMAX ALGORITHM (UNBEATABLE) =====
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove !== -1 ? bestMove : getRandomMove();
}

function minimax(newBoard, depth, isMaximizing) {
    const winner = checkWinner();

    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (isBoardFull()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'O';
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (newBoard[i] === '') {
                newBoard[i] = 'X';
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Random move for easy difficulty
function getRandomMove() {
    const availableMoves = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') availableMoves.push(i);
    }
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// ===== GAME STATUS =====
function checkGameStatus() {
    const winner = checkWinner();

    if (winner) {
        gameActive = false;
        handleWin(winner);
    } else if (isBoardFull()) {
        gameActive = false;
        handleDraw();
    }
}

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            drawWinLine(combo);
            return board[a];
        }
    }
    return null;
}

function isBoardFull() {
    return board.every(cell => cell !== '');
}

function handleWin(winner) {
    if (winner === 'X') {
        scores.player++;
        showModal('🎉', 'You Win!', 'Incredible! You beat the AI!', 'win');
        createConfetti();
    } else {
        scores.ai++;
        showModal('😢', 'AI Wins!', 'Better luck next time!', 'lose');
    }
    saveScores();
    updateScoreDisplay();
}

function handleDraw() {
    scores.draw++;
    showModal('🤝', "It's a Draw!", 'Well played! Try again?', 'draw');
    saveScores();
    updateScoreDisplay();
}

// ===== WIN LINE ANIMATION =====
function drawWinLine(combo) {
    const [a, b, c] = combo;
    const cellA = cells[a].getBoundingClientRect();
    const cellC = cells[c].getBoundingClientRect();
    const boardRect = document.querySelector('.game-board').getBoundingClientRect();

    const x1 = cellA.left + cellA.width / 2 - boardRect.left;
    const y1 = cellA.top + cellA.height / 2 - boardRect.top;
    const x2 = cellC.left + cellC.width / 2 - boardRect.left;
    const y2 = cellC.top + cellC.height / 2 - boardRect.top;

    const line = winLine.querySelector('line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);

    winLine.style.display = 'block';
}

// ===== UI UPDATES =====
function updateCurrentPlayer() {
    const playerText = currentPlayerEl.querySelector('.player-text');
    const playerSymbol = currentPlayerEl.querySelector('.player-symbol');

    if (currentPlayer === 'X') {
        playerText.textContent = 'Your Turn';
        playerSymbol.textContent = 'X';
        playerSymbol.style.color = 'var(--player-x)';
        playerSymbol.style.textShadow = '0 0 20px var(--player-x)';
    } else {
        playerText.textContent = 'AI Thinking...';
        playerSymbol.textContent = 'O';
        playerSymbol.style.color = 'var(--player-o)';
        playerSymbol.style.textShadow = '0 0 20px var(--player-o)';
    }
}

function updateScoreDisplay() {
    playerScoreEl.textContent = scores.player;
    aiScoreEl.textContent = scores.ai;
    drawScoreEl.textContent = scores.draw;
}

// ===== GAME CONTROLS =====
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    winLine.style.display = 'none';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o');
    });

    updateCurrentPlayer();
}

function resetScores() {
    scores = { player: 0, ai: 0, draw: 0 };
    saveScores();
    updateScoreDisplay();
    restartGame();
}

// ===== MODAL =====
function showModal(icon, title, message, type) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOverlay.classList.add('show');

    // Change modal colors based on result
    if (type === 'win') {
        modalTitle.style.color = 'var(--win-color)';
    } else if (type === 'lose') {
        modalTitle.style.color = 'var(--lose-color)';
    } else {
        modalTitle.style.color = 'var(--draw-color)';
    }
}

function closeModalAndRestart() {
    modalOverlay.classList.remove('show');
    restartGame();
}

// ===== CONFETTI ANIMATION =====
function createConfetti() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 20);
    }
}

// ===== FLOATING DRAGGABLE OBJECTS =====
function createFloatingObjects() {
    const shapes = ['circle', 'square', 'triangle'];
    const count = 6;

    for (let i = 0; i < count; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const obj = document.createElement('div');
        obj.classList.add('floating-object', `shape-${shape}`);

        obj.style.left = Math.random() * 80 + 10 + '%';
        obj.style.top = Math.random() * 80 + 10 + '%';
        obj.style.animationDelay = Math.random() * 3 + 's';
        obj.style.animationDuration = (Math.random() * 4 + 6) + 's';

        makeDraggable(obj);
        floatingContainer.appendChild(obj);
    }
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.addEventListener('mousedown', dragMouseDown);
    element.addEventListener('touchstart', dragTouchStart);

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.classList.add('dragging');
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
    }

    function dragTouchStart(e) {
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        element.classList.add('dragging');
        document.addEventListener('touchmove', elementTouchDrag);
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

// ===== PARTICLE EFFECTS =====
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===== LOCAL STORAGE =====
function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(scores));
}

function loadScores() {
    const saved = localStorage.getItem('ticTacToeScores');
    if (saved) {
        scores = JSON.parse(saved);
    }
}