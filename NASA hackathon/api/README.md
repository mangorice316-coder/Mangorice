# 🚀 NASA Junior Astronaut Mission Trainer — API Connection Guide

Welcome to the **API Configuration Subsystem** for the **NASA Junior Astronaut Mission Trainer**!

This folder provides everything you need to connect your **official NASA Open API key** to power live space weather telemetry, satellite feeds, Mars rover cameras, and deep space exploration.

---

## 🔑 1. How to Get a Free NASA API Key (30 Seconds)

1. Open your browser and go to: **[https://api.nasa.gov/](https://api.nasa.gov/)**
2. Fill in:
   - **First Name**
   - **Last Name**
   - **Email Address**
3. Click **"Signup"**.
4. Your personal NASA API key will appear instantly on screen (and sent to your email).
   - Format example: `u8YtK8m92kLm9qV41P93nZbC081XaQ98yZ12345`

---

## 🛠️ 2. Where to Put Your API Key

You have **two easy ways** to connect your key:

### Method A: Directly in Code (Recommended for Developers)
1. Open [`api/config.js`](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/api/config.js) in your editor.
2. Find line 33:
   ```javascript
   NASA_API_KEY: "DEMO_KEY",
   ```
3. Replace `"DEMO_KEY"` with your key:
   ```javascript
   NASA_API_KEY: "YOUR_ACTUAL_KEY_HERE",
   ```
4. Save the file! The game will immediately recognize and use your personal key.

---

### Method B: Right Inside the Running Game (Interactive)
1. Launch the game in your browser (`http://localhost:8000` or double-click `play.bat`).
2. In the top navigation bar, click the **`🔑 NASA API Key`** button.
3. Paste your API key into the input field.
4. Click **"⚡ Connect"**.
5. The game will test your key against NASA's live servers in real-time, show your ping and rate limits, and save it to your browser's secure local storage.

---

## 🛰️ 3. What NASA Services Connect With Your Key?

| Service | Endpoint | In-Game Feature |
| :--- | :--- | :--- |
| **NASA DONKI CME** | `/DONKI/CME` | Real-time Coronal Mass Ejection plasma speed tracking and solar radiation alerts. |
| **NASA DONKI Solar Flares** | `/DONKI/FLR` | Live X-class, M-class, and C-class flare detection from SDO & GOES satellites. |
| **NASA DONKI Notifications**| `/DONKI/notifications` | Live flight-rule warnings streaming from the Space Weather Prediction Center. |
| **NASA APOD** | `/planetary/apod` | High-resolution deep space imagery from Hubble & James Webb Space Telescope. |
| **Mars Perseverance Rover** | `/mars-photos/.../perseverance` | Raw photo telemetry from Jezero Crater on Mars. |
| **Mars Curiosity Rover** | `/mars-photos/.../curiosity` | Raw mastcam and navigation camera shots from Gale Crater. |
| **Asteroids (NeoWs)** | `/neo/rest/v1/feed` | Real-time tracking of near-Earth asteroids and close approaches. |

---

## ⚡ Rate Limits: DEMO_KEY vs. Personal Key

| Key Type | Hourly Request Limit | Daily Request Limit | Best For |
| :--- | :--- | :--- | :--- |
| **`DEMO_KEY`** (Default) | 30 requests / hour | 50 requests / day | Quick testing & offline use |
| **`Personal NASA Key`** | **1,000 requests / hour** | **Unlimited** | Seamless gameplay, live streams & competition judging |

> **Offline Protection**: If your computer loses internet access or hits a rate limit, the Mission Trainer automatically falls back to the bundled **May 2024 Solar Superstorm verified telemetry dataset** (`assets/donki_dataset.json`), ensuring zero crashes or interruptions!

---

## 🎮 4. Unity 3D Engine Integration

If you are running the game in **Unity 3D**:
1. Open the Unity project.
2. The C# client is located at:
   - [`UnityProject/Assets/Scripts/API/APIConfig.cs`](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/UnityProject/Assets/Scripts/API/APIConfig.cs)
   - [`UnityProject/Assets/Scripts/NASADataService.cs`](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/UnityProject/Assets/Scripts/NASADataService.cs)
3. Set your key in `APIConfig.cs` or in the `NASADataService` inspector component in the scene hierarchy.

---

## 🔒 5. Privacy & Security
- Your API key is stored strictly on your local computer (`api/config.js` and browser `localStorage`).
- It is only transmitted directly to official **`https://api.nasa.gov/`** SSL-encrypted endpoints.
- No third-party servers ever receive or store your key.
