# ASTRA: 3D Junior Astronaut Mission Trainer & Real Space Station Simulator
**Official NASA Space Apps Challenge 2026 Project — Specially Designed for Kids (Ages 7–12)**

[![NASA Space Apps](https://img.shields.io/badge/NASA-Space%20Apps%202026-blue.svg)](https://www.spaceappschallenge.org/)
[![Visual Style](https://img.shields.io/badge/Format-Full%203D%20Explorable%20Station-brightgreen.svg)](#)
[![Unity 6](https://img.shields.io/badge/Unity-6000.5.2f1-black.svg)](https://unity.com/)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20WebGL-success.svg)](https://threejs.org/)
[![NASA DONKI](https://img.shields.io/badge/Live%20Data-NASA%20DONKI%20API-red.svg)](https://api.nasa.gov/DONKI/)

> ### **"STEP INSIDE HUMANITY'S OUTPOST IN IMMERSIVE 3D!"**
> **ASTRA 3D** transforms kids into Junior Astronaut Cadets exploring a full 3D space station with real physical room boundaries, physical collisions (no walking through walls or doors!), live panoramic cupola windows displaying real-time NASA DONKI space weather (solar flares, coronal mass ejections, and aurorae), a daily astronaut To-Do list (morning vitals, 2-hour ARED microgravity bone loss workout, strawberry harvesting, ECLSS water recycling, and Houston teletype dispatch), tactical top-down minimap with labeled sectors, and delayed consequential mission choices!

---

## 🎮 Play Right Now in Your Browser

* 🌐 **Live Web URL:** [http://localhost:8000](http://localhost:8000)
* 📂 **Direct HTML File:** [`index.html`](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/index.html)
* ⚡ **One-Click Browser Launcher:** Double-click [`play.bat`](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/play.bat)
* 🪐 **Open in Unity 6 Editor:** Double-click [`open_in_unity.bat`](file:///c:/Users/tamil/OneDrive/문서/GitHub/Mangorice/NASA%20hackathon/open_in_unity.bat)

---

## 🕹️ Full 3D Controls & Navigation

* **[W] [A] [S] [D] (or Arrow Keys):** Move cadet astronaut in all 360-degree directions across station corridors and rooms.
* **Physical Wall Collisions:** Accurate bounding box collision system prevents clipping or walking through station walls, airlocks, and observation glass!
* **[SPACEBAR]:** Floaty zero-gravity jump ($0.166\text{ g}$ on Moon vs $0.38\text{ g}$ on Mars) with jetpack thruster puffs!
* **Mouse Drag / Touch:** 360-degree orbital camera rotation to inspect the outpost interior and gaze out through observation cupolas.

---

## 🗺️ Top Tactical Minimap & Outpost Sectors

Located at the top of the HUD with **live resource gauges positioned directly below**:
* 🔴 **`[AIRLOCK]` ($X = -40$):** Heavy blast hatch leading to the lunar/martian surface, rover, and rocket.
* 🔵 **`[ECLSS WATER]` ($X = -22$):** Distillation and water recovery tanks recycling over 98% of outpost moisture.
* ⚪ **`[COMMAND]` ($X = 0$):** Central navigation bridge with rotating holographic celestial globe.
* 🟢 **`[FOOD DOME]` ($X = +24$):** Hydroponic greenhouse with glowing grow lamps and ripe strawberries.
* 🟣 **`[ARED GYM]` ($Z = +22$):** Resistive exercise gym with ARED machine where astronauts train to prevent bone density loss.
* 🟡 **`[SOLAR FARM]` ($Z = -22$):** High-efficiency photovoltaic array providing primary electrical power.

---

## 📋 Astronaut Daily Routine & To-Do List

NASA astronauts must follow strict schedules to stay healthy and maintain station systems:
1. **Morning Telemetry & Vitals Check:** Record heart rate and verify cabin oxygen levels.
2. **2-Hour ARED Gym Workout:** *Educational Fact: Without gravity pulling on bones, humans lose 1% to 2% of their bone mass every month in space! Astronauts use vacuum cylinders on the Advanced Resistive Exercise Device (ARED) to simulate lifting weights!*
3. **Harvest Strawberries in Food Dome:** Pluck fresh fruit from aeroponic trays to stop astronaut menu fatigue and generate oxygen.
4. **Cycle ECLSS Water Recovery Filters:** Inspect the catalytic distillation processors.
5. **Evening NASA Houston Dispatch Uplink:** Transmit daily telemetry logs back to Earth.

---

## ☀️ Live NASA DONKI Space Weather & Window View

* **Panoramic Cupola Observation Windows:** Look directly outside the station to observe deep space, rotating Earth, the directional Sun, and incoming space weather.
* **Real-time Solar Flares & CMEs:** Powered by the NASA Space Weather Database Of Notifications, Knowledge, Information (DONKI).
* **Operational Radiation Stakes:** When an M-Class solar flare strikes, high-energy proton particle streaks and auroral ionization glow visibly outside the windows. The player must choose whether to engage heavy lead/polyethylene shielding or redirect power.
* **Delayed Consequential Choices:** Shielding the base diverts solar power away from the hydroponics dome heaters, causing crops to wither 2 sols later—teaching kids about systemic balance!

---

## 🛠️ Unity 6 Architecture (`UnityProject/`)

* **`Station3DInteriorBuilder.cs`:** Procedural generator for the full 3D space station interior with physical box colliders on walls, transparent cupola windows, ARED gym, hydroponics dome, ECLSS water recovery center, and airlock bay.
* **`Astronaut3DController.cs`:** 360-degree character controller with `CharacterController`, gravity switching ($0.166\text{ g}$ Moon vs $0.38\text{ g}$ Mars), smooth mouse look, and physical collision prevention.
* **`DailyTodoListManager.cs`:** In-game To-Do list, routine tasks, and science experiments with educational facts.
* **`Minimap3DController.cs`:** Real-time top-down minimap camera tracking player location across labeled outpost sectors.
* **`WindowWeatherViewer.cs`:** Dynamic space weather renderer visible through observation windows with solar flare particles and auroral lighting.
* **`SpaceRadiationRendererFeature.cs` (`Assets/Scripts/URP/`):** Unity 6 URP Render Graph compliant `ScriptableRendererFeature` validated against the `/validate-urp-render-graph-renderer-feature` skill guidelines (`RecordRenderGraph`, explicit texture wiring, raster pass binding, zero runtime allocations).
* **`SceneBootstrapper.cs`:** Automatically instantiates the full 3D station, managers, and cadet character upon pressing Play in the Unity Editor.

---

## 🏆 Official NASA Space Apps Challenge 2026 Diploma
Upon successfully surviving and managing the outpost for 30 Sols, cadets receive an official gold-embossed **NASA Space Apps Commander Certificate** declaring their mastery of microgravity biology, ECLSS water recycling, and space weather radiation management!
