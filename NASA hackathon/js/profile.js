// NASA JUNIOR ASTRONAUT MISSION TRAINER - PLAYER PROFILE & PROGRESSION
const PlayerProfile = (() => {
  const STORAGE_KEY = 'nasa_junior_astronaut_profile_v2';

  const RANKS = [
    { name: 'Cadet Astronaut', minXp: 0, badge: '🚀', desc: 'Recruit in the NASA Junior Astronaut Program' },
    { name: 'Junior Explorer', minXp: 250, badge: '🌌', desc: 'Certified for Low Earth Orbit and Station Operations' },
    { name: 'Space Specialist', minXp: 600, badge: '🛰️', desc: 'Qualified for Microgravity Science & EVA Spacewalks' },
    { name: 'Mission Scientist', minXp: 1100, badge: '🔬', desc: 'Authorized to Lead Surface Lunar & Martian Expeditions' },
    { name: 'Senior Astronaut', minXp: 1800, badge: '🪐', desc: 'Commander of Interplanetary Transport & Deep Field Probes' },
    { name: 'Galactic Explorer', minXp: 2800, badge: '⭐', desc: 'Master Explorer of the Solar System and Beyond' }
  ];

  const AVATARS = [
    { id: 'pilot', name: 'Flight Pilot', icon: '👨‍🚀', symbol: '✈️' },
    { id: 'scientist', name: 'Planetary Scientist', icon: '👩‍🔬', symbol: '🔬' },
    { id: 'engineer', name: 'Mission Engineer', icon: '🧑‍🔧', symbol: '⚙️' },
    { id: 'astrobiologist', name: 'Botanist', icon: '👩‍🌾', symbol: '🌱' },
    { id: 'commander', name: 'Flight Director', icon: '🧑‍🚀', symbol: '⭐' },
    { id: 'roboticist', name: 'Cyber Specialist', icon: '🤖', symbol: '📡' }
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

  let profile = {
    name: 'Cadet Leo',
    avatar: 'pilot',
    suitColor: 'white',
    role: 'explorer',
    idNumber: 'NASA-JAT-2026-X84',
    xp: 0,
    completedMissions: [],
    completedModules: [],
    completedExperiments: [],
    achievements: ['first_launch'],
    collectibles: ['apollo_lrv', 'shackleton_crater'],
    createdAt: new Date().toISOString()
  };

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        profile = Object.assign(profile, JSON.parse(saved));
      } else {
        // Generate random callsign ID for new cadets
        const randId = 'NASA-JAT-2026-' + Math.floor(100 + Math.random() * 900);
        profile.idNumber = randId;
        save();
      }
    } catch (e) {
      console.warn('Failed to load profile from storage:', e);
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
    return null; // Top rank achieved
  }

  function addXP(amount, reason = '') {
    const oldRank = getRank();
    profile.xp += amount;
    const newRank = getRank();

    if (newRank.name !== oldRank.name) {
      SoundEngine.success();
      showRankUpModal(newRank);
    }

    if (reason && typeof toast === 'function') {
      toast(`+${amount} XP: ${reason}`);
    }
    save();
  }

  function unlockAchievement(id, title) {
    if (!profile.achievements.includes(id)) {
      profile.achievements.push(id);
      addXP(100, `Achievement Unlocked: ${title}`);
      SoundEngine.success();
      if (typeof toast === 'function') {
        toast(`🏆 ACHIEVEMENT UNLOCKED: ${title}!`);
      }
      save();
    }
  }

  function unlockCollectible(id, title) {
    if (!profile.collectibles.includes(id)) {
      profile.collectibles.push(id);
      addXP(50, `Discovery Logged: ${title}`);
      save();
    }
  }

  function updateUI() {
    const curRank = getRank();
    const nextRank = getNextRank();

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
      idRole.textContent = r ? r.title : 'Space Explorer';
    }
    if (idRank) idRank.textContent = `${curRank.badge} ${curRank.name}`;
    if (idXp) idXp.textContent = `${profile.xp} XP`;
    if (idMissions) idMissions.textContent = profile.completedMissions.length;
    if (idAvatar) {
      const a = AVATARS.find(x => x.id === profile.avatar);
      idAvatar.textContent = a ? a.icon : '👨‍🚀';
    }
    if (idNextXp) {
      idNextXp.textContent = nextRank ? `${nextRank.minXp - profile.xp} XP to ${nextRank.name}` : 'MAX RANK';
    }
  }

  function showRankUpModal(rank) {
    const modal = document.getElementById('rankUpModal');
    if (!modal) return;
    document.getElementById('rankUpBadge').textContent = rank.badge;
    document.getElementById('rankUpTitle').textContent = rank.name;
    document.getElementById('rankUpDesc').textContent = rank.desc;
    modal.classList.add('on');
  }

  return {
    load,
    save,
    get profile() { return profile; },
    get RANKS() { return RANKS; },
    get AVATARS() { return AVATARS; },
    get SUIT_COLORS() { return SUIT_COLORS; },
    get ROLES() { return ROLES; },
    getRank,
    getNextRank,
    addXP,
    unlockAchievement,
    unlockCollectible,
    updateUI
  };
})();

// Auto-load profile on startup
PlayerProfile.load();
