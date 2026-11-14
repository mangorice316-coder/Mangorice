/**
 * ============================================================================
 * NASA JUNIOR ASTRONAUT MISSION TRAINER - 5-KEY COMMAND CENTER & UI
 * ============================================================================
 * Manages the interactive interface for all 5 Mission Critical APIs:
 * - Top Navigation Live Status Chip
 * - 5-Slot Credential Management Modal
 * - Individual & Bulk API Test Harness
 * - Real-time NOVA AI & Space Weather Sync
 * ============================================================================
 */

(function () {
  'use strict';

  function init5KeyManager() {
    const api = window.NASA_API;
    const cfg = window.API_CONFIG;
    if (!api || !cfg) {
      setTimeout(init5KeyManager, 100);
      return;
    }

    // Inject 5-Key Modal if not present
    if (!document.getElementById('apiKeyModal')) {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'apiKeyModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');

      modal.innerHTML = `
        <div class="modalCard" style="max-width: 780px; max-height: 90vh; overflow-y: auto;">
          <div class="modalHeader" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <div class="eyebrow" style="color:var(--cyan,#42e8ff); letter-spacing:1px; font-size:0.75rem;">🛰️ MISSION CONTROL TELEMETRY · 5-KEY INTEGRATION</div>
              <h2 style="margin:4px 0 0 0; font-size:1.5rem; font-family:var(--font-display,sans-serif);">Astronaut Mission API Command Center</h2>
            </div>
            <div id="modalMasterPill" class="donkiPill" style="cursor:default; font-size:0.8rem; padding:4px 10px;">
              0 / 5 CONNECTED
            </div>
          </div>

          <p class="small muted" style="margin:0 0 16px 0; line-height:1.5;">
            Configure your <strong>5 Mission API keys</strong> below to unlock unthrottled real-time satellite telemetry, conversational AI mission debriefing, orbital satellite tracking, and launchpad weather.
          </p>

          <!-- 5 Keys Grid Container -->
          <div id="apiSlotsContainer" style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
            <!-- Dynamically populated slots -->
          </div>

          <!-- Master Control Bar -->
          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="font-size:0.8rem; color:var(--silver,#b8c5d9);">
              📁 Config File: <code style="color:var(--cyan,#42e8ff); background:rgba(0,0,0,0.4); padding:3px 6px; border-radius:4px;">api/config.js</code>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn" id="btnTestAll5Keys" style="background:rgba(66,232,255,0.15); border-color:rgba(66,232,255,0.4); color:#fff; font-size:0.8rem; padding:8px 14px;">
                ⚡ Test All 5 Keys
              </button>
              <button class="btn" id="apiKeyModalClose" style="font-size:0.8rem; padding:8px 14px;">
                Close Command Center
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Inject or update Top Nav Button
    let navBtn = document.getElementById('btnNavApiKey');
    if (!navBtn) {
      navBtn = document.createElement('button');
      navBtn.id = 'btnNavApiKey';
      navBtn.className = 'donkiPill';
      navBtn.style.cursor = 'pointer';
      navBtn.style.marginLeft = '8px';
      navBtn.innerHTML = `🔑 <span id="navApiKeyLabel">5-API KEYS</span>`;

      const donkiPill = document.getElementById('donkiPill');
      if (donkiPill && donkiPill.parentNode) {
        donkiPill.parentNode.insertBefore(navBtn, donkiPill.nextSibling);
      }
    }

    // Render 5 Key Slots in the Modal
    function renderSlots() {
      const container = document.getElementById('apiSlotsContainer');
      if (!container) return;

      const slots = api.getAllSlotStatus();
      container.innerHTML = slots.map(slot => {
        const isSet = slot.configured;
        const val = slot.activeValue === 'DEMO_KEY' ? '' : slot.activeValue;
        const statusBadge = isSet 
          ? `<span style="color:#38d996; font-size:0.75rem; background:rgba(56,217,150,0.15); padding:2px 8px; border-radius:6px; border:1px solid rgba(56,217,150,0.3);">🟢 ACTIVE</span>`
          : (slot.id === 'NASA_PRIMARY_KEY' 
              ? `<span style="color:#ffbf5b; font-size:0.75rem; background:rgba(255,191,91,0.15); padding:2px 8px; border-radius:6px; border:1px solid rgba(255,191,91,0.3);">🟡 DEMO_KEY</span>`
              : `<span style="color:#8ca0ba; font-size:0.75rem; background:rgba(255,255,255,0.06); padding:2px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">⚪ NOT CONFIGURED</span>`);

        return `
          <div class="apiSlotCard" id="slotCard_${slot.id}" style="background:rgba(11,21,35,0.85); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.3rem;">${slot.icon}</span>
                <div>
                  <div style="font-weight:700; font-size:0.95rem; color:#fff;">${slot.name}</div>
                  <div style="font-size:0.75rem; color:var(--muted,#8ca0ba);">${slot.desc}</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <a href="${slot.signupUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--cyan,#42e8ff); font-size:0.75rem; text-decoration:none;">
                  Get Free Key ↗
                </a>
                ${statusBadge}
              </div>
            </div>

            <!-- Input & Test Button Row -->
            <div style="display:flex; gap:8px; margin-top:8px;">
              <input type="password" id="input_${slot.id}" value="${val}" placeholder="${slot.placeholder}"
                style="flex:1; background:rgba(0,0,0,0.55); border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 12px; border-radius:8px; font-family:monospace; font-size:0.85rem; outline:none;" />
              <button class="btn btnToggleShow" data-target="input_${slot.id}" style="padding:8px 10px; font-size:0.75rem; background:rgba(255,255,255,0.06);">
                👁️
              </button>
              <button class="btn btnSaveSlot" data-slot="${slot.id}" style="padding:8px 14px; font-size:0.8rem; background:rgba(57,139,255,0.2); border-color:rgba(57,139,255,0.4); color:#fff;">
                💾 Save
              </button>
              <button class="btn primary btnTestSlot" data-slot="${slot.id}" style="padding:8px 14px; font-size:0.8rem; white-space:nowrap;">
                ⚡ Test
              </button>
            </div>

            <div id="feedback_${slot.id}" style="display:none; margin-top:8px; font-size:0.8rem;"></div>
          </div>
        `;
      }).join('');

      // Wire up toggle visibility buttons
      container.querySelectorAll('.btnToggleShow').forEach(btn => {
        btn.onclick = () => {
          const target = document.getElementById(btn.dataset.target);
          if (target) {
            target.type = target.type === 'password' ? 'text' : 'password';
          }
        };
      });

      // Wire up individual Save buttons
      container.querySelectorAll('.btnSaveSlot').forEach(btn => {
        btn.onclick = () => {
          const slotId = btn.dataset.slot;
          const input = document.getElementById(`input_${slotId}`);
          if (input) {
            cfg.setKey(slotId, input.value.trim());
            renderSlots();
            updateNavPill();
            if (window.toast) window.toast(`${slotId} saved successfully!`, 'success');
            if (window.Audio && window.Audio.click) window.Audio.click();
          }
        };
      });

      // Wire up individual Test buttons
      container.querySelectorAll('.btnTestSlot').forEach(btn => {
        btn.onclick = async () => {
          const slotId = btn.dataset.slot;
          const input = document.getElementById(`input_${slotId}`);
          const val = input ? input.value.trim() : '';
          const fb = document.getElementById(`feedback_${slotId}`);
          
          btn.disabled = true;
          btn.textContent = '⏳ Testing...';
          if (fb) {
            fb.style.display = 'block';
            fb.style.color = 'var(--cyan,#42e8ff)';
            fb.textContent = 'Verifying connection...';
          }

          const res = await api.validateSlot(slotId, val);
          btn.disabled = false;
          btn.textContent = '⚡ Test';

          if (res.success) {
            cfg.setKey(slotId, val);
            renderSlots();
            updateNavPill();
            const newFb = document.getElementById(`feedback_${slotId}`);
            if (newFb) {
              newFb.style.display = 'block';
              newFb.style.color = '#38d996';
              const ping = res.pingMs ? ` (${res.pingMs}ms)` : '';
              const rem = res.remaining !== undefined && res.remaining !== null ? ` · ${res.remaining} req remaining` : '';
              newFb.innerHTML = `✅ <strong>Connected!</strong> Ping${ping}${rem}`;
            }
            if (window.toast) window.toast(`Connection Verified: ${slotId}!`, 'success');
            if (window.Audio && window.Audio.success) window.Audio.success();
          } else {
            if (fb) {
              fb.style.display = 'block';
              fb.style.color = '#ff7b7b';
              fb.innerHTML = `❌ <strong>Failed:</strong> ${res.error || 'Connection refused'}`;
            }
          }
        };
      });
    }

    // Update Top Nav status indicator
    function updateNavPill() {
      const configuredCount = cfg.getConfiguredCount ? cfg.getConfiguredCount() : 0;
      const hasCustom = api.hasCustomKey();

      const label = document.getElementById('navApiKeyLabel');
      if (label) {
        label.textContent = `APIs · ${configuredCount}/5 ACTIVE`;
      }

      if (navBtn) {
        if (configuredCount >= 3 || hasCustom) {
          navBtn.style.borderColor = 'rgba(56, 217, 150, 0.6)';
          navBtn.style.color = '#38d996';
        } else if (configuredCount > 0) {
          navBtn.style.borderColor = 'rgba(66, 232, 255, 0.5)';
          navBtn.style.color = '#42e8ff';
        } else {
          navBtn.style.borderColor = 'rgba(255, 191, 91, 0.4)';
          navBtn.style.color = '#ffbf5b';
        }
      }

      const masterPill = document.getElementById('modalMasterPill');
      if (masterPill) {
        masterPill.textContent = `${configuredCount} / 5 KEYS CONFIGURED`;
        masterPill.style.color = configuredCount > 0 ? '#38d996' : '#ffbf5b';
      }
    }

    // Modal open / close handlers
    function openModal() {
      const m = document.getElementById('apiKeyModal');
      if (m) {
        renderSlots();
        updateNavPill();
        m.classList.add('on');
      }
    }

    function closeModal() {
      const m = document.getElementById('apiKeyModal');
      if (m) m.classList.remove('on');
    }

    if (navBtn) navBtn.onclick = openModal;

    const closeBtn = document.getElementById('apiKeyModalClose');
    if (closeBtn) closeBtn.onclick = closeModal;

    // Master Test All 5 Keys Button
    const testAllBtn = document.getElementById('btnTestAll5Keys');
    if (testAllBtn) {
      testAllBtn.onclick = async () => {
        testAllBtn.disabled = true;
        testAllBtn.textContent = '⏳ Testing All 5 Services...';
        if (window.toast) window.toast('Initiating 5-Key Deep Space Telemetry Diagnostics...');

        await api.validateAllSlots();
        testAllBtn.disabled = false;
        testAllBtn.textContent = '⚡ Test All 5 Keys';
        renderSlots();
        updateNavPill();

        if (window.toast) window.toast('5-Key Telemetry Diagnostics Complete!', 'success');
        if (window.Audio && window.Audio.success) window.Audio.success();
        if (window.NOVA && window.NOVA.speak) {
          const count = cfg.getConfiguredCount();
          window.NOVA.speak(`Diagnostics complete. ${count} of 5 mission telemetry keys are verified and ready.`);
        }
      };
    }

    // Wire DONKI modal shortcut button if present
    const donkiShortcut = document.getElementById('btnOpenApiKeyModalFromDonki');
    if (donkiShortcut) {
      donkiShortcut.onclick = () => {
        const dm = document.getElementById('donkiModal');
        if (dm) dm.classList.remove('on');
        openModal();
      };
    }

    // Close on backdrop or ESC
    const modalEl = document.getElementById('apiKeyModal');
    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Initial render & sync
    updateNavPill();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init5KeyManager);
  } else {
    init5KeyManager();
  }

  window.init5KeyManager = init5KeyManager;
})();
