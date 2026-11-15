// NASA JUNIOR ASTRONAUT MISSION TRAINER - WEB AUDIO API SOUND ENGINE
const SoundEngine = (() => {
  let ctx = null;
  let isMuted = false;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;
  let ambientOsc = null;

  function init() {
    if (ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();

      masterGain = ctx.createGain();
      masterGain.gain.value = 0.8;
      masterGain.connect(ctx.destination);

      musicGain = ctx.createGain();
      musicGain.gain.value = 0.35;
      musicGain.connect(masterGain);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.7;
      sfxGain.connect(masterGain);

      startAmbience();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  function ensureContext() {
    if (!ctx) init();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  function startAmbience() {
    if (!ctx || ambientOsc) return;
    try {
      // Gentle cosmic sub-harmonic drone (48Hz and 72Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.value = 160;

      osc1.type = 'sine';
      osc1.frequency.value = 48; // Deep space G

      osc2.type = 'triangle';
      osc2.frequency.value = 72; // Warm 5th

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(musicGain);

      osc1.start();
      osc2.start();
      ambientOsc = [osc1, osc2];
    } catch (e) {
      // Non-fatal
    }
  }

  // Sci-fi Click
  function click() {
    ensureContext();
    if (!ctx || isMuted) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

    g.gain.setValueAtTime(0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(g);
    g.connect(sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.055);
  }

  // Subtle Hover Tone
  function hover() {
    ensureContext();
    if (!ctx || isMuted) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);

    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(g);
    g.connect(sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  }

  // Thruster Roar (Filtered White Noise)
  let thrusterNode = null;
  function startThruster() {
    ensureContext();
    if (!ctx || isMuted || thrusterNode) return;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 280;
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    noise.start();
    thrusterNode = { noise, gain };
  }

  function stopThruster() {
    if (!thrusterNode || !ctx) return;
    try {
      thrusterNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      setTimeout(() => {
        if (thrusterNode) {
          thrusterNode.noise.stop();
          thrusterNode = null;
        }
      }, 160);
    } catch (e) {
      thrusterNode = null;
    }
  }

  // Mission Start Sweep
  function missionStart() {
    ensureContext();
    if (!ctx || isMuted) return;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      g.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      g.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(g);
      g.connect(sfxGain);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
    });
  }

  // Achievement Fanfare / Success
  function success() {
    ensureContext();
    if (!ctx || isMuted) return;
    const chord = [392.00, 493.88, 587.33, 783.99]; // G B D G
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      g.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.05);
      g.gain.linearRampToValueAtTime(0.28, ctx.currentTime + idx * 0.05 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.9);

      osc.connect(g);
      g.connect(sfxGain);
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.95);
    });
  }

  // Alert / Warning Klaxon
  function alert() {
    ensureContext();
    if (!ctx || isMuted) return;
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      const t = ctx.currentTime + i * 0.35;
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.linearRampToValueAtTime(420, t + 0.28);

      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(g);
      g.connect(sfxGain);
      osc.start(t);
      osc.stop(t + 0.32);
    }
  }

  // Friendly NOVA Assistant Ping
  function novaChime() {
    ensureContext();
    if (!ctx || isMuted) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.12); // E6

    g.gain.setValueAtTime(0.22, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(g);
    g.connect(sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (masterGain) {
      masterGain.gain.value = isMuted ? 0 : 0.8;
    }
    return isMuted;
  }

  return {
    init,
    ensureContext,
    click,
    hover,
    startThruster,
    stopThruster,
    missionStart,
    success,
    alert,
    novaChime,
    toggleMute,
    get isMuted() { return isMuted; }
  };
})();

// Auto-unlock audio on first user touch/click
window.addEventListener('click', () => SoundEngine.ensureContext(), { once: true });
window.addEventListener('keydown', () => SoundEngine.ensureContext(), { once: true });
