using System;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Master GameManager governing world stages, Sol / Day cycles, and game flow.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("State")]
        public int currentWorldIndex = 0; // 0: Earth, 1: Orbit, 2: Moon, 3: Mars
        public int currentSol = 1;
        public bool isNight = false;

        public event Action<int, bool> OnSolAdvanced;
        public event Action<int> OnWorldChanged;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void AdvanceSol()
        {
            currentSol++;
            isNight = (currentSol % 2 == 0);

            bool isMars = (currentWorldIndex == 3);
            BaseGridManager.Instance.ProcessDailyLifeSupport(isNight, isMars);

            OnSolAdvanced?.Invoke(currentSol, isNight);

            // Check emergency triggers on specific Sols
            if (currentSol == 4 && currentWorldIndex == 2)
            {
                TriggerLunarNightFreeze();
            }
            else if (currentSol == 9 && currentWorldIndex == 3)
            {
                TriggerSol214DustStorm();
            }
        }

        public void SetWorld(int worldIdx)
        {
            currentWorldIndex = Mathf.Clamp(worldIdx, 0, 3);
            OnWorldChanged?.Invoke(currentWorldIndex);
        }

        private void TriggerLunarNightFreeze()
        {
            var ev = new EmergencyEvent
            {
                title = "14-Day Lunar Night Freezing Shadow (-208°F)",
                description = "Sun has dropped below Shackleton Crater rim! Habitat heaters require immediate power.",
                baseDuration = 10f
            };
            ev.choices.Add(new EmergencyChoice
            {
                title = "Switch Rooms to Eco-Mode",
                costText = "Saves 20 kW power",
                onChosen = () => { /* Switch eco */ }
            });
            EmergencyEventManager.Instance.TriggerEmergency(ev);
        }

        private void TriggerSol214DustStorm()
        {
            var ev = new EmergencyEvent
            {
                title = "Sol 214 Mars Dust Storm Approaching!",
                description = "Buzz the Drone detects a 300-ft red dust wall rolling toward Jezero Crater! Earth is 18 minutes away!",
                baseDuration = 10f
            };
            ev.choices.Add(new EmergencyChoice
            {
                title = "Fold Solar Arrays Immediately",
                costText = "0 parts lost, -25 power tonight",
                onChosen = () => { ResourceManager.Instance.ModifyPower(-25f); }
            });
            EmergencyEventManager.Instance.TriggerEmergency(ev);
        }
    }
}

