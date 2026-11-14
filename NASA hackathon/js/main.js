// NASA JUNIOR ASTRONAUT MISSION TRAINER - MASTER APPLICATION CONTROLLER
const AppRouter = (() => {
  let currentHub = 'command';

  const HUBS = [
    { id: 'command', name: 'Command Center', icon: '🏠' },
    { id: 'academy', name: 'Academy', icon: '🎓' },
    { id: 'missions', name: 'Missions', icon: '🚀' },
    { id: 'planetarium', name: 'Planets', icon: '🪐' },
    { id: 'laboratory', name: 'Laboratory', icon: '🔬' },
    { id: 'simulator', name: 'Flight Sim', icon: '🛸' },
    { id: 'achievements', name: 'Medals', icon: '🏆' },
    { id: 'profile', name: 'Profile', icon: '🧑‍🚀' }
  ];

  function init() {
    renderDock();
    setupCinematicIntro();
    setupProfileModal();
    setupNova();
    navigate('command');
  }

  function renderDock() {
    const dock = document.getElementById('hubDock');
    if (!dock) return;

    dock.innerHTML = HUBS.map(h => `
      <button class="hubTab ${h.id === currentHub ? 'active' : ''}" data-hub="${h.id}" onclick="AppRouter.navigate('${h.id}')">
        <span class="tabIcon">${h.icon}</span>
        <span>${h.name}</span>
      </button>
    `).join('');
  }

  function navigate(hubId) {
    SoundEngine.click();
    currentHub = hubId;

    // Update Dock
    document.querySelectorAll('.hubTab').forEach(tab => {
      const id = tab.getAttribute('data-hub');
      tab.classList.toggle('active', id === hubId);
    });

    // Hide all full-screen hub views
    document.querySelectorAll('.hubView').forEach(v => v.classList.remove('active'));

    // Handle view rendering
    if (hubId === 'command') {
      // 3D Scene is prominent
      const cmdView = document.getElementById('commandHubView');
      if (cmdView) cmdView.classList.remove('active');
    } else if (hubId === 'academy') {
      AstronautAcademy.renderHub('academyHubView');
      const v = document.getElementById('academyHubView');
      if (v) v.classList.add('active');
    } else if (hubId === 'missions') {
      MissionControl.renderHub('missionsHubView');
      const v = document.getElementById('missionsHubView');
      if (v) v.classList.add('active');
    } else if (hubId === 'planetarium') {
      PlanetExplorer.renderHub('planetariumHubView');
      const v = document.getElementById('planetariumHubView');
      if (v) v.classList.add('active');
    } else if (hubId === 'laboratory') {
      SpaceLaboratory.renderHub('laboratoryHubView');
      const v = document.getElementById('laboratoryHubView');
      if (v) v.classList.add('active');
    } else if (hubId === 'simulator') {
      SpacecraftSimulator.renderHub('simulatorHubView');
      const v = document.getElementById('simulatorHubView');
      if (v) v.classList.add('active');
    } else if (hubId === 'achievements') {
      AchievementCenter.renderHub('achievementsHubView');
      const v = document.getElementById('achievementsHubView');
      if (v) v.classList.add('active');
    } else if (hubId === 'profile') {
      openProfileModal();
    }
  }

  function setupCinematicIntro() {
    const screen = document.getElementById('cinematicScreen');
    const startBtn = document.getElementById('startJourneyBtn');
    const skipBtn = document.getElementById('skipIntroBtn');

    if (!screen) return;

    const dismissIntro = () => {
      SoundEngine.missionStart();
      screen.classList.add('hidden');
      PlayerProfile.unlockAchievement('first_launch', 'First Launch');
    };

    if (startBtn) startBtn.onclick = dismissIntro;
    if (skipBtn) skipBtn.onclick = dismissIntro;
  }

  function setupProfileModal() {
    const modal = document.getElementById('profileModal');
    const closeBtn = document.getElementById('profileCloseBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const nameInput = document.getElementById('inputAstronautName');

    if (closeBtn) closeBtn.onclick = () => {
      SoundEngine.click();
      modal.classList.remove('on');
    };

    if (saveBtn) saveBtn.onclick = () => {
      SoundEngine.success();
      if (nameInput && nameInput.value.trim()) {
        PlayerProfile.profile.name = nameInput.value.trim();
      }
      PlayerProfile.save();
      modal.classList.remove('on');
      toast('Astronaut Profile & Suit Configuration Saved!');
    };

    // Render avatar and suit options
    renderProfileOptions();
  }

  function renderProfileOptions() {
    const avatarGrid = document.getElementById('profileAvatarGrid');
    const colorRow = document.getElementById('profileColorRow');
    const roleSelect = document.getElementById('profileRoleSelect');

    if (avatarGrid) {
      avatarGrid.innerHTML = PlayerProfile.AVATARS.map(a => `
        <div class="avatarOption ${a.id === PlayerProfile.profile.avatar ? 'selected' : ''}" data-id="${a.id}">
          <div class="avatarSymbol">${a.icon}</div>
          <span style="font-size:10px;display:block;">${a.name}</span>
        </div>
      `).join('');

      avatarGrid.querySelectorAll('.avatarOption').forEach(el => {
        el.onclick = () => {
          SoundEngine.click();
          avatarGrid.querySelectorAll('.avatarOption').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
          PlayerProfile.profile.avatar = el.getAttribute('data-id');
          PlayerProfile.updateUI();
        };
      });
    }

    if (colorRow) {
      colorRow.innerHTML = PlayerProfile.SUIT_COLORS.map(c => `
        <div class="colorSwatch ${c.id === PlayerProfile.profile.suitColor ? 'selected' : ''}" 
             data-id="${c.id}" 
             style="background:${c.hex};" 
             title="${c.name}"></div>
      `).join('');

      colorRow.querySelectorAll('.colorSwatch').forEach(el => {
        el.onclick = () => {
          SoundEngine.click();
          colorRow.querySelectorAll('.colorSwatch').forEach(x => x.classList.remove('selected'));
          el.classList.add('selected');
          const colorId = el.getAttribute('data-id');
          PlayerProfile.profile.suitColor = colorId;
          const chosen = PlayerProfile.SUIT_COLORS.find(x => x.id === colorId);
          if (chosen && window.white && window.white.color) {
            window.white.color.setHex(chosen.matColor);
          }
          PlayerProfile.updateUI();
        };
      });
    }

    if (roleSelect) {
      roleSelect.innerHTML = PlayerProfile.ROLES.map(r => `
        <option value="${r.id}" ${r.id === PlayerProfile.profile.role ? 'selected' : ''}>
          ${r.title} — ${r.desc}
        </option>
      `).join('');

      roleSelect.onchange = (e) => {
        PlayerProfile.profile.role = e.target.value;
        PlayerProfile.updateUI();
      };
    }
  }

  function openProfileModal() {
    SoundEngine.click();
    const modal = document.getElementById('profileModal');
    const nameInput = document.getElementById('inputAstronautName');
    if (modal) {
      modal.classList.add('on');
      if (nameInput) nameInput.value = PlayerProfile.profile.name;
      renderProfileOptions();
      PlayerProfile.updateUI();
    }
  }

  function setupNova() {
    const fab = document.getElementById('novaFab');
    const chat = document.getElementById('novaChat');
    if (fab && chat) {
      fab.onclick = () => {
        SoundEngine.novaChime();
        chat.classList.toggle('on');
        if (chat.classList.contains('on')) {
          NovaAI.renderNovaChat('novaChat');
        }
      };
    }
  }

  return {
    init,
    navigate,
    openProfileModal
  };
})();

// Keyboard shortcuts for quick navigation
window.addEventListener('keydown', e => {
  if (e.key === '1') AppRouter.navigate('command');
  else if (e.key === '2') AppRouter.navigate('academy');
  else if (e.key === '3') AppRouter.navigate('missions');
  else if (e.key === '4') AppRouter.navigate('planetarium');
  else if (e.key === '5') AppRouter.navigate('laboratory');
  else if (e.key === '6') AppRouter.navigate('simulator');
  else if (e.key === '7') AppRouter.navigate('achievements');
  else if (e.key === '8') AppRouter.navigate('profile');
  else if (e.key === 'n' || e.key === 'N') {
    const chat = document.getElementById('novaChat');
    if (chat) {
      SoundEngine.novaChime();
      chat.classList.toggle('on');
      if (chat.classList.contains('on')) NovaAI.renderNovaChat('novaChat');
    }
  }
});
