// NASA JUNIOR ASTRONAUT MISSION TRAINER - ASTRONAUT TRAINING ACADEMY
const AstronautAcademy = (() => {
  const MODULES = [
    {
      id: 'zerog',
      name: 'Zero-Gravity Training',
      badge: 'MODULE A',
      icon: '🌌',
      desc: 'Master microgravity floating, momentum control, and collect floating supplies in orbit.',
      xp: 150,
      concepts: ['Newton’s First Law (Inertia)', 'Microgravity Freefall', 'Space Station Thrusters']
    },
    {
      id: 'suit',
      name: 'Spacesuit Training & Inspection',
      badge: 'MODULE B',
      icon: '🛡️',
      desc: 'Inspect the Artemis xEMU spacesuit, test pressure seals, and prepare for spacewalks.',
      xp: 150,
      concepts: ['Primary Life Support (PLSS)', 'Thermal Insulation', 'Micrometeorite Shielding']
    },
    {
      id: 'navigation',
      name: 'Space Navigation & Orbits',
      badge: 'MODULE C',
      icon: '🧭',
      desc: 'Calculate orbital burn vectors, align trajectories, and perform a Hohmann transfer.',
      xp: 150,
      concepts: ['Orbital Velocity', 'Hohmann Transfer', 'Prograde/Retrograde Burns']
    },
    {
      id: 'robotics',
      name: 'Robotics & Rover Operations',
      badge: 'MODULE D',
      icon: '🤖',
      desc: 'Pilot a surface exploration rover, navigate rocky obstacles, and drill rock core samples.',
      xp: 150,
      concepts: ['Rocker-Bogie Suspension', 'Remote Sensing', 'Core Sample Drilling']
    },
    {
      id: 'emergency',
      name: 'Mission Emergency Training',
      badge: 'MODULE E',
      icon: '⚠️',
      desc: 'Diagnose space weather solar proton alerts, reroute power, and protect your crew.',
      xp: 150,
      concepts: ['Solar Radiation Protection', 'ECLSS Redundancy', 'Regolith Shielding']
    }
  ];

  function renderHub(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = `
      <div class="hubContainer">
        <div class="hubHeader">
          <div class="eyebrow">NASA JUNIOR ASTRONAUT ACADEMY</div>
          <h1>Astronaut Training Modules</h1>
          <p>Complete certified astronaut flight training modules to prepare for deep-space planetary expeditions. Earn your cadet badges!</p>
        </div>
        <div class="cardGrid">
    `;

    MODULES.forEach(m => {
      const isDone = PlayerProfile.profile.completedModules.includes(m.id);
      html += `
        <div class="hubCard glass-panel" onclick="AstronautAcademy.startModule('${m.id}')">
          <div>
            <div class="cardBadge" style="color:${isDone ? 'var(--green)' : 'var(--cyan)'}">
              ${isDone ? '✓ CERTIFIED' : m.badge} · +${m.xp} XP
            </div>
            <div style="font-size:32px;margin-bottom:10px;">${m.icon}</div>
            <h3>${m.name}</h3>
            <p>${m.desc}</p>
          </div>
          <div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:14px;">
              ${m.concepts.map(c => `<span style="font-size:9px;background:rgba(255,255,255,0.06);padding:3px 7px;border-radius:4px;color:var(--silver);">${c}</span>`).join('')}
            </div>
            <button class="btn ${isDone ? 'primary' : 'cyan'}" style="width:100%;">
              ${isDone ? 'Replay Simulation' : 'Begin Training →'}
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    el.innerHTML = html;
  }

  function startModule(id) {
    SoundEngine.click();
    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    modal.classList.add('on');
    if (id === 'zerog') runZeroGModule(content);
    else if (id === 'suit') runSuitModule(content);
    else if (id === 'navigation') runNavModule(content);
    else if (id === 'robotics') runRoboticsModule(content);
    else if (id === 'emergency') runEmergencyModule(content);
  }

  /* -------------------------------------------------------------
     MODULE A: ZERO-G FLOATING SIMULATOR
     ------------------------------------------------------------- */
  function runZeroGModule(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">MODULE A · MICROGRAVITY SIMULATOR</div>
          <h2 style="font-family:var(--font-display);">Zero-Gravity Floating & Momentum</h2>
        </div>
        <button class="iconBtn" onclick="AstronautAcademy.closeModal()">✕</button>
      </div>
      <p class="small muted">Inside the space station, there is no floor or ceiling. Use your keyboard arrow keys or W/A/S/D to gently fire small compressed-gas puffs to collect all 5 floating supply pouches before oxygen runs out!</p>
      
      <div style="position:relative;">
        <canvas id="zerogCanvas" class="simCanvas" width="800" height="380"></canvas>
        <div style="position:absolute;top:15px;left:15px;font-family:var(--font-mono);font-size:12px;background:rgba(5,8,22,0.8);padding:8px 12px;border-radius:6px;border:1px solid rgba(66,232,255,0.3);">
          <span>Supplies: <b id="zgScore" style="color:var(--cyan)">0 / 5</b></span> | 
          <span>Oxygen: <b id="zgOxygen" style="color:var(--green)">100%</b></span>
        </div>
      </div>

      <div class="factBox" style="background:rgba(11,21,48,0.7);padding:14px;border-radius:8px;border:1px solid var(--panel-border);margin-top:14px;">
        <b style="color:var(--cyan);font-family:var(--font-display);">THE SCIENCE OF ZERO-G:</b>
        <p style="font-size:12px;color:var(--silver);margin-top:4px;">According to Sir Isaac Newton's First Law, an object in motion stays in motion unless acted upon by an outside force. In space, there is no air resistance! Once you start floating in one direction, you keep going until you push off a wall or fire a reverse thruster.</p>
      </div>

      <div class="btnRow" style="display:flex;justify-content:flex-end;margin-top:14px;gap:10px;">
        <button class="btn" onclick="AstronautAcademy.closeModal()">Exit Simulation</button>
        <button class="btn primary" id="zgFinishBtn" disabled onclick="AstronautAcademy.finishModule('zerog', 'Zero-G Master')">Complete Module (+150 XP)</button>
      </div>
    `;

    // Interactive 2D Canvas Physics Loop
    const canvas = document.getElementById('zerogCanvas');
    const ctx = canvas.getContext('2d');
    let astronaut = { x: 400, y: 190, vx: 0, vy: 0, r: 18 };
    let supplies = [
      { x: 120, y: 80, r: 14, icon: '🍎', collected: false },
      { x: 680, y: 90, r: 14, icon: '🔧', collected: false },
      { x: 200, y: 300, r: 14, icon: '💧', collected: false },
      { x: 620, y: 290, r: 14, icon: '📦', collected: false },
      { x: 400, y: 70, r: 14, icon: '🔋', collected: false }
    ];
    let collectedCount = 0;
    let oxygen = 100;
    let keys = {};
    let animId;

    const onKey = (e) => { keys[e.key.toLowerCase()] = e.type === 'keydown'; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    function loop() {
      // Input thrusters
      let thrusting = false;
      if (keys['w'] || keys['arrowup']) { astronaut.vy -= 0.12; thrusting = true; }
      if (keys['s'] || keys['arrowdown']) { astronaut.vy += 0.12; thrusting = true; }
      if (keys['a'] || keys['arrowleft']) { astronaut.vx -= 0.12; thrusting = true; }
      if (keys['d'] || keys['arrowright']) { astronaut.vx += 0.12; thrusting = true; }

      if (thrusting) {
        oxygen = Math.max(0, oxygen - 0.05);
        document.getElementById('zgOxygen').textContent = Math.round(oxygen) + '%';
      }

      // Microgravity drag is very low
      astronaut.vx *= 0.985;
      astronaut.vy *= 0.985;
      astronaut.x += astronaut.vx;
      astronaut.y += astronaut.vy;

      // Bounce off space station bulkheads
      if (astronaut.x < 25) { astronaut.x = 25; astronaut.vx *= -0.8; SoundEngine.click(); }
      if (astronaut.x > canvas.width - 25) { astronaut.x = canvas.width - 25; astronaut.vx *= -0.8; SoundEngine.click(); }
      if (astronaut.y < 25) { astronaut.y = 25; astronaut.vy *= -0.8; SoundEngine.click(); }
      if (astronaut.y > canvas.height - 25) { astronaut.y = canvas.height - 25; astronaut.vy *= -0.8; SoundEngine.click(); }

      // Check supplies collection
      supplies.forEach(s => {
        if (!s.collected && Math.hypot(astronaut.x - s.x, astronaut.y - s.y) < astronaut.r + s.r) {
          s.collected = true;
          collectedCount++;
          SoundEngine.success();
          document.getElementById('zgScore').textContent = `${collectedCount} / 5`;
          if (collectedCount >= 5) {
            document.getElementById('zgFinishBtn').disabled = false;
          }
        }
      });

      // Render
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Station Module Grid
      ctx.strokeStyle = 'rgba(66, 232, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

      // Supplies
      supplies.forEach(s => {
        if (!s.collected) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r + 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(66, 232, 255, 0.2)';
          ctx.fill();
          ctx.font = '16px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(s.icon, s.x, s.y);
        }
      });

      // Astronaut
      ctx.save();
      ctx.translate(astronaut.x, astronaut.y);
      ctx.beginPath();
      ctx.arc(0, 0, astronaut.r, 0, Math.PI * 2);
      ctx.fillStyle = '#E2E8F0';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#42E8FF';
      ctx.stroke();

      // Gold visor
      ctx.fillStyle = '#FFBF5B';
      ctx.beginPath();
      ctx.ellipse(astronaut.vx * 3, astronaut.vy * 3, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (document.getElementById('zerogCanvas')) {
        animId = requestAnimationFrame(loop);
      } else {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('keyup', onKey);
      }
    }
    loop();
  }

  /* -------------------------------------------------------------
     MODULE B: SPACESUIT TRAINING & INSPECTION
     ------------------------------------------------------------- */
  function runSuitModule(el) {
    const components = [
      { id: 'visor', name: 'Gold-Coated Helmet Visor', checked: false, desc: 'Coated in a microscopic layer of pure 24-karat gold to reflect harsh solar glare and UV radiation while remaining transparent.' },
      { id: 'plss', name: 'Primary Life Support (PLSS)', checked: false, desc: 'The backpack containing oxygen tanks, lithium hydroxide canisters to scrub exhaled CO2, and battery power for up to 8 hours.' },
      { id: 'lcvg', name: 'Liquid Cooling Garment', checked: false, desc: 'Spandex undergarment knitted with 90 meters of tiny water tubes. Circulating cold water prevents astronauts from overheating.' },
      { id: 'bladder', name: 'Pressurized Bladder Layer', checked: false, desc: 'In the vacuum of space, your blood would boil without air pressure. This airtight layer holds 4.3 psi of pure oxygen pressure.' },
      { id: 'tmg', name: 'Thermal Micrometeoroid Shield', checked: false, desc: '14 layers of Kevlar and aluminized Mylar that shield against micrometeorites traveling at speeds up to 28,000 km/h.' },
      { id: 'gloves', name: 'Heated EVA Gloves', checked: false, desc: 'Custom silicone finger pads with electric heaters, allowing delicate mechanical work in temperatures from -150°C to +120°C.' }
    ];

    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">MODULE B · SPACESUIT INSPECTION</div>
          <h2 style="font-family:var(--font-display);">Artemis xEMU Exploration Spacesuit</h2>
        </div>
        <button class="iconBtn" onclick="AstronautAcademy.closeModal()">✕</button>
      </div>
      <p class="small muted">A spacesuit is not just clothing—it is a miniature one-person spaceship! Click each component below to inspect its life-support function and complete the pre-EVA safety checklist.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:16px 0;">
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${components.map((c, i) => `
            <button class="btn suitCompBtn" data-idx="${i}" style="justify-content:space-between;text-align:left;">
              <span>🛡️ ${c.name}</span>
              <span class="statusDot" style="color:var(--silver);">○ Inspect</span>
            </button>
          `).join('')}
        </div>
        <div class="glass-panel" style="padding:18px;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div class="eyebrow" id="compEyebrow">SELECT A COMPONENT</div>
            <h3 id="compTitle" style="margin:6px 0 10px;font-family:var(--font-display);color:var(--cyan);">Spacesuit Anatomy</h3>
            <p id="compDesc" class="small muted">Click any spacesuit system on the left to review its engineering and confirm flight safety readiness.</p>
          </div>
          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--panel-border);">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
              <span>Inspection Progress:</span>
              <strong id="suitProg" style="color:var(--cyan);">0 / 6</strong>
            </div>
            <div style="height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;">
              <div id="suitProgBar" style="width:0%;height:100%;background:var(--cyan);transition:width 0.3s;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="btnRow" style="display:flex;justify-content:flex-end;margin-top:14px;gap:10px;">
        <button class="btn" onclick="AstronautAcademy.closeModal()">Cancel</button>
        <button class="btn primary" id="suitFinishBtn" disabled onclick="AstronautAcademy.finishModule('suit', 'Suit Specialist')">Certify Spacesuit (+150 XP)</button>
      </div>
    `;

    let checkedCount = 0;
    el.querySelectorAll('.suitCompBtn').forEach(btn => {
      btn.onclick = () => {
        SoundEngine.click();
        const idx = parseInt(btn.getAttribute('data-idx'));
        const comp = components[idx];
        document.getElementById('compEyebrow').textContent = 'SYSTEM VERIFICATION';
        document.getElementById('compTitle').textContent = comp.name;
        document.getElementById('compDesc').textContent = comp.desc;

        if (!comp.checked) {
          comp.checked = true;
          checkedCount++;
          btn.querySelector('.statusDot').innerHTML = '✓ <span style="color:var(--green)">PASSED</span>';
          btn.style.borderColor = 'var(--green)';
          document.getElementById('suitProg').textContent = `${checkedCount} / 6`;
          document.getElementById('suitProgBar').style.width = `${(checkedCount / 6) * 100}%`;

          if (checkedCount >= 6) {
            SoundEngine.success();
            document.getElementById('suitFinishBtn').disabled = false;
          }
        }
      };
    });
  }

  /* -------------------------------------------------------------
     MODULE C: SPACE NAVIGATION & ORBITS
     ------------------------------------------------------------- */
  function runNavModule(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">MODULE C · ORBITAL MECHANICS</div>
          <h2 style="font-family:var(--font-display);">Orbital Navigation & Hohmann Transfer</h2>
        </div>
        <button class="iconBtn" onclick="AstronautAcademy.closeModal()">✕</button>
      </div>
      <p class="small muted">To fly from Low Earth Orbit to a higher destination orbit, you cannot just fly straight! You must perform a timed 'prograde burn' to stretch your circular orbit into an ellipse (Hohmann Transfer Orbit). Adjust the Delta-V burn slider until your transfer orbit intersects the target space station!</p>

      <canvas id="navCanvas" class="simCanvas" width="800" height="340"></canvas>

      <div style="display:flex;align-items:center;gap:16px;margin:14px 0;">
        <label style="font-family:var(--font-mono);font-size:12px;color:var(--cyan);white-space:nowrap;">PROGRADE BURN ΔV:</label>
        <input type="range" id="burnSlider" min="0" max="100" value="20" style="flex-grow:1;accent-color:var(--cyan);">
        <span id="burnVal" style="font-family:var(--font-mono);font-size:13px;color:var(--amber);min-width:70px;">2.4 km/s</span>
      </div>

      <div class="btnRow" style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
        <span id="navFeedback" style="font-size:12px;color:var(--silver);">Adjust burn to match the green target orbit.</span>
        <div style="display:flex;gap:10px;">
          <button class="btn" onclick="AstronautAcademy.closeModal()">Exit</button>
          <button class="btn primary" id="navFinishBtn" disabled onclick="AstronautAcademy.finishModule('navigation', 'Orbital Navigator')">Lock Trajectory (+150 XP)</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('navCanvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('burnSlider');
    const burnVal = document.getElementById('burnVal');
    const feedback = document.getElementById('navFeedback');
    const finishBtn = document.getElementById('navFinishBtn');

    let angle = 0;
    function draw() {
      const v = parseFloat(slider.value); // 0 to 100
      burnVal.textContent = (1.5 + (v / 100) * 3.5).toFixed(1) + ' km/s';

      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Earth
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#1E3A8A';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - 8, cy - 8, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#2563EB';
      ctx.fill();

      // Initial Orbit (Inner Cyan)
      ctx.beginPath();
      ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(66, 232, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Target Destination Orbit (Outer Green)
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 217, 150, 0.6)';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Target Station
      const tx = cx + Math.cos(angle * 0.7) * 140;
      const ty = cy + Math.sin(angle * 0.7) * 140;
      ctx.fillStyle = '#38D996';
      ctx.beginPath();
      ctx.arc(tx, ty, 6, 0, Math.PI * 2);
      ctx.fill();

      // Transfer Ellipse (Amber)
      const apogee = 75 + (v / 100) * 85;
      const semiMajor = (75 + apogee) / 2;
      const cOffset = semiMajor - 75;

      ctx.beginPath();
      ctx.ellipse(cx - cOffset, cy, semiMajor, 75 + (v / 100) * 35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFBF5B';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Ship on orbit
      angle += 0.02;
      const sx = cx + Math.cos(angle) * 75;
      const sy = cy + Math.sin(angle) * 75;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Evaluation: Perfect transfer when apogee reaches exactly 140 (around slider 76)
      if (Math.abs(apogee - 140) < 3.5) {
        feedback.innerHTML = '<span style="color:var(--green);font-weight:700;">✓ PERFECT HOHMANN TRANSFER CALCULATED! Intersecting target orbit!</span>';
        finishBtn.disabled = false;
      } else if (apogee < 140) {
        feedback.textContent = 'Under-burn: Trajectory falls short of target orbit.';
        finishBtn.disabled = true;
      } else {
        feedback.textContent = 'Over-burn: Spacecraft exceeds orbital velocity and escapes!';
        finishBtn.disabled = true;
      }

      if (document.getElementById('navCanvas')) {
        requestAnimationFrame(draw);
      }
    }
    slider.oninput = () => SoundEngine.hover();
    draw();
  }

  /* -------------------------------------------------------------
     MODULE D: ROBOTICS & ROVER OPERATIONS
     ------------------------------------------------------------- */
  function runRoboticsModule(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow">MODULE D · ROBOTICS OPERATIONS</div>
          <h2 style="font-family:var(--font-display);">Autonomous Planetary Rover Navigation</h2>
        </div>
        <button class="iconBtn" onclick="AstronautAcademy.closeModal()">✕</button>
      </div>
      <p class="small muted">Remotely pilot the 6-wheel exploration rover across Jezero Crater. Navigate around hazardous boulders and position the robotic arm over 3 scientific rock formations to drill core samples!</p>

      <canvas id="roverCanvas" class="simCanvas" width="800" height="340"></canvas>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-family:var(--font-mono);font-size:12px;">
        <span>Samples Extracted: <b id="roverSamples" style="color:var(--cyan)">0 / 3</b></span>
        <span style="color:var(--silver);">Controls: Arrow Keys / WASD to drive</span>
      </div>

      <div class="btnRow" style="display:flex;justify-content:flex-end;margin-top:14px;gap:10px;">
        <button class="btn" onclick="AstronautAcademy.closeModal()">Exit</button>
        <button class="btn primary" id="roverFinishBtn" disabled onclick="AstronautAcademy.finishModule('robotics', 'Robotics Specialist')">Complete Rover Mission (+150 XP)</button>
      </div>
    `;

    const canvas = document.getElementById('roverCanvas');
    const ctx = canvas.getContext('2d');
    let rover = { x: 80, y: 170, angle: 0, speed: 0 };
    let targets = [
      { x: 300, y: 90, r: 24, drilled: false, name: 'Mudstone Clay' },
      { x: 520, y: 260, r: 24, drilled: false, name: 'Basaltic Lava' },
      { x: 700, y: 120, r: 24, drilled: false, name: 'Carbonate Mineral' }
    ];
    let boulders = [
      { x: 200, y: 150, r: 25 },
      { x: 420, y: 120, r: 30 },
      { x: 550, y: 80, r: 20 },
      { x: 380, y: 280, r: 28 }
    ];
    let drilledCount = 0;
    let keys = {};

    const onKey = (e) => { keys[e.key.toLowerCase()] = e.type === 'keydown'; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    function loop() {
      if (keys['w'] || keys['arrowup']) rover.speed = Math.min(rover.speed + 0.1, 2.5);
      else if (keys['s'] || keys['arrowdown']) rover.speed = Math.max(rover.speed - 0.1, -1.2);
      else rover.speed *= 0.92;

      if (keys['a'] || keys['arrowleft']) rover.angle -= 0.04;
      if (keys['d'] || keys['arrowright']) rover.angle += 0.04;

      rover.x += Math.cos(rover.angle) * rover.speed;
      rover.y += Math.sin(rover.angle) * rover.speed;

      // Boulder collisions
      boulders.forEach(b => {
        const d = Math.hypot(rover.x - b.x, rover.y - b.y);
        if (d < b.r + 14) {
          rover.speed = -1.0;
          SoundEngine.click();
        }
      });

      // Target drilling
      targets.forEach(t => {
        if (!t.drilled && Math.hypot(rover.x - t.x, rover.y - t.y) < t.r) {
          t.drilled = true;
          drilledCount++;
          SoundEngine.success();
          document.getElementById('roverSamples').textContent = `${drilledCount} / 3`;
          if (typeof toast === 'function') toast(`Drilled Core Sample: ${t.name}!`);
          if (drilledCount >= 3) {
            document.getElementById('roverFinishBtn').disabled = false;
          }
        }
      });

      // Render Martian terrain
      ctx.fillStyle = '#3E1C12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rocks / Boulders
      boulders.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = '#220D07';
        ctx.fill();
        ctx.strokeStyle = '#5E2B1D';
        ctx.stroke();
      });

      // Target sites
      targets.forEach(t => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = t.drilled ? 'rgba(56, 217, 150, 0.2)' : 'rgba(66, 232, 255, 0.15)';
        ctx.strokeStyle = t.drilled ? '#38D996' : '#42E8FF';
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.drilled ? '✓ SAMPLED' : t.name, t.x, t.y + 4);
      });

      // Rover (6-wheel chassis)
      ctx.save();
      ctx.translate(rover.x, rover.y);
      ctx.rotate(rover.angle);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(-14, -10, 28, 20); // body
      ctx.fillStyle = '#1E293B';
      // 6 wheels
      [-12, 0, 12].forEach(wx => {
        ctx.fillRect(wx - 3, -14, 6, 4);
        ctx.fillRect(wx - 3, 10, 6, 4);
      });
      // Robotic Arm Mast
      ctx.fillStyle = '#FFBF5B';
      ctx.beginPath();
      ctx.arc(8, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (document.getElementById('roverCanvas')) {
        requestAnimationFrame(loop);
      } else {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('keyup', onKey);
      }
    }
    loop();
  }

  /* -------------------------------------------------------------
     MODULE E: MISSION EMERGENCY TRAINING
     ------------------------------------------------------------- */
  function runEmergencyModule(el) {
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div>
          <div class="eyebrow" style="color:var(--amber);">MODULE E · MISSION ANOMALY DRILL</div>
          <h2 style="font-family:var(--font-display);">Space Weather Solar Storm Protocol</h2>
        </div>
        <button class="iconBtn" onclick="AstronautAcademy.closeModal()">✕</button>
      </div>
      <p class="small muted">NASA DONKI has detected an X-class solar flare at Sun-Earth L1. An energetic proton storm is arriving in 30 minutes! Step through the standardized flight rules to safeguard the habitat and crew.</p>

      <div style="display:flex;flex-direction:column;gap:12px;margin:20px 0;" id="emergencySteps">
        <div class="glass-panel" style="padding:16px;border-color:var(--amber);" id="step1">
          <b style="color:var(--amber);">STEP 1: Verify NASA DONKI Solar Warning</b>
          <p class="small muted" style="margin:6px 0 10px;">Coronal Mass Ejection detected traveling at 1,420 km/s. Radiation sensors indicate S3 Proton Storm.</p>
          <button class="btn small primary" onclick="AstronautAcademy.resolveEmergencyStep(1)">Acknowledge Alert & Sound Warning Chime</button>
        </div>
        <div class="glass-panel" style="padding:16px;opacity:0.4;" id="step2">
          <b>STEP 2: Protect External Solar Arrays</b>
          <p class="small muted" style="margin:6px 0 10px;">High-energy ions cause microscopic surface etching on photovoltaic glass.</p>
          <button class="btn small" disabled onclick="AstronautAcademy.resolveEmergencyStep(2)">Feather & Retract Outer Solar Wings</button>
        </div>
        <div class="glass-panel" style="padding:16px;opacity:0.4;" id="step3">
          <b>STEP 3: Station Life Support Battery Backup</b>
          <p class="small muted" style="margin:6px 0 10px;">With solar wings feathered, switch ECLSS oxygen generators to lithium battery banks.</p>
          <button class="btn small" disabled onclick="AstronautAcademy.resolveEmergencyStep(3)">Transfer Power Bus to Fuel Cells</button>
        </div>
        <div class="glass-panel" style="padding:16px;opacity:0.4;" id="step4">
          <b>STEP 4: Regolith Bunker Crew Muster</b>
          <p class="small muted" style="margin:6px 0 10px;">Guide all astronauts into the 2.5m thick lunar regolith shelter.</p>
          <button class="btn small" disabled onclick="AstronautAcademy.resolveEmergencyStep(4)">Seal Storm Hatch & Confirm 100% Shielding</button>
        </div>
      </div>

      <div class="btnRow" style="display:flex;justify-content:flex-end;margin-top:14px;gap:10px;">
        <button class="btn" onclick="AstronautAcademy.closeModal()">Exit Drill</button>
        <button class="btn primary" id="emFinishBtn" disabled onclick="AstronautAcademy.finishModule('emergency', 'Safety Commander')">Certify Emergency Readiness (+150 XP)</button>
      </div>
    `;
  }

  function resolveEmergencyStep(num) {
    SoundEngine.success();
    const cur = document.getElementById(`step${num}`);
    cur.style.borderColor = 'var(--green)';
    cur.querySelector('button').disabled = true;
    cur.querySelector('button').innerHTML = '✓ COMPLETED';

    if (num < 4) {
      const next = document.getElementById(`step${num + 1}`);
      next.style.opacity = '1';
      next.querySelector('button').disabled = false;
      next.querySelector('button').classList.add('primary');
    } else {
      document.getElementById('emFinishBtn').disabled = false;
    }
  }

  function finishModule(id, achievementName) {
    if (!PlayerProfile.profile.completedModules.includes(id)) {
      PlayerProfile.profile.completedModules.push(id);
    }
    PlayerProfile.addXP(150, `Completed ${id.toUpperCase()} Training`);
    PlayerProfile.unlockAchievement(id, achievementName);
    closeModal();
    renderHub('academyHubView');
  }

  function closeModal() {
    SoundEngine.click();
    const modal = document.getElementById('interactiveModal');
    if (modal) modal.classList.remove('on');
  }

  return {
    renderHub,
    startModule,
    resolveEmergencyStep,
    finishModule,
    closeModal
  };
})();
