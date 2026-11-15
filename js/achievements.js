// NASA JUNIOR ASTRONAUT MISSION TRAINER - ACHIEVEMENTS & DISCOVERY CARDS
const AchievementCenter = (() => {
  const MEDALS = [
    {
      id: 'first_launch',
      name: 'First Launch',
      icon: '🚀',
      desc: 'Complete astronaut recruitment and enter the NASA Space Command Center.',
      category: 'Recruitment'
    },
    {
      id: 'zero_g_explorer',
      name: 'Zero-G Explorer',
      icon: '🌌',
      desc: 'Complete microgravity floating academy training without collision.',
      category: 'Academy'
    },
    {
      id: 'suit_specialist',
      name: 'Suit Specialist',
      icon: '🛡️',
      desc: 'Perform 100% component safety verification on the Artemis xEMU spacesuit.',
      category: 'Academy'
    },
    {
      id: 'lunar_scientist',
      name: 'Lunar Scientist',
      icon: '🌕',
      desc: 'Complete the Lunar South Pole Shackleton Crater water ice expedition.',
      category: 'Campaign'
    },
    {
      id: 'mars_pioneer',
      name: 'Mars Pioneer',
      icon: '🔴',
      desc: 'Drill ancient river delta clay samples in Jezero Crater on Mars.',
      category: 'Campaign'
    },
    {
      id: 'ring_navigator',
      name: 'Ring Navigator',
      icon: '🪐',
      desc: 'Complete the Saturn planetary flyby and sample Titan and Enceladus.',
      category: 'Campaign'
    },
    {
      id: 'mission_commander',
      name: 'Mission Commander',
      icon: '⭐',
      desc: 'Complete the deep space nebula survey and reach the rank of Commander.',
      category: 'Campaign'
    },
    {
      id: 'master_pilot',
      name: 'Master Pilot',
      icon: '🛸',
      desc: 'Fly through all 5 orbital waypoint rings in the Spacecraft Flight Simulator.',
      category: 'Simulation'
    },
    {
      id: 'space_researcher',
      name: 'Space Researcher',
      icon: '🧪',
      desc: 'Execute all 5 physics and space science experiments in the Space Laboratory.',
      category: 'Science'
    }
  ];

  const CARDS = [
    {
      id: 'apollo_lrv',
      name: 'Apollo 17 Lunar Roving Vehicle',
      tag: 'Moon Exploration',
      date: 'Dec 1972 · Taurus-Littrow',
      img: 'assets/moon_panorama.jpg',
      facts: 'The electric Lunar Roving Vehicle allowed Apollo astronauts to drive 35.7 km across the Moon, collecting 110 kg of lunar rock samples!'
    },
    {
      id: 'shackleton_crater',
      name: 'Shackleton Crater Water Ice',
      tag: 'Lunar South Pole',
      date: 'NASA LOLA Telemetry',
      img: 'assets/moon_panorama.jpg',
      facts: 'Shackleton Crater’s interior has been in permanent darkness for billions of years, keeping ancient cometary water ice frozen at -246°C.'
    },
    {
      id: 'perseverance_rover',
      name: 'Perseverance Rover & Mastcam-Z',
      tag: 'Mars Exploration',
      date: 'Feb 2021 · Jezero Crater',
      img: 'assets/mars_panorama.jpg',
      facts: 'Equipped with a robotic drill and 43 sample collection tubes, Perseverance is collecting core samples to be returned to Earth by Mars Sample Return.'
    },
    {
      id: 'ingenuity_helicopter',
      name: 'Ingenuity Mars Helicopter',
      tag: 'Aerial Robotics',
      date: '72 Total Flights on Mars',
      img: 'assets/mars_panorama.jpg',
      facts: 'The first aircraft in history to achieve powered, controlled flight on another planet, spinning dual rotors at 2,400 RPM in thin Martian air.'
    },
    {
      id: 'sdo_solar_flare',
      name: 'SDO Solar Dynamics Observatory',
      tag: 'Space Weather',
      date: 'Extreme Ultraviolet AIA',
      img: 'assets/sun_sdo_flare.jpg',
      facts: 'SDO orbits Earth capturing 4K ultra-high-definition images of the Sun every 12 seconds, monitoring solar flares and coronal mass ejections for NASA DONKI.'
    },
    {
      id: 'earth_blue_marble',
      name: 'Apollo 17 "Blue Marble" Earth',
      tag: 'Human Spaceflight',
      date: 'Dec 7, 1972',
      img: 'assets/earth_apollo17.jpg',
      facts: 'One of the most reproduced images in human history, photographed from 29,000 km away showing the entire illuminated Earth with Antarctica and Africa.'
    },
    {
      id: 'iss_cupola',
      name: 'ISS Cupola Observation Module',
      tag: 'Life in Orbit',
      date: 'Permanent Human Presence',
      img: 'assets/earth_apollo17.jpg',
      facts: 'The Cupola has seven large windows providing a 360° panoramic view of Earth, used for monitoring spacewalks, robotic arm dockings, and science observation.'
    },
    {
      id: 'enceladus_ocean',
      name: 'Enceladus Cryovolcanic Plumes',
      tag: 'Ocean Worlds',
      date: 'NASA Cassini Discovery',
      img: 'assets/earth_apollo17.jpg',
      facts: 'Over 100 geysers shoot water vapor, ice crystals, and organic molecules from a global liquid ocean under Enceladus’s ice crust into space!'
    }
  ];

  function renderHub(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const userAchievements = PlayerProfile.profile.achievements || [];
    const userCards = PlayerProfile.profile.collectibles || [];

    el.innerHTML = `
      <div class="hubContainer">
        <div class="hubHeader">
          <div class="eyebrow">NASA RECOGNITION ARCHIVE</div>
          <h1>Astronaut Achievement Center</h1>
          <p>Review your earned mission medals, flight qualifications, and collectible NASA scientific discovery cards. Keep exploring to complete your collection!</p>
        </div>

        <!-- Section 1: Medals & Qualifications -->
        <div style="margin-top:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="font-family:var(--font-display);font-size:20px;">🎖️ Astronaut Medals & Certifications</h3>
            <span style="font-family:var(--font-mono);font-size:12px;color:var(--cyan);">
              EARNED: ${userAchievements.length} / ${MEDALS.length}
            </span>
          </div>

          <div class="medalGrid">
            ${MEDALS.map(m => {
              const isEarned = userAchievements.includes(m.id);
              return `
                <div class="medalCard ${!isEarned ? 'unearned' : ''}">
                  <div class="medalIcon">${m.icon}</div>
                  <div>
                    <span style="font-size:9px;font-family:var(--font-mono);color:${isEarned ? 'var(--green)' : 'var(--silver)'};">
                      ${isEarned ? '✓ EARNED' : '○ IN PROGRESS'} · ${m.category}
                    </span>
                    <h4 style="font-family:var(--font-display);font-size:16px;margin:2px 0 4px;color:${isEarned ? 'var(--white)' : 'var(--silver)'};">${m.name}</h4>
                    <p style="font-size:11px;color:var(--silver);line-height:1.4;">${m.desc}</p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Section 2: Collectible Discovery Cards -->
        <div style="margin-top:34px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="font-family:var(--font-display);font-size:20px;">🃏 Scientific Discovery Cards</h3>
            <span style="font-family:var(--font-mono);font-size:12px;color:var(--amber);">
              COLLECTED: ${userCards.length} / ${CARDS.length}
            </span>
          </div>

          <div class="cardGrid" style="margin-top:14px;">
            ${CARDS.map(c => {
              const isUnlocked = userCards.includes(c.id);
              return `
                <div class="hubCard glass-panel" style="padding:14px;${!isUnlocked ? 'filter:grayscale(0.8);opacity:0.4;' : ''}">
                  <div style="height:140px;border-radius:8px;overflow:hidden;margin-bottom:12px;position:relative;">
                    <img src="${c.img}" style="width:100%;height:100%;object-fit:cover;" alt="${c.name}">
                    <span style="position:absolute;top:8px;left:8px;background:rgba(5,8,22,0.85);font-size:9px;padding:3px 7px;border-radius:4px;font-family:var(--font-mono);color:var(--cyan);">
                      ${c.tag}
                    </span>
                  </div>
                  <h4 style="font-family:var(--font-display);font-size:15px;margin-bottom:4px;">${c.name}</h4>
                  <div style="font-size:10px;font-family:var(--font-mono);color:var(--silver);margin-bottom:8px;">${c.date}</div>
                  <p style="font-size:11px;line-height:1.4;color:var(--silver);">${c.facts}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  return {
    renderHub
  };
})();
