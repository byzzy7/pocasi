# Komplexní dokumentace - Webová aplikace "Počasí"

## Obsah
1. [Úvod](#úvod)
2. [Technologický stack](#technologický-stack)
3. [Architektura aplikace](#architektura-aplikace)
4. [Funkcionality](#funkcionality)
5. [API integrace](#api-integrace)
6. [Instalace a konfigurace](#instalace-a-konfigurace)
7. [Struktura projektu](#struktura-projektu)
8. [Backend - Flask](#backend---flask)
9. [Frontend - HTML/CSS/JavaScript](#frontend---htmlcssjavascript)
10. [Bezpečnost](#bezpečnost)
11. [Nasazení](#nasazení)
12. [Řešení problémů](#řešení-problémů)

---

## Úvod

Webová aplikace "Počasí" je moderní, responzivní aplikace pro zobrazení aktuálního počasí, předpovědi a meteorologických dat. Aplikace je navržena pro snadné nasazení na různých platformách včetně Synology NAS.

### Hlavní vlastnosti
- ✅ Kompletní informace o počasí (17 různých metrik)
- ✅ Animované ikony počasí (Skycons)
- ✅ Interaktivní mapa s meteorologickými vrstvami
- ✅ Dark Mode s automatickým ukládáním
- ✅ Meteorologické výstrahy v reálném čase
- ✅ 100% responzivní design
- ✅ Bez závislostí na Dockeru

---

## Technologický stack

### Backend
- **Python 3.7+** - Programovací jazyk
- **Flask 3.0.0** - Webový framework
- **Requests 2.31.0** - HTTP knihovna pro API volání

### Frontend
- **HTML5** - Struktura
- **CSS3** - Styling (Flexbox, Grid, CSS Variables)
- **Vanilla JavaScript (ES6+)** - Logika bez frameworků

### Knihovny (CDN)
- **Chart.js 4.4.0** - Grafy
- **Leaflet.js 1.9.4** - Interaktivní mapy
- **Skycons** - Animované ikony počasí

### API
- **OpenWeatherMap Current Weather API** - Aktuální počasí
- **OpenWeatherMap Forecast API** - 5-denní předpověď
- **OpenWeatherMap One Call API 3.0** - Výstrahy
- **OpenWeatherMap Tiles API** - Meteorologické mapy

---

## Architektura aplikace

### Komunikační schéma

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│         Flask Server (app.py)       │
│  ┌─────────────────────────────┐   │
│  │  Route: /                    │   │
│  │  → render index.html         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  Route: /api/weather/<city> │   │
│  │  → API orchestrator          │   │
│  └─────────────────────────────┘   │
└──────┬──────────────────────────────┘
       │ API Calls
       ▼
┌─────────────────────────────────────┐
│      OpenWeatherMap APIs            │
│  • Current Weather API              │
│  • Forecast API                     │
│  • One Call API 3.0                 │
│  • Tiles API (maps)                 │
└─────────────────────────────────────┘
```

### Data Flow

1. **Uživatel zadá město** → Frontend
2. **AJAX Request** → `/api/weather/<city>`
3. **Backend orchestrace:**
   - Volání Current Weather API (základní data + souřadnice)
   - Volání Forecast API (5 dní + 24h data)
   - Volání One Call API (výstrahy)
4. **Zpracování dat:**
   - Převod timestamp na lokální čas
   - Převod směru větru ze stupňů
   - Filtrace denních předpovědí
   - Mapování weather_id na Skycons
5. **JSON Response** → Frontend
6. **Update UI** (animace, mapy, grafy)

---

## Funkcionality

### 1. Aktuální počasí

Zobrazení 17 různých metrik:

| Metrika | Jednotka | Popis |
|---------|----------|-------|
| Teplota | °C | Aktuální teplota vzduchu |
| Pocitová teplota | °C | "Feels like" - větrná zima |
| Vlhkost | % | Relativní vlhkost vzduchu |
| Tlak vzduchu | hPa | Atmosférický tlak |
| Rychlost větru | m/s | Rychlost větru |
| Směr větru | N/NE/E/... | Směr větru (8 směrů) |
| Viditelnost | km | Viditelnost v krajině |
| Oblačnost | % | Procento pokrytí oblaky |
| Východ slunce | HH:MM | Lokální čas východu |
| Západ slunce | HH:MM | Lokální čas západu |

**Animovaná ikona:** Skycons dynamicky zobrazuje aktuální stav počasí.

### 2. 5-denní předpověď

- Zobrazení max/min teploty pro každý den
- Animované ikony pro každý den
- Responzivní grid layout
- Hover efekty

### 3. 24hodinová předpověď (Graf)

- Line chart pomocí Chart.js
- Data každé 3 hodiny (8 datových bodů)
- Dynamické barvy podle dark/light mode
- Interaktivní tooltips

### 4. Interaktivní mapa (Radar)

**Funkce:**
- Automatické centrování na vyhledané město
- Značka s popup informací
- Ovládání zoom (scroll, tlačítka)
- Přepínání vrstev

**Meteorologické vrstvy:**
- 🌥️ Oblačnost (výchozí zapnuto)
- 🌧️ Srážky (lze zapnout)

**Použitá technologie:**
- Leaflet.js pro mapu
- OpenStreetMap tiles pro podklad
- OpenWeatherMap tiles pro meteorologická data

### 5. Dark Mode

**Automatické funkce:**
- Ukládání preference do localStorage
- Obnovení při opětovném načtení
- Plynulé animace přechodů (0.3s)

**Co se mění:**
- Gradient pozadí
- Barvy karet
- Barvy textu
- Akcenty
- Graf (barvy os, legendy, gridů)

**Přepínač:**
- Ikona měsíc (light mode) / slunce (dark mode)
- Pozice: pravý horní roh
- Hover efekt: rotace 20°

### 6. Meteorologické výstrahy

**Podmínky zobrazení:**
- Sekce se zobrazí pouze pokud existují aktivní výstrahy
- Data z One Call API 3.0

**Informace v každé výstraze:**
- 🔴 Název události (event)
- 📄 Detailní popis (description)
- ⏰ Platnost od - do (lokální čas)

**Design:**
- Červené pozadí (#ff4444)
- Bílý text
- Průhledné karty
- Levý border pro oddělení

---

## API integrace

### 1. Current Weather API

**Endpoint:**
```
GET https://api.openweathermap.org/data/2.5/weather
```

**Query parametry:**
- `q` - Název města
- `units=metric` - Metrické jednotky
- `lang=cz` - Česká lokalizace
- `appid` - API klíč

**Získaná data:**
- Základní meteorologická data
- GPS souřadnice (lat, lon)
- Sunrise/sunset timestamp
- Weather ID (pro ikony)

### 2. Forecast API

**Endpoint:**
```
GET https://api.openweathermap.org/data/2.5/forecast
```

**Query parametry:**
- Stejné jako Current Weather API

**Získaná data:**
- 40 záznamů (5 dní × 8 měření/den)
- Interval: 3 hodiny
- Použití:
  - Prvních 8 → 24h graf
  - Všechny → 5-denní přehled (filtrováno na max/min)

### 3. One Call API 3.0

**Endpoint:**
```
GET https://api.openweathermap.org/data/3.0/onecall
```

**Query parametry:**
- `lat`, `lon` - GPS souřadnice
- `units=metric`
- `lang=cz`
- `appid` - API klíč

**Získaná data:**
- `alerts[]` - Pole výstrah
  - `event` - Typ výstrahy
  - `description` - Popis
  - `start`, `end` - UNIX timestamps

**Poznámka:** One Call API 3.0 může vyžadovat předplatné. Pokud API vrátí chybu, aplikace funguje bez výstrah.

### 4. Tiles API (Mapy)

**Endpointy:**
```
# Oblačnost
https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png

# Srážky
https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png
```

**Parametry:**
- `{z}` - Zoom level
- `{x}`, `{y}` - Tile souřadnice
- `appid` - API klíč (query parameter)

---

## Instalace a konfigurace

### Krok 1: Stažení projektu

```bash
git clone <repository-url>
cd pocasi_3
```

### Krok 2: Instalace závislostí

```bash
pip install -r requirements.txt
```

**requirements.txt:**
```
flask==3.0.0
requests==2.31.0
```

### Krok 3: Konfigurace API klíče

Vytvořte soubor `config.py` v kořenovém adresáři:

```python
# config.py
OPEN_WEATHER_MAP_KEY = "váš_api_klíč_zde"
```

**Získání API klíče:**
1. Zaregistrujte se na [OpenWeatherMap.org](https://openweathermap.org/)
2. Přejděte na: [API Keys](https://home.openweathermap.org/api_keys)
3. Vygenerujte nový klíč (free tier je dostačující)
4. Počkejte 10-15 minut na aktivaci

### Krok 4: Spuštění aplikace

```bash
python app.py
```

Aplikace běží na: **http://localhost:5000**

---

## Struktura projektu

```
pocasi_3/
│
├── app.py                      # Flask backend (hlavní soubor)
├── config.py                   # Konfigurace (API klíč) - NEPŘIDÁVAT DO GITU!
├── requirements.txt            # Python závislosti
├── README.md                   # Stručná dokumentace
├── DOKUMENTACE.md              # Tato komplexní dokumentace
│
├── templates/
│   └── index.html              # Hlavní HTML šablona
│
├── static/
│   ├── style.css               # CSS styly (vč. dark mode)
│   └── script.js               # JavaScript logika
│
└── .gitignore                  # Git ignore (vč. config.py)
```

### .gitignore (doporučený obsah)

```
config.py
__pycache__/
*.pyc
.env
venv/
.vscode/
.idea/
```

---

## Backend - Flask

### Hlavní soubor: app.py

#### Struktura

```python
# Import
from flask import Flask, render_template, jsonify
import requests
from datetime import datetime, timezone
import config

# Inicializace
app = Flask(__name__)
API_KEY = config.OPEN_WEATHER_MAP_KEY

# Pomocné funkce
def degrees_to_direction(degrees)
def unix_to_time(timestamp, timezone_offset=0)

# Routy
@app.route('/')                    # Hlavní stránka
@app.route('/api/weather/<city>') # API endpoint

# Spuštění
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

#### Pomocné funkce

**1. degrees_to_direction(degrees)**

Převádí stupně větru (0-360°) na směr (N, NE, E, SE, S, SW, W, NW).

```python
def degrees_to_direction(degrees):
    directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    index = round(degrees / 45) % 8
    return directions[index]
```

**Příklady:**
- 0° → N
- 45° → NE
- 90° → E
- 180° → S
- 270° → W

**2. unix_to_time(timestamp, timezone_offset=0)**

Převádí UNIX timestamp na lokální čas ve formátu HH:MM.

```python
def unix_to_time(timestamp, timezone_offset=0):
    dt = datetime.fromtimestamp(timestamp + timezone_offset, tz=timezone.utc)
    return dt.strftime("%H:%M")
```

**Parametry:**
- `timestamp` - UNIX timestamp (sekundy od 1.1.1970)
- `timezone_offset` - Offset v sekundách (z API)

#### API Endpoint: /api/weather/<city>

**Request:**
```
GET /api/weather/Opava
```

**Response (JSON):**
```json
{
  "current": {
    "city": "Opava",
    "country": "CZ",
    "temperature": 15,
    "feels_like": 13,
    "humidity": 65,
    "pressure": 1013,
    "visibility": 10000,
    "clouds": 40,
    "description": "Polojasno",
    "icon": "02d",
    "weather_id": 801,
    "wind_speed": 3.5,
    "wind_direction": "NW",
    "wind_deg": 315,
    "sunrise": "06:30",
    "sunset": "20:15",
    "lat": 49.9384,
    "lon": 17.9027
  },
  "weekly": [
    {
      "date": "Po 04.12",
      "temp_max": 16,
      "temp_min": 8,
      "icon": "03d",
      "weather_id": 802
    }
    // ... dalších 4 dní
  ],
  "hourly": [
    {
      "time": "15:00",
      "temp": 15.2
    }
    // ... dalších 7 měření
  ],
  "alerts": [
    {
      "event": "Silný vítr",
      "description": "Očekávají se silné poryvy větru...",
      "start": "14:00",
      "end": "22:00"
    }
  ],
  "map": {
    "api_key": "...",
    "lat": 49.9384,
    "lon": 17.9027
  }
}
```

#### Error handling

```python
try:
    # API volání a zpracování
    return jsonify(result)
except Exception as e:
    return jsonify({"error": f"Chyba serveru: {str(e)}"}), 500
```

**Možné chyby:**
- 404 - Město nenalezeno
- 500 - Chyba serveru / API
- 401 - Neplatný API klíč (OpenWeatherMap)

---

## Frontend - HTML/CSS/JavaScript

### HTML struktura (index.html)

#### Hlavní sekce

1. **Header** - Nadpis + přepínač dark mode
2. **Search** - Input + tlačítko
3. **Error Message** - Chybové hlášky
4. **Loader** - Loading spinner
5. **Weather Content**:
   - Current Weather (aktuální počasí)
   - Alerts (výstrahy)
   - Weekly Forecast (5 dní)
   - Chart (24h graf)
   - Map (interaktivní mapa)
6. **Footer** - Attribution

### CSS (style.css)

#### CSS Variables pro Dark Mode

```css
:root {
  --bg-gradient-start: #667eea;
  --bg-gradient-end: #764ba2;
  --card-bg: #ffffff;
  --text-primary: #333333;
  --text-secondary: #999999;
  --accent-color: #667eea;
  --border-color: #eeeeee;
  --shadow: rgba(0, 0, 0, 0.1);
  --input-bg: #ffffff;
  --input-text: #333333;
}

[data-theme="dark"] {
  --bg-gradient-start: #1a1a2e;
  --bg-gradient-end: #16213e;
  --card-bg: #0f3460;
  --text-primary: #e4e4e4;
  --text-secondary: #a0a0a0;
  --accent-color: #53a8b6;
  --border-color: #1e3a5f;
  --shadow: rgba(0, 0, 0, 0.3);
  --input-bg: #1e3a5f;
  --input-text: #e4e4e4;
}
```

#### Responzivní breakpointy

- **Desktop:** > 768px (výchozí)
- **Tablet:** ≤ 768px
- **Mobile:** ≤ 480px

**Media queries:**
```css
@media (max-width: 768px) {
  /* Tablet */
}

@media (max-width: 480px) {
  /* Mobile */
}
```

### JavaScript (script.js)

#### Globální proměnné

```javascript
let temperatureChart = null;    // Chart.js instance
let weatherMap = null;          // Leaflet mapa
let skycons = new Skycons({"color": "white"});  // Skycons instance
```

#### Hlavní funkce

**1. fetchWeatherData(city)**

Hlavní funkce pro získání dat z API.

**2. updateCurrentWeather(data)**

Aktualizuje UI s aktuálním počasím včetně všech metrik.

**3. updateWeeklyForecast(weeklyData)**

Vytváří 5 denních karet s animovanými ikonami.

**4. updateChart(hourlyData)**

Renderuje 24h graf pomocí Chart.js.

**5. updateMap(mapData)**

Vytváří interaktivní mapu s meteorologickými vrstvami.

**6. updateAlerts(alerts)**

Zobrazuje meteorologické výstrahy (pokud existují).

**7. getSkyconsType(weatherId)**

Mapuje OpenWeatherMap weather_id na Skycons typ:

```javascript
function getSkyconsType(weatherId) {
  // 2xx - Bouřka
  if (weatherId >= 200 && weatherId < 300) return Skycons.RAIN;

  // 3xx - Mrholení
  if (weatherId >= 300 && weatherId < 400) return Skycons.RAIN;

  // 5xx - Déšť
  if (weatherId >= 500 && weatherId < 600) return Skycons.RAIN;

  // 6xx - Sníh
  if (weatherId >= 600 && weatherId < 700) return Skycons.SNOW;

  // 7xx - Mlha
  if (weatherId >= 700 && weatherId < 800) return Skycons.FOG;

  // 800 - Jasno
  if (weatherId === 800) return Skycons.CLEAR_DAY;

  // 801 - Skoro jasno
  if (weatherId === 801) return Skycons.PARTLY_CLOUDY_DAY;

  // 802-804 - Oblačno
  if (weatherId >= 802 && weatherId <= 804) return Skycons.CLOUDY;

  return Skycons.CLEAR_DAY;
}
```

#### Event Listeners

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Načtení uloženého tématu
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);

  // Search button
  searchBtn.addEventListener('click', () => {
    fetchWeatherData(cityInput.value.trim());
  });

  // Enter key
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      fetchWeatherData(cityInput.value.trim());
    }
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    // Přepnutí a uložení tématu
  });

  // Výchozí načtení
  fetchWeatherData('Opava');
});
```

---

## Bezpečnost

### 1. API klíč

✅ **Správně:**
- API klíč je uložen v `config.py` na serveru
- `config.py` je v `.gitignore`
- Klíč není nikdy odeslán do browseru (kromě map tiles)

❌ **Špatně:**
- Klíč hardcodovaný v JavaScriptu
- Klíč commitnutý do Gitu
- Klíč sdílený veřejně

### 2. Input validace

Backend:
```python
if current_response.status_code != 200:
    return jsonify({"error": "Město nenalezeno"}), 404
```

Frontend:
```javascript
const city = cityInput.value.trim();
if (city) {
    fetchWeatherData(city);
}
```

### 3. Error handling

- Try-catch bloky v JavaScriptu
- Try-except v Pythonu
- Uživatelsky přívětivé chybové zprávy
- Logování chyb (v produkci)

### 4. CORS

Flask automaticky povoluje same-origin requesty. Pro production zvažte:

```python
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "https://vase-domena.cz"}})
```

---

## Nasazení

### Lokální vývoj

```bash
python app.py
```

Debug mode: `debug=True` (pouze pro vývoj!)

### Synology NAS

#### Metoda 1: Manuální spuštění

```bash
# SSH připojení
ssh admin@192.168.1.100

# Přechod do složky
cd /volume1/web/pocasi_3

# Instalace závislostí
python3 -m pip install flask requests

# Spuštění
python3 app.py
```

#### Metoda 2: Background proces

```bash
# Spuštění na pozadí
nohup python3 app.py > app.log 2>&1 &

# Zjištění PID
ps aux | grep "python3 app.py"

# Zastavení
pkill -f "python3 app.py"
```

#### Metoda 3: Synology Task Scheduler

1. Control Panel → Task Scheduler
2. Create → Triggered Task → User-defined script
3. Task Settings:
   ```bash
   cd /volume1/web/pocasi_3
   /usr/bin/python3 app.py
   ```
4. Trigger: Boot-up

### Production server (Linux)

#### S Gunicorn (doporučeno)

```bash
# Instalace
pip install gunicorn

# Spuštění
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Systemd service

`/etc/systemd/system/pocasi.service`:

```ini
[Unit]
Description=Pocasi Weather App
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/pocasi_3
ExecStart=/usr/bin/python3 app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Aktivace:
```bash
sudo systemctl enable pocasi
sudo systemctl start pocasi
```

### Nginx reverse proxy

`/etc/nginx/sites-available/pocasi`:

```nginx
server {
    listen 80;
    server_name pocasi.vase-domena.cz;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /var/www/pocasi_3/static;
    }
}
```

---

## Řešení problémů

### 1. Port 5000 již používán

**Příznaky:**
```
OSError: [Errno 48] Address already in use
```

**Řešení:**
```python
# app.py, řádek 117
app.run(debug=True, host='0.0.0.0', port=5001)  # Změňte port
```

### 2. Module not found

**Příznaky:**
```
ModuleNotFoundError: No module named 'flask'
```

**Řešení:**
```bash
pip install flask requests
# nebo
pip install -r requirements.txt
```

### 3. API klíč nefunguje

**Příznaky:**
- Chyba 401 Unauthorized
- "Invalid API key"

**Kontrola:**
1. Zkontrolujte `config.py` - je API klíč správný?
2. Počkejte 10-15 minut po vytvoření klíče
3. Zkontrolujte [API Keys stránku](https://home.openweathermap.org/api_keys)
4. Ověřte, že klíč není v uvozovkách navíc

### 4. Město nenalezeno

**Příznaky:**
- "Město nenalezeno"

**Řešení:**
- Použijte anglický název města: "Prague" místo "Praha"
- Zkuste přidat kód země: "Opava,CZ"
- Zkontrolujte překlepy

### 5. Mapa se nezobrazuje

**Možné příčiny:**
1. **Leaflet CSS se nenačetl**
   - Zkontrolujte console (F12)
   - Ověřte CDN dostupnost

2. **Chybný API klíč pro tiles**
   - Tiles API používá stejný klíč
   - Zkontrolujte `config.py`

3. **Map container má nulovou výšku**
   - Zkontrolujte CSS: `.weather-map { height: 400px; }`

### 6. Animované ikony nefungují

**Příznaky:**
- Ikony se nezobrazují
- Console error: "Skycons is not defined"

**Řešení:**
```html
<!-- Zkontrolujte HTML head -->
<script src="https://rawgithub.com/darkskyapp/skycons/master/skycons.js"></script>
```

Alternativní CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/skycons@1.0.0/skycons.min.js"></script>
```

### 7. Dark mode se neuloží

**Problém:**
- Dark mode resetuje po refreshi

**Řešení:**
- Zkontrolujte browser storage (F12 → Application → Local Storage)
- Ujistěte se, že cookies nejsou blokovány
- Testujte v inkognito režimu

### 8. Graf se nezobrazuje

**Možné příčiny:**
1. **Chart.js se nenačetl**
   ```html
   <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
   ```

2. **Canvas má nulovou výšku**
   ```css
   .chart-container {
       height: 300px;
   }
   ```

3. **Chyba v datech**
   - Zkontrolujte console (F12)
   - Ověřte formát dat z API

### 9. Výstrahy se nezobrazují

**Je to normální?**
- Výstrahy se zobrazují pouze pokud existují
- Většinu času nebude žádná výstraha

**Pokud očekáváte výstrahu:**
1. Zkontrolujte One Call API response v Network tab (F12)
2. Ověřte, že máte správný API klíč
3. One Call API 3.0 může vyžadovat předplatné

### 10. Aplikace běží pomalu

**Možná řešení:**

1. **Caching API odpovědí**
   ```python
   from functools import lru_cache
   from datetime import datetime, timedelta

   @lru_cache(maxsize=100)
   def get_weather_cached(city, timestamp):
       # API volání
       pass
   ```

2. **Snížení timeout**
   ```python
   response = requests.get(url, timeout=5)
   ```

3. **Asynchronní API volání**
   ```python
   import asyncio
   import aiohttp
   # ... async implementace
   ```

---

## Changelog

### Version 1.3 (Aktuální)
- ✅ Přidány meteorologické výstrahy (One Call API)
- ✅ Rozšíření metrik (tlak, viditelnost, oblačnost)
- ✅ Astronomické informace (východ/západ slunce)
- ✅ Směr větru s převodníkem stupňů
- ✅ Responzivní grid pro detaily

### Version 1.2
- ✅ Interaktivní mapa s Leaflet.js
- ✅ Meteorologické vrstvy (oblačnost, srážky)
- ✅ Animované ikony (Skycons)
- ✅ Dark Mode s localStorage

### Version 1.1
- ✅ 24hodinový graf (Chart.js)
- ✅ 5-denní předpověď
- ✅ Responzivní design

### Version 1.0
- ✅ Základní funkcionalita
- ✅ Aktuální počasí
- ✅ Flask backend

---

## Autor a Licence

**Vytvořeno:** 2024

**Licence:** Open Source - volně použitelné pro osobní i komerční účely

**API Data:** [OpenWeatherMap](https://openweathermap.org/)

**Podpora:** Pro otázky a bugreporty vytvořte issue v GitHub repository

---

## Další vývoj (Roadmap)

### Plánované funkce v1.4:
- [ ] PWA (Progressive Web App)
- [ ] Offline mode
- [ ] Notifikace při výstrahách
- [ ] Historie vyhledávání
- [ ] Oblíbená města
- [ ] Export dat (CSV, JSON)

### Plánované funkce v1.5:
- [ ] Vícejazyčnost (EN, DE, SK)
- [ ] Hodinová předpověď (48h)
- [ ] UV index a pollen
- [ ] Kvalita ovzduší (Air Quality)
- [ ] Radar animace (time-lapse)

---

**Konec dokumentace**

*Pro rychlý start viz [README.md](README.md)*
