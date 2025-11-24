// API Configuration
// Using Open-Meteo API - Free, no API key required, CORS enabled
// Geocoding API to convert city names to coordinates
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
// Weather API to get weather data
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loader = document.getElementById('loader');
const weatherDisplay = document.getElementById('weatherDisplay');
const weatherIcon = document.getElementById('weatherIcon');
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const weatherDesc = document.getElementById('weatherDesc');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Weather code to description mapping
const weatherCodes = {
    0: { desc: 'Clear sky', icon: '☀️' },
    1: { desc: 'Mainly clear', icon: '🌤️' },
    2: { desc: 'Partly cloudy', icon: '⛅' },
    3: { desc: 'Overcast', icon: '☁️' },
    45: { desc: 'Foggy', icon: '🌫️' },
    48: { desc: 'Depositing rime fog', icon: '🌫️' },
    51: { desc: 'Light drizzle', icon: '🌦️' },
    53: { desc: 'Moderate drizzle', icon: '🌦️' },
    55: { desc: 'Dense drizzle', icon: '🌧️' },
    61: { desc: 'Slight rain', icon: '🌧️' },
    63: { desc: 'Moderate rain', icon: '🌧️' },
    65: { desc: 'Heavy rain', icon: '🌧️' },
    71: { desc: 'Slight snow', icon: '🌨️' },
    73: { desc: 'Moderate snow', icon: '❄️' },
    75: { desc: 'Heavy snow', icon: '❄️' },
    77: { desc: 'Snow grains', icon: '❄️' },
    80: { desc: 'Slight rain showers', icon: '🌦️' },
    81: { desc: 'Moderate rain showers', icon: '🌧️' },
    82: { desc: 'Violent rain showers', icon: '⛈️' },
    85: { desc: 'Slight snow showers', icon: '🌨️' },
    86: { desc: 'Heavy snow showers', icon: '❄️' },
    95: { desc: 'Thunderstorm', icon: '⛈️' },
    96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' }
};

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Main search handler
async function handleSearch() {
    const city = cityInput.value.trim();

    // Validate input
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    // Show loader, hide previous results
    showLoader();
    hideError();
    hideWeatherDisplay();

    try {
        // Step 1: Get coordinates from city name
        const locationData = await fetchCityCoordinates(city);

        // Step 2: Fetch weather data using coordinates
        const weatherData = await fetchWeatherData(locationData.latitude, locationData.longitude);

        // Step 3: Display the weather
        displayWeatherData(weatherData, locationData);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

// Fetch city coordinates from geocoding API
async function fetchCityCoordinates(city) {
    const url = `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to search for city. Please try again.');
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error('City not found. Please check the spelling and try again.');
    }

    return data.results[0];
}

// Fetch weather data from Open-Meteo API
async function fetchWeatherData(latitude, longitude) {
    const url = `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch weather data. Please try again later.');
    }

    return await response.json();
}

// Display weather data on the UI
function displayWeatherData(data, location) {
    const current = data.current;

    // Update city name
    const cityNameText = location.admin1
        ? `${location.name}, ${location.admin1}, ${location.country}`
        : `${location.name}, ${location.country}`;
    cityName.textContent = cityNameText;

    // Update temperature
    temp.textContent = Math.round(current.temperature_2m);

    // Update weather description and icon
    const weatherCode = current.weather_code;
    const weatherInfo = weatherCodes[weatherCode] || { desc: 'Unknown', icon: '🌡️' };
    weatherDesc.textContent = weatherInfo.desc;

    // Create weather icon using emoji
    weatherIcon.src = ''; // Clear old icon
    weatherIcon.alt = weatherInfo.desc;
    weatherIcon.textContent = weatherInfo.icon;
    weatherIcon.style.fontSize = '120px';
    weatherIcon.style.textAlign = 'center';

    // Update feels like temperature
    feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;

    // Update humidity
    humidity.textContent = `${current.relative_humidity_2m}%`;

    // Update wind speed
    windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

    // Show weather display with animation
    showWeatherDisplay();
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

function showWeatherDisplay() {
    weatherDisplay.classList.remove('hidden');
}

function hideWeatherDisplay() {
    weatherDisplay.classList.add('hidden');
}

// Load default city on page load (optional)
window.addEventListener('load', () => {
    // Uncomment the lines below to load a default city on startup
    // cityInput.value = 'London';
    // handleSearch();

    // Initialize floating objects and particles
    createFloatingObjects();
    createParticles();
});

// ===== FLOATING DRAGGABLE OBJECTS =====
function createFloatingObjects() {
    const container = document.getElementById('floatingContainer');
    const shapes = ['cloud', 'sun', 'raindrop'];
    const count = 7;

    for (let i = 0; i < count; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const obj = document.createElement('div');
        obj.classList.add('floating-object', `shape-${shape}`);

        obj.style.left = Math.random() * 90 + 5 + '%';
        obj.style.top = Math.random() * 90 + 5 + '%';
        obj.style.animationDelay = Math.random() * 4 + 's';
        obj.style.animationDuration = (Math.random() * 6 + 8) + 's';

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

// ===== PARTICLE EFFECTS =====
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 12 + 12) + 's';
        particle.style.animationDelay = Math.random() * 8 + 's';
        container.appendChild(particle);
    }
}