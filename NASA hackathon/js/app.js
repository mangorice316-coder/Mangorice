/**
 * Project Starbridge - Master Application Controller
 * Coordinates Screens, UI State, Telemetry, and Interactive Canvas Views
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Engines
  const engine = new StarbridgeEngine();
  const campaign = new CampaignManager(engine);
  const minigames = new MiniGameEngine('minigame-canvas');
  const certificate = new CertificateGenerator('certificate-canvas');

  // DOM Elements
  const screens = {
    hero: document.getElementById('screen-hero'),
    dashboard: document.getElementById('screen-dashboard'),
    minigames: document.getElementById('screen-minigames'),
    coop: document.getElementById('screen-coop'),
    guide: document.getElementById('screen-guide'),
    certificate: document.getElementById('screen-certificate')
  };

  const navBtns = document.querySelectorAll('.btn-nav');
  const audioBtn = document.getElementById('btn-audio-toggle');

  // Switch Active Screen
  function showScreen(screenId) {
    Object.values(screens).forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (screens[screenId]) {
      screens[screenId].classList.add('active');
    }

    navBtns.forEach(btn => {
      if (btn.dataset.target === screenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    window.spaceAudio.playClick();

    if (screenId === 'dashboard') {
      updateTelemetryUI();
      engine.renderBaseCanvas('base-canvas');
    } else if (screenId === 'certificate') {
      const cadetInput = document.getElementById('cadet-name-input');
      const cadetName = cadetInput && cadetInput.value.trim() ? cadetInput.value.trim() : "Commander Alex";
      certificate.render(cadetName, Array.from(engine.badgesEarned));
    }
  }

  // Navigation Button Handlers
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen(btn.dataset.target);
    });
  });

  // Audio Toggle
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isMuted = window.spaceAudio.toggleMute();
      audioBtn.innerHTML = isMuted ? '🔇' : '🔊';
      if (!isMuted) {
        window.spaceAudio.startAmbientMusic();
      }
    });
  }

  // First interaction starts ambient audio
  document.body.addEventListener('click', () => {
    window.spaceAudio.init();
    if (!window.spaceAudio.isMuted) {
      window.spaceAudio.startAmbientMusic();
    }
  }, { once: true });

  // Mode Card Handlers on Hero Screen
  document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', () => {
      const mode = card.dataset.mode;
      if (mode === 'campaign') {
        campaign.startMission(1);
        showScreen('dashboard');
        showMissionBriefingModal(campaign.getCurrentMission());
      } else if (mode === 'coop') {
        campaign.initCoopMode();
        showScreen('coop');
        renderCoopUI();
      } else if (mode === 'minigames') {
        showScreen('minigames');
        startMiniGameSelect('pool-eva');
      } else if (mode === 'guide') {
        showScreen('guide');
      }
    });
  });

  // ==========================================
  // TELEMETRY & DASHBOARD UPDATE
  // ==========================================
  function updateTelemetryUI() {
    const world = engine.getCurrentWorld();
    
    // Header World Info
    const worldNameEl = document.getElementById('hud-world-name');
    const solValEl = document.getElementById('hud-sol-val');
    const delayValEl = document.getElementById('hud-delay-val');
    const worldIconEl = document.getElementById('hud-world-icon');

    if (worldNameEl) worldNameEl.textContent = world.name;
    if (solValEl) solValEl.textContent = `SOL ${engine.sol} (${engine.isNight ? '🌙 Lunar Night' : '☀️ Daytime'})`;
    if (delayValEl) delayValEl.textContent = `Radio Delay: ${world.radioDelay}`;
    if (worldIconEl) {
      worldIconEl.textContent = engine.worldIndex === 0 ? '🌍' : engine.worldIndex === 1 ? '🛰️' : engine.worldIndex === 2 ? '🌕' : '🪐';
    }

    // Telemetry Gauges
    const res = engine.resources;
    setGauge('power', res.power, res.maxPower, 'kW');
    setGauge('water', res.water, res.maxWater, 'L');
    setGauge('oxygen', res.oxygen, res.maxOxygen, 'kg');
    setGauge('food', res.food, res.maxFood, 'kg');
    setGauge('fuel', res.fuel, res.maxFuel, 'kg');
    setGauge('parts', res.parts, 20, 'units');
    setGauge('morale', res.morale, 100, '%');

    // Update Room Actions Bar
    renderRoomSlotsUI();
    renderCrewRosterUI();
  }

  function setGauge(id, val, max, unit) {
    const valEl = document.getElementById(`val-${id}`);
    const barEl = document.getElementById(`bar-${id}`);
    if (valEl) valEl.textContent = `${Math.round(val)} ${unit}`;
    if (barEl) {
      const pct = Math.max(0, Math.min(100, (val / max) * 100));
      barEl.style.width = `${pct}%`;
    }
  }

  // Room Slots in Control Panel
  function renderRoomSlotsUI() {
    const container = document.getElementById('room-slots-container');
    if (!container) return;
    container.innerHTML = '';

    engine.rooms.forEach(room => {
      const slot = document.createElement('div');
      slot.className = `btn-room-slot ${room.built ? 'built' : ''} ${room.flooded ? 'flooded' : ''}`;
      slot.innerHTML = `
        <span style="font-size: 1.3rem;">${room.icon}</span>
        <strong>${room.name}</strong>
        <span>${room.built ? (room.eco ? 'ECO-MODE' : (room.flooded ? 'SHIELD ON' : 'ACTIVE')) : '+ BUILD'}</span>
      `;
      slot.addEventListener('click', () => {
        if (!room.built) {
          const res = engine.buildRoom(room.id);
          showNotification(res.msg);
          updateTelemetryUI();
          engine.renderBaseCanvas('base-canvas');
        } else if (room.id === 'water-shelter') {
          const res = engine.toggleWaterWallShield();
          showNotification(res.msg);
          updateTelemetryUI();
          engine.renderBaseCanvas('base-canvas');
        } else {
          const isEco = engine.toggleEcoMode(room.id);
          showNotification(`${room.name} switched to ${isEco ? 'Eco-Mode (Low Power)' : 'Normal Mode'}`);
          updateTelemetryUI();
          engine.renderBaseCanvas('base-canvas');
        }
      });
      container.appendChild(slot);
    });
  }

  // Crew Roster & Assignment Selects
  function renderCrewRosterUI() {
    const container = document.getElementById('crew-roster-container');
    if (!container) return;
    container.innerHTML = '';

    engine.crew.forEach(member => {
      const card = document.createElement('div');
      card.className = 'crew-card';
      
      const selectHtml = `
        <select data-crew="${member.id}" class="crew-room-select">
          <option value="">Unassigned</option>
          ${engine.rooms.filter(r => r.built).map(r => `
            <option value="${r.id}" ${r.assigned === member.id ? 'selected' : ''}>${r.name}</option>
          `).join('')}
        </select>
      `;

      card.innerHTML = `
        <div class="crew-info">
          <div class="crew-avatar">${member.avatar}</div>
          <div class="crew-details">
            <h4>${member.name} ${'❤️'.repeat(member.hearts)}</h4>
            <span>${member.title}</span>
            <div class="crew-ability">⚡ ${member.bonus}</div>
          </div>
        </div>
        <div class="crew-assignment">
          ${selectHtml}
        </div>
      `;

      const select = card.querySelector('.crew-room-select');
      if (select) {
        select.addEventListener('change', (e) => {
          engine.assignCrew(member.id, e.target.value);
          engine.renderBaseCanvas('base-canvas');
          showNotification(`Assigned ${member.name} to ${e.target.value ? e.target.value : 'rest'}!`);
        });
      }

      container.appendChild(card);
    });
  }

  // "Next Sol" Advancement Button
  const btnNextSol = document.getElementById('btn-next-sol');
  if (btnNextSol) {
    btnNextSol.addEventListener('click', () => {
      const res = engine.advanceSol();
      updateTelemetryUI();
      engine.renderBaseCanvas('base-canvas');

      // Random space weather or emergency chance
      if (engine.sol === 4) {
        triggerLunarFreezeEmergency();
      } else if (engine.sol === 6) {
        triggerSolarFlareEmergency();
      } else if (engine.sol === 9 && engine.worldIndex === 3) {
        triggerMarsDustStormEmergency();
      }
    });
  }

  // ==========================================
  // 10-SECOND REFLEX EMERGENCY SYSTEM
  // ==========================================
  const emergencyBanner = document.getElementById('emergency-banner');
  const emergencyTitle = document.getElementById('emergency-title');
  const emergencyDesc = document.getElementById('emergency-desc');
  const emergencyTimer = document.getElementById('emergency-timer-val');
  const choicesContainer = document.getElementById('emergency-choices-container');

  function showEmergencyUI(emergency) {
    if (!emergencyBanner) return;
    emergencyBanner.classList.add('active');
    if (emergencyTitle) emergencyTitle.innerHTML = `🚨 ${emergency.title}`;
    if (emergencyDesc) emergencyDesc.textContent = emergency.desc;

    // Render choice buttons
    if (choicesContainer) {
      choicesContainer.innerHTML = '';
      emergency.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
          <strong>Choice ${String.fromCharCode(65 + idx)}: ${choice.title}</strong>
          <span>${choice.desc}</span>
          <span class="choice-cost">${choice.costText}</span>
        `;
        btn.addEventListener('click', () => {
          engine.resolveEmergencyChoice(idx, (chosen) => {
            emergencyBanner.classList.remove('active');
            showNotification(`Action Taken: ${chosen.title}`);
            updateTelemetryUI();
            engine.renderBaseCanvas('base-canvas');
          });
        });
        choicesContainer.appendChild(btn);
      });
    }

    // Start Reflex Timer
    engine.triggerEmergency(emergency, 
      () => {
        // Timeout penalty
        emergencyBanner.classList.remove('active');
        showNotification("⏰ Time expired! Emergency caused base systems degradation!");
        engine.resources.power = Math.max(0, engine.resources.power - 20);
        engine.resources.morale = Math.max(20, engine.resources.morale - 20);
        updateTelemetryUI();
      }
    );

    // Update countdown tick in UI
    const timerUpdateInterval = setInterval(() => {
      if (!engine.activeEmergency) {
        clearInterval(timerUpdateInterval);
        return;
      }
      if (emergencyTimer) {
        emergencyTimer.textContent = `${engine.emergencyTimer}s`;
      }
    }, 500);
  }

  function triggerMarsDustStormEmergency() {
    showEmergencyUI({
      title: "Sol 214 Mars Giant Dust Storm Rolling In!",
      desc: "Buzz the Drone detects a 300-ft red dust wall rolling toward Jezero Crater! Earth is 18 minutes away—Mission Control cannot respond! You have 10 seconds before dust coats your solar panels!",
      baseSeconds: 10,
      choices: [
        {
          title: "Fold Solar Arrays Immediately",
          desc: "Protects panels from abrasive dust. 0 parts lost, but 0 solar power produced tonight.",
          costText: "Cost: 0 Parts | -30 Power tonight",
          apply: (eng) => {
            eng.resources.power = Math.max(0, eng.resources.power - 25);
          }
        },
        {
          title: "Leave Panels Open to Finish Charging",
          desc: "Gives +30 Power tonight, but dust storm cracks a solar wing requiring repairs tomorrow.",
          costText: "Gain: +30 Power | Cost: -3 Spare Parts tomorrow",
          apply: (eng) => {
            eng.resources.power = Math.min(eng.resources.maxPower, eng.resources.power + 30);
            eng.resources.parts = Math.max(0, eng.resources.parts - 3);
          }
        },
        {
          title: "Deploy Robot Arm Dust-Shield",
          desc: "Use Canadarm2 robot arm to tilt panels and brush off dust automatically.",
          costText: "Cost: -5 Power now | 100% Protection",
          apply: (eng) => {
            eng.resources.power = Math.max(0, eng.resources.power - 5);
          }
        }
      ]
    });
  }

  function triggerSolarFlareEmergency() {
    showEmergencyUI({
      title: "NASA DONKI Alert: X-Class Solar Flare CME!",
      desc: "The Sun just erupted a Coronal Mass Ejection right at the Lunar South Pole! Scoop the Rover is mining in Shackleton Crater. Choose your defense!",
      baseSeconds: 10,
      choices: [
        {
          title: "Flood Water Shelter Walls & Recall Rover",
          desc: "100% crew radiation protection. Pauses rover fuel production today.",
          costText: "Uses 30L Water temporarily | Crew 100% Safe",
          apply: (eng) => {
            eng.toggleWaterWallShield();
          }
        },
        {
          title: "Keep Water in Fuel Depot & Rush Astronaut Outside",
          desc: "Keeps fuel production online, but astronaut suffers radiation fatigue.",
          costText: "Gain: +25 Rocket Fuel | Crew Hearts -1",
          apply: (eng) => {
            eng.resources.fuel = Math.min(eng.resources.maxFuel, eng.resources.fuel + 25);
            eng.crew[0].hearts = Math.max(1, eng.crew[0].hearts - 1);
          }
        }
      ]
    });
  }

  function triggerLunarFreezeEmergency() {
    showEmergencyUI({
      title: "14-Day Lunar Night Freezing Shadow (-208°F)",
      desc: "Sun has dipped below Shackleton Crater rim. Base heaters require immediate energy allocation!",
      baseSeconds: 12,
      choices: [
        {
          title: "Switch Habitats to Eco-Power Mode",
          desc: "Reduces power drain by 60% to safely endure the cold night.",
          costText: "Power Saved: 20 kW | Slight Morale Drop",
          apply: (eng) => {
            eng.rooms.forEach(r => { if (r.built) r.eco = true; });
          }
        },
        {
          title: "Fire Up the Kilopower Fission Generator",
          desc: "Activates safe nuclear thermal loop, supplying continuous 40 kW power.",
          costText: "Gain: +40 kW baseline power day and night!",
          apply: (eng) => {
            eng.resources.power = Math.min(eng.resources.maxPower, eng.resources.power + 40);
          }
        }
      ]
    });
  }

  // ==========================================
  // MINI-GAME SELECT & CONTROLS
  // ==========================================
  const minigameSelects = document.querySelectorAll('.btn-minigame-select');
  minigameSelects.forEach(btn => {
    btn.addEventListener('click', () => {
      minigameSelects.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      startMiniGameSelect(btn.dataset.game);
    });
  });

  function startMiniGameSelect(gameType) {
    const titleEl = document.getElementById('minigame-title');
    const hintEl = document.getElementById('minigame-controls-desc');

    if (gameType === 'pool-eva') {
      if (titleEl) titleEl.textContent = "Mini-Game 1: Neutral Buoyancy Lab EVA (Houston, Earth)";
      if (hintEl) hintEl.textContent = "Arrow Keys / WASD to swim against water inertia. Hold SPACE at glowing valves to repair!";
    } else if (gameType === 'canadarm-catch') {
      if (titleEl) titleEl.textContent = "Mini-Game 2: Canadarm2 Cargo Grapple (Space Station Orbit)";
      if (hintEl) hintEl.textContent = "Arrow Keys / WASD to align the crosshair with the drifting Cygnus capsule. Press SPACE when in green capture zone!";
    } else if (gameType === 'rover-mining') {
      if (titleEl) titleEl.textContent = "Mini-Game 3: Scoop the Rover Ice-Miner (Shackleton Crater, Moon)";
      if (hintEl) hintEl.textContent = "Arrow Keys to drive rover. Hold SPACE over glowing blue crater ice crystals to drill water ice!";
    } else if (gameType === 'moxie-squeeze') {
      if (titleEl) titleEl.textContent = "Mini-Game 4: MOXIE Mars Atmospheric Squeezer (Jezero Crater, Mars)";
      if (hintEl) hintEl.textContent = "Press SPACE when CO2 enters the golden 800°C catalytic zone to split it into pure Oxygen!";
    }

    minigames.start(gameType, (success, msg) => {
      showNotification(msg);
      if (success) {
        window.spaceAudio.playFanfare();
        // Reward resources
        engine.resources.morale = Math.min(100, engine.resources.morale + 15);
        if (gameType === 'rover-mining') engine.resources.water += 50;
        if (gameType === 'moxie-squeeze') engine.resources.oxygen += 40;
        updateTelemetryUI();
      }
    });
  }

  // ==========================================
  // CO-OP 2-PLAYER MODE UI
  // ==========================================
  function renderCoopUI() {
    const delayEl = document.getElementById('coop-radio-delay');
    if (delayEl) {
      delayEl.textContent = `${engine.radioDelay.toFixed(1)}s (Speed of Light Delay)`;
    }
    updateRadioLogUI();
  }

  function updateRadioLogUI() {
    const logBox = document.getElementById('coop-radio-log');
    if (!logBox) return;
    logBox.innerHTML = '';
    campaign.radioLog.forEach(entry => {
      const p = document.createElement('div');
      p.className = `radio-msg ${entry.sender.toLowerCase().includes('houston') ? 'houston' : 'base'}`;
      p.innerHTML = `<strong>[${entry.time}] ${entry.sender}:</strong> ${entry.text}`;
      logBox.appendChild(p);
    });
  }

  // Co-Op Supply Payload Buttons
  document.querySelectorAll('.btn-coop-supply').forEach(btn => {
    btn.addEventListener('click', () => {
      const supplyType = btn.dataset.supply;
      btn.disabled = true;
      campaign.sendHoustonSupplyDrop(supplyType, () => {
        btn.disabled = false;
        updateRadioLogUI();
        updateTelemetryUI();
      });
      updateRadioLogUI();
    });
  });

  // Co-Op Guidance Send Button
  const btnSendGuidance = document.getElementById('btn-send-guidance');
  const guidanceInput = document.getElementById('coop-guidance-input');
  if (btnSendGuidance && guidanceInput) {
    btnSendGuidance.addEventListener('click', () => {
      const text = guidanceInput.value.trim();
      if (!text) return;
      campaign.sendHoustonGuidance(text);
      guidanceInput.value = '';
      updateRadioLogUI();
    });
  }

  // ==========================================
  // FIELD GUIDE / ENCYCLOPEDIA RENDER
  // ==========================================
  function renderFieldGuide() {
    const container = document.getElementById('field-guide-grid');
    if (!container) return;
    container.innerHTML = '';

    NASA_DATA.CONCEPTS.forEach(concept => {
      const card = document.createElement('div');
      card.className = 'guide-card';
      card.innerHTML = `
        <div class="guide-header">
          <div class="guide-icon">${concept.icon}</div>
          <div>
            <h3>${concept.title}</h3>
            <span style="font-size: 0.8rem; color: var(--artemis-orange);">${concept.subtitle}</span>
          </div>
        </div>
        <div class="guide-analogy">
          "${concept.analogy}"
        </div>
        <div class="guide-science">
          <strong>Real NASA Science:</strong> ${concept.science}
        </div>
        <a href="${concept.link}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; font-size: 0.8rem; text-decoration: none; margin-top: 6px;">
          🔗 Official NASA Documentation &rarr;
        </a>
      `;
      container.appendChild(card);
    });
  }
  renderFieldGuide();

  // ==========================================
  // CERTIFICATE GENERATOR CONTROLS
  // ==========================================
  const cadetInput = document.getElementById('cadet-name-input');
  const btnDownloadCert = document.getElementById('btn-download-cert');
  const btnPrintCert = document.getElementById('btn-print-cert');

  if (cadetInput) {
    cadetInput.addEventListener('input', () => {
      const name = cadetInput.value.trim() || "Commander Cadet";
      certificate.render(name, Array.from(engine.badgesEarned));
    });
  }

  if (btnDownloadCert) {
    btnDownloadCert.addEventListener('click', () => {
      const name = cadetInput && cadetInput.value.trim() ? cadetInput.value.trim() : "Commander";
      certificate.downloadPNG(name);
      window.spaceAudio.playChime();
    });
  }

  if (btnPrintCert) {
    btnPrintCert.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // MISSION BRIEFING MODAL
  // ==========================================
  const modal = document.getElementById('mission-modal');
  const modalTitle = document.getElementById('modal-mission-title');
  const modalDesc = document.getElementById('modal-mission-desc');
  const modalObjective = document.getElementById('modal-mission-obj');
  const modalReward = document.getElementById('modal-mission-reward');
  const modalClose = document.getElementById('modal-close-btn');
  const modalActionBtn = document.getElementById('modal-action-btn');

  function showMissionBriefingModal(mission) {
    if (!modal || !mission) return;
    if (modalTitle) modalTitle.textContent = mission.title;
    if (modalDesc) modalDesc.textContent = mission.briefing;
    if (modalObjective) modalObjective.textContent = `🎯 Objective: ${mission.objective}`;
    if (modalReward) modalReward.textContent = `🏆 Reward: ${mission.reward}`;
    modal.classList.add('active');
    window.spaceAudio.playFanfare();

    if (modalActionBtn) {
      modalActionBtn.textContent = mission.miniGame ? "LAUNCH MINI-GAME" : "START MISSION SOL";
      modalActionBtn.onclick = () => {
        modal.classList.remove('active');
        if (mission.miniGame) {
          showScreen('minigames');
          startMiniGameSelect(mission.miniGame);
        } else {
          showScreen('dashboard');
        }
      };
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // ==========================================
  // FLOATING NOTIFICATIONS TOAST
  // ==========================================
  function showNotification(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = 'rgba(11, 61, 145, 0.95)';
    toast.style.color = '#ffffff';
    toast.style.border = '1px solid #60a5fa';
    toast.style.borderRadius = '10px';
    toast.style.padding = '12px 20px';
    toast.style.fontFamily = 'Space Mono, monospace';
    toast.style.fontSize = '0.85rem';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.6)';
    toast.style.zIndex = '9999';
    toast.style.animation = 'fadeIn 0.25s ease forwards';
    toast.textContent = msg;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // ==========================================
  // BACKGROUND STARFIELD CANVAS
  // ==========================================
  const starCanvas = document.getElementById('star-canvas');
  if (starCanvas) {
    const ctx = starCanvas.getContext('2d');
    let width = (starCanvas.width = window.innerWidth);
    let height = (starCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = starCanvas.width = window.innerWidth;
      height = starCanvas.height = window.innerHeight;
    });

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      dAlpha: (Math.random() - 0.5) * 0.02
    }));

    function animateStars() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(s => {
        s.alpha += s.dAlpha;
        if (s.alpha <= 0.2 || s.alpha >= 1) s.dAlpha *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animateStars);
    }
    animateStars();
  }

  // Start on Hero Screen
  showScreen('hero');
});

