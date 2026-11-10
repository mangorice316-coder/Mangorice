using System;
using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    [Serializable]
    public class Astronaut
    {
        public string id;
        public string name;
        public string title;
        public bool isRobot;
        public int hearts = 5;
        public string abilityDescription;
        public string assignedRoomId = null;
    }

    /// <summary>
    /// Manages the 4 human astronauts (Maya, Leo, Priya, Sam) and 3 robot helpers (Reach, Scoop, Buzz).
    /// </summary>
    public class CrewManager : MonoBehaviour
    {
        public static CrewManager Instance { get; private set; }

        [SerializeField] private List<Astronaut> roster = new List<Astronaut>();

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            InitializeCrew();
        }

        private void InitializeCrew()
        {
            if (roster.Count > 0) return;

            roster.Add(new Astronaut { id = "maya", name = "Commander Maya", title = "Jet Pilot", isRobot = false, abilityDescription = "+5s on reflex timers" });
            roster.Add(new Astronaut { id = "leo", name = "Engineer Leo", title = "Robotics Pro", isRobot = false, abilityDescription = "-1 spare part cost" });
            roster.Add(new Astronaut { id = "priya", name = "Dr. Priya", title = "Botanist & Doctor", isRobot = false, abilityDescription = "2x greenhouse crops" });
            roster.Add(new Astronaut { id = "sam", name = "Scientist Sam", title = "Geologist", isRobot = false, abilityDescription = "Early DONKI warning" });
            
            // Robots
            roster.Add(new Astronaut { id = "reach", name = "Reach the Arm", title = "Canadarm2", isRobot = true, abilityDescription = "Sweeps panel dust" });
            roster.Add(new Astronaut { id = "scoop", name = "Scoop the Rover", title = "Crater Miner", isRobot = true, abilityDescription = "Drills crater ice" });
            roster.Add(new Astronaut { id = "buzz", name = "Buzz the Drone", title = "Mars Scout", isRobot = true, abilityDescription = "Spots dust storms" });
        }

        public bool HasActiveCrew(string id)
        {
            var c = roster.Find(x => x.id == id);
            return c != null && c.hearts > 1;
        }

        public void AssignToRoom(string astronautId, string roomId)
        {
            var c = roster.Find(x => x.id == astronautId);
            if (c != null)
            {
                c.assignedRoomId = roomId;
            }
        }
    }
}

