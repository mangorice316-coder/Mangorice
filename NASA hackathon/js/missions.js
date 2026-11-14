// NASA JUNIOR ASTRONAUT MISSION TRAINER - 5 MAIN SPACE EXPLORATION MISSIONS
const MissionControl = (() => {
  const CAMPAIGN = [
    {
      id: 'iss',
      number: 'MISSION 01',
      title: 'Journey to the International Space Station',
      destination: 'Low Earth Orbit (400 km)',
      icon: '🛰️',
      badge: 'LEO ORBIT',
      desc: 'Rendezvous with the ISS in orbit, explore the European Cupola observatory, conduct microgravity protein crystallization experiments, and complete autonomous docking.',
      xp: 250,
      objectives: [
        'Perform approach burn & dock spacecraft with Harmony Node 2',
        'Inspect exterior solar array micrometeorite defense',
        'Grow macromolecular protein crystals inside the Destiny Laboratory'
      ],
      science: 'The ISS travels at 7.66 km/s, completing an orbit every 90 minutes. Microgravity allows pure, flawless protein crystals to grow without convection currents settling them down!'
    },
    {
      id: 'moon',
      number: 'MISSION 02',
      title: 'Lunar South Pole & Shackleton Crater',
      destination: 'The Moon (384,400 km)',
      icon: '🌕',
      badge: 'ARTEMIS BASE',
      desc: 'Land near the Lunar South Pole, leverage NASA LOLA continuous sunlight ridge data to deploy solar power, and drill into permanently shadowed craters for water ice.',
      xp: 300,
      objectives: [
        'Deploy high-efficiency solar panels along LOLA Connecting Ridge',
        'Extract subsurface water ice core from Shackleton Crater rim',
        'Return 5 kg of pristine lunar regolith basalt for laboratory analysis'
      ],
      science: 'NASA Lunar Reconnaissance Orbiter (LOLA) proved that peaks of eternal light at the South Pole receive sunlight for up to 92% of the year, while crater floors remain permanently dark reservoirs of ancient water ice!'
    },
    {
      id: 'mars',
      number: 'MISSION 03',
      title: 'Mars Jezero Crater Ancient River Delta',
      destination: 'Mars (225 Million km)',
      icon: '🔴',
      badge: 'ARES OUTPOST',
      desc: 'Explore Jezero Crater with the exploration rover, scout flight paths with the robotic helicopter, test MOXIE oxygen production, and search for ancient biosignatures.',
      xp: 350,
      objectives: [
        'Launch robotic helicopter on a 300m aerial survey of delta cliffs',
        'Extract sedimentary mudstone core samples rich in smectite clay',
        'Run MOXIE electrolysis to generate pure breathable oxygen from CO2'
      ],
      science: 'Jezero Crater was once flooded with deep water over 3.5 billion years ago. Clay minerals deposited by ancient rivers are the most promising rocks for preserving signs of microscopic past microbial life!'
    },
    {
      id: 'saturn',
      number: 'MISSION 04',
      title: 'Saturn, Its Rings & Ocean Moons',
      destination: 'Saturn (1.4 Billion km)',
      icon: '🪐',
      badge: 'GAS GIANT',
      desc: 'Fly past the majestic rings of Saturn, fly through the Cassini Division to sample water ice rings, and drop a probe toward the methane seas of Titan and geysers of Enceladus.',
      xp: 400,
      objectives: [
        'Analyze ice-to-rock ratio across Saturn Ring A, B, and C',
        'Sample water vapor & organic compounds erupting from Enceladus ice geysers',
        'Map liquid methane and ethane lakes on Titan’s frigid surface'
      ],
      science: 'Saturn’s rings are 282,000 km across but only about 10 meters thick! They are 99% pure water ice. Enceladus hides a global liquid ocean beneath its frozen crust with hydrothermal vents like Earth’s ocean floor.'
    },
    {
      id: 'deepspace',
      number: 'MISSION 05',
      title: 'Deep Space Nebula & Galaxy Survey',
      destination: 'Interstellar Deep Space',
      icon: '🔭',
      badge: 'COSMIC HORIZON',
      desc: 'Command a deep space observatory inspired by the James Webb Space Telescope. Peer through interstellar dust, classify stars by spectral type, and confirm an exoplanet.',
      xp: 500,
      objectives: [
        'Unfold 6.5-meter beryllium primary mirror and infrared sunshield',
        'Spectroscopically classify 3 stars across the O, B, A, F, G, K, M sequence',
        'Detect transit dip light curve confirming an Earth-sized habitable exoplanet'
      ],
      science: 'Infrared light penetrates dense cosmic dust clouds that block visible light, allowing astronomers to see stars and planets being born in stellar nurseries and peer back 13.5 billion years to the first galaxies!'
    }
  ];

  function renderHub(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = `
      <div class="hubContainer">
        <div class="hubHeader">
          <div class="eyebrow">MISSION CONTROL CAMPAIGN</div>
          <h1>Planetary Exploration Missions</h1>
          <p>Embark on structured missions across the Solar System and deep space. Complete scientific objectives to earn experience points, unlock new worlds, and rise through the astronaut ranks!</p>
        </div>
        <div class="cardGrid">
    `;

    CAMPAIGN.forEach((m, idx) => {
      const isDone = PlayerProfile.profile.completedMissions.includes(m.id);
      const isUnlocked = idx === 0 || PlayerProfile.profile.completedMissions.includes(CAMPAIGN[idx - 1].id);

      html += `
        <div class="hubCard glass-panel ${!isUnlocked ? 'locked' : ''}" onclick="${isUnlocked ? `MissionControl.openBriefing('${m.id}')` : ''}">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <span class="cardBadge" style="color:${isDone ? 'var(--green)' : (isUnlocked ? 'var(--cyan)' : 'var(--silver)')}">
                ${isDone ? '✓ MISSION ACCOMPLISHED' : (isUnlocked ? m.badge : '🔒 LOCKED')}
              </span>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--amber);">+${m.xp} XP</span>
            </div>
            <div style="font-size:32px;margin-bottom:10px;">${m.icon}</div>
            <div style="font-size:10px;font-family:var(--font-mono);color:var(--silver);">${m.number} · ${m.destination}</div>
            <h3 style="margin:4px 0 10px;">${m.title}</h3>
            <p>${m.desc}</p>
          </div>
          <div>
            <button class="btn ${isDone ? 'primary' : (isUnlocked ? 'cyan' : '')}" style="width:100%;" ${!isUnlocked ? 'disabled' : ''}>
              ${isDone ? 'Replay Mission' : (isUnlocked ? 'Launch Mission Briefing →' : 'Complete Previous Mission')}
            </button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    el.innerHTML = html;
  }

  function openBriefing(missionId) {
    SoundEngine.click();
    const mission = CAMPAIGN.find(m => m.id === missionId);
    if (!mission) return;

    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    modal.classList.add('on');
    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div>
          <div class="eyebrow">${mission.number} · MISSION BRIEFING</div>
          <h2 style="font-family:var(--font-display);">${mission.title}</h2>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--cyan);">${mission.destination}</span>
        </div>
        <button class="iconBtn" onclick="MissionControl.closeModal()">✕</button>
      </div>

      <p class="small muted" style="margin-bottom:16px;">${mission.desc}</p>

      <div class="factBox" style="background:rgba(11,21,48,0.7);border-color:var(--panel-border);padding:16px;border-radius:10px;margin-bottom:16px;">
        <b style="color:var(--amber);font-family:var(--font-display);display:block;margin-bottom:8px;">MISSION OBJECTIVES (FLIGHT PLAN):</b>
        <ul style="padding-left:20px;font-size:13px;line-height:1.7;color:var(--white);">
          ${mission.objectives.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>

      <div class="factBox" style="background:rgba(11,21,48,0.7);border-color:rgba(66,232,255,0.3);padding:16px;border-radius:10px;margin-bottom:20px;">
        <b style="color:var(--cyan);font-family:var(--font-display);display:block;margin-bottom:6px;">🔬 THE REAL NASA SCIENCE:</b>
        <p style="font-size:12px;color:var(--silver);line-height:1.5;">${mission.science}</p>
      </div>

      <div class="btnRow" style="display:flex;justify-content:flex-end;gap:12px;">
        <button class="btn" onclick="MissionControl.closeModal()">Cancel</button>
        <button class="btn primary" onclick="MissionControl.executeMission('${mission.id}')">Begin Mission Simulation →</button>
      </div>
    `;
  }

  function executeMission(id) {
    SoundEngine.missionStart();
    closeModal();

    // If lunar mission or mars mission, switch 3D scene environment!
    if (id === 'moon' && typeof applyEnvironment === 'function') {
      applyEnvironment('moon');
      toast('Switched 3D Base to Lunar South Pole (Apollo 17 Panorama)');
    } else if (id === 'mars' && typeof applyEnvironment === 'function') {
      applyEnvironment('mars');
      toast('Switched 3D Base to Mars Jezero Crater (Perseverance Panorama)');
    }

    // Switch to Command Center View so player can explore the 3D station & complete tasks!
    AppRouter.navigate('command');

    // Show celebratory mission debrief after exploration
    setTimeout(() => {
      completeMission(id);
    }, 1500);
  }

  function completeMission(id) {
    const mission = CAMPAIGN.find(m => m.id === id);
    if (!mission) return;

    if (!PlayerProfile.profile.completedMissions.includes(id)) {
      PlayerProfile.profile.completedMissions.push(id);
    }
    PlayerProfile.addXP(mission.xp, `Completed ${mission.title}`);

    // Unlock special achievements based on mission
    if (id === 'iss') PlayerProfile.unlockAchievement('zero_g_explorer', 'Zero-G Explorer');
    else if (id === 'moon') PlayerProfile.unlockAchievement('lunar_scientist', 'Lunar Scientist');
    else if (id === 'mars') PlayerProfile.unlockAchievement('mars_pioneer', 'Mars Pioneer');
    else if (id === 'saturn') PlayerProfile.unlockAchievement('ring_navigator', 'Ring Navigator');
    else if (id === 'deepspace') PlayerProfile.unlockAchievement('mission_commander', 'Mission Commander');

    SoundEngine.success();
    renderHub('missionsHubView');
  }

  function closeModal() {
    SoundEngine.click();
    const modal = document.getElementById('interactiveModal');
    if (modal) modal.classList.remove('on');
  }

  return {
    renderHub,
    openBriefing,
    executeMission,
    completeMission,
    closeModal
  };
})();
