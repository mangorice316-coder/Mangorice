using System;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Tracks and balances the life support resources of the outpost:
    /// Power (kW), Water (L), Oxygen (kg), Food (kg), Rocket Fuel (kg), Spare Parts, Morale.
    /// Based on NASA closed-loop life support (ECLSS) principles.
    /// </summary>
    public class ResourceManager : MonoBehaviour
    {
        public static ResourceManager Instance { get; private set; }

        [Header("Resource Balances")]
        [SerializeField] private float power = 60f;
        [SerializeField] private float maxPower = 100f;
        [SerializeField] private float water = 80f;
        [SerializeField] private float maxWater = 150f;
        [SerializeField] private float oxygen = 90f;
        [SerializeField] private float maxOxygen = 150f;
        [SerializeField] private float food = 40f;
        [SerializeField] private float maxFood = 100f;
        [SerializeField] private float rocketFuel = 10f;
        [SerializeField] private float maxRocketFuel = 120f;
        [SerializeField] private int spareParts = 8;
        [SerializeField] private float morale = 95f; // 0 to 100

        public event Action OnResourcesChanged;

        public float Power => power;
        public float Water => water;
        public float Oxygen => oxygen;
        public float Food => food;
        public float RocketFuel => rocketFuel;
        public int SpareParts => spareParts;
        public float Morale => morale;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void ModifyPower(float amount)
        {
            power = Mathf.Clamp(power + amount, 0f, maxPower);
            OnResourcesChanged?.Invoke();
        }

        public void ModifyWater(float amount)
        {
            water = Mathf.Clamp(water + amount, 0f, maxWater);
            OnResourcesChanged?.Invoke();
        }

        public void ModifyOxygen(float amount)
        {
            oxygen = Mathf.Clamp(oxygen + amount, 0f, maxOxygen);
            OnResourcesChanged?.Invoke();
        }

        public void ModifyFood(float amount)
        {
            food = Mathf.Clamp(food + amount, 0f, maxFood);
            OnResourcesChanged?.Invoke();
        }

        public void ModifyRocketFuel(float amount)
        {
            rocketFuel = Mathf.Clamp(rocketFuel + amount, 0f, maxRocketFuel);
            OnResourcesChanged?.Invoke();
        }

        public bool ConsumeSpareParts(int count)
        {
            if (spareParts >= count)
            {
                spareParts -= count;
                OnResourcesChanged?.Invoke();
                return true;
            }
            return false;
        }

        public void AddSpareParts(int count)
        {
            spareParts += count;
            OnResourcesChanged?.Invoke();
        }

        public void ModifyMorale(float amount)
        {
            morale = Mathf.Clamp(morale + amount, 0f, 100f);
            OnResourcesChanged?.Invoke();
        }
    }
}

