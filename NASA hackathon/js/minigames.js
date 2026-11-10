/**
 * Project Starbridge - Interactive Junior Astronaut Mini-Games
 * 1. Neutral Buoyancy Lab EVA (Earth)
 * 2. Canadarm2 Cargo Grapple (Orbit)
 * 3. Scoop the Rover Ice-Miner (Moon)
 * 4. MOXIE Mars Atmospheric Squeezer (Mars)
 */

class MiniGameEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.activeGame = null;
    this.animationId = null;
    this.keys = {};
    this.score = 0;
    this.timer = 0;
    this.isGameOver = false;
    this.onCompleteCallback = null;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    if (this.canvas) {
      // Touch and mouse click support for mobile / tablets
      this.canvas.addEventListener('pointerdown', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.touchX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.touchY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        this.keys['Space'] = true;
      });
      this.canvas.addEventListener('pointerup', () => {
        this.keys['Space'] = false;
        this.touchX = null;
        this.touchY = null;
      });
    }
  }

  start(gameType, onComplete) {
    if (!this.canvas) return;
    this.stop();
    this.activeGame = gameType;
    this.onCompleteCallback = onComplete;
    this.isGameOver = false;

    // Set canvas dimensions
    this.canvas.width = 800;
    this.canvas.height = 450;

    if (gameType === 'pool-eva') {
      this.initPoolEVA();
    } else if (gameType === 'canadarm-catch') {
      this.initCanadarm();
    } else if (gameType === 'rover-mining') {
      this.initRoverMining();
    } else if (gameType === 'moxie-squeeze') {
      this.initMoxie();
    }

    this.loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  loop() {
    if (!this.activeGame) return;
    this.update();
    this.render();
    if (!this.isGameOver) {
      this.animationId = requestAnimationFrame(() => this.loop());
    }
  }

  // ==========================================
  // MINI-GAME 1: NEUTRAL BUOYANCY POOL EVA
  // ==========================================
  initPoolEVA() {
    this.player = {
      x: 100,
      y: 200,
      vx: 0,
      vy: 0,
      size: 26,
      angle: 0
    };
    this.bubbles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 450,
      speed: 0.5 + Math.random() * 1.5,
      r: 2 + Math.random() * 3
    }));
    this.bolts = [
      { x: 380, y: 140, fixed: false, label: "Valve A" },
      { x: 620, y: 220, fixed: false, label: "Valve B" },
      { x: 450, y: 350, fixed: false, label: "Valve C" }
    ];
    this.timer = 40.0;
    this.score = 0;
  }

  updatePoolEVA() {
    this.timer -= 1 / 60;
    if (this.timer <= 0) {
      this.timer = 0;
      this.endGame(false, "Out of Oxygen! Pool divers escorted you to the surface.");
      return;
    }

    // Physics with water drag
    const speed = 0.28;
    const drag = 0.94;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) this.player.vy -= speed;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) this.player.vy += speed;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.player.vx -= speed;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.player.vx += speed;

    this.player.vx *= drag;
    this.player.vy *= drag;
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;

    // Boundaries
    this.player.x = Math.max(30, Math.min(770, this.player.x));
    this.player.y = Math.max(30, Math.min(420, this.player.y));

    // Update bubbles
    this.bubbles.forEach(b => {
      b.y -= b.speed;
      if (b.y < 0) {
        b.y = 450;
        b.x = Math.random() * 800;
      }
    });

    // Check bolt repairs
    this.bolts.forEach(bolt => {
      const dist = Math.hypot(this.player.x - bolt.x, this.player.y - bolt.y);
      if (dist < 40 && !bolt.fixed && this.keys['Space']) {
        bolt.fixed = true;
        this.score++;
        window.spaceAudio.playChime();
        if (this.score >= this.bolts.length) {
          this.endGame(true, "All 3 space station valves repaired! Neutral Buoyancy Wings Earned!");
        }
      }
    });
  }

  renderPoolEVA() {
    const ctx = this.ctx;
    // Blue pool water gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 450);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(1, '#082f49');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 450);

    // Pool tiles pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 450); ctx.stroke();
    }
    for (let y = 0; y < 450; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
    }

    // ISS Mockup Structure in pool
    ctx.fillStyle = '#334155';
    ctx.fillRect(320, 100, 360, 260);
    ctx.fillStyle = '#475569';
    ctx.fillRect(340, 120, 320, 220);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Space Mono';
    ctx.fillText("NASA NEUTRAL BUOYANCY LAB - ISS MOCKUP", 350, 140);

    // Render Bubbles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    this.bubbles.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Render Bolts
    this.bolts.forEach(bolt => {
      ctx.beginPath();
      ctx.arc(bolt.x, bolt.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = bolt.fixed ? '#22c55e' : '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Space Mono';
      ctx.fillText(bolt.fixed ? "FIXED" : bolt.label, bolt.x - 18, bolt.y - 20);
      if (!bolt.fixed) {
        ctx.fillStyle = '#fef08a';
        ctx.font = '9px sans-serif';
        ctx.fillText("[SPACE]", bolt.x - 16, bolt.y + 4);
      }
    });

    // Render Astronaut Diver
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    // Spacesuit body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    // Gold visor
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(6, -2, 7, 0, Math.PI * 2);
    ctx.fill();
    // Oxygen backpack
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-18, -10, 8, 20);
    ctx.restore();

    // HUD Display
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Space Mono';
    ctx.fillText(`AIR SUPPLY: ${this.timer.toFixed(1)}s`, 24, 34);
    ctx.fillText(`VALVES FIXED: ${this.score} / ${this.bolts.length}`, 24, 60);

    ctx.fillStyle = '#fef08a';
    ctx.font = '12px sans-serif';
    ctx.fillText("CONTROLS: Arrow Keys / WASD to Swim | Hold SPACE at valve to repair", 24, 430);
  }

  // ==========================================
  // MINI-GAME 2: CANADARM2 CARGO GRAPPLE
  // ==========================================
  initCanadarm() {
    this.claw = { x: 400, y: 225, vx: 0, vy: 0 };
    this.capsule = {
      x: 350,
      y: 200,
      targetX: 450,
      targetY: 260,
      angle: 0,
      w: 120,
      h: 80,
      t: 0
    };
    this.timer = 30.0;
    this.grappled = false;
  }

  updateCanadarm() {
    this.timer -= 1 / 60;
    if (this.timer <= 0) {
      this.timer = 0;
      this.endGame(false, "Cargo capsule drifted out of reach! Try again.");
      return;
    }

    // Move claw
    const spd = 4;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) this.claw.y -= spd;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) this.claw.y += spd;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.claw.x -= spd;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.claw.x += spd;

    this.claw.x = Math.max(80, Math.min(720, this.claw.x));
    this.claw.y = Math.max(80, Math.min(380, this.claw.y));

    // Capsule gently floats and tumbles
    this.capsule.t += 0.02;
    this.capsule.x = 400 + Math.sin(this.capsule.t * 0.8) * 120;
    this.capsule.y = 220 + Math.cos(this.capsule.t * 0.6) * 60;
    this.capsule.angle += 0.005;

    // Pin position on capsule
    const pinX = this.capsule.x;
    const pinY = this.capsule.y;

    // Check grapple press
    const dist = Math.hypot(this.claw.x - pinX, this.claw.y - pinY);
    if (dist < 32 && this.keys['Space']) {
      this.grappled = true;
      window.spaceAudio.playFanfare();
      this.endGame(true, "PERFECT DOCKING! Canadarm2 grappled the Cygnus resupply capsule!");
    }
  }

  renderCanadarm() {
    const ctx = this.ctx;
    // Earth from orbit background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 800, 450);

    // Glowing curved limb of Earth
    const earthGrad = ctx.createRadialGradient(400, 750, 200, 400, 750, 550);
    earthGrad.addColorStop(0, '#0284c7');
    earthGrad.addColorStop(0.5, '#0369a1');
    earthGrad.addColorStop(0.8, '#082f49');
    earthGrad.addColorStop(1, '#030712');
    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(400, 750, 520, 0, Math.PI * 2);
    ctx.fill();

    // Cargo Capsule
    ctx.save();
    ctx.translate(this.capsule.x, this.capsule.y);
    ctx.rotate(this.capsule.angle);
    // Solar wings
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-90, -10, 50, 20);
    ctx.fillRect(40, -10, 50, 20);
    // Capsule body
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(-40, -30, 80, 60, 10);
    ctx.fill();
    // NASA meatball logo placeholder
    ctx.fillStyle = '#0b3d91';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    // Grapple pin target
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Canadarm Boom links from edge
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(800, 450);
    ctx.lineTo(600, 350);
    ctx.lineTo(this.claw.x + 30, this.claw.y + 20);
    ctx.lineTo(this.claw.x, this.claw.y);
    ctx.stroke();

    // Canadarm Crosshair Claw
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.claw.x, this.claw.y, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.claw.x - 30, this.claw.y); ctx.lineTo(this.claw.x + 30, this.claw.y);
    ctx.moveTo(this.claw.x, this.claw.y - 30); ctx.lineTo(this.claw.x, this.claw.y + 30);
    ctx.stroke();

    // HUD
    const dist = Math.hypot(this.claw.x - this.capsule.x, this.claw.y - this.capsule.y);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Space Mono';
    ctx.fillText(`TIME TO DRIFT: ${this.timer.toFixed(1)}s`, 24, 34);
    ctx.fillText(`TARGET DISTANCE: ${Math.round(dist)} cm`, 24, 60);

    if (dist < 32) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 20px Space Mono';
      ctx.fillText(">>> IN CAPTURE ZONE! PRESS [SPACE] TO GRAPPLE! <<<", 120, 410);
    } else {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px sans-serif';
      ctx.fillText("CONTROLS: Use Arrow Keys to Align Canadarm Reticle with Capsule Pin", 24, 430);
    }
  }

  // ==========================================
  // MINI-GAME 3: SCOOP ROVER ICE-MINING (MOON)
  // ==========================================
  initRoverMining() {
    this.rover = { x: 100, y: 220, angle: 0, speed: 0 };
    this.rocks = [
      { x: 260, y: 150, r: 24 },
      { x: 340, y: 320, r: 28 },
      { x: 520, y: 180, r: 35 },
      { x: 600, y: 350, r: 25 }
    ];
    this.iceDeposits = [
      { x: 220, y: 340, collected: false, val: 25 },
      { x: 440, y: 120, collected: false, val: 35 },
      { x: 680, y: 240, collected: false, val: 40 }
    ];
    this.timer = 45.0;
    this.iceExtracted = 0;
  }

  updateRoverMining() {
    this.timer -= 1 / 60;
    if (this.timer <= 0) {
      this.timer = 0;
      this.endGame(false, "Rover battery depleted in freezing crater shadow! Return to charger.");
      return;
    }

    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.rover.angle -= 0.05;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.rover.angle += 0.05;

    let accel = 0;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) accel = 0.12;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) accel = -0.08;

    this.rover.speed = (this.rover.speed + accel) * 0.94;
    this.rover.x += Math.cos(this.rover.angle) * this.rover.speed;
    this.rover.y += Math.sin(this.rover.angle) * this.rover.speed;

    this.rover.x = Math.max(30, Math.min(770, this.rover.x));
    this.rover.y = Math.max(30, Math.min(420, this.rover.y));

    // Rock collisions
    this.rocks.forEach(r => {
      const d = Math.hypot(this.rover.x - r.x, this.rover.y - r.y);
      if (d < r.r + 18) {
        this.rover.speed = -1.5;
        window.spaceAudio.playBeep(200, 0.1);
      }
    });

    // Ice drilling
    this.iceDeposits.forEach(ice => {
      const d = Math.hypot(this.rover.x - ice.x, this.rover.y - ice.y);
      if (d < 36 && !ice.collected && this.keys['Space']) {
        ice.collected = true;
        this.iceExtracted += ice.val;
        window.spaceAudio.playDrill();
        if (this.iceExtracted >= 100) {
          this.endGame(true, `SUCCESS! Scoop extracted ${this.iceExtracted}L of pristine lunar crater ice for rocket fuel!`);
        }
      }
    });
  }

  renderRoverMining() {
    const ctx = this.ctx;
    // Pitch-black crater floor
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, 800, 450);

    // Rover Headlight Cone
    ctx.save();
    ctx.translate(this.rover.x, this.rover.y);
    ctx.rotate(this.rover.angle);
    const lightGrad = ctx.createRadialGradient(0, 0, 10, 140, 0, 200);
    lightGrad.addColorStop(0, 'rgba(255, 255, 230, 0.45)');
    lightGrad.addColorStop(1, 'rgba(255, 255, 230, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 200, -0.4, 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Boulders
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#3f3f46';
    this.rocks.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Ice Deposits (Glowing Cyan Crystals)
    this.iceDeposits.forEach(ice => {
      if (!ice.collected) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ice.x, ice.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#e0f2fe';
        ctx.font = '10px Space Mono';
        ctx.fillText(`ICE: ${ice.val}L`, ice.x - 18, ice.y - 18);
        ctx.fillText("[HOLD SPACE]", ice.x - 28, ice.y + 24);
      }
    });

    // Draw Scoop the Rover
    ctx.save();
    ctx.translate(this.rover.x, this.rover.y);
    ctx.rotate(this.rover.angle);
    // Treads
    ctx.fillStyle = '#71717a';
    ctx.fillRect(-18, -16, 36, 6);
    ctx.fillRect(-18, 10, 36, 6);
    // Body
    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(-14, -10, 28, 20);
    // Drill Arm
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(12, -4, 12, 8);
    ctx.restore();

    // HUD
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Space Mono';
    ctx.fillText(`SHACKLETON CRATER TEMP: -410°F`, 24, 34);
    ctx.fillText(`BATTERY TIMER: ${this.timer.toFixed(1)}s`, 24, 60);
    ctx.fillText(`WATER ICE EXTRACTED: ${this.iceExtracted} / 100 L`, 24, 86);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText("CONTROLS: Arrow Keys to Drive Rover | Hold SPACE over glowing blue ice to drill", 24, 430);
  }

  // ==========================================
  // MINI-GAME 4: MOXIE MARS ATMOSPHERIC SQUEEZER
  // ==========================================
  initMoxie() {
    this.co2Bubbles = [];
    this.o2Collected = 0;
    this.targetO2 = 10;
    this.timer = 30.0;
    this.coreHeat = 800; // 800 C
    this.spawnTimer = 0;
  }

  updateMoxie() {
    this.timer -= 1 / 60;
    if (this.timer <= 0) {
      this.timer = 0;
      this.endGame(false, "MOXIE reaction cooled down! Need sustained oxygen production.");
      return;
    }

    this.spawnTimer++;
    if (this.spawnTimer % 45 === 0) {
      this.co2Bubbles.push({
        x: 50,
        y: 180 + Math.random() * 90,
        vx: 3 + Math.random() * 2,
        cracked: false
      });
    }

    // Move CO2 bubbles
    this.co2Bubbles.forEach(b => {
      b.x += b.vx;
    });

    // Check electrolysis tap when inside catalytic golden chamber (x: 350 - 450)
    if (this.keys['Space']) {
      this.co2Bubbles.forEach(b => {
        if (!b.cracked && b.x >= 340 && b.x <= 460) {
          b.cracked = true;
          this.o2Collected++;
          window.spaceAudio.playChime();
          if (this.o2Collected >= this.targetO2) {
            this.endGame(true, "MOXIE SUCCESS! Pure breathable Oxygen generated from toxic Mars CO2!");
          }
        }
      });
    }

    // Filter off-screen
    this.co2Bubbles = this.co2Bubbles.filter(b => b.x < 780);
  }

  renderMoxie() {
    const ctx = this.ctx;
    // Mars rust exterior background
    ctx.fillStyle = '#1c0a07';
    ctx.fillRect(0, 0, 800, 450);

    // Reaction Pipe
    ctx.fillStyle = '#3f1811';
    ctx.fillRect(40, 160, 720, 130);
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 160, 720, 130);

    // Solid Oxide Electrolysis Chamber (Golden Box at 800°C)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.25)';
    ctx.fillRect(340, 140, 120, 170);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.strokeRect(340, 140, 120, 170);

    ctx.fillStyle = '#fef08a';
    ctx.font = '12px Space Mono';
    ctx.fillText("SOLID OXIDE CORE", 345, 130);
    ctx.fillText("800°C CRACKING ZONE", 340, 325);

    // Render CO2 & O2 Molecules
    this.co2Bubbles.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = b.cracked ? '#06d6a0' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Space Mono';
      ctx.fillText(b.cracked ? "O2" : "CO2", b.x - 9, b.y + 4);
    });

    // HUD
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Space Mono';
    ctx.fillText(`MOXIE SYSTEM STATUS: ACTIVE (800°C)`, 24, 34);
    ctx.fillText(`CYCLE TIMER: ${this.timer.toFixed(1)}s`, 24, 60);
    ctx.fillText(`OXYGEN PRODUCED: ${this.o2Collected} / ${this.targetO2} CYLINDERS`, 24, 86);

    ctx.fillStyle = '#fef08a';
    ctx.font = '14px Space Mono';
    ctx.fillText("TAP [SPACE] WHEN CO2 ENTERS THE GOLDEN 800°C ZONE TO CRACK INTO O2!", 80, 420);
  }

  update() {
    if (this.activeGame === 'pool-eva') this.updatePoolEVA();
    else if (this.activeGame === 'canadarm-catch') this.updateCanadarm();
    else if (this.activeGame === 'rover-mining') this.updateRoverMining();
    else if (this.activeGame === 'moxie-squeeze') this.updateMoxie();
  }

  render() {
    if (this.activeGame === 'pool-eva') this.renderPoolEVA();
    else if (this.activeGame === 'canadarm-catch') this.renderCanadarm();
    else if (this.activeGame === 'rover-mining') this.renderRoverMining();
    else if (this.activeGame === 'moxie-squeeze') this.renderMoxie();
  }

  endGame(success, message) {
    this.isGameOver = true;
    this.stop();
    if (this.onCompleteCallback) {
      this.onCompleteCallback(success, message);
    }
  }
}

window.MiniGameEngine = MiniGameEngine;

