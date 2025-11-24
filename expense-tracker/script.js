// DOM Elements
const expenseNameInput = document.getElementById('expenseName');
const expenseAmountInput = document.getElementById('expenseAmount');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const errorMessage = document.getElementById('errorMessage');
const totalBalance = document.getElementById('totalBalance');
const expensesList = document.getElementById('expensesList');
const clearAllBtn = document.getElementById('clearAllBtn');

// Expenses array (loaded from localStorage)
let expenses = [];

// Event Listeners
addExpenseBtn.addEventListener('click', addExpense);
clearAllBtn.addEventListener('click', clearAllExpenses);

// Allow Enter key to add expense
expenseNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        expenseAmountInput.focus();
    }
});

expenseAmountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addExpense();
    }
});

// Initialize app on page load
window.addEventListener('load', () => {
    loadExpenses();
    displayExpenses();
    updateTotal();
});

// Add new expense
function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    // Validate inputs
    if (!name || !amount || amount <= 0) {
        showError('Please enter a valid expense name and amount');
        return;
    }

    // Create expense object
    const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    };

    // Add to expenses array
    expenses.unshift(expense); // Add to beginning of array

    // Save to localStorage
    saveExpenses();

    // Update UI
    displayExpenses();
    updateTotal();

    // Clear form
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseNameInput.focus();

    // Hide error if it was showing
    hideError();
}

// Display all expenses
function displayExpenses() {
    // Clear current list
    expensesList.innerHTML = '';

    // If no expenses, show empty state
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="empty-state">No expenses yet. Add one to get started!</p>';
        clearAllBtn.classList.add('hidden');
        return;
    }

    // Show clear all button
    clearAllBtn.classList.remove('hidden');

    // Create expense items
    expenses.forEach(expense => {
        const expenseItem = createExpenseElement(expense);
        expensesList.appendChild(expenseItem);
    });
}

// Create expense element
function createExpenseElement(expense) {
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
        <div class="expense-info">
            <p class="expense-name">${expense.name}</p>
            <p class="expense-date">${expense.date}</p>
        </div>
        <div class="expense-right">
            <p class="expense-amount">$${expense.amount.toFixed(2)}</p>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">×</button>
        </div>
    `;
    return div;
}

// Delete single expense
function deleteExpense(id) {
    // Remove from array
    expenses = expenses.filter(expense => expense.id !== id);

    // Save to localStorage
    saveExpenses();

    // Update UI
    displayExpenses();
    updateTotal();
}

// Clear all expenses
function clearAllExpenses() {
    if (confirm('Are you sure you want to delete all expenses?')) {
        expenses = [];
        saveExpenses();
        displayExpenses();
        updateTotal();
    }
}

// Update total balance
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalBalance.textContent = `$${total.toFixed(2)}`;
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Load expenses from localStorage
function loadExpenses() {
    const stored = localStorage.getItem('expenses');
    if (stored) {
        expenses = JSON.parse(stored);
    }
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        hideError();
    }, 3000);
}

// Hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}