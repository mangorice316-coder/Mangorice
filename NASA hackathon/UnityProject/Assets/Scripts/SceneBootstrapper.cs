using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Automatic Scene Bootstrapper for Unity 6.
    /// Spawns the entire game world, managers, and the full 3D space station interior with physical wall collisions,
    /// transparent panoramic windows with NASA DONKI space weather, daily to-do list, ARED gym, minimap,
    /// coworker NPCs, and lighting when opening any scene in Unity.
    /// </summary>
    public class SceneBootstrapper : MonoBehaviour
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void InitializeScene()
        {
            if (FindObjectOfType<GameManager>() != null) return;

            Debug.Log("[Project Starbridge] Bootstrapping Complete 3D Real Space Station Outpost Simulation...");

            // 1. Managers Hub
            GameObject hub = new GameObject("--- MANAGERS_HUB ---");
            hub.AddComponent<GameManager>();
            hub.AddComponent<ResourceManager>();
            hub.AddComponent<CrewManager>();
            hub.AddComponent<BaseGridManager>();
            hub.AddComponent<BaseBuilder3D>();
            hub.AddComponent<EmergencyEventManager>();
            hub.AddComponent<MissionManager>();
            hub.AddComponent<MiniGameManager>();
            hub.AddComponent<CoopManager>();
            hub.AddComponent<NASADataService>();
            hub.AddComponent<AudioController>();
            hub.AddComponent<ChoiceConsequenceManager>();
            hub.AddComponent<DailyTodoListManager>();

            // 2. Spawn the Full 3D Space Station Interior & World
            GameObject stationGen = new GameObject("--- 3D_STATION_GENERATOR ---");
            stationGen.AddComponent<Station3DInteriorBuilder>();

            Debug.Log("[Project Starbridge] Full 3D Space Station Outpost & NASA Cadet successfully generated!");
        }
    }
}
