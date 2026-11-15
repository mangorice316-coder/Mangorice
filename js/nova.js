// NASA JUNIOR ASTRONAUT MISSION TRAINER - FRIENDLY AI ASSISTANT "NOVA"
const NovaAI = (() => {
  const KNOWLEDGE_BASE = {
    general: [
      {
        q: "What is NOVA?",
        a: "Hello Cadet! I am NOVA (Navigational Orbital Virtual Assistant), your friendly NASA-certified AI co-pilot. I'm here to guide your training, explain space physics, and help you become a certified astronaut!"
      },
      {
        q: "Why do astronauts float in space?",
        a: "Astronauts float not because there is 'no gravity', but because they are in continuous free fall! The space station travels sideways at 28,000 km/h (17,500 mph). As gravity pulls it toward Earth, the Earth curves away underneath it at the exact same rate!"
      },
      {
        q: "Why do astronauts exercise 2 hours every day?",
        a: "In microgravity, your bones and muscles don't have to support your weight, so they begin to weaken. Astronauts lose 1% to 2% of their bone density every month unless they lift heavy resistance weights with the ARED device and run on the space treadmill!"
      },
      {
        q: "Why is NASA exploring the Moon's South Pole?",
        a: "The Moon's South Pole has deep craters where the Sun never shines. Inside these permanent shadows, temperatures drop to -246°C (-410°F), trapping billions of tons of water ice! We can melt this ice for drinking water, oxygen, and rocket fuel!"
      },
      {
        q: "Why is Mars red?",
        a: "Mars gets its reddish-orange color from iron oxide—the same chemical as rusty iron! Ancient rocks weathered billions of years ago when Mars had rivers and lakes, spreading red rust dust across the planet."
      },
      {
        q: "What is a Solar Flare and CME?",
        a: "A solar flare is a gigantic explosion on the Sun that releases energy as bright light and X-rays. A Coronal Mass Ejection (CME) is a huge cloud of billions of tons of magnetized plasma shot into space at over 1,000 km/s! NASA DONKI tracks these storms to keep astronauts safe."
      },
      {
        q: "How does a space suit work?",
        a: "A spacesuit is actually a one-person spacecraft! It provides pure oxygen to breathe, maintains 4.3 pounds per square inch of pressure so your blood stays liquid, circulates chilled water through underwear pipes to keep you cool, and shields you from tiny micrometeorites flying at 10 km/s!"
      }
    ],
    facts: [
      "A day on Venus (243 Earth days) is longer than its entire year (225 Earth days)!",
      "The footprints left by Apollo astronauts on the Moon will stay there for at least 100 million years because there is no wind or rain to erode them.",
      "Jupiter's Great Red Spot is a hurricane storm that has been raging for over 300 years and is big enough to swallow the entire planet Earth!",
      "One million Earths could fit inside the Sun!",
      "Neutron stars spin so fast they can rotate up to 700 times per second!",
      "On Mars, sunsets look blue because the fine dust in the Martian atmosphere scatters blue light more effectively than red light.",
      "The International Space Station sees 16 sunrises and 16 sunsets every single day as it orbits Earth every 90 minutes!",
      "Water boils and turns into ice simultaneously in the vacuum of deep space!"
    ],
    quizzes: [
      {
        q: "What protects astronauts from solar radiation inside a lunar base?",
        options: ["Glass windows", "2.5 meters of lunar regolith soil", "Paper shields", "Normal air conditioning"],
        correct: 1,
        fact: "Lunar soil (regolith) is rich in basalt and iron. A 2.5-meter mound over the habitat absorbs over 99% of dangerous ionizing cosmic rays!"
      },
      {
        q: "How fast must a spacecraft travel to stay in Low Earth Orbit?",
        options: ["1,000 km/h", "5,000 km/h", "28,000 km/h", "100,000 km/h"],
        correct: 2,
        fact: "At 28,000 km/h (17,500 mph or 7.8 km/s), orbital centrifugal force perfectly balances Earth's gravitational pull!"
      },
      {
        q: "What famous rover landed in Jezero Crater on Mars in 2021?",
        options: ["Curiosity", "Opportunity", "Perseverance", "Sojourner"],
        correct: 2,
        fact: "NASA's Perseverance rover and its scout helicopter Ingenuity explore Jezero Crater's ancient lake delta searching for biosignatures!"
      },
      {
        q: "Why is there a thin layer of gold on the astronaut helmet visor?",
        options: ["For decoration", "To reflect intense solar glare and UV radiation", "To make it heavier", "To conduct electricity"],
        correct: 1,
        fact: "Gold is an incredible reflector of ultraviolet and infrared rays, protecting the astronaut's eyes from being blinded by the unfiltered Sun!"
      }
    ]
  };

  let activeQuizIndex = 0;

  function getRandomFact() {
    const list = KNOWLEDGE_BASE.facts;
    return list[Math.floor(Math.random() * list.length)];
  }

  async function getAnswer(query) {
    if (window.NASA_API && window.NASA_API.askAI) {
      try {
        const aiRes = await window.NASA_API.askAI(query);
        if (aiRes && aiRes.live && aiRes.answer) {
          return `${aiRes.answer} <span style="display:block;margin-top:6px;font-size:10px;color:var(--cyan);font-family:var(--font-mono);">🤖 [NOVA AI · ${aiRes.model}]</span>`;
        }
      } catch (e) {}
    }

    const qLower = query.toLowerCase();
    for (const item of KNOWLEDGE_BASE.general) {
      if (item.q.toLowerCase().includes(qLower) || qLower.includes(item.q.toLowerCase().split(' ')[1])) {
        return item.a;
      }
    }
    // Default contextual answer
    return `That's a fantastic scientific question, Cadet! In space exploration, every mission relies on physics, teamwork, and careful planning. Explore the Space Laboratory or the Planet Explorer to see this in action, or ask me about spacesuits, gravity, Mars, or the Moon!`;
  }

  function renderNovaChat(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="novaHead">
        <div class="novaTitle">
          <div class="novaAvatar">N</div>
          <div>
            <strong style="font-family:var(--font-display);font-size:15px;display:block;">NOVA AI ASSISTANT</strong>
            <small style="color:var(--cyan);font-family:var(--font-mono);font-size:9px;">NASA FLIGHT COMPANION · ACTIVE</small>
          </div>
        </div>
        <button class="iconBtn" id="novaCloseBtn" style="width:28px;height:28px;">✕</button>
      </div>
      <div class="novaBody" id="novaChatBody">
        <p>Greetings, <strong>${PlayerProfile.profile.name}</strong>! I am NOVA. What would you like to explore today?</p>
      </div>
      <div class="novaSuggestions">
        <button class="novaChip" data-action="fact">✨ Tell me a Mind-Blowing Space Fact</button>
        <button class="novaChip" data-action="quiz">🧠 Test My Knowledge with a Space Quiz</button>
        <button class="novaChip" data-q="Why do astronauts float in space?">🚀 Why do astronauts float in orbit?</button>
        <button class="novaChip" data-q="Why is NASA exploring the Moon's South Pole?">🌕 Why go to the Moon's South Pole?</button>
        <button class="novaChip" data-q="What is a Solar Flare and CME?">☀️ What is a solar flare & CME?</button>
      </div>
    `;

    // Event listeners
    container.querySelector('#novaCloseBtn').onclick = () => {
      container.classList.remove('on');
      SoundEngine.click();
    };

    container.querySelectorAll('.novaChip').forEach(btn => {
      btn.onclick = () => {
        SoundEngine.click();
        const action = btn.getAttribute('data-action');
        const q = btn.getAttribute('data-q');
        const body = document.getElementById('novaChatBody');

        if (action === 'fact') {
          const fact = getRandomFact();
          body.innerHTML = `<p style="color:var(--amber);margin-bottom:6px;"><strong>DID YOU KNOW?</strong></p><p>${fact}</p>`;
        } else if (action === 'quiz') {
          startQuiz(body);
        } else if (q) {
          body.innerHTML = `<p style="color:var(--cyan);margin-bottom:6px;"><strong>Q: ${q}</strong></p><p style="color:var(--muted);">Analyzing deep space telemetry...</p>`;
          getAnswer(q).then(ans => {
            body.innerHTML = `<p style="color:var(--cyan);margin-bottom:6px;"><strong>Q: ${q}</strong></p><p>${ans}</p>`;
          });
        }
      };
    });
  }

  function startQuiz(bodyEl) {
    const q = KNOWLEDGE_BASE.quizzes[activeQuizIndex % KNOWLEDGE_BASE.quizzes.length];
    activeQuizIndex++;

    let html = `
      <p style="color:var(--cyan);font-weight:700;margin-bottom:8px;">QUIZ TIME!</p>
      <p style="margin-bottom:12px;">${q.q}</p>
      <div style="display:flex;flex-direction:column;gap:6px;">
    `;

    q.options.forEach((opt, idx) => {
      html += `<button class="btn small" style="text-align:left;padding:8px 12px;font-size:12px;" data-opt="${idx}">${opt}</button>`;
    });

    html += `</div><div id="quizResult" style="margin-top:10px;font-size:12px;line-height:1.4;"></div>`;
    bodyEl.innerHTML = html;

    bodyEl.querySelectorAll('button[data-opt]').forEach(btn => {
      btn.onclick = () => {
        const choice = parseInt(btn.getAttribute('data-opt'));
        const resEl = bodyEl.querySelector('#quizResult');
        if (choice === q.correct) {
          SoundEngine.success();
          PlayerProfile.addXP(50, 'Correct Space Quiz Answer');
          resEl.innerHTML = `<span style="color:var(--green);font-weight:700;">✓ EXCELLENT WORK!</span> +50 XP!<br>${q.fact}`;
        } else {
          SoundEngine.alert();
          resEl.innerHTML = `<span style="color:var(--amber);font-weight:700;">Good try!</span> The correct answer was: <em>${q.options[q.correct]}</em>.<br>${q.fact}`;
        }
        bodyEl.querySelectorAll('button[data-opt]').forEach(b => b.disabled = true);
      };
    });
  }

  return {
    getAnswer,
    getRandomFact,
    renderNovaChat
  };
})();
