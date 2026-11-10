using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Automated Scene Builder for Project Starbridge.
    /// Creates and serializes MainOutpostScene.unity with all managers, camera rig,
    /// directional sun light, multi-deck station generator, and UI elements.
    /// Accessible via Unity Menu: Tools -> Project Starbridge -> Build Outpost Scene.
    /// </summary>
    public static class StarbridgeSceneBuilder
    {
        [MenuItem("Tools/Project Starbridge/Build Outpost Scene")]
        public static void BuildScene()
        {
            Debug.Log("[StarbridgeSceneBuilder] Building Outpost Scene...");

            // Create new scene
            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

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

            // 2. Station Map Generator
            GameObject mapGen = new GameObject("--- MAP_GENERATOR ---");
            mapGen.AddComponent<StationMapGenerator>();

            // 3. Camera Rig
            GameObject camObj = new GameObject("Main Camera");
            camObj.tag = "MainCamera";
            Camera cam = camObj.AddComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.02f, 0.04f, 0.09f);
            cam.nearClipPlane = 0.1f;
            cam.farClipPlane = 1000f;
            camObj.transform.position = new Vector3(0, 10, -18);
            camObj.transform.rotation = Quaternion.Euler(25, 0, 0);

            CameraController camCtrl = camObj.AddComponent<CameraController>();
            camCtrl.baseCenter = Vector3.zero;

            // 4. Directional Sun Light
            GameObject sun = new GameObject("Directional_Sun");
            Light sunLight = sun.AddComponent<Light>();
            sunLight.type = LightType.Directional;
            sunLight.color = new Color(1f, 0.98f, 0.92f);
            sunLight.intensity = 1.4f;
            sunLight.shadows = LightShadows.Soft;
            sun.transform.rotation = Quaternion.Euler(45, -35, 0);

            // 5. Ensure Scenes directory exists and save scene
            if (!AssetDatabase.IsValidFolder("Assets/Scenes"))
            {
                AssetDatabase.CreateFolder("Assets", "Scenes");
            }

            string scenePath = "Assets/Scenes/MainOutpostScene.unity";
            EditorSceneManager.SaveScene(scene, scenePath);
            AssetDatabase.Refresh();

            // Set as active build scene
            EditorBuildSettings.scenes = new EditorBuildSettingsScene[]
            {
                new EditorBuildSettingsScene(scenePath, true)
            };

            Debug.Log("[StarbridgeSceneBuilder] Successfully created and saved: " + scenePath);
        }
    }
}

