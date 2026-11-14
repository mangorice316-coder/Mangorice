/**
 * ============================================================================
 * NASA JUNIOR ASTRONAUT MISSION TRAINER - API CONFIGURATION
 * ============================================================================
 * 
 * Instructions:
 * 1. Get your free official NASA API Key in 30 seconds at:
 *    👉 https://api.nasa.gov/
 * 
 * 2. Paste your API key into the NASA_API_KEY field below:
 *    Example: NASA_API_KEY: "DEMO_KEY" -> NASA_API_KEY: "aBcD1234eFgH5678..."
 * 
 * 3. Save this file. The Mission Trainer will immediately use your key for:
 *    - Real-time DONKI Space Weather (Coronal Mass Ejections, Solar Flares)
 *    - APOD (Astronomy Picture of the Day from Hubble / James Webb)
 *    - Mars Perseverance & Curiosity Rover raw camera feeds
 *    - Near-Earth Asteroid tracking (NeoWs)
 *    - Earth Polychromatic Imaging Camera (EPIC) from DSCOVR
 * 
 * You can also enter or change your API key directly inside the game UI
 * via the "🔑 NASA API KEY" command center modal.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.API_CONFIG = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'nasa_mission_trainer_api_key';
  const AI_STORAGE_KEY = 'mission_trainer_ai_key';

  // Default configuration
  const API_CONFIG = {
    // ========================================================================
    // 👉 PASTE YOUR NASA API KEY HERE (Replace "DEMO_KEY"):
    // ========================================================================
    NASA_API_KEY: "DEMO_KEY",

    // Optional: AI Assistant Key (OpenAI / Gemini for NOVA AI live voice/chat)
    AI_API_KEY: "",

    // Service Endpoints
    ENDPOINTS: {
      NASA_BASE: "https://api.nasa.gov",
      DONKI_CME: "https://api.nasa.gov/DONKI/CME",
      DONKI_FLR: "https://api.nasa.gov/DONKI/FLR",
      DONKI_NOTIFICATIONS: "https://api.nasa.gov/DONKI/notifications",
      APOD: "https://api.nasa.gov/planetary/apod",
      MARS_ROVER_PERSEVERANCE: "https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos",
      MARS_ROVER_CURIOSITY: "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos",
      NEOWS_FEED: "https://api.nasa.gov/neo/rest/v1/feed",
      EPIC_NATURAL: "https://api.nasa.gov/EPIC/api/natural"
    },

    // Quota limits
    LIMITS: {
      DEMO_KEY_HOURLY: 30,
      PERSONAL_KEY_HOURLY: 1000
    },

    /**
     * Get the active NASA API key (checks localStorage first, then file config)
     */
    getNASAKey: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && stored.trim() && stored !== 'DEMO_KEY') {
          return stored.trim();
        }
      } catch (e) {
        // localStorage not available
      }
      return this.NASA_API_KEY || "DEMO_KEY";
    },

    /**
     * Set and persist the NASA API key
     */
    setNASAKey: function (newKey) {
      const sanitized = (newKey || '').trim();
      this.NASA_API_KEY = sanitized || "DEMO_KEY";
      try {
        if (sanitized && sanitized !== 'DEMO_KEY') {
          localStorage.setItem(STORAGE_KEY, sanitized);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.warn('Could not persist API key to localStorage', e);
      }
      return this.getNASAKey();
    },

    /**
     * Check if a custom key (not DEMO_KEY) is in use
     */
    hasCustomKey: function () {
      const key = this.getNASAKey();
      return Boolean(key && key !== 'DEMO_KEY' && key.length >= 20);
    },

    /**
     * Get the optional AI key
     */
    getAIKey: function () {
      try {
        const stored = localStorage.getItem(AI_STORAGE_KEY);
        if (stored && stored.trim()) return stored.trim();
      } catch (e) {}
      return this.AI_API_KEY || "";
    },

    /**
     * Set the optional AI key
     */
    setAIKey: function (key) {
      const sanitized = (key || '').trim();
      this.AI_API_KEY = sanitized;
      try {
        if (sanitized) localStorage.setItem(AI_STORAGE_KEY, sanitized);
        else localStorage.removeItem(AI_STORAGE_KEY);
      } catch (e) {}
      return this.AI_API_KEY;
    }
  };

  return API_CONFIG;
});
