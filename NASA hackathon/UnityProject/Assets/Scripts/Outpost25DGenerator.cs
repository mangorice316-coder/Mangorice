using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Generates a rich, impressive 2.5D space outpost cross-section in Unity 6.
    /// Features multi-layered parallax depth, cutaway habitat decks with warm interior point lights,
    /// glowing hydroponic grow-lamps, exterior lunar crater surface, and celestial backdrop.
    /// </summary>
    public class Outpost25DGenerator : MonoBehaviour
    {
        public static Outpost25DGenerator Instance { get; private set; }

        [Header("Spawned References")]
        public GameObject playerCadet;
        public Camera25DController camController;
        public GameObject distantEarth;
        public GameObject craterMountains;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            Generate25DEnvironment();
        }

        public void Generate25DEnvironment()
        {
            Debug.Log("[Outpost25DGenerator] Building Impressive 2.5D Space Outpost Environment...");

            // 1. Celestial Parallax Background
            BuildCelestialParallax();

            // 2. Multi-Deck Cutaway 2.5D Space Station (Z = 0)
            BuildCutawayStationDecks();

            // 3. Exterior Lunar Surface, Craters, Ice Crystals & Launch Pad
            BuildExteriorLunarSurface();

            // 4. Spawn 2.5D Player Astronaut Cadet
            SpawnCadetPlayer();

            // 5. Connect Camera Rig
            SetupCameraRig();

            Debug.Log("[Outpost25DGenerator] 2.5D Space Outpost Environment Complete!");
        }

        private void BuildCelestialParallax()
        {
            GameObject backgroundHub = new GameObject("--- CELESTIAL_PARALLAX_LAYER ---");

            // Giant Blue Rotating Earth in deep background
            distantEarth = new GameObject("Parallax_Earth_Globe");
            distantEarth.transform.SetParent(backgroundHub.transform);
            distantEarth.transform.position = new Vector3(30, 35, 120);
            MeshFilter emf = distantEarth.AddComponent<MeshFilter>();
            MeshRenderer emr = distantEarth.AddComponent<MeshRenderer>();
            emf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(24f, 8, new Color(0.12f, 0.45f, 0.95f));
            emr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.12f, 0.45f, 0.95f), 0.4f);

            // Directional Sun Light casting dramatic space shadows
            GameObject sun = new GameObject("Directional_Sun");
            sun.transform.SetParent(backgroundHub.transform);
            Light sunLight = sun.AddComponent<Light>();
            sunLight.type = LightType.Directional;
            sunLight.color = new Color(1f, 0.98f, 0.92f);
            sunLight.intensity = 1.5f;
            sunLight.shadows = LightShadows.Soft;
            sun.transform.rotation = Quaternion.Euler(35f, -40f, 0f);

            // Distant Crater Mountain Ridge (Z = 35)
            craterMountains = new GameObject("Parallax_Crater_Mountains");
            craterMountains.transform.SetParent(backgroundHub.transform);
            craterMountains.transform.position = new Vector3(0, -5, 35);
            MeshFilter mmf = craterMountains.AddComponent<MeshFilter>();
            MeshRenderer mmr = craterMountains.AddComponent<MeshRenderer>();
            mmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedTerrain(40, 6f, 30f, false);
            mmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.12f, 0.15f, 0.22f), 0.1f);
        }

        private void BuildCutawayStationDecks()
        {
            GameObject stationRoot = new GameObject("--- 2.5D_CUTAWAY_STATION ---");

            // Deck 1: Central Command & Flight Observation (X: 0, Y: 0, Z: 0)
            CreateCutawayDeck(stationRoot.transform, new Vector3(0, 0, 0), "Deck1_Command_Bridge",
                new Color(0.14f, 0.18f, 0.28f), Color.cyan, "Command Hub");

            // Deck 2: Hydroponics Biome Dome (X: 18, Y: 0, Z: 0)
            GameObject bioDeck = CreateCutawayDeck(stationRoot.transform, new Vector3(18, 0, 0), "Deck2_Hydroponics_Dome",
                new Color(0.12f, 0.24f, 0.18f), Color.green, "Hydroponics");

            // Add strawberry planter beds & purple grow lights in Hydroponics
            for (int i = -1; i <= 1; i++)
            {
                GameObject planter = new GameObject("Planter_" + i);
                planter.transform.SetParent(bioDeck.transform);
                planter.transform.localPosition = new Vector3(i * 3.5f, 0.8f, 0);
                MeshFilter pmf = planter.AddComponent<MeshFilter>();
                MeshRenderer pmr = planter.AddComponent<MeshRenderer>();
                pmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(2.5f, 0.8f, 2f), new Color(0.2f, 0.7f, 0.35f));
                pmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.2f, 0.7f, 0.35f));

                // Glowing Ripe Strawberries
                GameObject berry = new GameObject("Berry");
                berry.transform.SetParent(planter.transform);
                berry.transform.localPosition = new Vector3(0, 0.6f, 0);
                MeshFilter bmf = berry.AddComponent<MeshFilter>();
                MeshRenderer bmr = berry.AddComponent<MeshRenderer>();
                bmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(0.5f, 0.5f, 0.5f), Color.red);
                bmr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(Color.red, Color.red, 2f);
            }

            // Purple Grow Lamp Point Light
            GameObject growLightObj = new GameObject("Grow_Light");
            growLightObj.transform.SetParent(bioDeck.transform);
            growLightObj.transform.localPosition = new Vector3(0, 3.8f, 0);
            Light growLight = growLightObj.AddComponent<Light>();
            growLight.type = LightType.Point;
            growLight.color = new Color(0.85f, 0.35f, 1f); // Purple UV
            growLight.range = 14f;
            growLight.intensity = 2.5f;

            // Deck 3: Crew Habitat & ARED Zero-G Gym (X: 36, Y: 0, Z: 0)
            GameObject gymDeck = CreateCutawayDeck(stationRoot.transform, new Vector3(36, 0, 0), "Deck3_Crew_Gym",
                new Color(0.22f, 0.18f, 0.32f), new Color(0.8f, 0.5f, 1f), "Gym & Quarters");

            // ARED Workout Machine
            GameObject ared = new GameObject("ARED_Machine");
            ared.transform.SetParent(gymDeck.transform);
            ared.transform.localPosition = new Vector3(0, 1.5f, 0);
            MeshFilter amf = ared.AddComponent<MeshFilter>();
            MeshRenderer amr = ared.AddComponent<MeshRenderer>();
            amf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(3f, 2.5f, 2f), new Color(0.7f, 0.4f, 0.9f));
            amr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.7f, 0.4f, 0.9f));

            // Deck 4: Machine Bay & Pressurized Airlock (X: -18, Y: 0, Z: 0)
            CreateCutawayDeck(stationRoot.transform, new Vector3(-18, 0, 0), "Deck4_Airlock_Bay",
                new Color(0.28f, 0.22f, 0.16f), Color.yellow, "Airlock Bay");

            // Connecting Umbilical Corridor Floors along the 2.5D Walkway
            CreateWalkwayBridge(stationRoot.transform, new Vector3(-27, 0, 0), new Vector3(45, 0, 0));
        }

        private GameObject CreateCutawayDeck(Transform parent, Vector3 pos, string name, Color floorColor, Color accentColor, string label)
        {
            GameObject deck = new GameObject(name);
            deck.transform.SetParent(parent);
            deck.transform.position = pos;

            // Cutaway Floor & Back Wall (Open front facing camera for impressive 2.5D cross-section view!)
            GameObject floor = new GameObject("Deck_Floor");
            floor.transform.SetParent(deck.transform);
            floor.transform.localPosition = Vector3.zero;
            MeshFilter fmf = floor.AddComponent<MeshFilter>();
            MeshRenderer fmr = floor.AddComponent<MeshRenderer>();
            floor.AddComponent<BoxCollider>();
            fmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(14f, 0.8f, 6f), floorColor);
            fmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(floorColor, 0.2f);

            // Back Wall with Glass & Conduits
            GameObject backWall = new GameObject("Back_Wall");
            backWall.transform.SetParent(deck.transform);
            backWall.transform.localPosition = new Vector3(0, 3f, 2.8f);
            MeshFilter bmf = backWall.AddComponent<MeshFilter>();
            MeshRenderer bmr = backWall.AddComponent<MeshRenderer>();
            bmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(14f, 5.5f, 0.6f), new Color(0.18f, 0.22f, 0.32f));
            bmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.18f, 0.22f, 0.32f), 0.3f);

            // Glowing Neon Accent Conduits on Back Wall
            GameObject neon = new GameObject("Neon_Trim");
            neon.transform.SetParent(backWall.transform);
            neon.transform.localPosition = new Vector3(0, 1.8f, -0.32f);
            MeshFilter nmf = neon.AddComponent<MeshFilter>();
            MeshRenderer nmr = neon.AddComponent<MeshRenderer>();
            nmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(13f, 0.3f, 0.1f), accentColor);
            nmr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(accentColor, accentColor, 2.2f);

            // Warm Interior Point Light
            GameObject lightObj = new GameObject("Interior_Point_Light");
            lightObj.transform.SetParent(deck.transform);
            lightObj.transform.localPosition = new Vector3(0, 3.5f, 0);
            Light pLight = lightObj.AddComponent<Light>();
            pLight.type = LightType.Point;
            pLight.color = accentColor;
            pLight.range = 12f;
            pLight.intensity = 1.8f;

            return deck;
        }

        private void CreateWalkwayBridge(Transform parent, Vector3 from, Vector3 to)
        {
            GameObject bridge = new GameObject("Continuous_25D_Walkway");
            bridge.transform.SetParent(parent);
            float length = Vector3.Distance(from, to);
            bridge.transform.position = (from + to) * 0.5f;

            MeshFilter bmf = bridge.AddComponent<MeshFilter>();
            MeshRenderer bmr = bridge.AddComponent<MeshRenderer>();
            BoxCollider col = bridge.AddComponent<BoxCollider>();
            col.size = new Vector3(length, 0.6f, 5f);

            bmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(length, 0.6f, 5f), new Color(0.15f, 0.18f, 0.25f));
            bmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.15f, 0.18f, 0.25f));
        }

        private void BuildExteriorLunarSurface()
        {
            GameObject exterior = new GameObject("--- EXTERIOR_LUNAR_SURFACE ---");
            exterior.transform.position = new Vector3(-60, -1, 0);

            // Bumpy Crater Surface Ground extending to the left
            MeshFilter gmf = exterior.AddComponent<MeshFilter>();
            MeshRenderer gmr = exterior.AddComponent<MeshRenderer>();
            BoxCollider col = exterior.AddComponent<BoxCollider>();
            col.size = new Vector3(60f, 1f, 14f);

            gmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(60f, 1f, 14f), new Color(0.16f, 0.2f, 0.28f));
            gmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.16f, 0.2f, 0.28f), 0.2f);

            // Glowing Cyan Subterranean Water Ice Deposit Crystals
            for (int i = 0; i < 3; i++)
            {
                GameObject ice = new GameObject("Water_Ice_Crystal_" + (i + 1));
                ice.transform.SetParent(exterior.transform);
                ice.transform.localPosition = new Vector3(-8 - i * 12, 1.2f, 0);
                MeshFilter imf = ice.AddComponent<MeshFilter>();
                MeshRenderer imr = ice.AddComponent<MeshRenderer>();
                imf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(2f, 2f, 2f), Color.cyan);
                imr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(Color.cyan, Color.blue, 2.5f);
            }

            // Mars Starbridge Rocket on Launch Pad (X: -80)
            GameObject rocket = new GameObject("Mars_Starbridge_Rocket");
            rocket.transform.SetParent(exterior.transform);
            rocket.transform.localPosition = new Vector3(-24, 8f, 0);
            MeshFilter rmf = rocket.AddComponent<MeshFilter>();
            MeshRenderer rmr = rocket.AddComponent<MeshRenderer>();
            rmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(2.6f, 16f, 8, Color.white);
            rmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.white, 0.3f);
        }

        private void SpawnCadetPlayer()
        {
            playerCadet = new GameObject("Cadet_Astronaut_25D");
            playerCadet.tag = "Player";
            playerCadet.transform.position = new Vector3(0, 1.2f, 0);

            CharacterController cc = playerCadet.AddComponent<CharacterController>();
            cc.height = 1.8f;
            cc.radius = 0.5f;

            Astronaut25DController ctrl = playerCadet.AddComponent<Astronaut25DController>();
            ctrl.moveSpeed = 6.0f;
            ctrl.jumpForce = 5.5f;
            ctrl.fixedZ = 0.0f;

            // Visual Spacesuit Model
            GameObject visual = new GameObject("VisualModel");
            visual.transform.SetParent(playerCadet.transform);
            visual.transform.localPosition = Vector3.zero;

            MeshFilter mf = visual.AddComponent<MeshFilter>();
            MeshRenderer mr = visual.AddComponent<MeshRenderer>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(1.1f, 1.8f, 0.8f), Color.white);
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.white, 0.35f);

            // Gold Solar Visor
            GameObject visor = new GameObject("Visor");
            visor.transform.SetParent(visual.transform);
            visor.transform.localPosition = new Vector3(0, 0.45f, 0.45f);
            MeshFilter vmf = visor.AddComponent<MeshFilter>();
            MeshRenderer vmr = visor.AddComponent<MeshRenderer>();
            vmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(0.85f, 0.5f, 0.25f), new Color(0.98f, 0.75f, 0.15f));
            vmr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(new Color(0.98f, 0.75f, 0.15f), Color.yellow, 1.8f);
        }

        private void SetupCameraRig()
        {
            GameObject camObj = Camera.main != null ? Camera.main.gameObject : new GameObject("Main Camera");
            camObj.tag = "MainCamera";
            Camera cam = camObj.GetComponent<Camera>() ?? camObj.AddComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.02f, 0.04f, 0.09f);
            cam.nearClipPlane = 0.1f;
            cam.farClipPlane = 1000f;

            camController = camObj.GetComponent<Camera25DController>() ?? camObj.AddComponent<Camera25DController>();
            camController.target = playerCadet.transform;
            camController.offset = new Vector3(0, 3.5f, -22f); // 2.5D cutaway camera framing
            camController.distantEarth = distantEarth.transform;
            camController.backgroundMountains = craterMountains.transform;
        }
    }
}

