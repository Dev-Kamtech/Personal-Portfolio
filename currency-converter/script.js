// API Configuration
// Using Frankfurter API - Free, no API key required, CORS enabled
// Alternative endpoints: api.frankfurter.dev or cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1
const API_URL = 'https://api.frankfurter.dev';

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const errorMessage = document.getElementById('errorMessage');
const loader = document.getElementById('loader');
const resultDisplay = document.getElementById('resultDisplay');
const resultValue = document.getElementById('resultValue');
const resultCurrency = document.getElementById('resultCurrency');
const exchangeRate = document.getElementById('exchangeRate');

// Event Listeners
convertBtn.addEventListener('click', handleConvert);
swapBtn.addEventListener('click', swapCurrencies);

// Allow Enter key to trigger conversion
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleConvert();
    }
});

// Main conversion handler
async function handleConvert() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Validate input
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }

    if (from === to) {
        showError('Please select different currencies');
        return;
    }

    // Show loader, hide previous results
    showLoader();
    hideError();
    hideResult();

    try {
        // Fetch conversion data
        const data = await fetchConversionData(amount, from, to);
        displayResult(data, amount, from, to);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

// Fetch conversion data from API
async function fetchConversionData(amount, from, to) {
    const url = `${API_URL}/latest?amount=${amount}&from=${from}&to=${to}`;

    const response = await fetch(url);

    if (!response.ok) {
        // If primary API fails, try fallback
        return await fetchFallbackConversion(amount, from, to);
    }

    return await response.json();
}

// Fallback conversion using alternative API
async function fetchFallbackConversion(amount, from, to) {
    const fallbackURL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`;

    const response = await fetch(fallbackURL);

    if (!response.ok) {
        throw new Error('Failed to fetch exchange rates. Please try again later.');
    }

    const data = await response.json();
    const rate = data[from.toLowerCase()][to.toLowerCase()];

    if (!rate) {
        throw new Error('Currency conversion not available.');
    }

    // Format response to match Frankfurter structure
    return {
        rates: {
            [to]: amount * rate
        }
    };
}

// Display conversion result
function displayResult(data, amount, from, to) {
    // Get converted amount
    const convertedAmount = data.rates[to];

    // Update result display
    resultValue.textContent = convertedAmount.toFixed(2);
    resultCurrency.textContent = to;

    // Calculate and display exchange rate
    const rate = (convertedAmount / amount).toFixed(4);
    exchangeRate.textContent = `1 ${from} = ${rate} ${to}`;

    // Show result with animation
    showResult();
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    // If there's already a result, convert again with swapped currencies
    if (!resultDisplay.classList.contains('hidden')) {
        handleConvert();
    }
}

// UI Helper Functions
function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showResult() {
    resultDisplay.classList.remove('hidden');
}

function hideResult() {
    resultDisplay.classList.add('hidden');
}

// Auto-convert on page load (optional)
window.addEventListener('load', () => {
    // Uncomment to auto-convert on page load
    // handleConvert();
});