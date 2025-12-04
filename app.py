from flask import Flask, render_template, jsonify
import requests
from datetime import datetime, timezone
import config

app = Flask(__name__)

# API klíč pro OpenWeatherMap
API_KEY = config.OPEN_WEATHER_MAP_KEY
BASE_URL = "https://api.openweathermap.org/data/2.5"
ONE_CALL_URL = "https://api.openweathermap.org/data/3.0/onecall"

def degrees_to_direction(degrees):
    """Převod stupňů větru na směr (N, NE, E, SE, S, SW, W, NW)"""
    directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    index = round(degrees / 45) % 8
    return directions[index]

def unix_to_time(timestamp, timezone_offset=0):
    """Převod UNIX timestamp na lokální čas ve formátu HH:MM"""
    dt = datetime.fromtimestamp(timestamp + timezone_offset, tz=timezone.utc)
    return dt.strftime("%H:%M")

@app.route('/')
def index():
    """Hlavní stránka aplikace"""
    return render_template('index.html')

@app.route('/api/weather/<city>')
def get_weather(city):
    """
    Endpoint pro získání počasí pro zadané město.
    Vrací aktuální počasí, týdenní přehled a data pro 24h graf.
    """
    try:
        # 1. Získání aktuálního počasí
        current_url = f"{BASE_URL}/weather?units=metric&lang=cz&q={city}&appid={API_KEY}"
        current_response = requests.get(current_url)

        if current_response.status_code != 200:
            return jsonify({"error": "Město nenalezeno"}), 404

        current_data = current_response.json()

        # 2. Získání 5-denní předpovědi (data každé 3h)
        forecast_url = f"{BASE_URL}/forecast?units=metric&lang=cz&q={city}&appid={API_KEY}"
        forecast_response = requests.get(forecast_url)

        if forecast_response.status_code != 200:
            return jsonify({"error": "Nepodařilo se načíst předpověď"}), 404

        forecast_data = forecast_response.json()

        # Získání souřadnic pro One Call API
        lat = current_data["coord"]["lat"]
        lon = current_data["coord"]["lon"]
        timezone_offset = current_data.get("timezone", 0)

        # 3. Získání dat z One Call API (pro alerts a další detaily)
        onecall_url = f"{ONE_CALL_URL}?lat={lat}&lon={lon}&units=metric&lang=cz&appid={API_KEY}"
        onecall_response = requests.get(onecall_url)

        alerts_data = []
        if onecall_response.status_code == 200:
            onecall_data = onecall_response.json()
            # Zpracování výstrah, pokud existují
            if "alerts" in onecall_data:
                for alert in onecall_data["alerts"]:
                    alerts_data.append({
                        "event": alert.get("event", "Neznámá výstraha"),
                        "description": alert.get("description", "Bez popisu"),
                        "start": unix_to_time(alert.get("start", 0), timezone_offset),
                        "end": unix_to_time(alert.get("end", 0), timezone_offset)
                    })

        # 4. Zpracování aktuálního počasí
        wind_deg = current_data.get("wind", {}).get("deg", 0)
        wind_direction = degrees_to_direction(wind_deg)

        current_weather = {
            "city": current_data["name"],
            "country": current_data["sys"]["country"],
            "temperature": round(current_data["main"]["temp"]),
            "feels_like": round(current_data["main"]["feels_like"]),
            "humidity": current_data["main"]["humidity"],
            "pressure": current_data["main"]["pressure"],
            "visibility": current_data.get("visibility", 0),
            "clouds": current_data.get("clouds", {}).get("all", 0),
            "description": current_data["weather"][0]["description"].capitalize(),
            "icon": current_data["weather"][0]["icon"],
            "weather_id": current_data["weather"][0]["id"],
            "wind_speed": round(current_data["wind"]["speed"], 1),  # m/s
            "wind_direction": wind_direction,
            "wind_deg": wind_deg,
            "sunrise": unix_to_time(current_data["sys"]["sunrise"], timezone_offset),
            "sunset": unix_to_time(current_data["sys"]["sunset"], timezone_offset),
            "lat": lat,
            "lon": lon
        }

        # 4. Zpracování týdenního přehledu (max/min pro každý den)
        daily_forecast = {}
        for item in forecast_data["list"]:
            date = datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d")
            temp = item["main"]["temp"]
            icon = item["weather"][0]["icon"]
            weather_id = item["weather"][0]["id"]

            if date not in daily_forecast:
                daily_forecast[date] = {
                    "date": date,
                    "temps": [temp],
                    "icon": icon,
                    "weather_id": weather_id
                }
            else:
                daily_forecast[date]["temps"].append(temp)

        # Vytvoření pole s max/min teplotami pro každý den
        weekly_data = []
        for date, data in list(daily_forecast.items())[:5]:  # Prvních 5 dní
            day_name = datetime.strptime(date, "%Y-%m-%d").strftime("%a %d.%m")
            weekly_data.append({
                "date": day_name,
                "temp_max": round(max(data["temps"])),
                "temp_min": round(min(data["temps"])),
                "icon": data["icon"],
                "weather_id": data["weather_id"]
            })

        # 5. Zpracování dat pro 24h graf (následujících 8 záznamů = 24h)
        hourly_data = []
        for item in forecast_data["list"][:8]:  # Prvních 8 záznamů (3h interval = 24h)
            time = datetime.fromtimestamp(item["dt"]).strftime("%H:%M")
            temp = round(item["main"]["temp"], 1)
            hourly_data.append({
                "time": time,
                "temp": temp
            })

        # 6. Sloučení všech dat do jednoho JSON objektu
        result = {
            "current": current_weather,
            "weekly": weekly_data,
            "hourly": hourly_data,
            "alerts": alerts_data,
            "map": {
                "api_key": API_KEY,
                "lat": lat,
                "lon": lon
            }
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Chyba serveru: {str(e)}"}), 500

if __name__ == '__main__':
    print("🌤️  Počasí aplikace běží na http://localhost:5000")
    print("📍 Pro ukončení stiskni CTRL+C")
    app.run(debug=True, host='0.0.0.0', port=5000)
