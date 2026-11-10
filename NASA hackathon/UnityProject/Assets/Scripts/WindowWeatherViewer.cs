using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Renders dynamic space weather visible directly through the space station's observation windows.
    /// Simulates real-time NASA DONKI satellite observations: calm deep space vs. solar flares
    /// and coronal mass ejection plasma streams with operational radiation shielding stakes.
    /// </summary>
    public class WindowWeatherViewer : MonoBehaviour
    {
        public static WindowWeatherViewer Instance { get; private set; }

        [Header("Window Weather Effects")]
        public ParticleSystem solarFlareParticles;
        public Light solarAuroraLight;
        public bool isSolarStormActive = false;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            SetupSolarWeatherVFX();
        }

        private void SetupSolarWeatherVFX()
        {
            if (solarFlareParticles == null)
            {
                GameObject psObj = new GameObject("Window_Solar_Storm_VFX");
                psObj.transform.SetParent(transform);
                psObj.transform.position = new Vector3(0, 15, 60);

                solarFlareParticles = psObj.AddComponent<ParticleSystem>();
                var main = solarFlareParticles.main;
                main.startColor = new Color(1f, 0.35f, 0.2f, 0.8f);
                main.startSize = 1.5f;
                main.startSpeed = 8f;
                main.maxParticles = 300;
                main.playOnAwake = false;
            }

            if (solarAuroraLight == null)
            {
                GameObject lightObj = new GameObject("Solar_Aurora_Ambient_Light");
                lightObj.transform.SetParent(transform);
                lightObj.transform.position = new Vector3(0, 20, 0);

                solarAuroraLight = lightObj.AddComponent<Light>();
                solarAuroraLight.type = LightType.Directional;
                solarAuroraLight.color = new Color(1f, 0.4f, 0.2f);
                solarAuroraLight.intensity = 0f; // Hidden until flare hits
            }
        }

        public void SetSolarStormActive(bool active)
        {
            isSolarStormActive = active;
            if (active)
            {
                solarFlareParticles.Play();
                solarAuroraLight.intensity = 1.2f;
                Debug.Log("[WindowWeatherViewer] SDO Satellite Alert: CME Storm visible outside windows!");
            }
            else
            {
                solarFlareParticles.Stop();
                solarAuroraLight.intensity = 0f;
            }
        }
    }
}

