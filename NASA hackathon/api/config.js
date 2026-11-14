/**
 * ============================================================================
 * NASA JUNIOR ASTRONAUT MISSION TRAINER - 5-TIER API CONFIGURATION
 * ============================================================================
 * 
 * This file configures the 5 mission-critical API keys for your space mission:
 * 
 * 1. NASA_PRIMARY_KEY:
 *    Official NASA Open API key for DONKI Space Weather, APOD, Mars Rovers, NeoWs.
 *    👉 Free key at: https://api.nasa.gov/
 * 
 * 2. AI_ASSISTANT_KEY:
 *    Google Gemini or OpenAI key to power NOVA, your AI astronaut mentor.
 *    👉 Gemini: https://aistudio.google.com/ | OpenAI: https://platform.openai.com/
 * 
 * 3. NASA_SECONDARY_KEY:
 *    Secondary NASA API key for automatic failover, load balancing, or team pooling.
 *    👉 Free key at: https://api.nasa.gov/
 * 
 * 4. SATELLITE_TRACKER_KEY:
 *    N2YO / Space-Track API key for real-time ISS and satellite orbit tracking.
 *    👉 Free key at: https://www.n2yo.com/api/
 * 
 * 5. SPACEPORT_WEATHER_KEY:
 *    OpenWeatherMap key for live launchpad weather at Kennedy Space Center (Pad 39B).
 *    👉 Free key at: https://openweathermap.org/api
 * 
 * NOTE: You can paste your keys below OR configure them interactively in-game 
 * using the "🔑 5-KEY COMMAND CENTER" modal in the top navigation bar.
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

  const STORAGE_PREFIX = 'nasa_mission_trainer_key_';

  const API_CONFIG = {
    // ========================================================================
    // 🔑 THE 5 MISSION API KEYS:
    // ========================================================================
    KEYS: {
      // 1. Primary NASA Open API Key
      NASA_PRIMARY_KEY: "DEMO_KEY",

      // 2. AI Conversational Engine (Google Gemini or OpenAI for NOVA Assistant)
      AI_ASSISTANT_KEY: "",

      // 3. Secondary NASA Key / Failover Pool (Team Load Balancing)
      NASA_SECONDARY_KEY: "",

      // 4. Satellite & Space Station Orbit Tracker (N2YO / Space-Track)
      SATELLITE_TRACKER_KEY: "",

      // 5. Spaceport & Launch Weather (OpenWeatherMap for Kennedy Space Center)
      SPACEPORT_WEATHER_KEY: ""
    },

    // Optional Key Pool for team load-balancing across multiple NASA keys
    NASA_KEY_POOL: [
      // "KEY_1", "KEY_2", "KEY_3", "KEY_4", "KEY_5"
    ],

    // Metadata describing each of the 5 keys
    SLOTS: [
      {
        id: 'NASA_PRIMARY_KEY',
        name: 'Key 1: NASA Open Data (Primary)',
        provider: 'NASA Open APIs',
        icon: '🛰️',
        desc: 'DONKI Solar Weather, Mars Rover Photos, APOD & Asteroids',
        signupUrl: 'https://api.nasa.gov/',
        rateLimit: '1,000 requests/hr (Personal) · 30/hr (DEMO_KEY)',
        placeholder: 'Enter NASA API Key (e.g. AbC...123)',
        serviceType: 'nasa'
      },
      {
        id: 'AI_ASSISTANT_KEY',
        name: 'Key 2: AI Mission Specialist',
        provider: 'Google Gemini / OpenAI',
        icon: '🤖',
        desc: 'Powers NOVA AI for live cadet mentoring, speech & science Q&A',
        signupUrl: 'https://aistudio.google.com/',
        rateLimit: 'Free tier / Pay-as-you-go',
        placeholder: 'Enter Gemini (AIza...) or OpenAI (sk-...) Key',
        serviceType: 'ai'
      },
      {
        id: 'NASA_SECONDARY_KEY',
        name: 'Key 3: NASA Telemetry Failover',
        provider: 'NASA Open APIs (Backup)',
        icon: '☀️',
        desc: 'High-frequency telemetry pool & automated rate-limit failover',
        signupUrl: 'https://api.nasa.gov/',
        rateLimit: '1,000 requests/hr',
        placeholder: 'Enter 2nd NASA Key for load balancing',
        serviceType: 'nasa_backup'
      },
      {
        id: 'SATELLITE_TRACKER_KEY',
        name: 'Key 4: Satellite & Orbit Tracker',
        provider: 'N2YO / Space-Track / ISS',
        icon: '📡',
        desc: 'Real-time orbital tracking for ISS, Artemis Orion & Gateway',
        signupUrl: 'https://www.n2yo.com/api/',
        rateLimit: '1,000 requests/day (Free tier)',
        placeholder: 'Enter N2YO API Key',
        serviceType: 'satellite'
      },
      {
        id: 'SPACEPORT_WEATHER_KEY',
        name: 'Key 5: Launchpad & Spaceport Weather',
        provider: 'OpenWeatherMap',
        icon: '🚀',
        desc: 'Kennedy Space Center (Pad 39B) atmospheric launch telemetry',
        signupUrl: 'https://openweathermap.org/api',
        rateLimit: '60 calls/minute (Free tier)',
        placeholder: 'Enter OpenWeatherMap API Key',
        serviceType: 'weather'
      }
    ],

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
      EPIC_NATURAL: "https://api.nasa.gov/EPIC/api/natural",
      ISS_LOCATION: "https://api.wheretheiss.at/v1/satellites/25544",
      KSC_WEATHER: "https://api.openweathermap.org/data/2.5/weather?lat=28.5729&lon=-80.6490&units=metric",
      GEMINI_BASE: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    },

    /**
     * Get a specific key by slot ID (checks localStorage first, then KEYS object)
     */
    getKey: function (slotId) {
      if (typeof localStorage !== 'undefined') {
        try {
          const stored = localStorage.getItem(STORAGE_PREFIX + slotId);
          if (stored && stored.trim()) return stored.trim();
        } catch (e) {}
      }

      return (this.KEYS && this.KEYS[slotId]) ? this.KEYS[slotId].trim() : "";
    },

    /**
     * Set a specific key by slot ID and persist to localStorage
     */
    setKey: function (slotId, value) {
      const sanitized = (value || '').trim();
      if (this.KEYS && slotId in this.KEYS) {
        this.KEYS[slotId] = sanitized;
      }
      if (typeof localStorage !== 'undefined') {
        try {
          if (sanitized && sanitized !== 'DEMO_KEY') {
            localStorage.setItem(STORAGE_PREFIX + slotId, sanitized);
          } else {
            localStorage.removeItem(STORAGE_PREFIX + slotId);
          }
        } catch (e) {
          console.warn('Could not persist key to localStorage:', e);
        }
      }
      return sanitized;
    },

    /**
     * Get primary NASA key (with DEMO_KEY fallback)
     */
    getNASAKey: function () {
      const k = this.getKey('NASA_PRIMARY_KEY');
      return (k && k !== 'DEMO_KEY') ? k : (this.KEYS.NASA_PRIMARY_KEY || 'DEMO_KEY');
    },

    /**
     * Get active NASA key pool for rotation
     */
    getNASAPool: function () {
      const pool = [];
      const primary = this.getNASAKey();
      if (primary && primary !== 'DEMO_KEY') pool.push(primary);
      const secondary = this.getKey('NASA_SECONDARY_KEY');
      if (secondary && secondary !== 'DEMO_KEY') pool.push(secondary);
      if (Array.isArray(this.NASA_KEY_POOL)) {
        this.NASA_KEY_POOL.forEach(k => {
          if (k && !pool.includes(k) && k !== 'DEMO_KEY') pool.push(k);
        });
      }
      if (pool.length === 0) pool.push('DEMO_KEY');
      return pool;
    },

    /**
     * Check if a specific slot has a valid custom key
     */
    hasKey: function (slotId) {
      const val = this.getKey(slotId);
      return Boolean(val && val !== 'DEMO_KEY' && val.length >= 8);
    },

    /**
     * Count how many of the 5 keys are configured
     */
    getConfiguredCount: function () {
      let count = 0;
      this.SLOTS.forEach(slot => {
        if (this.hasKey(slot.id)) count++;
      });
      return count;
    }
  };

  return API_CONFIG;
});
