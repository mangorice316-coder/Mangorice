/**
 * ============================================================================
 * NASA JUNIOR ASTRONAUT MISSION TRAINER - API MANAGER & UI BRIDGE
 * ============================================================================
 * Provides an interactive UI and bridge for managing API keys:
 * - Live Status Indicator in Top Navigation
 * - Modal for entering / testing NASA API Key
 * - Integration with NOVA AI and DONKI space weather updates
 * ============================================================================
 */

(function () {
  'use strict';

  function initAPIManager() {
    const api = window.NASA_API;
    const cfg = window.API_CONFIG;
    if (!api || !cfg) {
      console.warn('NASA_API or API_CONFIG not loaded yet.');
      return;
    }

    // Create Modal HTML if not already in document
    if (!document.getElementById('apiKeyModal')) {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'apiKeyModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="modalCard" style="max-width: 620px;">
          <div class="modalHeader">
            <div>
              <div class="eyebrow" style="color:var(--cyan,#42e8ff);">🛰️ DEEP SPACE NETWORK CREDENTIALS</div>
              <h2 style="margin:4px 0 0 0; font-size:1.4rem;">NASA Open API Connection</h2>
            </div>
            <span class="donkiPill" id="apiKeyModalBadge" style="cursor:default;">DEMO_KEY</span>
          </div>

          <p class="small muted" style="margin:12px 0;">
            Connect your personal NASA API key to unlock up to <strong>1,000 real-time telemetry requests per hour</strong> directly from NASA satellites, DONKI space weather monitors, and Mars rovers.
          </p>

          <!-- Input Box -->
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; margin-bottom:16px;">
            <label style="display:block; font-size:0.75rem; letter-spacing:1px; text-transform:uppercase; color:var(--silver,#b8c5d9); margin-bottom:8px;">
              Your NASA API Key
            </label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="nasaApiKeyInput" 
                placeholder="Paste your key here (e.g. 7mK...9xZ)" 
                style="flex:1; background:rgba(0,0,0,0.5); border:1px solid rgba(66,232,255,0.3); color:#fff; padding:10px 14px; border-radius:8px; font-family:monospace; font-size:0.9rem; outline:none;" />
              <button class="btn primary" id="btnTestNasaKey" style="white-space:nowrap; padding:10px 16px;">
                ⚡ Connect
              </button>
            </div>
            <div id="apiKeyTestFeedback" style="margin-top:10px; font-size:0.8rem; display:none;"></div>
          </div>

          <!-- Quick Actions & Help -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:16px;">
            <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer" 
              class="btn" style="text-align:center; text-decoration:none; padding:10px; font-size:0.8rem; background:rgba(57,139,255,0.15); border:1px solid rgba(57,139,255,0.4); color:#fff;">
              👉 Get Free Key (30 Seconds)
            </a>
            <button class="btn" id="btnUseDemoKey" style="padding:10px; font-size:0.8rem;">
              🔄 Reset to Free DEMO_KEY
            </button>
          </div>

          <!-- Endpoints Status Grid -->
          <div style="background:rgba(0,0,0,0.3); border-radius:10px; padding:12px; font-size:0.75rem;">
            <div style="font-weight:700; color:var(--cyan,#42e8ff); margin-bottom:6px; letter-spacing:0.5px;">
              CONNECTED NASA SERVICES:
            </div>
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:6px; color:var(--silver,#b8c5d9);">
              <div>☀️ <strong>DONKI:</strong> Space Weather & CMEs</div>
              <div>📸 <strong>APOD:</strong> Astronomy Picture of the Day</div>
              <div>🤖 <strong>Mars Rovers:</strong> Perseverance & Curiosity</div>
              <div>☄️ <strong>NeoWs:</strong> Near-Earth Asteroid Tracking</div>
            </div>
            <div style="margin-top:8px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.08); color:var(--muted,#8ca0ba);">
              📁 Config file location: <code style="color:var(--cyan,#42e8ff); font-size:0.75rem;">NASA hackathon/api/config.js</code>
            </div>
          </div>

          <div class="modalActions" style="margin-top:16px; display:flex; justify-content:flex-end;">
            <button class="btn" id="apiKeyModalClose">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Create or locate the Nav Button in top nav
    let navBtn = document.getElementById('btnNavApiKey');
    if (!navBtn) {
      navBtn = document.createElement('button');
      navBtn.id = 'btnNavApiKey';
      navBtn.className = 'donkiPill';
      navBtn.style.cursor = 'pointer';
      navBtn.style.marginLeft = '8px';
      navBtn.innerHTML = `🔑 <span id="navApiKeyLabel">API Key</span>`;
      
      const donkiPill = document.getElementById('donkiPill');
      if (donkiPill && donkiPill.parentNode) {
        donkiPill.parentNode.insertBefore(navBtn, donkiPill.nextSibling);
      }
    }

    // Update UI Elements with active status
    function updateUI() {
      const activeKey = api.getKey();
      const isCustom = api.hasCustomKey();
      
      const navLabel = document.getElementById('navApiKeyLabel');
      if (navLabel) {
        navLabel.textContent = isCustom ? 'NASA API · LIVE' : 'NASA API · DEMO';
      }

      if (navBtn) {
        if (isCustom) {
          navBtn.style.borderColor = 'rgba(56, 217, 150, 0.6)';
          navBtn.style.color = '#38d996';
          navBtn.title = `Connected to NASA Open API with personal key (${activeKey.substring(0, 4)}...${activeKey.substring(activeKey.length - 4)})`;
        } else {
          navBtn.style.borderColor = 'rgba(255, 191, 91, 0.4)';
          navBtn.style.color = '#ffbf5b';
          navBtn.title = 'Running on NASA DEMO_KEY (30 req/hr). Click to connect your personal key.';
        }
      }

      const input = document.getElementById('nasaApiKeyInput');
      if (input) {
        input.value = (activeKey === 'DEMO_KEY') ? '' : activeKey;
      }

      const badge = document.getElementById('apiKeyModalBadge');
      if (badge) {
        badge.textContent = isCustom ? '🟢 PERSONAL KEY (1,000 req/hr)' : '🟡 DEMO_KEY (30 req/hr)';
        badge.style.color = isCustom ? '#38d996' : '#ffbf5b';
      }
    }

    // Modal Control Functions
    function openModal() {
      const m = document.getElementById('apiKeyModal');
      if (m) {
        updateUI();
        m.classList.add('on');
      }
    }

    function closeModal() {
      const m = document.getElementById('apiKeyModal');
      if (m) m.classList.remove('on');
    }

    // Wire up events
    if (navBtn) navBtn.onclick = openModal;

    const closeBtn = document.getElementById('apiKeyModalClose');
    if (closeBtn) closeBtn.onclick = closeModal;

    const demoBtn = document.getElementById('btnUseDemoKey');
    if (demoBtn) {
      demoBtn.onclick = function () {
        api.setKey('DEMO_KEY');
        const feedback = document.getElementById('apiKeyTestFeedback');
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#ffbf5b';
          feedback.innerHTML = 'ℹ️ Reset to default free <code>DEMO_KEY</code> (30 requests/hour limit).';
        }
        updateUI();
        if (window.Audio && window.Audio.click) window.Audio.click();
      };
    }

    const testBtn = document.getElementById('btnTestNasaKey');
    if (testBtn) {
      testBtn.onclick = async function () {
        const input = document.getElementById('nasaApiKeyInput');
        const key = input ? input.value.trim() : '';
        const feedback = document.getElementById('apiKeyTestFeedback');
        
        if (!key) {
          if (feedback) {
            feedback.style.display = 'block';
            feedback.style.color = '#ff7b7b';
            feedback.textContent = 'Please paste a valid NASA API key or click "Reset to Free DEMO_KEY".';
          }
          return;
        }

        testBtn.disabled = true;
        testBtn.textContent = '⏳ Testing...';
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#42e8ff';
          feedback.textContent = 'Verifying credentials against api.nasa.gov satellite network...';
        }

        const result = await api.validateKey(key);
        testBtn.disabled = false;
        testBtn.textContent = '⚡ Connect';

        if (result.success) {
          api.setKey(key);
          updateUI();
          if (feedback) {
            const limitStr = result.rateLimitRemaining !== null ? ` (${result.rateLimitRemaining} req remaining)` : '';
            feedback.style.color = '#38d996';
            feedback.innerHTML = `✅ <strong>Successfully Connected!</strong> Ping: ${result.pingMs}ms${limitStr}. Live telemetry unlocked!`;
          }
          if (window.toast) {
            window.toast('NASA API: Personal key authenticated! 1,000 req/hr enabled.', 'success');
          }
          if (window.Audio && window.Audio.success) window.Audio.success();
          if (window.NOVA && window.NOVA.speak) {
            window.NOVA.speak("Cadet, your personal NASA API key has been authenticated! Live telemetry from the Deep Space Network is now streaming.");
          }
        } else {
          if (feedback) {
            feedback.style.color = '#ff7b7b';
            feedback.innerHTML = `❌ <strong>Connection Failed:</strong> ${result.error || 'Invalid API Key'}. Check your key and try again.`;
          }
          if (window.toast) {
            window.toast(`NASA API Error: ${result.error || 'Invalid key'}`, 'warn');
          }
        }
      };
    }

    // Close on backdrop click or ESC
    const modalEl = document.getElementById('apiKeyModal');
    if (modalEl) {
      modalEl.addEventListener('click', function (e) {
        if (e.target === modalEl) closeModal();
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    // Initial update
    updateUI();
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAPIManager);
  } else {
    initAPIManager();
  }

  window.initAPIManager = initAPIManager;
})();
