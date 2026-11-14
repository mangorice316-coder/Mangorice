using System;
using UnityEngine;

namespace NASA.ProjectStarbridge.API
{
    /// <summary>
    /// Central API Configuration for Unity C# Subsystems.
    /// Configure your NASA Open API key here or in NASADataService.
    /// </summary>
    public static class APIConfig
    {
        // ====================================================================
        // 👉 PASTE YOUR NASA API KEY HERE (Replace "DEMO_KEY"):
        // ====================================================================
        public static string NASA_API_KEY = "DEMO_KEY";

        public const string NASA_BASE_URL = "https://api.nasa.gov";
        public const string DONKI_NOTIFICATIONS_URL = "https://api.nasa.gov/DONKI/notifications";
        public const string DONKI_CME_URL = "https://api.nasa.gov/DONKI/CME";
        public const string DONKI_FLR_URL = "https://api.nasa.gov/DONKI/FLR";
        public const string APOD_URL = "https://api.nasa.gov/planetary/apod";

        private const string PREFS_KEY = "NASA_API_KEY_PREF";

        /// <summary>
        /// Retrieves the active NASA API key (checks PlayerPrefs, then fallback)
        /// </summary>
        public static string GetActiveKey()
        {
            if (PlayerPrefs.HasKey(PREFS_KEY))
            {
                string stored = PlayerPrefs.GetString(PREFS_KEY);
                if (!string.IsNullOrEmpty(stored) && stored != "DEMO_KEY")
                {
                    return stored;
                }
            }
            return string.IsNullOrEmpty(NASA_API_KEY) ? "DEMO_KEY" : NASA_API_KEY;
        }

        /// <summary>
        /// Saves a new API key to PlayerPrefs
        /// </summary>
        public static void SetActiveKey(string key)
        {
            string sanitized = (key ?? "").Trim();
            if (!string.IsNullOrEmpty(sanitized) && sanitized != "DEMO_KEY")
            {
                PlayerPrefs.SetString(PREFS_KEY, sanitized);
                PlayerPrefs.Save();
            }
            else
            {
                PlayerPrefs.DeleteKey(PREFS_KEY);
                PlayerPrefs.Save();
            }
        }

        /// <summary>
        /// Formats full URL with active key
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
