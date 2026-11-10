using System;
using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    [Serializable]
    public class CampaignMission
    {
        public int id;
        public string title;
        public string world;
        public string briefing;
        public string objective;
        public string reward;
        public string badgeId;
    }

    /// <summary>
    /// Governs the 10-Mission Story Campaign ("Road to Mars").
    /// </summary>
    public class MissionManager : MonoBehaviour
    {
        public static MissionManager Instance { get; private set; }

        public int currentMissionIndex = 1;
        public List<CampaignMission> missions = new List<CampaignMission>();
        public HashSet<string> earnedBadges = new HashSet<string>();

        public event Action<CampaignMission> OnMissionStarted;
        public event Action<CampaignMission> OnMissionCompleted;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void CompleteMission(int missionId)
        {
            var mission = missions.Find(m => m.id == missionId);
            if (mission != null)
            {
                earnedBadges.Add(mission.badgeId);
                OnMissionCompleted?.Invoke(mission);

                currentMissionIndex++;
                if (currentMissionIndex <= 10)
                {
                    var next = missions.Find(m => m.id == currentMissionIndex);
                    if (next != null) OnMissionStarted?.Invoke(next);
                }
            }
        }
    }
}

