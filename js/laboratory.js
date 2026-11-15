// NASA JUNIOR ASTRONAUT MISSION TRAINER - INTERACTIVE SPACE LABORATORY
const SpaceLaboratory = (() => {
  const EXPERIMENTS = [
    {
      id: 'gravity',
      title: 'Planetary Gravity & Vacuum Drop',
      badge: 'EXPERIMENT 01',
      icon: '⚖️',
      desc: 'Compare the acceleration of gravity across Earth, Moon, Mars, and Jupiter. Drop a hammer and a feather simultaneously in air vs vacuum to recreate Apollo 15!',
      xp: 200,
      concepts: ['Gravitational Acceleration (g)', 'Air Resistance', 'Apollo 15 Experiment']
    },
    {
      id: 'solar',
      title: 'Solar System Physical Comparison',
      badge: 'EXPERIMENT 02',
      icon: '🪐',
      desc: 'Interact with relative planetary scales, mass ratios, and surface conditions to understand how worlds evolve.',
      xp: 200,
      concepts: ['Planetary Mass', 'Atmospheric Density', 'Orbital Mechanics']
    },
    {
      id: 'rocket',
      title: 'Rocket Science & Multi-Stage Staging',
      badge: 'EXPERIMENT 03',
      icon: '🚀',
      desc: 'Engineer a multi-stage rocket using the Tsiolkovsky rocket equation. Choose propellant chemistry, manage payload mass, and achieve orbit!',
      xp: 200,
      concepts: ['Thrust-to-Weight Ratio', 'Specific Impulse (Isp)', 'Staging Delta-V']
    },
    {
      id: 'radiation',
      title: 'Space Weather & Regolith Shielding',
      badge: 'EXPERIMENT 04',
      icon: '🛡️',
      desc: 'Test protective materials against NASA DONKI solar energetic proton storms. Discover why 2.5m of lunar regolith is the ultimate cosmic shield.',
      xp: 200,
      concepts: ['Ionizing Radiation', 'Coronal Mass Ejections', 'Regolith Attenuation']
    },
    {
      id: 'slingshot',
      title: 'Orbital Motion & Gravitational Slingshot',
      badge: 'EXPERIMENT 05',
      icon: '💫',
      desc: 'Launch a deep-space probe and use a planet’s gravitational field to execute a gravity assist (slingshot), gaining velocity without burning extra propellant!',
      xp: 200,
      concepts: ['Kepler’s Laws', 'Gravity Assist', 'Orbital Energy Transfer']
    }
  ];

  function renderHub(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = `
      <div class="hubContainer">
        <div class="hubHeader">
          <div class="eyebrow">NASA SCIENCE EXPERIMENT BENCH</div>
          <h1>Interactive Space Physics Laboratory</h1>
          <p>Put on your lab coat and become a Junior Planetary Scientist! Conduct real physics and space science experiments with interactive simulations, live telemetry, and educational analysis.</p>
        </div>
        <div class="cardGrid">
    `;

    EXPERIMENTS.forEach(exp => {
      const isDone = PlayerProfile.profile.completedExperiments.includes(exp.id);
      html += `
        <div class="hubCard glass-panel" onclick="SpaceLaboratory.startExperiment('${exp.id}')">
          <div>
            <div class="cardBadge" style="color:${isDone ? 'var(--green)' : 'var(--cyan)'}">
              ${isDone ? '✓ EXPERIMENT COMPLETED' : exp.badge} · +${exp.xp} XP
            </div>
            <div style="font-size:32px;margin-bottom:10px;">${exp.icon}</div>
            <h3>${exp.title}</h3>
            <p>${exp.desc}</p>
          </div>
          <div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:14px;">
              ${exp.concepts.map(c => `<span style="font-size:9px;background:rgba(255,255,255,0.06);padding:3px 7px;border-radius:4px;color:var(--silver);">${c}</span>`).join('')}
            </div>
            <button class="btn ${isDone ? 'primary' : 'cyan'}" style="width:100%;">
              ${isDone ? 'Run Experiment Again' : 'Enter Lab Bench →'}
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    el.innerHTML = html;
  }

  function startExperiment(id) {
    SoundEngine.click();
    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    modal.classList.add('on');
    if (id === 'gravity') runGravityExp(content);
    else if (id === 'rocket') runRocketExp(content);
    else if (id === 'radiation') runRadiationExp(content);
    else if (id === 'slingshot') runSlingshotExp(content);
    else runSolarExp(content);
  }

  /* -------------------------------------------------------------
     EXPERIMENT 1: PLANETARY GRAVITY & APOLLO 15 DROP TEST
     ------------------------------------------------------------- */
  function runGravityExp(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">EXPERIMENT 01 · GRAVITATIONAL PHYSICS</div>
          <h2 style="font-family:var(--font-display);">Planetary Gravity & Apollo 15 Drop Test</h2>
        </div>
        <button class="iconBtn" onclick="SpaceLaboratory.closeModal()">✕</button>
      </div>
      <p class="small muted">In 1971, Apollo 15 Commander David Scott dropped a 1.32 kg falcon feather and a geological hammer on the Moon simultaneously. Because there was no atmosphere to cause air resistance, both hit the ground at the exact same instant! Select a world, toggle vacuum mode, and release the objects!</p>

      <canvas id="gravityCanvas" class="simCanvas" width="800" height="320"></canvas>

      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0;">
        <label style="font-size:12px;color:var(--cyan);font-family:var(--font-mono);">ENVIRONMENT:</label>
        <button class="btn small gravWorldBtn selected" data-g="9.8" data-name="Earth">🌍 Earth (1.0 g)</button>
        <button class="btn small gravWorldBtn" data-g="1.62" data-name="Moon">🌕 Moon (0.16 g)</button>
        <button class="btn small gravWorldBtn" data-g="3.71" data-name="Mars">🔴 Mars (0.38 g)</button>
        <button class="btn small gravWorldBtn" data-g="24.79" data-name="Jupiter">🪐 Jupiter (2.53 g)</button>

        <label style="margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
          <input type="checkbox" id="vacuumToggle" checked style="accent-color:var(--cyan);">
          <span style="color:var(--white);">Vacuum Mode (No Air Resistance)</span>
        </label>
      </div>

      <div class="btnRow" style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <button class="btn accent" id="dropBtn" onclick="SoundEngine.click()">⚡ Release Objects (Drop Test)</button>
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="SpaceLaboratory.closeModal()">Exit Lab</button>
          <button class="btn primary" id="gravFinishBtn" onclick="SpaceLaboratory.finishExp('gravity')">Log Findings (+200 XP)</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('gravityCanvas');
    const ctx = canvas.getContext('2d');
    let currentG = 9.8;
    let isVacuum = true;
    let hammer = { y: 40, vy: 0 };
    let feather = { y: 40, vy: 0 };
    let dropping = false;

    el.querySelectorAll('.gravWorldBtn').forEach(b => {
      b.onclick = () => {
        SoundEngine.click();
        el.querySelectorAll('.gravWorldBtn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        currentG = parseFloat(b.getAttribute('data-g'));
        resetObjects();
      };
    });

    document.getElementById('vacuumToggle').onchange = (e) => {
      isVacuum = e.target.checked;
      resetObjects();
    };

    document.getElementById('dropBtn').onclick = () => {
      SoundEngine.click();
      resetObjects();
      dropping = true;
    };

    function resetObjects() {
      hammer = { y: 40, vy: 0 };
      feather = { y: 40, vy: 0 };
      dropping = false;
    }

    function loop() {
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, canvas.height - 25, canvas.width, 25);
      ctx.strokeStyle = 'rgba(66, 232, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 25);
      ctx.lineTo(canvas.width, canvas.height - 25);
      ctx.stroke();

      if (dropping) {
        const dt = 0.04;
        const scale = 5.0; // visual scaling
        hammer.vy += (currentG * scale) * dt;
        hammer.y += hammer.vy * dt;

        if (isVacuum) {
          feather.vy += (currentG * scale) * dt;
          feather.y += feather.vy * dt;
        } else {
          // Air resistance causes feather terminal velocity
          const drag = 0.88;
          feather.vy = (feather.vy + (currentG * scale * 0.4) * dt) * drag;
          feather.y += feather.vy * dt;
        }

        const floorY = canvas.height - 45;
        if (hammer.y >= floorY) { hammer.y = floorY; }
        if (feather.y >= floorY) { feather.y = floorY; }
      }

      // Draw Hammer Lane (Left)
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔨', 250, hammer.y);
      ctx.font = '11px monospace';
      ctx.fillStyle = 'var(--cyan)';
      ctx.fillText(`Geology Hammer (1.3 kg)`, 250, 20);

      // Draw Feather Lane (Right)
      ctx.font = '28px sans-serif';
      ctx.fillText('🪶', 550, feather.y);
      ctx.font = '11px monospace';
      ctx.fillStyle = 'var(--amber)';
      ctx.fillText(`Falcon Feather (0.03 kg)`, 550, 20);

      if (document.getElementById('gravityCanvas')) {
        requestAnimationFrame(loop);
      }
    }
    loop();
  }

  /* -------------------------------------------------------------
     EXPERIMENT 3: ROCKET SCIENCE & MULTI-STAGE STAGING
     ------------------------------------------------------------- */
  function runRocketExp(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">EXPERIMENT 03 · PROPULSION & STAGING</div>
          <h2 style="font-family:var(--font-display);">Rocket Science & Orbital Insertion</h2>
        </div>
        <button class="iconBtn" onclick="SpaceLaboratory.closeModal()">✕</button>
      </div>
      <p class="small muted">To escape Earth's gravity well and reach orbit, a rocket must accelerate to 28,000 km/h (7.8 km/s). Multi-stage rockets shed heavy empty fuel tanks to save weight. Configure your propellants and stage separation to reach 200 km Low Earth Orbit!</p>

      <canvas id="rocketCanvas" class="simCanvas" width="800" height="320"></canvas>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:12px 0;">
        <div class="glass-panel" style="padding:12px;">
          <small style="color:var(--cyan);display:block;font-size:9px;">STAGE 1 PROPELLANT</small>
          <select id="stage1Prop" class="btn small" style="width:100%;margin-top:6px;background:#050816;">
            <option value="solid">Solid Rocket Boosters (High Thrust)</option>
            <option value="methalox">Liquid Methalox (CH4 + LOX)</option>
            <option value="hydrolox">Liquid Hydrolox (LH2 + LOX)</option>
          </select>
        </div>
        <div class="glass-panel" style="padding:12px;">
          <small style="color:var(--amber);display:block;font-size:9px;">STAGE 2 PROPELLANT</small>
          <select id="stage2Prop" class="btn small" style="width:100%;margin-top:6px;background:#050816;">
            <option value="hydrolox">Liquid Hydrolox (High Efficiency)</option>
            <option value="methalox">Liquid Methalox (Reusable)</option>
          </select>
        </div>
        <div class="glass-panel" style="padding:12px;">
          <small style="color:var(--green);display:block;font-size:9px;">PAYLOAD MASS</small>
          <select id="payloadMass" class="btn small" style="width:100%;margin-top:6px;background:#050816;">
            <option value="5">Small Satellite (5 tons)</option>
            <option value="20">Crew Capsule (20 tons)</option>
            <option value="50">Heavy Space Station Module (50 tons)</option>
          </select>
        </div>
      </div>

      <div class="btnRow" style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <button class="btn accent" id="launchBtn">🚀 Launch Rocket Ignition</button>
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="SpaceLaboratory.closeModal()">Exit Lab</button>
          <button class="btn primary" id="rocketFinishBtn" disabled onclick="SpaceLaboratory.finishExp('rocket')">Confirm Orbital Insertion (+200 XP)</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('rocketCanvas');
    const ctx = canvas.getContext('2d');
    let altitude = 0; // km
    let velocity = 0; // km/s
    let stage = 1;
    let launched = false;

    document.getElementById('launchBtn').onclick = () => {
      SoundEngine.startThruster();
      altitude = 0;
      velocity = 0;
      stage = 1;
      launched = true;
    };

    function loop() {
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (launched) {
        if (stage === 1) {
          velocity += 0.08;
          altitude += velocity * 0.4;
          if (altitude > 65) {
            stage = 2; // Staging separation!
            SoundEngine.click();
            if (typeof toast === 'function') toast('Stage 1 Main Engine Cutoff (MECO) & Stage Separation!');
          }
        } else if (stage === 2) {
          velocity += 0.11;
          altitude += velocity * 0.35;
          if (velocity >= 7.8 && altitude >= 180) {
            launched = false;
            SoundEngine.stopThruster();
            SoundEngine.success();
            document.getElementById('rocketFinishBtn').disabled = false;
          }
        }
      }

      // Sky gradient based on altitude
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (altitude < 30) {
        skyGrad.addColorStop(0, '#1E3A8A');
        skyGrad.addColorStop(1, '#60A5FA');
      } else if (altitude < 100) {
        skyGrad.addColorStop(0, '#050816');
        skyGrad.addColorStop(1, '#1E3A8A');
      } else {
        skyGrad.addColorStop(0, '#000000');
        skyGrad.addColorStop(1, '#050816');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars in space
      if (altitude > 40) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i < 30; i++) {
          ctx.fillRect((i * 47) % canvas.width, (i * 61) % (canvas.height - 60), 1.5, 1.5);
        }
      }

      // Earth Horizon Curve below
      if (altitude > 100) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height + 400, 480, 0, Math.PI * 2);
        ctx.fillStyle = '#1D4ED8';
        ctx.fill();
      }

      // Rocket Representation
      const rx = canvas.width / 2;
      const ry = Math.max(80, canvas.height - 60 - altitude * 1.1);

      ctx.save();
      ctx.translate(rx, ry);
      // Exhaust Flame
      if (launched) {
        ctx.beginPath();
        ctx.moveTo(-6, 25);
        ctx.lineTo(6, 25);
        ctx.lineTo(0, 25 + Math.random() * 25 + 15);
        ctx.fillStyle = '#FFBF5B';
        ctx.fill();
      }
      // Rocket Body
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-8, -25, 16, 50);
      // Fairing Cone
      ctx.beginPath();
      ctx.moveTo(-8, -25);
      ctx.lineTo(8, -25);
      ctx.lineTo(0, -42);
      ctx.fillStyle = '#E2E8F0';
      ctx.fill();
      ctx.restore();

      // Telemetry Overlay
      ctx.fillStyle = 'rgba(5, 8, 22, 0.85)';
      ctx.fillRect(15, 15, 220, 75);
      ctx.strokeStyle = 'rgba(66, 232, 255, 0.3)';
      ctx.strokeRect(15, 15, 220, 75);

      ctx.font = '11px monospace';
      ctx.fillStyle = 'var(--cyan)';
      ctx.fillText(`ALTITUDE: ${altitude.toFixed(1)} km`, 25, 35);
      ctx.fillStyle = 'var(--amber)';
      ctx.fillText(`VELOCITY: ${velocity.toFixed(2)} km/s (Goal: 7.8)`, 25, 55);
      ctx.fillStyle = 'var(--green)';
      ctx.fillText(`STAGE: ${stage} · ${launched ? 'BURNING' : (altitude >= 180 ? 'ORBIT INSERTED' : 'READY')}`, 25, 75);

      if (document.getElementById('rocketCanvas')) {
        requestAnimationFrame(loop);
      } else {
        SoundEngine.stopThruster();
      }
    }
    loop();
  }

  /* -------------------------------------------------------------
     EXPERIMENT 4: SPACE WEATHER & REGOLITH SHIELDING
     ------------------------------------------------------------- */
  function runRadiationExp(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">EXPERIMENT 04 · RADIATION DOSIMETRY</div>
          <h2 style="font-family:var(--font-display);">Space Weather & Regolith Shielding</h2>
        </div>
        <button class="iconBtn" onclick="SpaceLaboratory.closeModal()">✕</button>
      </div>
      <p class="small muted">Cosmic rays and solar energetic protons (SEPs) easily penetrate spacecraft aluminum hulls. Test different shielding barriers against a NASA DONKI simulated solar storm to see how much radiation reaches your junior astronaut!</p>

      <canvas id="radiationCanvas" class="simCanvas" width="800" height="320"></canvas>

      <div style="display:flex;gap:12px;margin:12px 0;">
        <button class="btn small shieldBtn selected" data-att="0.15" data-name="Aluminum (3mm)">1. Aluminum Spacecraft Hull (15% Blocked)</button>
        <button class="btn small shieldBtn" data-att="0.45" data-name="Polyethylene Plastic">2. Polyethylene Plastic (45% Blocked)</button>
        <button class="btn small shieldBtn" data-att="0.75" data-name="Water Wall (10cm)">3. Water Wall Reservoir (75% Blocked)</button>
        <button class="btn small shieldBtn" data-att="0.994" data-name="Lunar Regolith (2.5m)">4. Compacted Lunar Regolith (99.4% Blocked)</button>
      </div>

      <div class="btnRow" style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <span id="radStats" style="font-size:12px;font-family:var(--font-mono);color:var(--red);">Dose: 420 mSv/hr · RADIATION HAZARD</span>
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="SpaceLaboratory.closeModal()">Exit Lab</button>
          <button class="btn primary" id="radFinishBtn" onclick="SpaceLaboratory.finishExp('radiation')">Log Shielding Study (+200 XP)</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('radiationCanvas');
    const ctx = canvas.getContext('2d');
    let attenuation = 0.15;
    let particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * 200,
        y: Math.random() * canvas.height,
        speed: Math.random() * 4 + 3
      });
    }

    el.querySelectorAll('.shieldBtn').forEach(b => {
      b.onclick = () => {
        SoundEngine.click();
        el.querySelectorAll('.shieldBtn').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        attenuation = parseFloat(b.getAttribute('data-att'));
        const dose = Math.round(500 * (1 - attenuation));
        const stats = document.getElementById('radStats');
        if (attenuation > 0.9) {
          stats.innerHTML = `<span style="color:var(--green)">Dose: ${dose} mSv/hr · 100% NOMINAL SAFE FOR ASTRONAUTS</span>`;
        } else {
          stats.innerHTML = `<span style="color:var(--red)">Dose: ${dose} mSv/hr · RADIATION HAZARD (Shielding Insufficient)</span>`;
        }
      };
    });

    function loop() {
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Shield Barrier in Middle
      const sx = 380;
      ctx.fillStyle = attenuation > 0.9 ? '#78716C' : '#334155';
      ctx.fillRect(sx, 0, 40, canvas.height);
      ctx.strokeStyle = 'rgba(66, 232, 255, 0.4)';
      ctx.strokeRect(sx, 0, 40, canvas.height);

      // Protons Stream from Left
      particles.forEach(p => {
        p.x += p.speed;
        if (p.x < sx) {
          ctx.fillStyle = '#FF5E7E';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Attenuation check
          if (Math.random() > attenuation) {
            ctx.fillStyle = '#FFBF5B';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        if (p.x > canvas.width) p.x = 0;
      });

      // Junior Astronaut in Habitat on Right
      ctx.font = '36px sans-serif';
      ctx.fillText('🧑‍🚀', 620, canvas.height / 2 + 10);

      if (document.getElementById('radiationCanvas')) {
        requestAnimationFrame(loop);
      }
    }
    loop();
  }

  /* -------------------------------------------------------------
     EXPERIMENT 5: ORBITAL SLINGSHOT & GRAVITY ASSIST
     ------------------------------------------------------------- */
  function runSlingshotExp(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">EXPERIMENT 05 · CELESTIAL MECHANICS</div>
          <h2 style="font-family:var(--font-display);">Gravitational Slingshot (Gravity Assist)</h2>
        </div>
        <button class="iconBtn" onclick="SpaceLaboratory.closeModal()">✕</button>
      </div>
      <p class="small muted">NASA's Voyager 1 & 2 spacecraft explored Jupiter, Saturn, Uranus, and Neptune by using the gravitational gravity-assist slingshot technique! Launch a probe with your trajectory vector to steal momentum from the moving gas giant and accelerate toward deep space!</p>

      <canvas id="slingCanvas" class="simCanvas" width="800" height="320"></canvas>

      <div class="btnRow" style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <button class="btn accent" id="slingLaunchBtn">🚀 Launch Deep Space Probe</button>
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="SpaceLaboratory.closeModal()">Exit Lab</button>
          <button class="btn primary" id="slingFinishBtn" onclick="SpaceLaboratory.finishExp('slingshot')">Log Slingshot Physics (+200 XP)</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('slingCanvas');
    const ctx = canvas.getContext('2d');
    let planet = { x: 420, y: 160, r: 34, mass: 6500 };
    let probe = { x: 60, y: 240, vx: 3.2, vy: -1.2, active: false };
    let trail = [];

    document.getElementById('slingLaunchBtn').onclick = () => {
      SoundEngine.missionStart();
      probe = { x: 60, y: 240, vx: 3.3, vy: -1.25, active: true };
      trail = [];
    };

    function loop() {
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gas Giant Planet
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.r, 0, Math.PI * 2);
      ctx.fillStyle = '#D69E2E';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(planet.x - 6, planet.y - 6, planet.r - 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ED8936';
      ctx.fill();

      // Probe Physics
      if (probe.active) {
        const dx = planet.x - probe.x;
        const dy = planet.y - probe.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist > planet.r) {
          const force = planet.mass / distSq;
          probe.vx += (dx / dist) * force * 0.04;
          probe.vy += (dy / dist) * force * 0.04;
        }

        probe.x += probe.vx;
        probe.y += probe.vy;
        trail.push({ x: probe.x, y: probe.y });
        if (trail.length > 80) trail.shift();
      }

      // Draw Trajectory Trail
      ctx.strokeStyle = 'rgba(66, 232, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      trail.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Draw Probe
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(probe.x, probe.y, 4, 0, Math.PI * 2);
      ctx.fill();

      if (document.getElementById('slingCanvas')) {
        requestAnimationFrame(loop);
      }
    }
    loop();
  }

  function finishExp(id) {
    if (!PlayerProfile.profile.completedExperiments.includes(id)) {
      PlayerProfile.profile.completedExperiments.push(id);
    }
    PlayerProfile.addXP(200, `Completed Laboratory Experiment: ${id}`);
    if (PlayerProfile.profile.completedExperiments.length >= EXPERIMENTS.length) {
      PlayerProfile.unlockAchievement('space_researcher', 'Space Researcher');
    }
    closeModal();
    renderHub('laboratoryHubView');
  }

  function closeModal() {
    SoundEngine.click();
    const modal = document.getElementById('interactiveModal');
    if (modal) modal.classList.remove('on');
  }

  return {
    renderHub,
    startExperiment,
    finishExp,
    closeModal
  };
})();
