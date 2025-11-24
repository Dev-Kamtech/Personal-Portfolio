// API Configuration
// Using QuoteSlate API - Free, no API key required, CORS enabled
// Alternative: https://qapi.vercel.app/api/random
const API_URL = 'https://quoteslate.vercel.app/api/quotes/random';

// DOM Elements
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyQuoteBtn = document.getElementById('copyQuoteBtn');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const authorContainer = document.getElementById('authorContainer');
const copySuccess = document.getElementById('copySuccess');

// Current quote data
let currentQuote = {
    text: '',
    author: ''
};

// Event Listeners
newQuoteBtn.addEventListener('click', fetchNewQuote);
copyQuoteBtn.addEventListener('click', copyQuote);

// Fetch new quote from API
async function fetchNewQuote() {
    // Show loader, hide error
    showLoader();
    hideError();
    hideCopySuccess();

    // Add fade-out effect to current quote
    quoteText.style.opacity = '0';

    try {
        // Fetch quote data
        const data = await fetchQuoteData();

        // Short delay for smooth transition
        setTimeout(() => {
            displayQuote(data);
        }, 300);

    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

// Fetch quote data from API
async function fetchQuoteData() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Failed to fetch quote. Please try again later.');
    }

    return await response.json();
}

// Display quote on the UI
function displayQuote(data) {
    // Store current quote
    // QuoteSlate API returns: { quote, author }
    currentQuote = {
        text: data.quote || data.content || data.text,
        author: data.author || 'Unknown'
    };

    // Update quote text
    quoteText.textContent = currentQuote.text;

    // Update author
    quoteAuthor.textContent = `— ${currentQuote.author}`;

    // Show author container
    authorContainer.classList.remove('hidden');

    // Fade in quote text
    quoteText.style.opacity = '1';
}

// Copy quote to clipboard
async function copyQuote() {
    // Check if there's a quote to copy
    if (!currentQuote.text) {
        showError('Generate a quote first before copying!');
        return;
    }

    const fullQuote = `"${currentQuote.text}" — ${currentQuote.author}`;

    try {
        // Try using the modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(fullQuote);
            showCopySuccess();
        } else {
            // Fallback for older browsers
            copyToClipboardFallback(fullQuote);
            showCopySuccess();
        }
    } catch (error) {
        showError('Failed to copy quote. Please try again.');
    }
}

// Fallback method for copying to clipboard
function copyToClipboardFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// UI Helper Functions
function showLoader() {
    loader.classList.remove('hidden');
    quoteDisplay.style.opacity = '0.3';
}

function hideLoader() {
    loader.classList.add('hidden');
    quoteDisplay.style.opacity = '1';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        hideError();
    }, 3000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showCopySuccess() {
    copySuccess.classList.remove('hidden');

    // Auto-hide after 2 seconds
    setTimeout(() => {
        hideCopySuccess();
    }, 2000);
}

function hideCopySuccess() {
    copySuccess.classList.add('hidden');
}

// Load a quote on page load (optional)
window.addEventListener('load', () => {
    // Uncomment to auto-load a quote on startup
    // fetchNewQuote();
});