// ASTROCADE – BEYOND THE HORIZON
// ASTRONAUT PROFILE, PROGRESSION & DIGITAL PASSPORT SYSTEM
const PlayerProfile = (() => {
  const STORAGE_KEY = 'astrocade_beyond_horizon_profile_v3';

  // 7-Tier Journey: BEGINNER → JUNIOR CADET → SPACE EXPLORER → LUNAR EXPLORER → MARS EXPLORER → MISSION COMMANDER → LEGENDARY SPACE EXPLORER
  const RANKS = [
    { id: 'beginner', name: 'Beginner Cadet', minXp: 0, badge: '🌱', desc: 'Enrolled at the Advanced Space Exploration Training Centre (ASETC)' },
    { id: 'junior_cadet', name: 'Junior Cadet', minXp: 200, badge: '🚀', desc: 'Certified in basic astronautics, spacesuit safety & orbital science' },
    { id: 'space_explorer', name: 'Space Explorer', minXp: 600, badge: '🌌', desc: 'Qualified for Trans-Lunar travel and microgravity operations' },
    { id: 'lunar_explorer', name: 'Lunar Explorer', minXp: 1200, badge: '🌕', desc: 'Commander of Lunar Frontier surface exploration & outpost systems' },
    { id: 'mars_explorer', name: 'Mars Explorer', minXp: 2200, badge: '🔴', desc: 'Pioneer of Red Planet landing, EDL flight & surface geology' },
    { id: 'mission_commander', name: 'Mission Commander', minXp: 3500, badge: '⭐', desc: 'Flight Director of deep-space planetary exploration campaigns' },
    { id: 'legendary_explorer', name: 'Legendary Space Explorer', minXp: 5000, badge: '👑', desc: 'Master of human interplanetary exploration and scientific discovery' }
  ];

  // 3 Educational Grade Levels
  const GRADES = [
    { id: 'grade_3_5', name: 'Junior Cadet', label: 'Grades 3–5', level: 'Level 1', desc: 'Beginner-friendly fundamentals, vivid illustrations, and accessible questions.', icon: '🐣' },
    { id: 'grade_6_8', name: 'Space Explorer', label: 'Grades 6–8', level: 'Level 2', desc: 'Middle-school physics, quantitative comparisons, and planetary science.', icon: '🧭' },
    { id: 'grade_9_12', name: 'Mission Commander', label: 'Grades 9–12', level: 'Level 3', desc: 'Advanced aerospace mechanics, orbital dynamics, chemical & astrobiology rigor.', icon: '🎖️' }
  ];

  const AVATARS = [
    { id: 'pilot', name: 'Space Pilot', icon: '👨‍🚀', symbol: '✈️' },
    { id: 'scientist', name: 'Planetary Scientist', icon: '👩‍🔬', symbol: '🔬' },
    { id: 'engineer', name: 'Mission Engineer', icon: '🧑‍🔧', symbol: '⚙️' },
    { id: 'astrobiologist', name: 'Astrobiologist', icon: '👩‍🌾', symbol: '🌱' },
    { id: 'commander', name: 'Flight Director', icon: '🧑‍🚀', symbol: '⭐' },
    { id: 'robotics', name: 'Robotics Specialist', icon: '🤖', symbol: '📡' }
  ];

  const SUIT_COLORS = [
    { id: 'white', name: 'Artemis Polar White', hex: '#E2E8F0', matColor: 0xd5dce2 },
    { id: 'orange', name: 'Solar Flare Orange', hex: '#FF9E3B', matColor: 0xeaa24e },
    { id: 'cyan', name: 'Cyber Neon Cyan', hex: '#42E8FF', matColor: 0x42e8ff },
    { id: 'navy', name: 'Deep Space Navy', hex: '#1E3A8A', matColor: 0x1e3a8a },
    { id: 'crimson', name: 'Martian Crimson', hex: '#E11D48', matColor: 0xe11d48 }
  ];

  const ROLES = [
    { id: 'pilot', title: 'Space Pilot', desc: 'Precision spacecraft maneuvering & orbital navigation' },
    { id: 'scientist', title: 'Planetary Scientist', desc: 'Geological sampling, atmospheric analysis & astrobiology' },
    { id: 'engineer', title: 'Mission Engineer', desc: 'ECLSS life support maintenance & power distribution' },
    { id: 'explorer', title: 'Space Explorer', desc: 'Surface terrain mapping & long-distance EVA traverses' },
    { id: 'robotics', title: 'Robotics Specialist', desc: 'Rover remote control, robotic arm drilling & sensor telemetry' }
  ];

  const SPECIAL_MEDALS = [
    { id: 'first_launch', name: 'First Launch Medal', icon: '🚀', desc: 'Commenced your first astronaut countdown at ASETC' },
    { id: 'lunar_pioneer', name: 'Lunar Pioneer', icon: '🌕', desc: 'Successfully established the Lunar Research Outpost & completed all Moon missions' },
    { id: 'red_planet_pioneer', name: 'Red Planet Pioneer', icon: '🔴', desc: 'Successfully landed on Mars and survived all Red Planet expeditions' },
    { id: 'scientific_genius', name: 'Scientific Genius', icon: '🔬', desc: 'Scored 90+ points (Gold Medal) across 5 or more scientific missions' },
    { id: 'survival_specialist', name: 'Survival Specialist', icon: '🛡️', desc: 'Mastered all emergency alerts (dust storms, solar flares, pressure drops)' },
    { id: 'ultimate_commander', name: 'Ultimate Space Commander', icon: '👑', desc: 'Completed both Lunar and Martian expeditions and earned Legendary rank!' }
  ];

  let profile = {
    name: 'Cadet Leo',
    grade: 'grade_3_5',
    avatar: 'pilot',
    suitColor: 'white',
    role: 'explorer',
    idNumber: 'ASTROCADE-2040-ASETC-84',
    xp: 0,
    totalScore: 0,
    completedMissions: [],
    missionScores: {}, // { [missionId]: { score: number, medal: 'gold'|'silver'|'bronze', grade: string, date: string } }
    completedModules: [],
    completedExperiments: [],
    achievements: ['first_launch'],
    medals: [],
    specialAchievements: ['first_launch'],
    activeExpedition: 'moon',
    createdAt: new Date().toISOString()
  };

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        profile = Object.assign(profile, parsed);
      } else {
        // Fallback check legacy key
        const legacy = localStorage.getItem('nasa_junior_astronaut_profile_v2');
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          profile = Object.assign(profile, parsedLegacy);
        }
        const randId = 'ASTROCADE-2040-ASETC-' + Math.floor(100 + Math.random() * 900);
        profile.idNumber = randId;
        save();
      }
    } catch (e) {
      console.warn('Failed to load profile:', e);
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile:', e);
    }
    updateUI();
  }

  function getRank(xp = profile.xp) {
    let current = RANKS[0];
    for (const r of RANKS) {
      if (xp >= r.minXp) current = r;
      else break;
    }
    return current;
  }

  function getNextRank(xp = profile.xp) {
    for (const r of RANKS) {
      if (xp < r.minXp) return r;
    }
    return null;
  }

  function setGrade(gradeId) {
    const valid = GRADES.find(g => g.id === gradeId);
    if (valid) {
      profile.grade = gradeId;
      save();
      if (typeof toast === 'function') {
        toast(`🎓 Educational Level set to ${valid.level}: ${valid.name} (${valid.label})`);
      }
    }
  }

  function getGradeInfo(gradeId = profile.grade) {
    return GRADES.find(g => g.id === gradeId) || GRADES[0];
  }

  function addXP(amount, reason = '') {
    const oldRank = getRank();
    profile.xp += amount;
    const newRank = getRank();

    if (newRank.name !== oldRank.name) {
      if (typeof SoundEngine !== 'undefined' && SoundEngine.success) SoundEngine.success();
      showRankUpModal(newRank);
    }

    if (reason && typeof toast === 'function') {
      toast(`+${amount} XP: ${reason}`);
    }
    save();
  }

  function recordMissionScore(missionId, score, medal, missionDetails = {}) {
    if (!profile.missionScores) profile.missionScores = {};
    const existing = profile.missionScores[missionId];

    // Only update score if higher or new
    const prevScore = existing ? existing.score : 0;
    if (score >= prevScore) {
      profile.missionScores[missionId] = {
        score: score,
        medal: medal,
        grade: profile.grade,
        date: new Date().toLocaleDateString(),
        title: missionDetails.title || missionId
      };
    }

    // Add to completedMissions if 50+ (passing score)
    if (score >= 50 && !profile.completedMissions.includes(missionId)) {
      profile.completedMissions.push(missionId);
    }

    // Recalculate totalScore
    profile.totalScore = Object.values(profile.missionScores).reduce((acc, curr) => acc + (curr.score || 0), 0);

    // Track medal badge
    if (medal && !profile.medals.includes(missionDetails.rewardMedal || medal)) {
      profile.medals.push(missionDetails.rewardMedal || medal);
    }

    // Check special medal unlocks
    checkSpecialMedals();

    save();
  }

  function checkSpecialMedals() {
    const moonDone = getMoonMissionsCompleted();
    const marsDone = getMarsMissionsCompleted();

    // 1. Lunar Pioneer
    if (moonDone >= 6 && !profile.specialAchievements.includes('lunar_pioneer')) {
      unlockSpecialMedal('lunar_pioneer');
    }

    // 2. Red Planet Pioneer
    if (marsDone >= 6 && !profile.specialAchievements.includes('red_planet_pioneer')) {
      unlockSpecialMedal('red_planet_pioneer');
    }

    // 3. Scientific Genius (5+ Gold medals)
    const goldCount = Object.values(profile.missionScores || {}).filter(m => m.medal === 'gold').length;
    if (goldCount >= 5 && !profile.specialAchievements.includes('scientific_genius')) {
      unlockSpecialMedal('scientific_genius');
    }

    // 4. Ultimate Space Commander
    if (moonDone >= 6 && marsDone >= 6 && !profile.specialAchievements.includes('ultimate_commander')) {
      unlockSpecialMedal('ultimate_commander');
    }
  }

  function unlockSpecialMedal(medalId) {
    if (!profile.specialAchievements.includes(medalId)) {
      profile.specialAchievements.push(medalId);
      const m = SPECIAL_MEDALS.find(x => x.id === medalId);
      if (m) {
        addXP(300, `Special Honor: ${m.name}`);
        if (typeof toast === 'function') {
          toast(`🎖️ SPECIAL MEDAL AWARDED: ${m.icon} ${m.name}!`);
        }
      }
      save();
    }
  }

  function unlockAchievement(id, title) {
    if (!profile.achievements.includes(id)) {
      profile.achievements.push(id);
      addXP(100, `Achievement Unlocked: ${title}`);
      if (typeof SoundEngine !== 'undefined' && SoundEngine.success) SoundEngine.success();
      if (typeof toast === 'function') {
        toast(`🏆 ACHIEVEMENT UNLOCKED: ${title}!`);
      }
      save();
    }
  }

  function unlockCollectible(id, title) {
    if (!profile.collectibles) profile.collectibles = [];
    if (!profile.collectibles.includes(id)) {
      profile.collectibles.push(id);
      addXP(50, `Discovery Logged: ${title}`);
      save();
    }
  }

  function getMoonMissionsCompleted() {
    const moonKeys = ['moon_1', 'moon_2', 'moon_3', 'moon_4', 'moon_5', 'moon_final'];
    return (profile.completedMissions || []).filter(id => moonKeys.includes(id)).length;
  }

  function getMarsMissionsCompleted() {
    const marsKeys = ['mars_1', 'mars_2', 'mars_3', 'mars_4', 'mars_5', 'mars_final'];
    return (profile.completedMissions || []).filter(id => marsKeys.includes(id)).length;
  }

  function updateUI() {
    const curRank = getRank();
    const nextRank = getNextRank();
    const curGrade = getGradeInfo();

    // Top HUD updates
    const nameEl = document.getElementById('hudAstronautName');
    const xpEl = document.getElementById('hudXpDisplay');
    const rankEl = document.getElementById('hudRankDisplay');
    if (nameEl) nameEl.textContent = profile.name;
    if (xpEl) xpEl.textContent = `${profile.xp} XP`;
    if (rankEl) rankEl.textContent = `${curRank.badge} ${curRank.name}`;

    // ID Badge elements
    const idName = document.getElementById('badgeName');
    const idNum = document.getElementById('badgeId');
    const idRole = document.getElementById('badgeRole');
    const idRank = document.getElementById('badgeRank');
    const idXp = document.getElementById('badgeXp');
    const idMissions = document.getElementById('badgeMissions');
    const idAvatar = document.getElementById('badgeAvatar');
    const idNextXp = document.getElementById('badgeNextXp');

    if (idName) idName.textContent = profile.name;
    if (idNum) idNum.textContent = profile.idNumber;
    if (idRole) {
      const r = ROLES.find(x => x.id === profile.role);
      idRole.textContent = `${r ? r.title : 'Space Explorer'} · ${curGrade.level}`;
    }
    if (idRank) idRank.textContent = `${curRank.badge} ${curRank.name}`;
    if (idXp) idXp.textContent = `${profile.xp} XP (${profile.totalScore || 0} pts)`;
    if (idMissions) idMissions.textContent = `${profile.completedMissions.length} / 12`;
    if (idAvatar) {
      const a = AVATARS.find(x => x.id === profile.avatar);
      idAvatar.textContent = a ? a.icon : '👨‍🚀';
    }
    if (idNextXp) {
      idNextXp.textContent = nextRank ? `${nextRank.minXp - profile.xp} XP to ${nextRank.name}` : 'MAX RANK ACHIEVED';
    }
  }

  function showRankUpModal(rank) {
    const modal = document.getElementById('rankUpModal');
    if (!modal) return;
    const badge = document.getElementById('rankUpBadge');
    const title = document.getElementById('rankUpTitle');
    const desc = document.getElementById('rankUpDesc');
    if (badge) badge.textContent = rank.badge;
    if (title) title.textContent = rank.name;
    if (desc) desc.textContent = rank.desc;
    modal.classList.add('on');
  }

  // Render Digital Astronaut Passport Modal
  function renderPassport(containerId = 'interactiveModalContent') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const rank = getRank();
    const grade = getGradeInfo();
    const avatar = AVATARS.find(a => a.id === profile.avatar) || AVATARS[0];
    const moonDone = getMoonMissionsCompleted();
    const marsDone = getMarsMissionsCompleted();
    const totalScore = profile.totalScore || 0;

    let html = `
      <div class="passportModalWrapper" style="padding:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:40px;height:40px;border-radius:8px;background:rgba(66,232,255,0.15);border:1px solid var(--cyan);display:grid;place-items:center;font-size:22px;">🌌</div>
            <div>
              <div class="eyebrow" style="color:var(--accent);">ADVANCED SPACE EXPLORATION TRAINING CENTRE</div>
              <h2 style="font-family:var(--font-display);margin:2px 0;letter-spacing:1px;">OFFICIAL ASTRONAUT PASSPORT</h2>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--cyan);">ASTROCADE – BEYOND THE HORIZON · YEAR 2040</span>
            </div>
          </div>
          <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;margin-bottom:20px;">
          <!-- Left: Identity & Grade -->
          <div class="glass-panel" style="padding:16px;border-radius:12px;background:rgba(11,21,48,0.7);border:1px solid rgba(66,232,255,0.25);">
            <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px;">
              <div style="width:68px;height:68px;border-radius:12px;background:radial-gradient(circle, rgba(66,232,255,0.3), rgba(11,21,48,0.9));border:2px solid var(--cyan);display:grid;place-items:center;font-size:36px;box-shadow:0 0 16px rgba(66,232,255,0.3);">
                ${avatar.icon}
              </div>
              <div>
                <span class="eyebrow" style="color:var(--green);">● ACTIVE FLIGHT STATUS</span>
                <h3 style="font-family:var(--font-display);font-size:22px;margin:2px 0;">${profile.name}</h3>
                <div style="font-family:var(--font-mono);font-size:11px;color:var(--cyan);">${profile.idNumber}</div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;font-family:var(--font-mono);background:rgba(5,8,22,0.6);padding:10px;border-radius:8px;">
              <div>
                <span style="color:var(--silver);font-size:10px;display:block;">GRADE LEVEL</span>
                <strong style="color:var(--accent);">${grade.level}</strong>
                <div style="font-size:10px;color:var(--cyan);">${grade.label}</div>
              </div>
              <div>
                <span style="color:var(--silver);font-size:10px;display:block;">CURRENT RANK</span>
                <strong style="color:var(--green);">${rank.badge} ${rank.name}</strong>
              </div>
              <div>
                <span style="color:var(--silver);font-size:10px;display:block;">TOTAL SCORE</span>
                <strong style="color:var(--accent);font-size:15px;">${totalScore} PTS</strong>
              </div>
              <div>
                <span style="color:var(--silver);font-size:10px;display:block;">EXPERIENCE</span>
                <strong style="color:var(--cyan);font-size:15px;">${profile.xp} XP</strong>
              </div>
            </div>

            <!-- Grade Switcher inside Passport -->
            <div style="margin-top:14px;">
              <label style="font-size:11px;font-family:var(--font-mono);color:var(--silver);display:block;margin-bottom:6px;">SWITCH GRADE CURRICULUM:</label>
              <div style="display:flex;gap:6px;">
                ${GRADES.map(g => `
                  <button class="btn ${profile.grade === g.id ? 'primary' : ''}" style="flex:1;padding:6px 4px;font-size:10px;min-height:36px;" onclick="PlayerProfile.setGrade('${g.id}');PlayerProfile.renderPassport('${containerId}');">
                    ${g.icon} ${g.label}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Expedition Progress Stamps -->
          <div class="glass-panel" style="padding:16px;border-radius:12px;background:rgba(11,21,48,0.7);border:1px solid rgba(255,189,105,0.25);">
            <div class="eyebrow" style="color:var(--accent);margin-bottom:10px;">EXPEDITION FLIGHT STAMPS</div>

            <!-- Moon Expedition Stamp -->
            <div style="display:flex;gap:12px;align-items:center;background:rgba(5,8,22,0.6);padding:12px;border-radius:8px;margin-bottom:10px;border-left:4px solid #ffd166;">
              <div style="font-size:32px;">🌕</div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="font-size:13px;font-family:var(--font-display);">LUNAR FRONTIER EXPEDITION</strong>
                  <span style="font-family:var(--font-mono);font-size:11px;color:${moonDone >= 6 ? 'var(--green)' : 'var(--accent)'};">${moonDone} / 6 MISSIONS</span>
                </div>
                <div style="background:rgba(255,255,255,0.1);height:6px;border-radius:3px;margin:6px 0;overflow:hidden;">
                  <div style="background:var(--accent);height:100%;width:${(moonDone / 6) * 100}%;"></div>
                </div>
                <small style="color:var(--silver);font-size:10px;">${moonDone >= 6 ? '✓ LUNAR OUTPOST FOUNDED & RETURN COMPLETED' : 'Establish the South Pole Research Outpost'}</small>
              </div>
            </div>

            <!-- Mars Expedition Stamp -->
            <div style="display:flex;gap:12px;align-items:center;background:rgba(5,8,22,0.6);padding:12px;border-radius:8px;border-left:4px solid #ff5e7e;">
              <div style="font-size:32px;">🔴</div>
              <div style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="font-size:13px;font-family:var(--font-display);">RED PLANET RISING EXPEDITION</strong>
                  <span style="font-family:var(--font-mono);font-size:11px;color:${marsDone >= 6 ? 'var(--green)' : 'var(--red)'};">${marsDone} / 6 MISSIONS</span>
                </div>
                <div style="background:rgba(255,255,255,0.1);height:6px;border-radius:3px;margin:6px 0;overflow:hidden;">
                  <div style="background:#ff5e7e;height:100%;width:${(marsDone / 6) * 100}%;"></div>
                </div>
                <small style="color:var(--silver);font-size:10px;">${marsDone >= 6 ? '✓ MARTIAN RESEARCH BASE ESTABLISHED' : 'Transit to Mars, survive dust storms & sample Jezero Delta'}</small>
              </div>
            </div>

            <!-- Total Completion Banner -->
            <div style="margin-top:14px;text-align:center;">
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--cyan);">
                OVERALL EXPEDITION PROGRESS: <strong>${profile.completedMissions.length} / 12 MISSIONS COMPLETED</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- Special Honor Medals Showcase -->
        <div class="glass-panel" style="padding:16px;border-radius:12px;background:rgba(11,21,48,0.7);border:1px solid rgba(66,232,255,0.25);margin-bottom:16px;">
          <div class="eyebrow" style="color:var(--cyan);margin-bottom:10px;">ASTRONAUT MEDAL CASE (SPECIAL RECOGNITIONS)</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(170px, 1fr));gap:10px;">
            ${SPECIAL_MEDALS.map(m => {
              const earned = (profile.specialAchievements || []).includes(m.id);
              return `
                <div style="padding:10px;border-radius:8px;background:${earned ? 'rgba(57,139,255,0.12)' : 'rgba(255,255,255,0.02)'};border:1px solid ${earned ? 'var(--cyan)' : 'rgba(255,255,255,0.08)'};opacity:${earned ? '1' : '0.45'};text-align:center;">
                  <div style="font-size:26px;margin-bottom:4px;">${m.icon}</div>
                  <strong style="font-size:11px;font-family:var(--font-display);display:block;color:${earned ? 'var(--white)' : 'var(--silver)'};">${m.name}</strong>
                  <small style="font-size:9px;color:var(--silver);display:block;line-height:1.3;margin-top:3px;">${m.desc}</small>
                  <span style="font-size:8px;font-family:var(--font-mono);display:inline-block;margin-top:5px;padding:2px 6px;border-radius:4px;background:${earned ? 'rgba(56,217,150,0.2)' : 'rgba(255,255,255,0.05)'};color:${earned ? 'var(--green)' : 'var(--silver)'};">
                    ${earned ? '✓ CONFERRED' : '🔒 LOCKED'}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div style="font-size:11px;color:var(--silver);font-family:var(--font-mono);">
            * ASETC Official Digital Credential. Progress saved locally on this terminal.
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn" onclick="document.getElementById('interactiveModal').classList.remove('on');">Close Passport</button>
            <button class="btn primary" onclick="AstrocadeCertificate.openCertificateModal();">🎓 View Official Diploma →</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    const modal = document.getElementById('interactiveModal');
    if (modal) modal.classList.add('on');
  }

  return {
    load,
    save,
    get profile() { return profile; },
    get RANKS() { return RANKS; },
    get GRADES() { return GRADES; },
    get AVATARS() { return AVATARS; },
    get SUIT_COLORS() { return SUIT_COLORS; },
    get ROLES() { return ROLES; },
    get SPECIAL_MEDALS() { return SPECIAL_MEDALS; },
    getRank,
    getNextRank,
    setGrade,
    getGradeInfo,
    addXP,
    recordMissionScore,
    unlockAchievement,
    unlockCollectible,
    unlockSpecialMedal,
    getMoonMissionsCompleted,
    getMarsMissionsCompleted,
    renderPassport,
    updateUI
  };
})();

// Auto-load profile on startup
PlayerProfile.load();
