# 🌤️ Počasí - Webová aplikace

Moderní a profesionální webová aplikace pro zobrazení aktuálního počasí, předpovědi a meteorologických dat. Vytvořená pomocí Python Flask a čistého JavaScriptu bez závislostí na frameworkech.

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-Open%20Source-brightgreen.svg)

---

## ✨ Hlavní vlastnosti

### 📊 Komplexní meteorologická data (17 metrik)
- 🌡️ **Teplota a pocitová teplota** - Aktuální i "feels like"
- 💧 **Vlhkost vzduchu** - Relativní vlhkost v %
- 🔽 **Tlak vzduchu** - Atmosférický tlak v hPa
- 💨 **Vítr** - Rychlost (m/s) a směr (N, NE, E, SE, S, SW, W, NW)
- 👁️ **Viditelnost** - V kilometrech
- ☁️ **Oblačnost** - Pokrytí oblaky v %
- 🌅 **Astronomie** - Východ a západ slunce (lokální čas)

### 📅 5-denní předpověď
- Max/Min teploty pro každý den
- Animované ikony počasí (Skycons)
- Responzivní grid layout
- Hover efekty a animace

### 📈 24hodinová předpověď
- Interaktivní line chart (Chart.js)
- Data každé 3 hodiny
- Dynamické barvy podle tématu
- Tooltips s detailními informacemi

### 🗺️ Interaktivní meteorologická mapa
- **Leaflet.js** - Plně interaktivní mapa
- **Meteorologické vrstvy**:
  - Oblačnost (clouds)
  - Srážky (precipitation)
- Automatické centrování na město
- Zoom, drag, ovládání vrstev

### 🌓 Dark Mode
- Přepínač světlý/tmavý režim
- Automatické ukládání do localStorage
- Plynulé animace přechodů
- Kompletní přebarvení včetně grafů

### ⚠️ Meteorologické výstrahy
- Real-time výstrahy z One Call API
- Zobrazení pouze při aktivních výstrahách
- Detailní informace:
  - Typ výstrahy
  - Popis situace
  - Platnost od-do (lokální čas)

### 🎨 Animované ikony počasí
- **Skycons** - Realistické animace
- Dynamické mapování podle weather_id
- Ikony pro všechny stavy:
  - Jasno, oblačno, déšť, sníh
  - Mlha, bouřka, mrholení

### 📱 100% Responzivní design
- Desktopy (1920px+)
- Tablety (768px-1920px)
- Mobily (320px-768px)
- Flexbox & CSS Grid
- Touch-friendly ovládání

---

## 🚀 Rychlý start

### Požadavky

- **Python 3.7+** - Programovací jazyk
- **pip** - Python package manager
- **Internetové připojení** - Pro API volání
- **OpenWeatherMap API klíč** - Zdarma na [openweathermap.org](https://openweathermap.org/api)

### Instalace (3 kroky)

#### 1️⃣ Nainstalujte závislosti

```bash
pip install flask requests
```

Nebo použijte requirements.txt:

```bash
pip install -r requirements.txt
```

#### 2️⃣ Nastavte API klíč

Vytvořte soubor `config.py` v kořenovém adresáři:

```python
# config.py
OPEN_WEATHER_MAP_KEY = "váš_api_klíč_zde"
```

**Jak získat API klíč:**
1. Zaregistrujte se na [OpenWeatherMap.org](https://openweathermap.org/)
2. Přejděte na [API Keys](https://home.openweathermap.org/api_keys)
3. Vygenerujte nový klíč (Free tier je dostačující)
4. Počkejte 10-15 minut na aktivaci

**⚠️ Bezpečnost:** Přidejte `config.py` do `.gitignore` - API klíč NIKDY nesmí být ve veřejném repository!

#### 3️⃣ Spusťte aplikaci

```bash
python app.py
```

**Aplikace běží na:** 🌐 **http://localhost:5000**

---

## 📁 Struktura projektu

```
pocasi_3/
│
├── 📄 app.py                      # Flask backend - Hlavní aplikace
├── ⚙️ config.py                   # Konfigurace (API klíč) - NEPŘIDÁVAT DO GITU!
├── 📋 requirements.txt            # Python závislosti
├── 📖 README.md                   # Tento soubor (rychlý start)
├── 📚 DOKUMENTACE.md              # Komplexní dokumentace
│
├── 📂 templates/
│   └── index.html                # HTML šablona (Jinja2)
│
└── 📂 static/
    ├── style.css                 # CSS styly + Dark Mode
    └── script.js                 # JavaScript logika + API integrace
```

### Popis souborů

| Soubor | Popis | Řádků kódu |
|--------|-------|------------|
| `app.py` | Flask backend, API orchestrace, helper funkce | ~160 |
| `config.py` | Konfigurace API klíče | ~2 |
| `templates/index.html` | HTML struktura, CDN skripty | ~115 |
| `static/style.css` | Responzivní styling, Dark Mode | ~524 |
| `static/script.js` | Frontend logika, Chart.js, Leaflet | ~354 |
| **CELKEM** | | **~1155 řádků** |

---

## 🖥️ Nasazení na Synology NAS

### Předpoklady
- ✅ SSH přístup k Synology
- ✅ Python 3 nainstalovaný (Package Center → Python 3)
- ✅ Základní znalost Linuxu

### Krok za krokem

#### 1. Nahrání souborů

**Metoda A: File Station**
- Nahrajte ZIP s projektem
- Rozbalte do `/volume1/web/pocasi_3/`

**Metoda B: SCP**
```bash
scp -r pocasi_3/ admin@192.168.1.100:/volume1/web/
```

#### 2. SSH připojení

```bash
ssh admin@192.168.1.100
```

#### 3. Instalace závislostí

```bash
cd /volume1/web/pocasi_3
python3 -m pip install --user flask requests
```

#### 4. Vytvoření config.py

```bash
nano config.py
# Vložte: OPEN_WEATHER_MAP_KEY = "váš_klíč"
# Uložte: CTRL+X, Y, Enter
```

#### 5. Test spuštění

```bash
python3 app.py
```

Otevřete: `http://IP_ADRESA_NAS:5000`

#### 6. Spuštění na pozadí (trvalé)

```bash
# Spuštění
nohup python3 app.py > app.log 2>&1 &

# Kontrola běhu
ps aux | grep "python3 app.py"

# Zastavení
pkill -f "python3 app.py"

# Sledování logů
tail -f app.log
```

#### 7. Automatické spuštění při bootu (Task Scheduler)

1. Control Panel → **Task Scheduler**
2. Create → **Triggered Task** → User-defined script
3. **General:**
   - Task: `Počasí - Autostart`
   - User: `root`
4. **Schedule:**
   - Run on: **Boot-up**
5. **Task Settings:**
   ```bash
   cd /volume1/web/pocasi_3 && python3 app.py
   ```
6. **Save** a **Enable**

---

## 🌐 API použití a limity

### OpenWeatherMap Free Tier

| Metrika | Limit | Poznámka |
|---------|-------|----------|
| Volání/minutu | 60 | Dostatečné pro malý provoz |
| Volání/den | 1,000 | ~40 uživatelů/den |
| Current Weather | ✅ Zdarma | Neomezený počet měst |
| Forecast 5 dní | ✅ Zdarma | 3h interval |
| One Call API 3.0 | ⚠️ Omezený | 1,000 volání/den |
| Tiles (mapy) | ✅ Zdarma | Neomezeno |

**Optimalizace:**
- Implementujte caching (např. Redis)
- Nastavte rate limiting
- Používejte CDN pro statické soubory

### API endpointy používané v aplikaci

1. **Current Weather** - Aktuální počasí
   ```
   https://api.openweathermap.org/data/2.5/weather
   ```

2. **Forecast** - 5-denní předpověď
   ```
   https://api.openweathermap.org/data/2.5/forecast
   ```

3. **One Call 3.0** - Výstrahy
   ```
   https://api.openweathermap.org/data/3.0/onecall
   ```

4. **Tiles** - Meteorologické mapy
   ```
   https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png
   ```

---

## 💻 Technologický stack

### Backend
| Technologie | Verze | Účel |
|-------------|-------|------|
| Python | 3.7+ | Programovací jazyk |
| Flask | 3.0.0 | Web framework |
| Requests | 2.31.0 | HTTP knihovna |

### Frontend
| Technologie | Verze | Účel |
|-------------|-------|------|
| HTML5 | - | Struktura |
| CSS3 | - | Styling (Flexbox, Grid, Variables) |
| JavaScript | ES6+ | Logika (Vanilla, bez frameworků) |

### Knihovny (CDN)
| Knihovna | Verze | Účel |
|----------|-------|------|
| Chart.js | 4.4.0 | Interaktivní grafy |
| Leaflet.js | 1.9.4 | Interaktivní mapy |
| Skycons | 1.0 | Animované ikony počasí |

### API
- **OpenWeatherMap Current Weather API** - Aktuální počasí
- **OpenWeatherMap Forecast API** - 5-denní předpověď
- **OpenWeatherMap One Call API 3.0** - Meteorologické výstrahy
- **OpenWeatherMap Tiles API** - Meteorologické mapy

---

## ⚙️ Konfigurace

### Výchozí nastavení

| Parametr | Hodnota | Kde změnit |
|----------|---------|------------|
| Port | 5000 | `app.py:159` |
| Host | 0.0.0.0 | `app.py:159` |
| Debug mode | True | `app.py:159` |
| Jazyk | Czech (cz) | `app.py:60,61` |
| Jednotky | Metric (°C, m/s) | `app.py:60,61` |
| Výchozí město | Opava | `script.js:50` |

### Změna portu

```python
# app.py, řádek 159
app.run(debug=True, host='0.0.0.0', port=5001)  # Změňte 5000 na jiný
```

### Změna výchozího města

```javascript
// script.js, řádek 50
fetchWeatherData('Praha');  // Změňte 'Opava' na jiné město
```

### Production mode

```python
# app.py, řádek 159
app.run(debug=False, host='0.0.0.0', port=5000)  # debug=False pro produkci
```

**Doporučení pro produkci:**
- Použijte WSGI server (Gunicorn, uWSGI)
- Nastavte reverse proxy (Nginx, Apache)
- Implementujte SSL/TLS (HTTPS)
- Aktivujte caching
- Monitorujte logy

---

## 🐛 Řešení problémů

### ❌ Port 5000 již používán

**Příznaky:**
```
OSError: [Errno 48] Address already in use
```

**Řešení:**
```python
# app.py, řádek 159
app.run(debug=True, host='0.0.0.0', port=5001)
```

### ❌ Module not found

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

### ❌ API klíč nefunguje

**Příznaky:**
- Chyba 401 Unauthorized
- "Invalid API key"

**Kontrola:**
1. Je API klíč v `config.py` správně?
2. Počkejte 10-15 minut po vytvoření klíče
3. Zkontrolujte [API Keys stránku](https://home.openweathermap.org/api_keys)

### ❌ Město nenalezeno

**Řešení:**
- Použijte anglický název: "Prague" místo "Praha"
- Přidejte kód země: "Opava,CZ"
- Zkontrolujte překlepy

### ❌ Mapa se nezobrazuje

**Možné příčiny:**
1. Leaflet CSS se nenačetl - zkontrolujte console (F12)
2. Map container má nulovou výšku
3. API klíč nefunguje pro tiles

### ❌ Výstrahy se nezobrazují

**Je to normální?**
- Výstrahy se zobrazují pouze když existují
- One Call API 3.0 může vyžadovat předplatné

**Více informací:** Viz [DOKUMENTACE.md](DOKUMENTACE.md) → Řešení problémů

---

## 📚 Dokumentace

### Soubory dokumentace

- **README.md** (tento soubor) - Rychlý start, instalace, základní použití
- **[DOKUMENTACE.md](DOKUMENTACE.md)** - Komplexní dokumentace:
  - Architektura aplikace
  - API integrace (detaily)
  - Backend kód (vysvětlení)
  - Frontend kód (vysvětlení)
  - Bezpečnost
  - Nasazení (production)
  - Troubleshooting (rozšířený)
  - Changelog

### Online zdroje

- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Chart.js Docs](https://www.chartjs.org/docs/)
- [Leaflet.js Docs](https://leafletjs.com/reference.html)

---

## 🤝 Přispívání

Příspěvky jsou vítány! Pokud chcete přispět:

1. Forkněte repository
2. Vytvořte feature branch (`git checkout -b feature/amazing-feature`)
3. Commitněte změny (`git commit -m 'Add amazing feature'`)
4. Pushněte do branch (`git push origin feature/amazing-feature`)
5. Otevřete Pull Request

### Roadmap (plánované funkce)

**v1.4:**
- [ ] PWA (Progressive Web App)
- [ ] Offline mode
- [ ] Push notifikace
- [ ] Historie vyhledávání
- [ ] Oblíbená města

**v1.5:**
- [ ] Vícejazyčnost (EN, DE, SK)
- [ ] Hodinová předpověď (48h)
- [ ] UV index
- [ ] Kvalita ovzduší
- [ ] Radar animace

---

## 📄 Licence

Tento projekt je **open source** a dostupný pro osobní i komerční použití.

**MIT License** - Volně použitelné, upravitelné a distribuovatelné.

---

## 👨‍💻 Autor

**Vytvořeno:** 2024
**Technologie:** Python, Flask, JavaScript
**Data:** OpenWeatherMap API

---

## ⭐ Podpora

Pokud se vám projekt líbí:
- ⭐ Dejte hvězdičku na GitHubu
- 🐛 Nahlaste chyby přes Issues
- 💡 Navrhněte nové funkce
- 🤝 Přispějte kódem

---

## 📞 Kontakt a podpora

- **Issues:** Pro bugreporty a feature requesty
- **Pull Requests:** Pro příspěvky kódem
- **Dokumentace:** [DOKUMENTACE.md](DOKUMENTACE.md)

---

**Děkujeme za používání aplikace Počasí!** 🌤️
