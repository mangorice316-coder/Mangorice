# 🛰️ NASA Junior Astronaut Mission Trainer — 5-Key API Integration Guide

Welcome to the **5-Key Deep Space Telemetry Architecture** for the **NASA Junior Astronaut Mission Trainer**.

This framework integrates **5 mission-critical API services** to provide cadets and judges with a full-scale astronaut simulation combining NASA live space data, AI mentor intelligence, satellite orbital tracking, and spaceport weather.

---

## 🔑 The 5 Mission API Keys

| Slot # | Key Name | Service & Provider | What It Powers In-Game | Signup Link |
| :--- | :--- | :--- | :--- | :--- |
| **Key 1** | `NASA_PRIMARY_KEY` | **NASA Open Data** | DONKI Solar Flares, Coronal Mass Ejections (CME), Mars Perseverance & Curiosity photos, APOD, Asteroids (NeoWs). | [api.nasa.gov](https://api.nasa.gov/) |
| **Key 2** | `AI_ASSISTANT_KEY` | **Google Gemini / OpenAI** | **NOVA AI Assistant**: Dynamic voice/chat astronaut mentoring, live science Q&A, and adaptive mission debriefs. | [aistudio.google.com](https://aistudio.google.com/) |
| **Key 3** | `NASA_SECONDARY_KEY` | **NASA Failover Pool** | Automatic rate-limit failover and team key load-balancing (boosts capacity to 2,000+ req/hr). | [api.nasa.gov](https://api.nasa.gov/) |
| **Key 4** | `SATELLITE_TRACKER_KEY`| **N2YO / Space-Track** | Real-time orbital passes for the International Space Station (ISS), Artemis Gateway, and Hubble. | [n2yo.com/api](https://www.n2yo.com/api/) |
| **Key 5** | `SPACEPORT_WEATHER_KEY`| **OpenWeatherMap** | Live launch telemetry from Kennedy Space Center (Pad 39B, Florida) & Mars environmental monitoring. | [openweathermap.org](https://openweathermap.org/api) |

---

## 🛠️ Two Ways to Configure Your 5 Keys

### Method A: Directly in Code (`api/config.js`)
Open [**`api/config.js`**](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/api/config.js) and populate the `KEYS` object:

```javascript
KEYS: {
  // 1. Primary NASA Open API Key
  NASA_PRIMARY_KEY: "YOUR_NASA_KEY_HERE",

  // 2. AI Intelligence (Google Gemini "AIza..." or OpenAI "sk-...")
  AI_ASSISTANT_KEY: "YOUR_GEMINI_OR_OPENAI_KEY_HERE",

  // 3. Secondary NASA Key / Failover Pool
  NASA_SECONDARY_KEY: "YOUR_SECOND_NASA_KEY_HERE",

  // 4. Satellite & Orbit Tracker (N2YO)
  SATELLITE_TRACKER_KEY: "YOUR_N2YO_KEY_HERE",

  // 5. Spaceport Launch Weather (OpenWeatherMap)
  SPACEPORT_WEATHER_KEY: "YOUR_OPENWEATHER_KEY_HERE"
}
```

### Method B: In-Game Interactive 5-Key Command Center
1. Launch the game in your browser (`http://localhost:8000` or double-click `play.bat`).
2. In the top navigation bar, click the **`🔑 APIs · X/5 ACTIVE`** button.
3. You will see all 5 key slots with:
   - Dedicated password-masked input fields (with `👁️` peek button).
   - Direct links to free signup pages.
   - Individual **`💾 Save`** and **`⚡ Test`** buttons.
   - A **`⚡ Test All 5 Keys`** master diagnostic button that pings all services in parallel and displays latency, status, and remaining quota.

---

## 🛡️ Key Rotation & Offline Resilience
- **Team Load-Balancing Pool**: If you have multiple NASA keys for your team, add them to `NASA_KEY_POOL` in `api/config.js`. If one key hits NASA's rate limit (HTTP 429), the engine automatically rotates to the next key without interrupting gameplay.
- **100% Offline Mode**: If any key is missing or internet connectivity is unavailable, the simulation automatically uses high-fidelity cached datasets (May 2024 Solar Superstorm, Apollo 17 & Perseverance panoramas, nominal ISS orbit baseline, and Kennedy Space Center telemetry).

---

## 🎮 Unity 3D Engine Support
If you open the project in Unity, all 5 keys are also exposed in C#:
- [**`UnityProject/Assets/Scripts/API/APIConfig.cs`**](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/UnityProject/Assets/Scripts/API/APIConfig.cs)
- Access keys in any C# script via `APIConfig.GetNASAKey()`, `APIConfig.GetAIKey()`, `APIConfig.GetSatelliteKey()`, etc.
