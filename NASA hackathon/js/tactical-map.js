// ASTROCADE – BEYOND THE HORIZON
// REALISTIC TACTICAL MAP & 3D QUEST/TO-DO TRACKING ENGINE
const OutpostMissionSystem = (() => {

  // Outpost 3D Structure Directory
  const STRUCTURES = [
    { id: 'pad', name: 'Launch & Landing Complex', type: 'pad', icon: '🚀', x: -4, z: -24.5, desc: 'Descent stage launch console and ascent platform' },
    { id: 'habitat', name: 'Primary Habitat Module', type: 'habitat', icon: '🏠', x: 0, z: 9, desc: 'ECLSS life support, crew quarters, resupply airlock' },
    { id: 'greenhouse', name: 'Hydroponic Greenhouse Biodome', type: 'greenhouse', icon: '🌿', x: 18, z: -0.5, desc: 'Crop agriculture, CO2 absorption, oxygen generation' },
    { id: 'solarA', name: 'Photovoltaic Solar Array A', type: 'solar', icon: '⚡', x: -20, z: -5.5, desc: 'Bifacial solar tracking collectors (25 kW)' },
    { id: 'solarB', name: 'Photovoltaic Solar Array B', type: 'solar', icon: '⚡', x: -25, z: 10.5, desc: 'Auxiliary solar tracking collectors (25 kW)' },
    { id: 'battery', name: 'Power Bank & Fuel Cell', type: 'battery', icon: '🔋', x: -12, z: 17.6, desc: 'Nighttime power storage and fuel cell grid' },
    { id: 'water', name: 'Water Recovery System', type: 'water', icon: '💧', x: 12, z: 18.7, desc: 'Subsurface ice thermal drill and closed-loop filtration' },
    { id: 'lab', name: 'Planetary Science Laboratory', type: 'lab', icon: '🔬', x: 27, z: 13.3, desc: 'Mass spectrometer, core sample glovebox, geology bench' },
    { id: 'shelter', name: 'Regolith Storm Bunker', type: 'shelter', icon: '🛡️', x: 30, z: -15.5, desc: '2.5m thick regolith radiation shelter for solar storms' },
    { id: 'comms', name: 'Communications Relay Dish', type: 'comms', icon: '📡', x: -28, z: -22, desc: 'High-gain directional satellite uplink to Houston' },
    { id: 'rover', name: 'Exploration Rover Station', type: 'rover', icon: '🚙', x: 10, z: -23, desc: '6-wheel drive mobile science platform with robotic drill' },
    // Open-World Exploration Sites
    { id: 'shackleton', name: 'Shackleton Crater Ice Drill', type: 'poi', icon: '❄️', x: -110, z: 95, desc: 'Cryogenic water ice extraction rig inside permanently shadowed crater' },
    { id: 'solarSub', name: 'Peak of Eternal Light Substation', type: 'poi', icon: '☀️', x: 145, z: -110, desc: 'High-ridge photovoltaic array beaming auxiliary power to base' },
    { id: 'surveyor', name: 'Historic Surveyor Lander Relic', type: 'poi', icon: '🤖', x: -160, z: -130, desc: 'Historic 20th-century lunar landing probe and retroreflector' },
    { id: 'lavaTube', name: 'Lava Tube Skylight Cavern', type: 'poi', icon: '🌋', x: 130, z: 125, desc: 'Natural subterranean basalt cavern for natural radiation shelter' },
    { id: 'magnetometer', name: 'Space Weather Magnetometer', type: 'poi', icon: '🧭', x: -85, z: -155, desc: 'Autonomous solar wind & magnetic field monitoring mast' }
  ];

  // Active 3D Mission State
  let activeMission = {
    id: 'moon_1',
    category: 'expedition', // 'expedition' or 'academy'
    title: 'The Astronaut Academy',
    expedition: '🌕 LUNAR FRONTIER',
    currentStepIndex: 0,
    steps: [
      { id: 'report_vega', text: 'Report to Commander Vega at Command Module', target: 'vega', type: 'npc', x: -2, z: 14, done: false },
      { id: 'inspect_rover', text: 'Mount Exploration Rover & test drive systems (Press E)', target: 'rover', type: 'rover', x: 10, z: -23, done: false },
      { id: 'check_greenhouse', text: 'Inspect Hydroponic Greenhouse O2 production with Dr. Hena', target: 'greenhouse', type: 'station', x: 18, z: -0.5, done: false },
      { id: 'sample_rocks', text: 'Drive to Crater Rim and extract basalt regolith sample', target: 'sample', type: 'sample', x: -18, z: 25, done: false },
      { id: 'solar_power', text: 'Verify Photovoltaic Solar Array power output', target: 'solarA', type: 'station', x: -20, z: -5.5, done: false }
    ]
  };

  // Rover driving state
  let isDrivingRover = false;
  let roverRef = null;
  let playerRef = null;

  // 3D Mission Catalog (Maps all 12 Missions + 5 Academy Modules to 3D In-World Objectives)
  const MISSION_3D_PLANS = {
    // ACADEMY 3D MISSIONS
    zerog: {
      title: 'Zero-G Floating & Thrusters',
      expedition: '🎓 ASTRONAUT ACADEMY',
      steps: [
        { id: 'z1', text: 'Walk to ASETC Observation Deck and inspect orbital view', target: 'pad', x: -4, z: -24.5, done: false },
        { id: 'z2', text: 'Collect 3 microgravity floating supply canisters around the outpost', target: 'sample', x: 8, z: 12, done: false },
        { id: 'z3', text: 'Return to Habitat airlock to verify zero-g tether lock', target: 'habitat', x: 0, z: 9, done: false }
      ]
    },
    suit: {
      title: 'Spacesuit EVA & Life Support',
      expedition: '🎓 ASTRONAUT ACADEMY',
      steps: [
        { id: 's1', text: 'Report to Primary Habitat airlock for suit pressurization', target: 'habitat', x: 0, z: 9, done: false },
        { id: 's2', text: 'Inspect Liquid Cooling Garment & oxygen valves at Water Recovery', target: 'water', x: 12, z: 18.7, done: false },
        { id: 's3', text: 'Verify micrometeorite shielding at Science Lab', target: 'lab', x: 27, z: 13.3, done: false }
      ]
    },
    navigation: {
      title: 'Deep Space Navigation & Orbits',
      expedition: '🎓 ASTRONAUT ACADEMY',
      steps: [
        { id: 'n1', text: 'Proceed to Deep-Space Communications Relay dish', target: 'comms', x: -28, z: -22, done: false },
        { id: 'n2', text: 'Calibrate orbital trajectory alignment with Houston', target: 'comms', x: -28, z: -22, done: false },
        { id: 'n3', text: 'Confirm Trans-Lunar burn telemetry with Commander Vega', target: 'vega', x: -2, z: 14, done: false }
      ]
    },
    robotics: {
      title: 'Rover Operations & Core Drilling',
      expedition: '🎓 ASTRONAUT ACADEMY',
      steps: [
        { id: 'r1', text: 'Walk to Exploration Rover (Press E to Mount and Drive)', target: 'rover', x: 10, z: -23, done: false },
        { id: 'r2', text: 'Drive Rover to the Highland Crater Ridge', target: 'sample', x: -22, z: 24, done: false },
        { id: 'r3', text: 'Operate robotic arm drill to collect pristine core sample', target: 'sample', x: -22, z: 24, done: false },
        { id: 'r4', text: 'Park Rover back at base charging pad', target: 'rover', x: 10, z: -23, done: false }
      ]
    },
    emergency: {
      title: 'Mission Emergency & Solar Storm',
      expedition: '🎓 ASTRONAUT ACADEMY',
      steps: [
        { id: 'e1', text: 'WARNING: Solar proton alert! Run to Regolith Storm Bunker', target: 'shelter', x: 30, z: -15.5, done: false },
        { id: 'e2', text: 'Press E inside Storm Bunker to lock radiation blast doors', target: 'shelter', x: 30, z: -15.5, done: false },
        { id: 'e3', text: 'Switch outpost power grid to backup fuel cells', target: 'battery', x: -12, z: 17.6, done: false }
      ]
    },

    // LUNAR FRONTIER 3D MISSIONS
    moon_1: {
      title: 'The Astronaut Academy',
      expedition: '🌕 LUNAR FRONTIER',
      steps: [
        { id: 'm1_1', text: 'Report to Commander Vega at the Command Module', target: 'vega', x: -2, z: 14, done: false },
        { id: 'm1_2', text: 'Mount Exploration Rover & test drive systems (Press E)', target: 'rover', x: 10, z: -23, done: false },
        { id: 'm1_3', text: 'Inspect Hydroponic Greenhouse O2 production with Dr. Hena', target: 'greenhouse', x: 18, z: -0.5, done: false },
        { id: 'm1_4', text: 'Verify Solar Array A photovoltaic collectors', target: 'solarA', x: -20, z: -5.5, done: false }
      ]
    },
    moon_2: {
      title: 'Journey Beyond Earth',
      expedition: '🌕 LUNAR FRONTIER',
      steps: [
        { id: 'm2_1', text: 'Proceed to Launch Console to verify TLI engine burn', target: 'pad', x: -4, z: -24.5, done: false },
        { id: 'm2_2', text: 'Consult Pilot Kira on translunar navigation heading', target: 'kira', x: 3, z: 3, done: false },
        { id: 'm2_3', text: 'Establish S-band signal handshake at Communications Relay', target: 'comms', x: -28, z: -22, done: false }
      ]
    },
    moon_3: {
      title: 'Welcome to the Moon',
      expedition: '🌕 LUNAR FRONTIER',
      steps: [
        { id: 'm3_1', text: 'Perform EVA egress from Primary Habitat airlock (0.16g)', target: 'habitat', x: 0, z: 9, done: false },
        { id: 'm3_2', text: 'Mount Rover and traverse to Shackleton Crater Rim', target: 'rover', x: 10, z: -23, done: false },
        { id: 'm3_3', text: 'Inspect lunar dust buildup on Solar Array B (Press E)', target: 'solarB', x: -25, z: 10.5, done: false }
      ]
    },
    moon_4: {
      title: 'Build Your Lunar Research Base',
      expedition: '🌕 LUNAR FRONTIER',
      steps: [
        { id: 'm4_1', text: 'Verify closed-loop water recycling unit in recovery bay', target: 'water', x: 12, z: 18.7, done: false },
        { id: 'm4_2', text: 'Balance electrical load between Solar Arrays and Power Bank', target: 'battery', x: -12, z: 17.6, done: false },
        { id: 'm4_3', text: 'Inspect 2.5m regolith radiation shield at Storm Shelter', target: 'shelter', x: 30, z: -15.5, done: false }
      ]
    },
    moon_5: {
      title: 'The Lunar Science Expedition',
      expedition: '🌕 LUNAR FRONTIER',
      steps: [
        { id: 'm5_1', text: 'Drive Rover to Highland Ridge to locate pristine anorthosite', target: 'rover', x: 10, z: -23, done: false },
        { id: 'm5_2', text: 'Extract 3 geological rock samples with coring drill', target: 'sample', x: 22, z: -20, done: false },
        { id: 'm5_3', text: 'Deliver core samples to Science Laboratory for mass spectrometry', target: 'lab', x: 27, z: 13.3, done: false }
      ]
    },
    moon_final: {
      title: 'Return to Earth',
      expedition: '🌕 LUNAR FRONTIER',
      steps: [
        { id: 'mf_1', text: 'Secure all science samples inside Ascent Vehicle', target: 'pad', x: -4, z: -24.5, done: false },
        { id: 'mf_2', text: 'Perform final flight control checkout with Commander Vega', target: 'vega', x: -2, z: 14, done: false },
        { id: 'mf_3', text: 'Ignite Ascent Propulsion System for Earth Return trajectory', target: 'pad', x: -4, z: -24.5, done: false }
      ]
    },

    // RED PLANET RISING 3D MISSIONS (MARS)
    mars_1: {
      title: 'Preparing for the Red Planet',
      expedition: '🔴 RED PLANET RISING',
      steps: [
        { id: 'mr1_1', text: 'Inspect Ares exploration rover cargo bay and tools', target: 'rover', x: 10, z: -23, done: false },
        { id: 'mr1_2', text: 'Verify 3-year food stores at Greenhouse biodome', target: 'greenhouse', x: 18, z: -0.5, done: false },
        { id: 'mr1_3', text: 'Check deep-space communications latency at relay dish', target: 'comms', x: -28, z: -22, done: false }
      ]
    },
    mars_2: {
      title: 'The Long Journey to Mars',
      expedition: '🔴 RED PLANET RISING',
      steps: [
        { id: 'mr2_1', text: 'Complete daily heavy resistance exercise (ARED) at Habitat', target: 'habitat', x: 0, z: 9, done: false },
        { id: 'mr2_2', text: 'Verify solar flare water-wall radiation shields', target: 'shelter', x: 30, z: -15.5, done: false },
        { id: 'mr2_3', text: 'Calibrate optical autonomous star tracker at Science Lab', target: 'lab', x: 27, z: 13.3, done: false }
      ]
    },
    mars_3: {
      title: 'Landing on Mars (EDL)',
      expedition: '🔴 RED PLANET RISING',
      steps: [
        { id: 'mr3_1', text: 'Inspect Sky Crane descent stage platform at Launch Pad', target: 'pad', x: -4, z: -24.5, done: false },
        { id: 'mr3_2', text: 'Verify Terrain Relative Navigation (TRN) radar sensors', target: 'comms', x: -28, z: -22, done: false },
        { id: 'mr3_3', text: 'Report successful Martian touchdown to Commander Vega', target: 'vega', x: -2, z: 14, done: false }
      ]
    },
    mars_4: {
      title: 'Surviving the Martian Environment',
      expedition: '🔴 RED PLANET RISING',
      steps: [
        { id: 'mr4_1', text: 'Calibrate MOXIE solid oxide electrolysis at Science Lab', target: 'lab', x: 27, z: 13.3, done: false },
        { id: 'mr4_2', text: 'WARNING: Dust storm alert! Clear solar panels with EDS', target: 'solarA', x: -20, z: -5.5, done: false },
        { id: 'mr4_3', text: 'Engage positive-pressure perchlorate seal at Habitat airlock', target: 'habitat', x: 0, z: 9, done: false }
      ]
    },
    mars_5: {
      title: 'The Search for Ancient Life',
      expedition: '🔴 RED PLANET RISING',
      steps: [
        { id: 'mr5_1', text: 'Drive Rover to Jezero River Delta sedimentary outcrops', target: 'rover', x: 10, z: -23, done: false },
        { id: 'mr5_2', text: 'Extract mudstone core sample with rover robotic arm', target: 'sample', x: -25, z: 20, done: false },
        { id: 'mr5_3', text: 'Run Raman & Luminescence organic spectrometer at Lab', target: 'lab', x: 27, z: 13.3, done: false }
      ]
    },
    mars_final: {
      title: 'The Future of Humanity',
      expedition: '🔴 RED PLANET RISING',
      steps: [
        { id: 'mrf_1', text: 'Verify Sabatier methane & liquid oxygen ISRU fuel synthesis', target: 'pad', x: -4, z: -24.5, done: false },
        { id: 'mrf_2', text: 'Verify subsurface ice well water production', target: 'water', x: 12, z: 18.7, done: false },
        { id: 'mrf_3', text: 'Conduct final multi-planetary expedition debrief with crew', target: 'vega', x: -2, z: 14, done: false }
      ]
    }
  };

  // Initialize and mount Top-Left To-Do List HUD
  function init() {
    if (window._roverRef && window._playerRef) {
      setRoverReferences(window._roverRef, window._playerRef);
    }
    renderTodoListHUD();
    setupKeyboardShortcuts();
  }

  // Render the Top-Left To-Do List in the Command Center
  function renderTodoListHUD() {
    let hud = document.getElementById('todoListHUD');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'todoListHUD';
      hud.className = 'panel';
      document.body.appendChild(hud);
    }

    const curStep = activeMission.steps[activeMission.currentStepIndex] || null;
    const completedCount = activeMission.steps.filter(s => s.done).length;
    const totalCount = activeMission.steps.length;
    const progressPct = Math.round((completedCount / totalCount) * 100);

    hud.innerHTML = `
      <div class="todoHeader">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="todoBadge">
            <span class="liveDot"></span> ACTIVE 3D MISSION
          </div>
          <button class="todoToggleBtn" onclick="OutpostMissionSystem.toggleHUD(this)" title="Collapse / Expand To-Do List">—</button>
        </div>
        <h3 id="todoTitle">${activeMission.title}</h3>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span class="todoExpedition">${activeMission.expedition}</span>
          <span class="todoProgressText">${completedCount}/${totalCount} Done (${progressPct}%)</span>
        </div>
        <div class="todoProgressBar"><div style="width:${progressPct}%;"></div></div>
      </div>

      <div class="todoChecklist" id="todoChecklist">
        ${activeMission.steps.map((s, idx) => `
          <div class="todoItem ${s.done ? 'done' : (idx === activeMission.currentStepIndex ? 'active' : '')}" onclick="OutpostMissionSystem.setObjectiveStep(${idx})">
            <span class="todoCheck">${s.done ? '✓' : '○'}</span>
            <span class="todoText">${s.text}</span>
            ${(!s.done && idx === activeMission.currentStepIndex) ? `<span class="todoTargetBadge">TARGET</span>` : ''}
          </div>
        `).join('')}
      </div>

      <div class="todoFooter">
        <button class="todoActionBtn" onclick="OutpostMissionSystem.openTacticalMap()" title="Press M to toggle map">
          🗺️ Tactical Map (M)
        </button>
        <button class="todoActionBtn" onclick="AppRouter.navigate('profile')" title="Press 8 to view passport">
          🛂 Passport (8)
        </button>
      </div>
    `;

    hud.style.display = 'block';
  }

  function toggleHUD(btn) {
    const list = document.getElementById('todoChecklist');
    if (list) {
      const isHidden = list.style.display === 'none';
      list.style.display = isHidden ? 'flex' : 'none';
      if (btn) btn.textContent = isHidden ? '—' : '+';
    }
  }

  // Set active step manually or on waypoint change
  function setObjectiveStep(idx) {
    if (idx >= 0 && idx < activeMission.steps.length) {
      activeMission.currentStepIndex = idx;
      renderTodoListHUD();
      if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
    }
  }

  // Check objective completion on player interaction (E key or walk)
  function checkObjectiveInteraction(targetId, targetCoords = null) {
    const curStep = activeMission.steps[activeMission.currentStepIndex];
    if (!curStep || curStep.done) return false;

    let matched = false;

    // Direct target match
    if (curStep.target === targetId) {
      matched = true;
    } else if (curStep.type === 'station' && curStep.target === targetId) {
      matched = true;
    } else if (curStep.type === 'npc' && curStep.target === targetId) {
      matched = true;
    } else if (curStep.type === 'rover' && (targetId === 'rover' || isDrivingRover)) {
      matched = true;
    } else if (curStep.type === 'sample' && targetId === 'sample') {
      matched = true;
    } else if (targetCoords && Math.hypot(curStep.x - targetCoords.x, curStep.z - targetCoords.z) < 4.0) {
      matched = true;
    }

    if (matched) {
      curStep.done = true;
      if (typeof SoundEngine !== 'undefined' && SoundEngine.success) SoundEngine.success();
      if (typeof toast === 'function') {
        toast(`✓ OBJECTIVE COMPLETE: ${curStep.text} (+40 XP)`, 'good');
      }
      PlayerProfile.addXP(40, `Objective Completed: ${curStep.text}`);

      // Advance to next uncompleted step
      const nextIdx = activeMission.steps.findIndex(s => !s.done);
      if (nextIdx !== -1) {
        activeMission.currentStepIndex = nextIdx;
      } else {
        // ALL STEPS IN THIS MISSION COMPLETED!
        completeActiveMission();
      }

      renderTodoListHUD();
      return true;
    }
    return false;
  }

  function completeActiveMission() {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.missionStart) SoundEngine.missionStart();
    if (typeof toast === 'function') {
      toast(`🎉 MISSION ACCOMPLISHED: ${activeMission.title}!`, 'good');
    }

    // Award full mission score in profile
    PlayerProfile.recordMissionScore(activeMission.id, 100, 'gold', {
      title: activeMission.title,
      rewardMedal: 'GOLD COMMENDATION'
    });
    PlayerProfile.addXP(250, `Conferred Gold Commendation for ${activeMission.title}`);

    // If active mission was an Academy module
    if (activeMission.category === 'academy') {
      if (!PlayerProfile.profile.completedModules.includes(activeMission.id)) {
        PlayerProfile.profile.completedModules.push(activeMission.id);
        PlayerProfile.save();
      }
    }

    // Show celebration modal
    setTimeout(() => {
      openMissionDebriefModal();
    }, 1200);
  }

  function openMissionDebriefModal() {
    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="padding:16px;text-align:center;">
        <div style="font-size:56px;margin-bottom:8px;">🏆</div>
        <div class="eyebrow" style="color:var(--green);">3D SURFACE EXPEDITION ACCOMPLISHED</div>
        <h2 style="font-family:var(--font-display);font-size:28px;margin:4px 0 6px;">${activeMission.title}</h2>
        <span style="font-family:var(--font-mono);font-size:13px;color:var(--accent);font-weight:700;">
          ALL FIELD OBJECTIVES VERIFIED · 100/100 PTS (🥇 GOLD MEDAL)
        </span>

        <div class="glass-panel" style="max-width:440px;margin:20px auto;padding:16px;border-radius:10px;text-align:left;background:rgba(11,21,48,0.8);border:1px solid rgba(56,217,150,0.3);">
          <strong style="color:var(--green);font-size:12px;font-family:var(--font-mono);display:block;margin-bottom:8px;">COMPLETED 3D OBJECTIVES:</strong>
          <ul style="margin:0;padding-left:18px;font-size:12px;line-height:1.6;color:var(--white);">
            ${activeMission.steps.map(s => `<li>${s.text}</li>`).join('')}
          </ul>
        </div>

        <p style="font-size:13px;color:var(--silver);max-width:500px;margin:0 auto 20px;">
          Outstanding work in the field, Cadet! Your real-time 3D flight performance and telemetry have been recorded in your Official Astronaut Passport.
        </p>

        <div style="display:flex;justify-content:center;gap:12px;">
          <button class="btn" onclick="document.getElementById('interactiveModal').classList.remove('on');">
            Continue 3D Exploration
          </button>
          <button class="btn primary" onclick="OutpostMissionSystem.openTacticalMap()">
            🗺️ Open Tactical Map & Next Mission →
          </button>
        </div>
      </div>
    `;
    modal.classList.add('on');
  }

  // Launch any mission in the 3D Command Center
  function start3DMission(missionId) {
    const plan = MISSION_3D_PLANS[missionId];
    if (!plan) return;

    activeMission = {
      id: missionId,
      category: missionId.startsWith('moon') || missionId.startsWith('mars') ? 'expedition' : 'academy',
      title: plan.title,
      expedition: plan.expedition,
      currentStepIndex: 0,
      steps: plan.steps.map(s => Object.assign({}, s))
    };

    // Close any open modals
    const modal = document.getElementById('interactiveModal');
    if (modal) modal.classList.remove('on');

    // Switch to Command Center 3D view
    AppRouter.navigate('command');

    // Switch environment to Moon or Mars if applicable
    if (missionId.startsWith('moon') && typeof applyEnvironment === 'function') {
      applyEnvironment('moon');
    } else if (missionId.startsWith('mars') && typeof applyEnvironment === 'function') {
      applyEnvironment('mars');
    }

    renderTodoListHUD();

    if (typeof SoundEngine !== 'undefined' && SoundEngine.missionStart) SoundEngine.missionStart();
    if (typeof toast === 'function') {
      toast(`🚀 3D MISSION ACTIVE: ${activeMission.title}`, 'good');
    }
  }

  // ==========================================
  // REALISTIC ROVER DRIVING CONTROLLER
  // ==========================================
  function setRoverReferences(roverGroup, playerMesh) {
    roverRef = roverGroup;
    playerRef = playerMesh;
  }

  function toggleRoverDrive() {
    if (!roverRef && window._roverRef) roverRef = window._roverRef;
    if (!playerRef && window._playerRef) playerRef = window._playerRef;
    if (!roverRef || !playerRef) return;
    isDrivingRover = !isDrivingRover;

    if (isDrivingRover) {
      // Enter rover
      if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
      if (typeof toast === 'function') toast('🚙 MOUNTED EXPLORATION ROVER · WASD TO DRIVE · E TO EXIT', 'good');
      // Position astronaut on rover
      roverRef.add(playerRef);
      playerRef.position.set(-0.85, 2.15, 0);
      playerRef.rotation.set(0, Math.PI / 2, 0);
      checkObjectiveInteraction('rover');
    } else {
      // Exit rover
      if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
      if (typeof toast === 'function') toast('Dismounted Exploration Rover');
      // Return player to world scene next to rover
      if (roverRef.parent) {
        roverRef.parent.add(playerRef);
        playerRef.position.copy(roverRef.position).add(new THREE.Vector3(3.2, 0, 0));
        playerRef.rotation.set(0, roverRef.rotation.y + Math.PI / 2, 0);
      }
    }
    renderTodoListHUD();
  }

  function updateRoverDrive(dt, inputKeys, camYaw) {
    if (!isDrivingRover || !roverRef) return;

    let forward = (inputKeys.up ? 1 : 0) - (inputKeys.down ? 1 : 0);
    let steer = (inputKeys.left ? 1 : 0) - (inputKeys.right ? 1 : 0);

    const speed = 11.5; // m/s (faster than astronaut walking)
    const turnRate = 2.4;

    // Steering
    if (steer !== 0) {
      roverRef.rotation.y += steer * turnRate * dt;
    }

    // Forward/Backward driving with Shift / Sprint turbo boost across open world
    if (forward !== 0) {
      const isBoosting = !!(inputKeys.sprint || inputKeys.shift);
      const activeSpeed = isBoosting ? 18.5 : 12.0;
      const dir = new THREE.Vector3(Math.cos(roverRef.rotation.y), 0, -Math.sin(roverRef.rotation.y));
      roverRef.position.addScaledVector(dir, forward * activeSpeed * dt);

      // Open-World exploration bounds (expanded from 68m to 440m radius)
      const dist = Math.hypot(roverRef.position.x, roverRef.position.z);
      if (dist > 440) {
        roverRef.position.x *= 440 / dist;
        roverRef.position.z *= 440 / dist;
        if (typeof toast === 'function') toast('⚠️ ROVER TELEMETRY: Reached exploration sector boundary.', 'warn');
      }

      // Check proximity to objectives & open-world POIs while driving
      checkObjectiveInteraction(null, { x: roverRef.position.x, z: roverRef.position.z });
    }

    // Ground hug
    if (typeof terrainHeight === 'function') {
      roverRef.position.y = terrainHeight(roverRef.position.x, roverRef.position.z);
    }
  }

  // ==========================================
  // REALISTIC TACTICAL SATELLITE MAP
  // ==========================================
  function openTacticalMap() {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    const moonDone = PlayerProfile.getMoonMissionsCompleted();
    const marsDone = PlayerProfile.getMarsMissionsCompleted();
    const curGrade = PlayerProfile.getGradeInfo();

    content.innerHTML = `
      <div style="padding:10px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:38px;height:38px;border-radius:8px;background:rgba(66,232,255,0.15);border:1px solid var(--cyan);display:grid;place-items:center;font-size:22px;">🗺️</div>
            <div>
              <div class="eyebrow" style="color:var(--accent);">ASETC REAL-TIME TACTICAL ORBITAL MAP</div>
              <h2 style="font-family:var(--font-display);margin:2px 0;">Surface Tracking & Mission Control</h2>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--cyan);">
                TOPOGRAPHICAL SATELLITE RADAR · 300M PERIMETER · GRID SCALE 1:1
              </span>
            </div>
          </div>
          <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:16px;margin-bottom:14px;">
          <!-- Left: High-Res Interactive Tactical Satellite Map Canvas -->
          <div class="glass-panel" style="padding:14px;border-radius:12px;background:#050816;border:1px solid rgba(66,232,255,0.3);text-align:center;">
            <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:11px;color:var(--silver);margin-bottom:8px;">
              <span>ORBITAL RECON: LOLA ALT-4</span>
              <span style="color:var(--green);">● TELEMETRY SYNCED</span>
            </div>
            <div style="position:relative;display:inline-block;">
              <canvas id="tacticalSatelliteMap" width="460" height="460" style="width:100%;max-width:440px;height:auto;border-radius:8px;border:1px solid rgba(66,232,255,0.2);display:block;margin:0 auto;"></canvas>
            </div>
            <div style="display:flex;justify-content:space-around;font-size:10px;font-family:var(--font-mono);color:var(--silver);margin-top:8px;">
              <span>🚀 Launch Complex</span>
              <span>🏠 Base Habitat</span>
              <span>🌿 Greenhouse</span>
              <span>⚡ Solar Arrays</span>
              <span>🚙 Rover</span>
            </div>
          </div>

          <!-- Right: All Possible Missions & Structure Directory -->
          <div style="display:flex;flex-direction:column;gap:12px;max-height:510px;overflow-y:auto;padding-right:6px;">
            <!-- Mission Filter Tabs -->
            <div style="display:flex;gap:6px;">
              <button class="btn primary" id="tabMapLunar" onclick="OutpostMissionSystem.renderMapMissionList('lunar')" style="flex:1;padding:6px 8px;font-size:11px;">
                🌕 Moon (${moonDone}/6)
              </button>
              <button class="btn" id="tabMapMars" onclick="OutpostMissionSystem.renderMapMissionList('mars')" style="flex:1;padding:6px 8px;font-size:11px;">
                🔴 Mars (${marsDone}/6)
              </button>
              <button class="btn" id="tabMapAcademy" onclick="OutpostMissionSystem.renderMapMissionList('academy')" style="flex:1;padding:6px 8px;font-size:11px;">
                🎓 Academy (5)
              </button>
            </div>

            <!-- Scrollable Mission List -->
            <div id="tacticalMissionList" style="display:flex;flex-direction:column;gap:8px;"></div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.08);padding-top:10px;font-size:11px;color:var(--silver);">
          <span>* Click ANY mission above to immediately track it in the 3D Command Center!</span>
          <button class="btn primary" onclick="document.getElementById('interactiveModal').classList.remove('on');">
            Return to 3D Field View →
          </button>
        </div>
      </div>
    `;

    modal.classList.add('on');
    renderMapMissionList('lunar');

    // Draw full map canvas
    setTimeout(() => {
      drawTacticalSatelliteMap();
    }, 50);
  }

  function renderMapMissionList(category) {
    const listEl = document.getElementById('tacticalMissionList');
    if (!listEl) return;

    ['tabMapLunar', 'tabMapMars', 'tabMapAcademy'].forEach(id => {
      const b = document.getElementById(id);
      if (b) b.classList.remove('primary');
    });

    let items = [];
    if (category === 'lunar') {
      const b = document.getElementById('tabMapLunar');
      if (b) b.classList.add('primary');
      items = [
        { id: 'moon_1', title: 'The Astronaut Academy', icon: '🎓', xp: 200, reward: 'Cadet Badge' },
        { id: 'moon_2', title: 'Journey Beyond Earth', icon: '🚀', xp: 220, reward: 'Space Traveller' },
        { id: 'moon_3', title: 'Welcome to the Moon', icon: '🌕', xp: 250, reward: 'Lunar Explorer' },
        { id: 'moon_4', title: 'Build Your Lunar Base', icon: '🏗️', xp: 280, reward: 'Base Architect' },
        { id: 'moon_5', title: 'The Lunar Science Expedition', icon: '🔬', xp: 320, reward: 'Lunar Scientist' },
        { id: 'moon_final', title: 'Return to Earth', icon: '🏆', xp: 400, reward: 'Mission Commander' }
      ];
    } else if (category === 'mars') {
      const b = document.getElementById('tabMapMars');
      if (b) b.classList.add('primary');
      items = [
        { id: 'mars_1', title: 'Preparing for Red Planet', icon: '🔴', xp: 250, reward: 'Mission Specialist' },
        { id: 'mars_2', title: 'The Long Journey to Mars', icon: '🌌', xp: 280, reward: 'Deep Space Navigator' },
        { id: 'mars_3', title: 'Landing on Mars (EDL)', icon: '🪂', xp: 320, reward: 'Landing Medal' },
        { id: 'mars_4', title: 'Surviving Martian Environment', icon: '🛡️', xp: 350, reward: 'Survival Expert' },
        { id: 'mars_5', title: 'The Search for Ancient Life', icon: '🔬', xp: 380, reward: 'Astrobiology Explorer' },
        { id: 'mars_final', title: 'The Future of Humanity', icon: '👑', xp: 500, reward: 'Martian Commander' }
      ];
    } else {
      const b = document.getElementById('tabMapAcademy');
      if (b) b.classList.add('primary');
      items = [
        { id: 'zerog', title: 'Zero-G Floating & Thrusters', icon: '🌌', xp: 150, reward: 'Zero-G Wings' },
        { id: 'suit', title: 'Spacesuit EVA & Life Support', icon: '🛡️', xp: 150, reward: 'Suit Specialist' },
        { id: 'navigation', title: 'Deep Space Navigation & Orbits', icon: '🧭', xp: 150, reward: 'Navigator Crest' },
        { id: 'robotics', title: 'Rover Operations & Core Drilling', icon: '🤖', xp: 150, reward: 'Robotics Badge' },
        { id: 'emergency', title: 'Mission Emergency & Solar Storm', icon: '⚠️', xp: 150, reward: 'Emergency Star' }
      ];
    }

    listEl.innerHTML = items.map(m => {
      const isCompleted = (PlayerProfile.profile.completedMissions || []).includes(m.id) || (PlayerProfile.profile.completedModules || []).includes(m.id);
      const isCurrentActive = activeMission.id === m.id;

      return `
        <div class="glass-panel" style="padding:10px 14px;border-radius:8px;border:1px solid ${isCurrentActive ? 'var(--cyan)' : (isCompleted ? 'rgba(56,217,150,0.3)' : 'rgba(255,255,255,0.08)')};background:${isCurrentActive ? 'rgba(66,232,255,0.12)' : 'rgba(11,21,48,0.7)'};display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:18px;">${m.icon}</span>
              <strong style="font-size:12px;font-family:var(--font-display);color:${isCurrentActive ? 'var(--cyan)' : 'var(--white)'};">${m.title}</strong>
            </div>
            <div style="font-size:10px;font-family:var(--font-mono);color:var(--silver);margin-top:2px;">
              ${isCompleted ? '✓ Completed' : `Reward: ${m.reward}`} · +${m.xp} XP
            </div>
          </div>
          <div>
            ${isCurrentActive ? `
              <span style="font-size:10px;font-family:var(--font-mono);color:var(--cyan);font-weight:700;">● TRACKING</span>
            ` : `
              <button class="btn" style="padding:4px 10px;font-size:10px;min-height:30px;" onclick="OutpostMissionSystem.start3DMission('${m.id}')">
                Track in 3D →
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  function drawTacticalSatelliteMap() {
    const canvas = document.getElementById('tacticalSatelliteMap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    // Scale: 460px represents 160m total range
    const centerX = w / 2, centerY = h / 2;
    const scale = 2.4; // pixels per meter

    // Clear background
    ctx.fillStyle = '#060d1f';
    ctx.fillRect(0, 0, w, h);

    // Topographical elevation contours & grid
    ctx.strokeStyle = 'rgba(66, 232, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 20; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Range rings
    [30, 60, 90, 120].forEach(rMeters => {
      ctx.strokeStyle = 'rgba(66, 232, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, rMeters * scale * 0.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(66, 232, 255, 0.4)';
      ctx.font = '8px monospace';
      ctx.fillText(`${rMeters}m`, centerX + rMeters * scale * 0.45 + 3, centerY - 2);
    });

    // Draw all outpost structures
    STRUCTURES.forEach(s => {
      const sx = centerX + s.x * scale;
      const sy = centerY + s.z * scale;

      // Outer glow
      ctx.fillStyle = 'rgba(66, 232, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(sx, sy, 14, 0, Math.PI * 2);
      ctx.fill();

      // Structure core
      ctx.fillStyle = '#0b2650';
      ctx.strokeStyle = '#42e8ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.name, sx, sy + 18);
    });

    // Draw Player position & heading
    if (!playerRef && window._playerRef) playerRef = window._playerRef;
    let px = centerX, py = centerY;
    if (playerRef) {
      const pPos = new THREE.Vector3();
      if (playerRef.getWorldPosition) playerRef.getWorldPosition(pPos);
      else pPos.copy(playerRef.position);
      px = centerX + pPos.x * scale;
      py = centerY + pPos.z * scale;
    }

    ctx.save();
    ctx.translate(px, py);
    // Player pulsing beacon
    ctx.fillStyle = 'rgba(56, 217, 150, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38d996';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#38d996';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ASTRONAUT (YOU)', px, py - 12);

    // Draw active mission target waypoint
    const curStep = activeMission.steps[activeMission.currentStepIndex];
    if (curStep) {
      const tx = centerX + curStep.x * scale;
      const ty = centerY + curStep.z * scale;

      // Dashed line from player to objective
      ctx.strokeStyle = '#ffbd69';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);

      // Waypoint icon
      ctx.fillStyle = 'rgba(255, 189, 105, 0.3)';
      ctx.beginPath();
      ctx.arc(tx, ty, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffbd69';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', tx, ty + 6);

      ctx.font = 'bold 10px monospace';
      ctx.fillText('ACTIVE WAYPOINT', tx, ty - 14);
    }
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', e => {
      // 'M' opens tactical map
      if (e.key === 'm' || e.key === 'M') {
        const modal = document.getElementById('interactiveModal');
        if (modal && modal.classList.contains('on')) {
          modal.classList.remove('on');
        } else {
          openTacticalMap();
        }
      }
    });
  }

  return {
    init,
    start3DMission,
    renderTodoListHUD,
    toggleHUD,
    setObjectiveStep,
    checkObjectiveInteraction,
    completeActiveMission,
    openTacticalMap,
    renderMapMissionList,
    setRoverReferences,
    toggleRoverDrive,
    updateRoverDrive,
    get isDrivingRover() { return isDrivingRover; },
    get activeMission() { return activeMission; },
    STRUCTURES
  };
})();

// Auto-initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  OutpostMissionSystem.init();
});
