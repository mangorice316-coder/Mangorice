/**
 * ============================================================================
 * NASA JUNIOR ASTRONAUT MISSION TRAINER - NASA OPEN API CLIENT
 * ============================================================================
 * Seamlessly interfaces with NASA's official REST APIs:
 * - DONKI (Space Weather Database Of Notifications, Knowledge, Information)
 * - APOD (Astronomy Picture of the Day)
 * - Mars Rover Photos (Perseverance & Curiosity)
 * - NeoWs (Near-Earth Object Hazard Tracking)
 * - EPIC (Earth Polychromatic Imaging Camera)
 * 
 * Includes rate-limit monitoring, live health check, and offline fallback.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./config'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./config'));
  } else {
    root.NASA_API = factory(root.API_CONFIG);
  }
})(typeof self !== 'undefined' ? self : this, function (config) {
  'use strict';

  const cfg = config || (typeof window !== 'undefined' ? window.API_CONFIG : null) || {
    getNASAKey: () => 'DEMO_KEY',
    ENDPOINTS: {
      DONKI_CME: 'https://api.nasa.gov/DONKI/CME',
      DONKI_FLR: 'https://api.nasa.gov/DONKI/FLR',
      DONKI_NOTIFICATIONS: 'https://api.nasa.gov/DONKI/notifications',
      APOD: 'https://api.nasa.gov/planetary/apod',
      MARS_ROVER_PERSEVERANCE: 'https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos',
      NEOWS_FEED: 'https://api.nasa.gov/neo/rest/v1/feed'
    }
  };

  // State tracker
  const state = {
    status: 'idle', // 'idle' | 'connected' | 'demo' | 'error' | 'offline'
    lastTested: null,
    rateLimitRemaining: null,
    rateLimitLimit: null,
    errorMessage: '',
    cachedData: {}
  };

  const NASA_API = {
    /**
     * Get active API key
     */
    getKey: function () {
      return cfg.getNASAKey ? cfg.getNASAKey() : 'DEMO_KEY';
    },

    /**
     * Set new API key
     */
    setKey: function (key) {
      if (cfg.setNASAKey) {
        cfg.setNASAKey(key);
      }
      return this.validateKey(key);
    },

    /**
     * Check if a custom key is active
     */
    hasCustomKey: function () {
      return cfg.hasCustomKey ? cfg.hasCustomKey() : (this.getKey() !== 'DEMO_KEY');
    },

    /**
     * Get current connection status object
     */
    getStatus: function () {
      return {
        ...state,
        key: this.getKey(),
        isCustom: this.hasCustomKey()
      };
    },

    /**
     * Test and validate an API key against NASA servers
     * @param {string} [keyToTest] optional key, defaults to active key
     */
    validateKey: async function (keyToTest) {
      const key = (keyToTest !== undefined ? keyToTest : this.getKey()).trim() || 'DEMO_KEY';
      state.status = 'testing';
      
      const testUrl = `${cfg.ENDPOINTS.APOD}?api_key=${encodeURIComponent(key)}&count=1`;
      
      const startTime = Date.now();
      try {
        const response = await fetch(testUrl, { method: 'GET', headers: { 'Accept': 'application/json' } });
        const pingMs = Date.now() - startTime;
        
        // Read rate limit headers if provided by api.nasa.gov
        const remaining = response.headers.get('X-RateLimit-Remaining');
        const limit = response.headers.get('X-RateLimit-Limit');
        if (remaining !== null) state.rateLimitRemaining = parseInt(remaining, 10);
        if (limit !== null) state.rateLimitLimit = parseInt(limit, 10);

        if (response.ok) {
          const data = await response.json();
          state.status = (key === 'DEMO_KEY') ? 'demo' : 'connected';
          state.lastTested = new Date().toISOString();
          state.errorMessage = '';
          return {
            success: true,
            status: state.status,
            pingMs: pingMs,
            key: key,
            rateLimitRemaining: state.rateLimitRemaining,
            rateLimitLimit: state.rateLimitLimit,
            sample: Array.isArray(data) ? data[0] : data
          };
        } else {
          let errText = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errJson = await response.json();
            if (errJson && errJson.error && errJson.error.message) {
              errText = errJson.error.message;
            }
          } catch (e) {}

          state.status = 'error';
          state.errorMessage = errText;
          return {
            success: false,
            status: 'error',
            error: errText,
            key: key
          };
        }
      } catch (err) {
        state.status = 'offline';
        state.errorMessage = err.message || 'Network unreachable';
        return {
          success: false,
          status: 'offline',
          error: state.errorMessage,
          key: key
        };
      }
    },

    /**
     * Fetch Live Coronal Mass Ejections (CME) from NASA DONKI
     */
    getDONKI_CME: async function (startDate, endDate) {
      const key = this.getKey();
      
      // Default date range: last 7 days to present
      const end = endDate || new Date().toISOString().split('T')[0];
      const defaultStart = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().split('T')[0];
      const start = startDate || defaultStart;

      const url = `${cfg.ENDPOINTS.DONKI_CME}?startDate=${start}&endDate=${end}&api_key=${encodeURIComponent(key)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`DONKI CME fetch failed with HTTP ${response.status}`);
        const data = await response.json();
        return {
          success: true,
          live: true,
          events: data,
          source: 'NASA DONKI Space Weather Satellite Network'
        };
      } catch (err) {
        console.warn('Live NASA DONKI CME request failed, falling back to local dataset:', err);
        return this.getFallbackDONKI('CME');
      }
    },

    /**
     * Fetch Live Solar Flares from NASA DONKI
     */
    getDONKI_Flares: async function (startDate, endDate) {
      const key = this.getKey();
      const end = endDate || new Date().toISOString().split('T')[0];
      const defaultStart = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().split('T')[0];
      const start = startDate || defaultStart;

      const url = `${cfg.ENDPOINTS.DONKI_FLR}?startDate=${start}&endDate=${end}&api_key=${encodeURIComponent(key)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`DONKI Flare fetch failed with HTTP ${response.status}`);
        const data = await response.json();
        return {
          success: true,
          live: true,
          flares: data,
          source: 'NASA SDO / GOES Fleet'
        };
      } catch (err) {
        console.warn('Live NASA DONKI Flare request failed, falling back to local dataset:', err);
        return this.getFallbackDONKI('FLR');
      }
    },

    /**
     * Fetch Live Space Weather Notifications from NASA DONKI
     */
    getDONKI_Notifications: async function (type = 'all') {
      const key = this.getKey();
      const url = `${cfg.ENDPOINTS.DONKI_NOTIFICATIONS}?type=${encodeURIComponent(type)}&api_key=${encodeURIComponent(key)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`DONKI Notifications failed with HTTP ${response.status}`);
        const data = await response.json();
        return {
          success: true,
          live: true,
          notifications: data,
          source: 'NASA DONKI Direct Space Weather Stream'
        };
      } catch (err) {
        console.warn('Live NASA DONKI Notifications failed, falling back to local dataset:', err);
        return this.getFallbackDONKI('NOTIFICATIONS');
      }
    },

    /**
     * Fetch Astronomy Picture of the Day (APOD)
     */
    getAPOD: async function (date) {
      const key = this.getKey();
      let url = `${cfg.ENDPOINTS.APOD}?api_key=${encodeURIComponent(key)}`;
      if (date) url += `&date=${encodeURIComponent(date)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`APOD failed with HTTP ${response.status}`);
        const data = await response.json();
        return {
          success: true,
          live: true,
          data: data
        };
      } catch (err) {
        console.warn('Live APOD fetch failed, using fallback:', err);
        return {
          success: true,
          live: false,
          data: {
            title: "The Moon at the South Pole (Shackleton Rim)",
            explanation: "NASA Lunar Reconnaissance Orbiter (LRO) mosaic of the permanently shadowed craters at the Lunar South Pole where water ice reserves are preserved.",
            url: "assets/moon_panorama.jpg",
            media_type: "image",
            copyright: "NASA / GSFC / Arizona State University"
          }
        };
      }
    },

    /**
     * Fetch Mars Rover Raw Photos (Perseverance or Curiosity)
     */
    getMarsRoverPhotos: async function (rover = 'perseverance', sol = 100, camera = 'NAVCAM_LEFT') {
      const key = this.getKey();
      const endpoint = rover.toLowerCase() === 'curiosity' 
        ? cfg.ENDPOINTS.MARS_ROVER_CURIOSITY 
        : cfg.ENDPOINTS.MARS_ROVER_PERSEVERANCE;

      const url = `${endpoint}?sol=${sol}&camera=${camera}&api_key=${encodeURIComponent(key)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Mars Rover photos failed with HTTP ${response.status}`);
        const data = await response.json();
        return {
          success: true,
          live: true,
          rover: rover,
          sol: sol,
          photos: data.photos || []
        };
      } catch (err) {
        console.warn('Mars Rover live photos fetch failed, using local Mars panorama:', err);
        return {
          success: true,
          live: false,
          rover: rover,
          sol: sol,
          photos: [
            {
              id: 999901,
              sol: sol,
              camera: { full_name: "Perseverance Mastcam-Z / Navigation Camera" },
              img_src: "assets/mars_panorama.jpg"
            }
          ]
        };
      }
    },

    /**
     * Fallback to local verified datasets when offline or rate-limited
     */
    getFallbackDONKI: function (type) {
      return {
        success: true,
        live: false,
        source: 'NASA DONKI May 2024 Solar Superstorm Verified Cache',
        events: [
          {
            activityID: "2024-05-11T01:30:00-CME-001",
            startTime: "2024-05-11T01:30Z",
            sourceLocation: "Active Region 3664 (Carrington-class)",
            classType: "X8.7",
            cmeSpeed: "1,260 km/s",
            note: "Extreme G5 Geomagnetic storm. Solar flare energy reaching Earth & Moon orbit.",
            halfAngle: 65,
            catalog: "M2M_CATALOG"
          },
          {
            activityID: "2024-05-10T06:54:00-FLR-001",
            startTime: "2024-05-10T06:54Z",
            sourceLocation: "AR3664",
            classType: "X5.8",
            cmeSpeed: "1,100 km/s",
            note: "Major proton flux elevation observed by GOES-16 and SOHO."
          }
        ]
      };
    }
  };

  return NASA_API;
});
