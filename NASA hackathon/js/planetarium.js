// NASA JUNIOR ASTRONAUT MISSION TRAINER - 3D SOLAR SYSTEM & PLANET EXPLORER
const PlanetExplorer = (() => {
  const PLANETS = [
    {
      id: 'sun',
      name: 'The Sun',
      type: 'Yellow Dwarf Star (G2V)',
      diameter: '1,392,700 km (109x Earth)',
      distance: 'Center of Solar System',
      gravity: '27.9 g (274 m/s²)',
      temp: '5,500°C surface (15M°C core)',
      day: '25–35 Earth Days (Differential)',
      year: '230 Million Earth Years (Galactic Orbit)',
      moons: 'Orbits center of Milky Way',
      color: '#FFB85B',
      radiusPx: 28,
      orbitR: 0,
      speed: 0,
      facts: 'The Sun contains 99.86% of all the mass in the entire Solar System! Its energy is powered by nuclear fusion, turning 600 million tons of hydrogen into helium every single second.'
    },
    {
      id: 'mercury',
      name: 'Mercury',
      type: 'Terrestrial Rocky Planet',
      diameter: '4,879 km',
      distance: '57.9 Million km (0.39 AU)',
      gravity: '0.38 g (3.7 m/s²)',
      temp: '-180°C to +430°C',
      day: '59 Earth Days',
      year: '88 Earth Days',
      moons: '0 Moons',
      color: '#A0AEC0',
      radiusPx: 6,
      orbitR: 50,
      speed: 0.04,
      facts: 'Mercury is the smallest planet and closest to the Sun. Because it has almost no atmosphere to trap heat, its day side reaches 430°C while its night side plunges to -180°C!'
    },
    {
      id: 'venus',
      name: 'Venus',
      type: 'Terrestrial Rocky Planet',
      diameter: '12,104 km',
      distance: '108.2 Million km (0.72 AU)',
      gravity: '0.90 g (8.87 m/s²)',
      temp: '465°C (Hottest Planet)',
      day: '243 Earth Days (Spins backwards!)',
      year: '225 Earth Days',
      moons: '0 Moons',
      color: '#ED8936',
      radiusPx: 9,
      orbitR: 80,
      speed: 0.03,
      facts: 'Venus has a runaway greenhouse effect caused by a dense 96% carbon dioxide atmosphere with clouds of sulfuric acid. Surface atmospheric pressure is 92 times heavier than Earth!'
    },
    {
      id: 'earth',
      name: 'Earth',
      type: 'Terrestrial Ocean Planet',
      diameter: '12,742 km',
      distance: '149.6 Million km (1.0 AU)',
      gravity: '1.0 g (9.81 m/s²)',
      temp: '-88°C to +58°C (Avg 15°C)',
      day: '24 Hours',
      year: '365.25 Days',
      moons: '1 (The Moon)',
      color: '#3182CE',
      radiusPx: 10,
      orbitR: 115,
      speed: 0.025,
      facts: 'The only known world harboring life! Earth’s magnetic field shields us from dangerous solar winds, and 71% of its surface is covered in liquid water.'
    },
    {
      id: 'mars',
      name: 'Mars',
      type: 'Terrestrial Rocky Planet',
      diameter: '6,779 km',
      distance: '227.9 Million km (1.52 AU)',
      gravity: '0.38 g (3.71 m/s²)',
      temp: '-140°C to +20°C (Avg -60°C)',
      day: '24h 37m (1 Sol)',
      year: '687 Earth Days',
      moons: '2 (Phobos & Deimos)',
      color: '#DD6B20',
      radiusPx: 7,
      orbitR: 155,
      speed: 0.02,
      facts: 'Home to Olympus Mons, the largest volcano in the Solar System—three times taller than Mount Everest! NASA rovers are actively searching ancient lakebeds for evidence of past microscopic life.'
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      type: 'Gas Giant',
      diameter: '139,820 km (11x Earth)',
      distance: '778.5 Million km (5.2 AU)',
      gravity: '2.53 g (24.79 m/s²)',
      temp: '-110°C (Cloud tops)',
      day: '9h 55m (Fastest spinner!)',
      year: '11.86 Earth Years',
      moons: '95 Confirmed Moons (Europa, Io, Ganymede)',
      color: '#D69E2E',
      radiusPx: 18,
      orbitR: 205,
      speed: 0.012,
      facts: 'Jupiter is so massive that more than 1,300 Earths could fit inside it. Its moon Ganymede is larger than planet Mercury and possesses its own magnetic field!'
    },
    {
      id: 'saturn',
      name: 'Saturn',
      type: 'Gas Giant (Ringed)',
      diameter: '116,460 km (9x Earth)',
      distance: '1.43 Billion km (9.58 AU)',
      gravity: '1.06 g (10.44 m/s²)',
      temp: '-140°C',
      day: '10h 33m',
      year: '29.45 Earth Years',
      moons: '146 Confirmed Moons (Titan, Enceladus)',
      color: '#ECC94B',
      radiusPx: 16,
      orbitR: 260,
      speed: 0.008,
      facts: 'Saturn’s spectacular rings are made of billions of chunks of pure water ice ranging from dust grains to house-sized boulders. Saturn is so light that if you had a bathtub big enough, it would float on water!'
    },
    {
      id: 'uranus',
      name: 'Uranus',
      type: 'Ice Giant',
      diameter: '50,724 km (4x Earth)',
      distance: '2.87 Billion km (19.2 AU)',
      gravity: '0.89 g (8.69 m/s²)',
      temp: '-224°C (Coldest atmosphere)',
      day: '17h 14m',
      year: '84 Earth Years',
      moons: '28 Confirmed Moons (Miranda, Titania)',
      color: '#4FD1C5',
      radiusPx: 12,
      orbitR: 310,
      speed: 0.005,
      facts: 'Uranus is uniquely tipped on its side with an axial tilt of 98 degrees, likely caused by a collision with an Earth-sized protoplanet billions of years ago!'
    },
    {
      id: 'neptune',
      name: 'Neptune',
      type: 'Ice Giant',
      diameter: '49,244 km (3.8x Earth)',
      distance: '4.50 Billion km (30.0 AU)',
      gravity: '1.14 g (11.15 m/s²)',
      temp: '-214°C',
      day: '16h 6m',
      year: '164.8 Earth Years',
      moons: '16 Confirmed Moons (Triton)',
      color: '#3182CE',
      radiusPx: 11,
      orbitR: 360,
      speed: 0.003,
      facts: 'Neptune has the fastest supersonic winds in the Solar System, whipping up storms at over 2,100 km/h (1,300 mph)! Its large moon Triton orbits backwards.'
    }
  ];

  let selectedPlanet = PLANETS[3]; // Earth default
  let discoveredPlanets = ['earth', 'moon'];
  let animId;

  function renderHub(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="hubContainer">
        <div class="hubHeader">
          <div class="eyebrow">NASA SOLAR SYSTEM EXPLORATION</div>
          <h1>Interactive Planet Explorer & Orrery</h1>
          <p>Explore the Sun, planets, and celestial bodies of our Solar System. Click any planet in the interactive orbital map to analyze its atmospheric data, physical scale, and NASA exploration history!</p>
        </div>

        <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:20px;margin-top:16px;">
          <!-- Left: 2D Interactive Orbit Orrery -->
          <div class="glass-panel" style="padding:16px;display:flex;flex-direction:column;align-items:center;">
            <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span class="eyebrow">ORBITAL MAP (CLICK PLANET TO SCAN)</span>
              <span style="font-family:var(--font-mono);font-size:10px;color:var(--cyan);" id="discoveredCount">DISCOVERED: 2 / 9</span>
            </div>
            <canvas id="orreryCanvas" width="600" height="460" style="width:100%;max-width:600px;border-radius:10px;background:#030712;border:1px solid rgba(66,232,255,0.2);cursor:pointer;"></canvas>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;justify-content:center;">
              ${PLANETS.map(p => `
                <button class="btn small planetPickerBtn" data-id="${p.id}" style="padding:4px 8px;font-size:11px;">
                  <span style="color:${p.color}">●</span> ${p.name}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Right: Planetary Telemetry Card -->
          <div class="glass-panel" style="padding:22px;display:flex;flex-direction:column;justify-content:space-between;" id="planetInfoPanel">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>
    `;

    updateInfoPanel();
    initOrrery();

    el.querySelectorAll('.planetPickerBtn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const p = PLANETS.find(x => x.id === id);
        if (p) selectPlanet(p);
      };
    });
  }

  function selectPlanet(planet) {
    selectedPlanet = planet;
    SoundEngine.click();
    if (!discoveredPlanets.includes(planet.id)) {
      discoveredPlanets.push(planet.id);
      PlayerProfile.addXP(40, `Discovered ${planet.name}`);
      if (discoveredPlanets.length >= PLANETS.length) {
        PlayerProfile.unlockAchievement('planet_master', 'Planet Master');
      }
    }
    const countEl = document.getElementById('discoveredCount');
    if (countEl) countEl.textContent = `DISCOVERED: ${discoveredPlanets.length} / ${PLANETS.length}`;
    updateInfoPanel();
  }

  function updateInfoPanel() {
    const el = document.getElementById('planetInfoPanel');
    if (!el) return;
    const p = selectedPlanet;

    el.innerHTML = `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div class="eyebrow" style="color:${p.color}">${p.type}</div>
          <span style="font-family:var(--font-mono);font-size:10px;padding:3px 8px;border-radius:10px;background:rgba(255,255,255,0.06);">NASA CATALOG</span>
        </div>
        <h2 style="font-family:var(--font-display);font-size:28px;margin-bottom:4px;">${p.name}</h2>
        <div style="font-size:12px;color:var(--silver);margin-bottom:16px;">Distance from Sun: <b style="color:var(--white);">${p.distance}</b></div>

        <!-- Telemetry Grid -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-family:var(--font-mono);font-size:11px;">
          <div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);">
            <span style="color:var(--silver);display:block;font-size:9px;">DIAMETER</span>
            <strong style="color:var(--cyan);font-size:13px;">${p.diameter}</strong>
          </div>
          <div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);">
            <span style="color:var(--silver);display:block;font-size:9px;">SURFACE GRAVITY</span>
            <strong style="color:var(--amber);font-size:13px;">${p.gravity}</strong>
          </div>
          <div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);">
            <span style="color:var(--silver);display:block;font-size:9px;">TEMPERATURE</span>
            <strong style="color:var(--white);font-size:13px;">${p.temp}</strong>
          </div>
          <div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);">
            <span style="color:var(--silver);display:block;font-size:9px;">KNOWN MOONS</span>
            <strong style="color:var(--green);font-size:13px;">${p.moons}</strong>
          </div>
          <div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);">
            <span style="color:var(--silver);display:block;font-size:9px;">DAY LENGTH</span>
            <strong style="color:var(--silver);font-size:13px;">${p.day}</strong>
          </div>
          <div style="background:rgba(255,255,255,0.04);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);">
            <span style="color:var(--silver);display:block;font-size:9px;">YEAR LENGTH</span>
            <strong style="color:var(--silver);font-size:13px;">${p.year}</strong>
          </div>
        </div>

        <div class="factBox" style="background:rgba(11,21,48,0.7);border-color:rgba(66,232,255,0.25);padding:14px;border-radius:10px;margin-top:16px;">
          <b style="color:var(--cyan);font-family:var(--font-display);display:block;margin-bottom:4px;">🔭 NASA SCIENCE EXPLORATION NOTES:</b>
          <p style="font-size:12px;color:var(--silver);line-height:1.5;">${p.facts}</p>
        </div>
      </div>

      <div style="margin-top:16px;">
        <button class="btn primary" style="width:100%;" onclick="PlanetExplorer.logDiscovery()">
          ✓ Log into Cadet Discovery Book (+40 XP)
        </button>
      </div>
    `;
  }

  function logDiscovery() {
    SoundEngine.success();
    PlayerProfile.unlockCollectible(selectedPlanet.id, selectedPlanet.name);
    if (typeof toast === 'function') toast(`Cataloged ${selectedPlanet.name} in Discovery Archive!`);
  }

  function initOrrery() {
    const canvas = document.getElementById('orreryCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    let angles = PLANETS.map(() => Math.random() * Math.PI * 2);

    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;

      // Click detection on planets
      PLANETS.forEach((p, idx) => {
        if (p.id === 'sun') {
          if (Math.hypot(mx - cx, my - cy) < p.radiusPx) selectPlanet(p);
        } else {
          const px = cx + Math.cos(angles[idx]) * (p.orbitR * 0.52);
          const py = cy + Math.sin(angles[idx]) * (p.orbitR * 0.52);
          if (Math.hypot(mx - px, my - py) < p.radiusPx + 6) {
            selectPlanet(p);
          }
        }
      });
    };

    function loop() {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97) % canvas.width;
        const sy = (i * 131) % canvas.height;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      // Draw Orbit Rings
      PLANETS.forEach((p, idx) => {
        if (p.orbitR > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, p.orbitR * 0.52, 0, Math.PI * 2);
          ctx.strokeStyle = p === selectedPlanet ? 'rgba(66, 232, 255, 0.45)' : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = p === selectedPlanet ? 1.5 : 1;
          ctx.stroke();

          // Advance orbit angle
          angles[idx] += p.speed * 0.4;
        }
      });

      // Draw Planets
      PLANETS.forEach((p, idx) => {
        const r = p.orbitR * 0.52;
        const px = p.id === 'sun' ? cx : cx + Math.cos(angles[idx]) * r;
        const py = p.id === 'sun' ? cy : cy + Math.sin(angles[idx]) * r;

        // Glow for Sun or selected planet
        if (p.id === 'sun' || p === selectedPlanet) {
          ctx.beginPath();
          ctx.arc(px, py, p.radiusPx + 8, 0, Math.PI * 2);
          ctx.fillStyle = p.id === 'sun' ? 'rgba(255, 184, 91, 0.25)' : 'rgba(66, 232, 255, 0.35)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(px, py, p.radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Rings for Saturn
        if (p.id === 'saturn') {
          ctx.beginPath();
          ctx.ellipse(px, py, p.radiusPx + 9, 4, 0.4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(236, 201, 75, 0.8)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Selected halo indicator
        if (p === selectedPlanet) {
          ctx.beginPath();
          ctx.arc(px, py, p.radiusPx + 5, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      if (document.getElementById('orreryCanvas')) {
        animId = requestAnimationFrame(loop);
      }
    }
    loop();
  }

  return {
    renderHub,
    selectPlanet,
    logDiscovery
  };
})();
