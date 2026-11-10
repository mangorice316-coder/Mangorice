using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    [Serializable]
    public class EmergencyChoice
    {
        public string title;
        public string description;
        public string costText;
        public Action onChosen;
    }

    [Serializable]
    public class EmergencyEvent
    {
        public string title;
        public string description;
        public float baseDuration = 10f; // seconds
        public List<EmergencyChoice> choices = new List<EmergencyChoice>();
    }

    /// <summary>
    /// Handles 10-second reflex emergencies (Sol 214 Mars Dust Storm, DONKI Solar Flare, etc.).
    /// </summary>
    public class EmergencyEventManager : MonoBehaviour
    {
        public static EmergencyEventManager Instance { get; private set; }

        public event Action<EmergencyEvent, float> OnEmergencyStarted;
        public event Action OnEmergencyResolved;

        private Coroutine activeCountdownCoroutine;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void TriggerEmergency(EmergencyEvent ev)
        {
            if (activeCountdownCoroutine != null) StopCoroutine(activeCountdownCoroutine);

            // Check Commander Maya bonus: +5s extra on reflex timer!
            float duration = ev.baseDuration;
            if (CrewManager.Instance != null && CrewManager.Instance.HasActiveCrew("maya"))
            {
                duration += 5f;
            }

            OnEmergencyStarted?.Invoke(ev, duration);
            activeCountdownCoroutine = StartCoroutine(EmergencyCountdown(duration));
        }

        private IEnumerator EmergencyCountdown(float seconds)
        {
            yield return new WaitForSeconds(seconds);
            // Emergency timed out: default consequence
            ResourceManager.Instance.ModifyPower(-20f);
            ResourceManager.Instance.ModifyMorale(-20f);
            OnEmergencyResolved?.Invoke();
            activeCountdownCoroutine = null;
        }

        public void ResolveChoice(EmergencyChoice choice)
        {
            if (activeCountdownCoroutine != null)
            {
                StopCoroutine(activeCountdownCoroutine);
                activeCountdownCoroutine = null;
            }
            choice.onChosen?.Invoke();
            OnEmergencyResolved?.Invoke();
        }
    }
}

