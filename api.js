const weatherForm = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const weatherDisplay = document.getElementById('weatherDisplay');
const locationName = document.getElementById('locationName');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const temperatureElement = document.getElementById('temperature');
const toggleTempButton = document.getElementById('toggleTemp');

// Your Visual Crossing API key
const apiKey = 'GE3ACC5KUUPUG4YBYUTLUQZPF';

// Mapping for Weather Icons (Weather Icons library class names)
const iconMapping = {
    'clear-day': 'wi-day-sunny',
    'clear-night': 'wi-night-clear',
    'rain': 'wi-rain',
    'snow': 'wi-snow',
    'cloudy': 'wi-cloudy',
    'partly-cloudy-day': 'wi-day-cloudy',
    'partly-cloudy-night': 'wi-night-alt-cloudy',
    'fog': 'wi-fog',
    'wind': 'wi-strong-wind',
    'thunderstorm': 'wi-thunderstorm',
};

// Default fallback class
const defaultIconClass = 'wi-na';

// Function to fetch weather data
async function fetchWeather(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        console.log(data); // Log the API response for debugging
        return processWeatherData(data);
    } catch (error) {
        console.error(error);
        alert('Error fetching weather data. Please try again!');
    }
}

// Function to process the weather data and return necessary information
function processWeatherData(data) {
    return {
        location: data.resolvedAddress,
        tempF: data.currentConditions.temp,
        tempC: ((data.currentConditions.temp - 32) * 5) / 9, // Convert to Celsius
        description: data.currentConditions.conditions,
        icon: data.currentConditions.icon, // Weather icon code
    };
}

// Function to display weather data on the page
function displayWeather(weather) {
    locationName.textContent = weather.location;
    weatherDescription.textContent = weather.description;

    // Display temperature in Fahrenheit by default
    temperatureElement.textContent = `${weather.tempF.toFixed(1)}° F`;
    temperatureElement.dataset.tempF = weather.tempF;
    temperatureElement.dataset.tempC = weather.tempC;

    console.log("Weather icon code:", weather.icon);

    // Get the class name for the icon or use a default
    const iconClass = iconMapping[weather.icon] || defaultIconClass;
    weatherIcon.className = `wi ${iconClass}`;

    // Show the weather display section
    weatherDisplay.classList.remove('hidden');
}

// Handle form submission to fetch and display weather
weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (location) {
        const weather = await fetchWeather(location);
        if (weather) displayWeather(weather);
    }
});

// Toggle between Fahrenheit and Celsius
toggleTempButton.addEventListener('click', () => {
    const currentTemp = temperatureElement.textContent;
    const tempF = parseFloat(temperatureElement.dataset.tempF);
    const tempC = parseFloat(temperatureElement.dataset.tempC);

    if (currentTemp.includes('F')) {
        // Switch to Celsius
        temperatureElement.textContent = `${tempC.toFixed(1)}° C`;
        toggleTempButton.textContent = 'Switch to Fahrenheit';
    } else {
        // Switch to Fahrenheit
        temperatureElement.textContent = `${tempF.toFixed(1)}° F`;
        toggleTempButton.textContent = 'Switch to Celsius';
    }
});
