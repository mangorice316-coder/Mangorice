using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Manages the layout, construction, and life support loops of the 7 modular rooms.
    /// </summary>
    public class BaseGridManager : MonoBehaviour
    {
        public static BaseGridManager Instance { get; private set; }

        [SerializeField] private List<BaseModule> rooms = new List<BaseModule>();

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public bool BuildRoom(RoomType type)
        {
            var module = rooms.Find(r => r.roomType == type);
            if (module == null || module.isBuilt) return false;

            int cost = GetRoomCost(type);
            
            // Check Engineer Leo bonus: -1 spare part cost
            if (CrewManager.Instance != null && CrewManager.Instance.HasActiveCrew("leo"))
            {
                cost = Mathf.Max(1, cost - 1);
            }

            if (ResourceManager.Instance.ConsumeSpareParts(cost))
            {
                module.isBuilt = true;
                return true;
            }
            return false;
        }

        public void ProcessDailyLifeSupport(bool isNight, bool isMars)
        {
            var res = ResourceManager.Instance;
            float netPower = 0f;

            foreach (var r in rooms)
            {
                if (!r.isBuilt) continue;

                if (r.roomType == RoomType.SolarWingArm)
                {
                    if (!isNight) netPower += 55f;
                }
                else
                {
                    netPower -= r.GetCurrentPowerDemand();
                }

                // Room benefits
                if (r.roomType == RoomType.StarterHab)
                {
                    res.ModifyOxygen(15f);
                    res.ModifyWater(10f);
                }
                else if (r.roomType == RoomType.Greenhouse && !r.isEcoMode)
                {
                    float crops = (r.assignedAstronautId == "priya") ? 20f : 10f;
                    res.ModifyFood(crops);
                    res.ModifyOxygen(8f);
                    res.ModifyMorale(10f);
                }
                else if (r.roomType == RoomType.RoverGarageMoxie && !r.isEcoMode)
                {
                    if (isMars) res.ModifyOxygen(25f);
                    res.AddSpareParts(1);
                }
                else if (r.roomType == RoomType.FuelDepot && !r.isEcoMode)
                {
                    if (res.Water >= 15f)
                    {
                        res.ModifyWater(-15f);
                        res.ModifyRocketFuel(20f);
                    }
                }
            }

            res.ModifyPower(netPower);
        }

        private int GetRoomCost(RoomType type)
        {
            switch (type)
            {
                case RoomType.StarterHab: return 0;
                case RoomType.SolarWingArm: return 2;
                case RoomType.GymMedBay: return 3;
                case RoomType.WaterShelter: return 4;
                case RoomType.Greenhouse: return 5;
                case RoomType.RoverGarageMoxie: return 6;
                case RoomType.FuelDepot: return 8;
                default: return 3;
            }
        }
    }
}

