// Globální proměnné
let temperatureChart = null;
let weatherMap = null;
let skycons = null;

// Event listenery po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Načtení uloženého tématu
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    // Inicializace Skycons s barvou podle tématu
    const iconColor = savedTheme === 'dark' ? 'white' : 'black';
    skycons = new Skycons({"color": iconColor});

    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const themeToggle = document.getElementById('themeToggle');

    updateThemeIcon(savedTheme);

    // Kliknutí na tlačítko
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    });

    // Enter klávesa v inputu
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherData(city);
            }
        }
    });

    // Přepínač dark mode
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Aktualizace grafu pro nové téma
        if (temperatureChart) {
            updateChartTheme();
        }

        // Aktualizace barvy Skycons ikon
        updateSkyconsColor(newTheme);
    });

    // Výchozí město při načtení
    fetchWeatherData('Opava');
});

/**
 * Aktualizace ikony přepínače tématu
 */
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

/**
 * Aktualizace barvy Skycons ikon podle tématu
 */
function updateSkyconsColor(theme) {
    // Zničit starou instanci
    if (skycons) {
        // Zastavit všechny animace
        // Skycons nemá destroy metodu, takže vytvoříme novou instanci
    }

    // Vytvořit novou instanci s novou barvou
    const iconColor = theme === 'dark' ? 'white' : 'black';
    skycons = new Skycons({"color": iconColor});

    // Znovu spustit všechny ikony (pokud jsou zobrazeny)
    const currentWeatherIcon = document.getElementById('currentWeatherIcon');
    if (currentWeatherIcon && currentWeatherIcon.dataset.weatherId) {
        const weatherId = parseInt(currentWeatherIcon.dataset.weatherId);
        const skyconType = getSkyconsType(weatherId);
        skycons.add(currentWeatherIcon, skyconType);
        skycons.play();
    }

    // Aktualizovat týdenní ikony
    const weeklyIcons = document.querySelectorAll('[id^="weeklyIcon"]');
    weeklyIcons.forEach(canvas => {
        if (canvas.dataset.weatherId) {
            const weatherId = parseInt(canvas.dataset.weatherId);
            const skyconType = getSkyconsType(weatherId);
            skycons.add(canvas, skyconType);
        }
    });

    if (weeklyIcons.length > 0) {
        skycons.play();
    }
}

/**
 * Aktualizace barev grafu podle tématu
 */
function updateChartTheme() {
    const theme = document.body.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#e4e4e4' : '#333';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const accentColor = theme === 'dark' ? '#53a8b6' : '#667eea';

    if (temperatureChart) {
        temperatureChart.options.plugins.legend.labels.color = textColor;
        temperatureChart.options.scales.y.ticks.color = textColor;
        temperatureChart.options.scales.x.ticks.color = textColor;
        temperatureChart.options.scales.y.grid.color = gridColor;
        temperatureChart.options.scales.x.grid.color = gridColor;
        temperatureChart.data.datasets[0].borderColor = accentColor;
        temperatureChart.data.datasets[0].backgroundColor = accentColor + '20';
        temperatureChart.data.datasets[0].pointBackgroundColor = accentColor;
        temperatureChart.update();
    }
}

/**
 * Hlavní funkce pro získání dat o počasí
 */
async function fetchWeatherData(city) {
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('errorMessage');
    const weatherContent = document.getElementById('weatherContent');

    // Zobrazit loader a skrýt ostatní
    loader.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    weatherContent.classList.add('hidden');

    try {
        const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Nepodařilo se načíst data');
        }

        // Aktualizovat UI s daty
        updateCurrentWeather(data.current);
        updateWeeklyForecast(data.weekly);
        updateChart(data.hourly);
        updateMap(data.map);
        updateAlerts(data.alerts);

        // Zobrazit obsah
        loader.classList.add('hidden');
        weatherContent.classList.remove('hidden');

    } catch (error) {
        // Zobrazit chybovou zprávu
        loader.classList.add('hidden');
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    }
}

/**
 * Mapování OpenWeatherMap kódu na Skycons typ
 */
function getSkyconsType(weatherId) {
    // Thunderstorm (2xx)
    if (weatherId >= 200 && weatherId < 300) return Skycons.RAIN;
    // Drizzle (3xx)
    if (weatherId >= 300 && weatherId < 400) return Skycons.RAIN;
    // Rain (5xx)
    if (weatherId >= 500 && weatherId < 600) return Skycons.RAIN;
    // Snow (6xx)
    if (weatherId >= 600 && weatherId < 700) return Skycons.SNOW;
    // Atmosphere (7xx) - fog, mist, etc.
    if (weatherId >= 700 && weatherId < 800) return Skycons.FOG;
    // Clear (800)
    if (weatherId === 800) return Skycons.CLEAR_DAY;
    // Clouds (80x)
    if (weatherId === 801) return Skycons.PARTLY_CLOUDY_DAY;
    if (weatherId >= 802 && weatherId <= 804) return Skycons.CLOUDY;

    return Skycons.CLEAR_DAY; // výchozí
}

/**
 * Aktualizace aktuálního počasí
 */
function updateCurrentWeather(data) {
    document.getElementById('cityName').textContent = data.city;
    document.getElementById('countryCode').textContent = data.country;
    document.getElementById('temperature').textContent = data.temperature;
    document.getElementById('description').textContent = data.description;
    document.getElementById('feelsLike').textContent = `${data.feels_like}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;
    document.getElementById('windSpeed').textContent = `${data.wind_speed} m/s`;
    document.getElementById('windDirection').textContent = data.wind_direction;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('clouds').textContent = `${data.clouds}%`;
    document.getElementById('sunrise').textContent = data.sunrise;
    document.getElementById('sunset').textContent = data.sunset;

    // Animovaná ikona pomocí Skycons
    const canvas = document.getElementById('currentWeatherIcon');
    canvas.dataset.weatherId = data.weather_id; // Uložit weather_id pro pozdější použití
    const skyconType = getSkyconsType(data.weather_id);
    skycons.add(canvas, skyconType);
    skycons.play();
}

/**
 * Aktualizace meteorologických výstrah
 */
function updateAlerts(alerts) {
    const alertsSection = document.getElementById('alertsSection');
    const alertsContainer = document.getElementById('alertsContainer');

    if (alerts && alerts.length > 0) {
        alertsContainer.innerHTML = '';

        alerts.forEach(alert => {
            const alertCard = document.createElement('div');
            alertCard.className = 'alert-card';

            alertCard.innerHTML = `
                <h4>${alert.event}</h4>
                <p>${alert.description}</p>
                <div class="alert-time">
                    <span>Od: ${alert.start}</span>
                    <span>Do: ${alert.end}</span>
                </div>
            `;

            alertsContainer.appendChild(alertCard);
        });

        alertsSection.classList.remove('hidden');
    } else {
        alertsSection.classList.add('hidden');
    }
}

/**
 * Aktualizace týdenního přehledu
 */
function updateWeeklyForecast(weeklyData) {
    const container = document.getElementById('weeklyContainer');
    container.innerHTML = '';

    weeklyData.forEach((day, index) => {
        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        const canvasId = `weeklyIcon${index}`;

        dayCard.innerHTML = `
            <div class="day-name">${day.date}</div>
            <canvas id="${canvasId}" width="60" height="60" data-weather-id="${day.weather_id}"></canvas>
            <div class="temps">
                <span class="temp-max">${day.temp_max}°</span>
                <span class="temp-min">${day.temp_min}°</span>
            </div>
        `;

        container.appendChild(dayCard);

        // Přidání animované ikony
        const canvas = document.getElementById(canvasId);
        const skyconType = getSkyconsType(day.weather_id);
        skycons.add(canvas, skyconType);
    });

    skycons.play();
}

/**
 * Aktualizace grafu s 24h předpovědí
 */
function updateChart(hourlyData) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const theme = document.body.getAttribute('data-theme');
    const textColor = theme === 'dark' ? '#e4e4e4' : '#333';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const accentColor = theme === 'dark' ? '#53a8b6' : '#667eea';

    // Příprava dat pro graf
    const labels = hourlyData.map(item => item.time);
    const temperatures = hourlyData.map(item => item.temp);

    // Zničit předchozí graf, pokud existuje
    if (temperatureChart) {
        temperatureChart.destroy();
    }

    // Vytvoření nového grafu
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Teplota (°C)',
                data: temperatures,
                borderColor: accentColor,
                backgroundColor: accentColor + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: accentColor,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: textColor
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y}°C`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value + '°C';
                        },
                        font: {
                            size: 12
                        },
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

/**
 * Aktualizace interaktivní mapy
 */
function updateMap(mapData) {
    const mapContainer = document.getElementById('weatherMap');

    // Zničit předchozí mapu, pokud existuje
    if (weatherMap) {
        weatherMap.remove();
    }

    // Vytvoření nové mapy
    weatherMap = L.map('weatherMap').setView([mapData.lat, mapData.lon], 10);

    // Základní vrstva - OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(weatherMap);

    // Meteorologická vrstva - oblačnost
    const cloudsLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${mapData.api_key}`,
        {
            attribution: 'OpenWeatherMap',
            opacity: 0.6,
            maxZoom: 18
        }
    ).addTo(weatherMap);

    // Meteorologická vrstva - srážky
    const precipitationLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${mapData.api_key}`,
        {
            attribution: 'OpenWeatherMap',
            opacity: 0.6,
            maxZoom: 18
        }
    );

    // Značka na mapě pro aktuální město
    L.marker([mapData.lat, mapData.lon])
        .addTo(weatherMap)
        .bindPopup('<b>Aktuální poloha</b>')
        .openPopup();

    // Přidání ovládání vrstev
    const baseMaps = {};
    const overlayMaps = {
        "Oblačnost": cloudsLayer,
        "Srážky": precipitationLayer
    };

    L.control.layers(baseMaps, overlayMaps).addTo(weatherMap);
}
