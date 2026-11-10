using System;
using System.Collections;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Manages 2-Player Co-Op mode between Base Commander and Houston Flight Director.
    /// Simulates speed-of-light radio communication delays (0s Earth, 1.3s Moon, up to 20m Mars).
    /// </summary>
    public class CoopManager : MonoBehaviour
    {
        public static CoopManager Instance { get; private set; }

        public float currentRadioDelaySeconds = 1.3f; // Defaults to Moon delay

        public event Action<string, string> OnRadioMessageDelivered;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void SendHoustonSupplyRocket(string supplyType)
        {
            StartCoroutine(TransmitPayload(supplyType, currentRadioDelaySeconds));
        }

        private IEnumerator TransmitPayload(string supplyType, float delay)
        {
            yield return new WaitForSeconds(delay);

            var res = ResourceManager.Instance;
            switch (supplyType)
            {
                case "oxygen": res.ModifyOxygen(40f); break;
                case "water": res.ModifyWater(40f); break;
                case "parts": res.AddSpareParts(4); break;
                case "food": res.ModifyFood(30f); break;
            }

            OnRadioMessageDelivered?.Invoke("Houston", $"Supply payload '{supplyType}' arrived safely at base!");
        }

        public void SendHoustonGuidance(string message)
        {
            StartCoroutine(TransmitGuidance(message, currentRadioDelaySeconds));
        }

        private IEnumerator TransmitGuidance(string message, float delay)
        {
            yield return new WaitForSeconds(delay);
            OnRadioMessageDelivered?.Invoke("Houston Guidance", message);
        }
    }
}

