// NASA JUNIOR ASTRONAUT MISSION TRAINER - 3D SPACECRAFT FLIGHT SIMULATOR
const SpacecraftSimulator = (() => {
  let simCanvas, ctx, animId;
  let ship = {
    x: 0, y: 0, z: 0,
    pitch: 0, yaw: 0, roll: 0,
    speed: 0.5,
    maxSpeed: 3.5,
    fuel: 100
  };

  let rings = [
    { x: 0, y: 0, z: 250, passed: false },
    { x: 30, y: -20, z: 550, passed: false },
    { x: -40, y: 15, z: 900, passed: false },
    { x: 20, y: 35, z: 1300, passed: false },
    { x: 0, y: 0, z: 1750, passed: false }
  ];

  let passedRingsCount = 0;
  let keys = {};
  let isSimActive = false;

  function renderHub(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div class="hubContainer">
        <div class="hubHeader">
          <div class="eyebrow">NASA PILOT SIMULATION COCKPIT</div>
          <h1>Spacecraft Flight Simulator</h1>
          <p>Take manual flight control of the Orion deep-space crew exploration vehicle! Navigate through 5 orbital navigational waypoint rings in low Earth orbit and perform a precision approach.</p>
        </div>

        <div style="position:relative;width:100%;max-width:1000px;margin:16px auto;">
          <canvas id="flightSimCanvas" width="900" height="480" style="width:100%;border-radius:14px;background:#02050E;border:2px solid rgba(66,232,255,0.4);display:block;box-shadow:0 0 35px rgba(57,139,255,0.25);"></canvas>
          
          <!-- Cockpit Flight HUD Overlay -->
          <div id="flightHud">
            <div class="hudTopFlight">
              <div>SPEED: <b id="simSpeed" style="color:var(--cyan);">0.50 km/s</b></div>
              <div>WAYPOINT: <b id="simWaypoint" style="color:var(--amber);">GATE 1 / 5</b></div>
              <div>RCS FUEL: <b id="simFuel" style="color:var(--green);">100%</b></div>
            </div>
            
            <div class="crosshair"></div>

            <div style="display:flex;justify-content:space-between;align-items:flex-end;">
              <div style="background:rgba(5,8,22,0.7);padding:8px 14px;border-radius:8px;font-size:11px;border:1px solid rgba(255,255,255,0.1);">
                <b>CONTROLS:</b> W/S = Speed · A/D = Turn · Q/E = Roll · Space = Booster
              </div>
              <button class="btn primary" id="simResetBtn" onclick="SpacecraftSimulator.resetSim()">Reset Flight</button>
            </div>
          </div>
        </div>

        <div class="factBox" style="background:rgba(11,21,48,0.7);border-color:var(--panel-border);padding:14px;border-radius:10px;margin-top:16px;">
          <b style="color:var(--cyan);font-family:var(--font-display);">PILOT FLIGHT MANUAL:</b>
          <p style="font-size:12px;color:var(--silver);margin-top:4px;">In space, you do not bank or turn using airfoils like an airplane. Spacecraft use Reaction Control System (RCS) thrusters that squirt nitrogen or hydrazine gas to rotate in any direction!</p>
        </div>
      </div>
    `;

    initSimulator();
  }

  function initSimulator() {
    simCanvas = document.getElementById('flightSimCanvas');
    if (!simCanvas) return;
    ctx = simCanvas.getContext('2d');

    resetSim();
    isSimActive = true;

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    loop();
  }

  function resetSim() {
    ship = {
      x: 0, y: 0, z: 0,
      pitch: 0, yaw: 0, roll: 0,
      speed: 1.2,
      maxSpeed: 4.0,
      fuel: 100
    };
    rings = [
      { x: 0, y: 0, z: 250, passed: false },
      { x: 40, y: -25, z: 600, passed: false },
      { x: -50, y: 20, z: 1000, passed: false },
      { x: 30, y: 40, z: 1450, passed: false },
      { x: 0, y: 0, z: 1950, passed: false }
    ];
    passedRingsCount = 0;
    updateHud();
  }

  function onKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
  }
  function onKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
  }

  function updateHud() {
    const spd = document.getElementById('simSpeed');
    const wp = document.getElementById('simWaypoint');
    const fl = document.getElementById('simFuel');

    if (spd) spd.textContent = (ship.speed * 2.2).toFixed(2) + ' km/s';
    if (wp) wp.textContent = `GATE ${Math.min(passedRingsCount + 1, 5)} / 5`;
    if (fl) fl.textContent = Math.round(ship.fuel) + '%';
  }

  function loop() {
    if (!document.getElementById('flightSimCanvas')) {
      isSimActive = false;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      return;
    }

    // Controls
    if (keys['w'] || keys['arrowup']) ship.speed = Math.min(ship.speed + 0.05, ship.maxSpeed);
    if (keys['s'] || keys['arrowdown']) ship.speed = Math.max(ship.speed - 0.05, 0.4);
    if (keys['a'] || keys['arrowleft']) { ship.x -= 1.8; ship.roll = -0.2; }
    else if (keys['d'] || keys['arrowright']) { ship.x += 1.8; ship.roll = 0.2; }
    else { ship.roll *= 0.9; }

    if (keys['q']) ship.y -= 1.4;
    if (keys['e']) ship.y += 1.4;

    if (keys[' ']) {
      ship.speed = Math.min(ship.speed + 0.15, ship.maxSpeed * 1.5);
      ship.fuel = Math.max(0, ship.fuel - 0.15);
      SoundEngine.startThruster();
    } else {
      SoundEngine.stopThruster();
    }

    // Advance forward
    ship.z += ship.speed * 4;

    // Check Waypoint Rings
    rings.forEach((r, idx) => {
      if (!r.passed && ship.z >= r.z) {
        const dist = Math.hypot(ship.x - r.x, ship.y - r.y);
        if (dist < 55) {
          r.passed = true;
          passedRingsCount++;
          SoundEngine.success();
          if (typeof toast === 'function') toast(`Gate ${passedRingsCount} Cleared!`);
          if (passedRingsCount >= 5) {
            PlayerProfile.unlockAchievement('master_pilot', 'Master Pilot');
            PlayerProfile.addXP(300, 'Mastered Spacecraft Flight Simulator');
          }
        } else {
          // Missed gate
          r.passed = true;
          SoundEngine.alert();
          if (typeof toast === 'function') toast(`Gate ${idx + 1} Missed! Keep Flying!`);
        }
      }
    });

    updateHud();

    // Render 3D Space Flight Field
    ctx.fillStyle = '#02050E';
    ctx.fillRect(0, 0, simCanvas.width, simCanvas.height);

    const cx = simCanvas.width / 2;
    const cy = simCanvas.height / 2;

    // Distant Earth in Background
    ctx.beginPath();
    ctx.arc(cx + 220, cy + 180, 190, 0, Math.PI * 2);
    ctx.fillStyle = '#1D4ED8';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 200, cy + 160, 160, 0, Math.PI * 2);
    ctx.fillStyle = '#2563EB';
    ctx.fill();

    // Render Waypoint Rings in Perspective
    rings.forEach(r => {
      const relZ = r.z - ship.z;
      if (relZ > 0 && relZ < 1800) {
        const fov = 420;
        const scale = fov / relZ;
        const screenX = cx + (r.x - ship.x) * scale;
        const screenY = cy + (r.y - ship.y) * scale;
        const ringRadius = 55 * scale;

        ctx.beginPath();
        ctx.arc(screenX, screenY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = r.passed ? 'rgba(56, 217, 150, 0.4)' : (relZ < 400 ? '#42E8FF' : 'rgba(66, 232, 255, 0.6)');
        ctx.lineWidth = Math.max(2, 6 * scale);
        ctx.stroke();

        // Pulsing Chevron
        ctx.beginPath();
        ctx.arc(screenX, screenY, ringRadius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(66, 232, 255, 0.2)';
        ctx.fill();
      }
    });

    // Spacecraft Body (Third-Person View)
    ctx.save();
    ctx.translate(cx, cy + 85);
    ctx.rotate(ship.roll);

    // Thruster Flare
    ctx.beginPath();
    ctx.moveTo(-8, 30);
    ctx.lineTo(8, 30);
    ctx.lineTo(0, 30 + Math.random() * 20 + ship.speed * 8);
    ctx.fillStyle = '#42E8FF';
    ctx.fill();

    // Orion Capsule & Service Module
    ctx.fillStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.moveTo(0, -35); // nose
    ctx.lineTo(26, 20); // right wing
    ctx.lineTo(-26, 20); // left wing
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#398BFF';
    ctx.stroke();

    // Solar Wings
    ctx.fillStyle = '#153E8A';
    ctx.fillRect(-58, 8, 30, 8);
    ctx.fillRect(28, 8, 30, 8);
    ctx.restore();

    animId = requestAnimationFrame(loop);
  }

  return {
    renderHub,
    resetSim
  };
})();
