using System;
using UnityEngine;

namespace NASA.ProjectStarbridge.API
{
    /// <summary>
    /// Central 5-Tier API Configuration for Unity C# Subsystems.
    /// Manages the 5 mission-critical keys for NASA data, AI, Satellite tracking, and Weather.
    /// </summary>
    public static class APIConfig
    {
        // ====================================================================
        // 🔑 THE 5 MISSION API KEYS:
        // ====================================================================
        
        // 1. Primary NASA Open API Key
        public static string NASA_PRIMARY_KEY = "DEMO_KEY";

        // 2. AI Intelligence Engine (Gemini / OpenAI for NOVA Assistant)
        public static string AI_ASSISTANT_KEY = "";

        // 3. Secondary NASA Key / Failover Pool
        public static string NASA_SECONDARY_KEY = "";

        // 4. Satellite & Orbit Tracker (N2YO / Space-Track)
        public static string SATELLITE_TRACKER_KEY = "";

        // 5. Spaceport & Launch Weather (OpenWeatherMap)
        public static string SPACEPORT_WEATHER_KEY = "";

        // Endpoints
        public const string NASA_BASE_URL = "https://api.nasa.gov";
        public const string DONKI_NOTIFICATIONS_URL = "https://api.nasa.gov/DONKI/notifications";
        public const string DONKI_CME_URL = "https://api.nasa.gov/DONKI/CME";
        public const string DONKI_FLR_URL = "https://api.nasa.gov/DONKI/FLR";
        public const string APOD_URL = "https://api.nasa.gov/planetary/apod";
        public const string ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";

        /// <summary>
        /// Retrieves the active NASA API key
        /// </summary>
        public static string GetActiveKey()
        {
            if (PlayerPrefs.HasKey("KEY_NASA_PRIMARY"))
            {
                string stored = PlayerPrefs.GetString("KEY_NASA_PRIMARY");
                if (!string.IsNullOrEmpty(stored) && stored != "DEMO_KEY")
                {
                    return stored;
                }
            }
            return string.IsNullOrEmpty(NASA_PRIMARY_KEY) ? "DEMO_KEY" : NASA_PRIMARY_KEY;
        }

        public static string GetAIKey()
        {
            return PlayerPrefs.GetString("KEY_AI_ASSISTANT", AI_ASSISTANT_KEY);
        }

        public static string GetSatelliteKey()
        {
            return PlayerPrefs.GetString("KEY_SATELLITE", SATELLITE_TRACKER_KEY);
        }

        public static string GetWeatherKey()
        {
            return PlayerPrefs.GetString("KEY_WEATHER", SPACEPORT_WEATHER_KEY);
        }

        /// <summary>
        /// Formats full NASA URL with active key
        /// </summary>
        public static string BuildUrl(string endpoint, string queryParams = "")
        {
            string key = GetActiveKey();
            string separator = endpoint.Contains("?") ? "&" : "?";
            string query = string.IsNullOrEmpty(queryParams) ? "" : $"{queryParams}&";
            return $"{endpoint}{separator}{query}api_key={Uri.EscapeDataString(key)}";
        }
    }
}
