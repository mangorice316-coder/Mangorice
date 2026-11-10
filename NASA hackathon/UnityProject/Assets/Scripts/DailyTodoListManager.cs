using System;
using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    [Serializable]
    public class AstronautTask
    {
        public int id;
        public string title;
        public string description;
        public bool isCompleted;
        public string educationalFact;
    }

    /// <summary>
    /// Manages the in-game Daily To-Do list, astronaut daily routines,
    /// scientific experiments, and team missions with gradual kid-friendly difficulty ramp.
    /// </summary>
    public class DailyTodoListManager : MonoBehaviour
    {
        public static DailyTodoListManager Instance { get; private set; }

        [Header("Today's To-Do List")]
        public List<AstronautTask> todayTasks = new List<AstronautTask>();
        public string activeScienceExperiment = "Plant Geotropism in Low Gravity";
        public string spaceWeatherStatus = "SOLAR FLUX NORMAL (NASA DONKI)";

        public event Action<AstronautTask> OnTaskCompleted;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);

            InitializeDefaultRoutine();
        }

        public void InitializeDefaultRoutine()
        {
            todayTasks.Clear();

            todayTasks.Add(new AstronautTask
            {
                id = 1,
                title = "Morning Telemetry & Vitals Check",
                description = "Verify cabin oxygen, pressure, and heart rate telemetry.",
                isCompleted = true,
                educationalFact = "Astronauts monitor their resting heart rate every morning to track cardiovascular health."
            });

            todayTasks.Add(new AstronautTask
            {
                id = 2,
                title = "2-Hour ARED Gym Workout",
                description = "Perform resistive squats to stop microgravity bone density loss.",
                isCompleted = false,
                educationalFact = "Without gravity pulling on bones, humans lose 1% to 2% bone mass per month in space!"
            });

            todayTasks.Add(new AstronautTask
            {
                id = 3,
                title = "Harvest Strawberries in Food Dome",
                description = "Pluck ripe fruit and prune leaves in the VEGGIE aeroponic trays.",
                isCompleted = false,
                educationalFact = "Fresh crops absorb exhaled CO2, release oxygen, and stop astronaut menu fatigue!"
            });

            todayTasks.Add(new AstronautTask
            {
                id = 4,
                title = "Cycle ECLSS Water Recovery Filters",
                description = "Inspect the distillation processor and cycle catalytic filters.",
                isCompleted = false,
                educationalFact = "NASA recovers over 98% of all water from sweat, moisture, and urine!"
            });

            todayTasks.Add(new AstronautTask
            {
                id = 5,
                title = "Evening NASA Houston Dispatch Uplink",
                description = "Transmit daily mission logs and receive ground control dispatches.",
                isCompleted = false,
                educationalFact = "Radio waves take 1.3 seconds between the Moon and Earth, and up to 20 minutes from Mars!"
            });
        }

        public void CompleteTask(int taskId)
        {
            var task = todayTasks.Find(t => t.id == taskId);
            if (task != null && !task.isCompleted)
            {
                task.isCompleted = true;
                Debug.Log($"[DailyTodoList] Completed task: {task.title}. Fact: {task.educationalFact}");
                OnTaskCompleted?.Invoke(task);
            }
        }
    }
}

