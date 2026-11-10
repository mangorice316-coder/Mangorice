using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.SceneManagement;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Builds and saves the impressive 2.5D Space Outpost scene in Unity 6.
    /// Accessible via Unity Menu: Tools -> Project Starbridge -> Build 2.5D Outpost Scene.
    /// </summary>
    public static class Outpost25DSceneBuilder
    {
        [MenuItem("Tools/Project Starbridge/Build 2.5D Outpost Scene")]
        public static void Build25DScene()
        {
            Debug.Log("[Outpost25DSceneBuilder] Generating 2.5D Cutaway Outpost Scene...");

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

            // 1. Managers Hub
            GameObject hub = new GameObject("--- MANAGERS_HUB ---");
            hub.AddComponent<GameManager>();
            hub.AddComponent<ResourceManager>();
            hub.AddComponent<ChoiceConsequenceManager>();
            hub.AddComponent<AudioController>();

            // 2. 2.5D Outpost Generator
            GameObject generatorObj = new GameObject("--- 2.5D_OUTPOST_GENERATOR ---");
            generatorObj.AddComponent<Outpost25DGenerator>();

            // 3. Ensure Scenes folder exists
            if (!AssetDatabase.IsValidFolder("Assets/Scenes"))
            {
                AssetDatabase.CreateFolder("Assets", "Scenes");
            }

            string scenePath = "Assets/Scenes/Outpost25DScene.unity";
            EditorSceneManager.SaveScene(scene, scenePath);
            AssetDatabase.Refresh();

            EditorBuildSettings.scenes = new EditorBuildSettingsScene[]
            {
                new EditorBuildSettingsScene(scenePath, true)
            };

            Debug.Log("[Outpost25DSceneBuilder] Scene built and saved successfully: " + scenePath);
        }
    }
}

