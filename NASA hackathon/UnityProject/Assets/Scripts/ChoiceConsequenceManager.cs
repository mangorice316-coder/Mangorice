using System;
using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    [Serializable]
    public class ConsequenceChoice
    {
        public string id;
        public string title;
        public string description;
        public string promptText;
        public string optionATitle;
        public string optionADesc;
        public string optionBTitle;
        public string optionBDesc;
    }

    /// <summary>
    /// Governs player choices that create permanent, tangible ripple effects
    /// throughout the station, crew morale, visual base state, and future missions.
    /// </summary>
    public class ChoiceConsequenceManager : MonoBehaviour
    {
        public static ChoiceConsequenceManager Instance { get; private set; }

        [Header("Choice History")]
        public Dictionary<string, string> choiceHistory = new Dictionary<string, string>();

        [Header("Physical Station References to Modify")]
        public GameObject greenhouseLushPlants;
        public GameObject greenhouseWitheredPlants;
        public GameObject exteriorCommsDishNormal;
        public GameObject exteriorCommsDishDamagedSparking;
        public GameObject roverNormalBattery;
        public GameObject roverSmokingBattery;

        public event Action<string, string> OnChoiceMade;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        /// <summary>
        /// Applies a consequential decision and triggers immediate physical changes on the station.
        /// </summary>
        public void MakeDecision(string dilemmaId, bool pickedOptionA)
        {
            string chosenKey = pickedOptionA ? "OPTION_A" : "OPTION_B";
            choiceHistory[dilemmaId] = chosenKey;

            var res = ResourceManager.Instance;

            // Dilemma 1: Solar Flare Power Routing (Greenhouse vs Exterior Shield)
            if (dilemmaId == "solar_flare_power")
            {
                if (pickedOptionA) // Route to Greenhouse
                {
                    // Visual changes: Greenhouse stays lush green, but exterior comms dish fries!
                    if (greenhouseLushPlants) greenhouseLushPlants.SetActive(true);
                    if (greenhouseWitheredPlants) greenhouseWitheredPlants.SetActive(false);
                    if (exteriorCommsDishNormal) exteriorCommsDishNormal.SetActive(false);
                    if (exteriorCommsDishDamagedSparking) exteriorCommsDishDamagedSparking.SetActive(true);

                    res.ModifyMorale(20f);
                    res.ModifyFood(25f);
                    Debug.Log("[Choice] Routed power to Greenhouse! Crops saved, but exterior comms dish fried. Spacewalk repair required!");
                }
                else // Route to Shielding
                {
                    // Visual changes: Comms dish stays intact, but crops wilt!
                    if (greenhouseLushPlants) greenhouseLushPlants.SetActive(false);
                    if (greenhouseWitheredPlants) greenhouseWitheredPlants.SetActive(true);
                    if (exteriorCommsDishNormal) exteriorCommsDishNormal.SetActive(true);
                    if (exteriorCommsDishDamagedSparking) exteriorCommsDishDamagedSparking.SetActive(false);

                    res.ModifyFood(-20f);
                    res.ModifyMorale(-15f);
                    Debug.Log("[Choice] Shielded the station! Crew protected, but greenhouse crops withered into compost.");
                }
            }

            // Dilemma 2: Rover Battery Overclocking
            else if (dilemmaId == "rover_battery_overclock")
            {
                if (pickedOptionA) // Overclock battery
                {
                    if (roverNormalBattery) roverNormalBattery.SetActive(false);
                    if (roverSmokingBattery) roverSmokingBattery.SetActive(true);

                    res.ModifyRocketFuel(50f);
                    res.ConsumeSpareParts(2);
                    Debug.Log("[Choice] Overclocked rover! Gained +50 Rocket Fuel, but rover motor burned out and needs 2 spare parts.");
                }
                else // Safe drive
                {
                    if (roverNormalBattery) roverNormalBattery.SetActive(true);
                    if (roverSmokingBattery) roverSmokingBattery.SetActive(false);

                    res.ModifyRocketFuel(20f);
                    Debug.Log("[Choice] Safe driving! Rover is intact, but rocket fuel production is slower.");
                }
            }

            // Dilemma 3: Water-Wall Radiation Shield vs Rocket Fuel Splitting
            else if (dilemmaId == "crater_water_use")
            {
                if (pickedOptionA) // Drinking water & storm shield
                {
                    res.ModifyWater(50f);
                    res.ModifyOxygen(20f);
                    Debug.Log("[Choice] Saved crater water for crew life support & radiation shielding!");
                }
                else // Crack into Mars rocket fuel
                {
                    res.ModifyRocketFuel(45f);
                    res.ModifyWater(-20f);
                    Debug.Log("[Choice] Converted crater water into Mars rocket propellant!");
                }
            }

            OnChoiceMade?.Invoke(dilemmaId, chosenKey);
        }

        public bool HasMadeChoice(string dilemmaId, string expectedOption)
        {
            return choiceHistory.ContainsKey(dilemmaId) && choiceHistory[dilemmaId] == expectedOption;
        }
    }
}

