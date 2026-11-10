using UnityEngine;

namespace NASA.ProjectStarbridge
{
    public enum RoomType
    {
        StarterHab,      // Life support core, bunks, water loop
        SolarWingArm,    // Daylight power generator & Canadarm2 dust-brushing
        GymMedBay,       // Low-G workout (ARED) to prevent bone mineral loss
        WaterShelter,    // Floods walls with water during solar storms (DONKI)
        Greenhouse,      // BLiSS hydroponics (salads, O2, morale boost)
        RoverGarageMoxie,// Scoop rover maintenance, 3D printing & MOXIE CO2->O2
        FuelDepot        // Moon crater ice electrolysis -> liquid rocket fuel
    }

    /// <summary>
    /// Represents one of the 7 modular habitat rooms in the outpost.
    /// Handles power consumption, generation, eco-mode, and flooded radiation shielding.
    /// </summary>
    public class BaseModule : MonoBehaviour
    {
        [Header("Room Identity")]
        public RoomType roomType;
        public string roomName;
        public bool isBuilt = false;
        public bool isEcoMode = false;
        public bool isFloodedWithWater = false; // Radiation shielding for Room 4

        [Header("Power Specs")]
        public float powerDemand = 10f; // kW (negative if generator like Solar Wing)

        [Header("Crew Occupant")]
        public string assignedAstronautId = null;

        public float GetCurrentPowerDemand()
        {
            if (!isBuilt) return 0f;
            float multiplier = isEcoMode ? 0.4f : 1.0f;
            return powerDemand * multiplier;
        }

        public void SetEcoMode(bool eco)
        {
            isEcoMode = eco;
        }

        public bool ToggleWaterWallShield()
        {
            if (roomType != RoomType.WaterShelter || !isBuilt) return false;

            var res = ResourceManager.Instance;
            if (isFloodedWithWater)
            {
                // Drain back to water tanks
                isFloodedWithWater = false;
                res.ModifyWater(30f);
                return false;
            }
            else
            {
                // Flood walls with water
                if (res.Water >= 30f)
                {
                    res.ModifyWater(-30f);
                    isFloodedWithWater = true;
                    return true;
                }
                return false;
            }
        }
    }
}

