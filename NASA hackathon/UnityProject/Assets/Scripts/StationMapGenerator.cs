using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Generates a massive, multi-deck low-poly space station & lunar outpost map in Unity 6.
    /// Includes Central Flight Deck, Hydroponics Dome with space strawberries,
    /// Crew Habitat & ARED Gym, Engineering Airlock Bay, Exterior Truss with Comms Dish,
    /// vast Shackleton Crater Terrain with Cyan Water Ice, and the Mars Starbridge Rocket Launch Pad!
    /// </summary>
    public class StationMapGenerator : MonoBehaviour
    {
        public static StationMapGenerator Instance { get; private set; }

        [Header("Spawned References")]
        public GameObject playerAstronaut;
        public GameObject scoopRover;
        public GameObject marsRocket;
        public GameObject commsDish;
        public GameObject greenhouseDome;
        public List<CoworkerNPC> activeNPCs = new List<CoworkerNPC>();
        public List<GameObject> iceCrystals = new List<GameObject>();

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            GenerateMassiveStation();
        }

        public void GenerateMassiveStation()
        {
            Debug.Log("[StationMapGenerator] Generating Massive Low-Poly Starbridge Station & Outpost Map...");

            // 1. Massive Skybox & Celestial Background (Earth, Sun, Stars)
            CreateCelestialBackground();

            // 2. Deck 1: Central Command & Flight Observation Deck (x: 0, z: 0)
            CreateCommandDeck(new Vector3(0, 0, 0));

            // 3. Deck 2: Hydroponics Biome Dome (x: 34, z: 0)
            CreateHydroponicsDome(new Vector3(34, 0, 0));

            // 4. Deck 3: Crew Quarters & ARED Gym (x: 0, z: 34)
            CreateCrewGymDeck(new Vector3(0, 0, 34));

            // 5. Deck 4: Machine Bay & Pressurized Airlock (x: -34, z: 0)
            CreateEngineeringAirlockDeck(new Vector3(-34, 0, 0));

            // 6. Connecting Corridors & Umbilical Tunnels between Decks
            CreateCorridor(new Vector3(0, 0, 0), new Vector3(34, 0, 0));
            CreateCorridor(new Vector3(0, 0, 0), new Vector3(0, 0, 34));
            CreateCorridor(new Vector3(0, 0, 0), new Vector3(-34, 0, 0));

            // 7. Exterior Hull Truss & Comms Dish
            CreateExteriorTruss(new Vector3(-14, 10, -8));

            // 8. Exterior Lunar Surface outside Airlock (x: -95, z: 0)
            CreateExteriorLunarTerrain(new Vector3(-95, -3, 0));

            // 9. Mars Rocket Launch Pad & Starbridge Rocket (x: -130, z: 0)
            CreateMarsLaunchPad(new Vector3(-130, -3.5f, 0));

            // 10. Spawn Player Astronaut on Command Deck
            SpawnPlayerAstronaut(new Vector3(0, 1.2f, 0));

            // 11. Spawn Coworker NPCs at their respective posts
            SpawnCoworkerNPCs();

            // 12. Spawn Scoop Rover outside on Lunar Surface
            SpawnScoopRover(new Vector3(-68, -2.5f, 12));

            // A single, deterministic presentation pass adds suit models, deck trim, surface dressing and lighting.
            StationVisualEnhancements.Apply(this);

            Debug.Log("[StationMapGenerator] Massive Station Map generation complete!");
        }

        private void CreateCommandDeck(Vector3 pos)
        {
            GameObject deck = new GameObject("Deck1_Central_Command");
            deck.transform.position = pos;

            // Floor
            GameObject floor = new GameObject("Command_Floor");
            floor.transform.SetParent(deck.transform);
            floor.transform.localPosition = Vector3.zero;
            MeshFilter mf = floor.AddComponent<MeshFilter>();
            MeshRenderer mr = floor.AddComponent<MeshRenderer>();
            floor.AddComponent<BoxCollider>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(15f, 0.8f, 14, new Color(0.12f, 0.16f, 0.25f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.12f, 0.16f, 0.25f), 0.3f);

            // Panoramic Observation Window Ring
            GameObject windows = new GameObject("Observation_Windows");
            windows.transform.SetParent(deck.transform);
            windows.transform.localPosition = new Vector3(0, 2.5f, 0);
            MeshFilter wmf = windows.AddComponent<MeshFilter>();
            MeshRenderer wmr = windows.AddComponent<MeshRenderer>();
            wmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(15f, 8, new Color(0.3f, 0.7f, 1f, 0.3f));
            wmr.sharedMaterial = LowPolyMaterialFactory.GetTranslucentMaterial(new Color(0.3f, 0.7f, 1f, 0.35f));

            // Holographic Tactical Radar Table in Center
            GameObject holoTable = new GameObject("Tactical_Holo_Table");
            holoTable.transform.SetParent(deck.transform);
            holoTable.transform.localPosition = new Vector3(0, 0.8f, 0);
            MeshFilter hmf = holoTable.AddComponent<MeshFilter>();
            MeshRenderer hmr = holoTable.AddComponent<MeshRenderer>();
            holoTable.AddComponent<BoxCollider>();
            hmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(2.6f, 1.2f, 8, new Color(0.2f, 0.5f, 0.9f));
            hmr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(new Color(0.1f, 0.4f, 0.8f), Color.cyan, 2f);
        }

        private void CreateHydroponicsDome(Vector3 pos)
        {
            greenhouseDome = new GameObject("Deck2_Hydroponics_Dome");
            greenhouseDome.transform.position = pos;

            // Floor
            GameObject floor = new GameObject("Greenhouse_Floor");
            floor.transform.SetParent(greenhouseDome.transform);
            floor.transform.localPosition = Vector3.zero;
            MeshFilter mf = floor.AddComponent<MeshFilter>();
            MeshRenderer mr = floor.AddComponent<MeshRenderer>();
            floor.AddComponent<BoxCollider>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(13f, 0.8f, 12, new Color(0.15f, 0.2f, 0.18f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.15f, 0.2f, 0.18f));

            // Translucent Geodesic Glass Dome
            GameObject glass = new GameObject("Geodesic_Glass");
            glass.transform.SetParent(greenhouseDome.transform);
            glass.transform.localPosition = new Vector3(0, 0.4f, 0);
            MeshFilter gmf = glass.AddComponent<MeshFilter>();
            MeshRenderer gmr = glass.AddComponent<MeshRenderer>();
            gmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(13f, 8, new Color(0.2f, 0.9f, 0.5f, 0.45f));
            gmr.sharedMaterial = LowPolyMaterialFactory.GetTranslucentMaterial(new Color(0.2f, 0.9f, 0.5f, 0.45f));

            // Tiered Planter Beds with Space Strawberries
            for (int i = 0; i < 4; i++)
            {
                float angle = i * Mathf.PI * 0.5f;
                Vector3 bedPos = new Vector3(Mathf.Cos(angle) * 6.5f, 0.6f, Mathf.Sin(angle) * 6.5f);

                GameObject planter = new GameObject("Planter_Bed_" + (i + 1));
                planter.transform.SetParent(greenhouseDome.transform);
                planter.transform.localPosition = bedPos;
                MeshFilter pmf = planter.AddComponent<MeshFilter>();
                MeshRenderer pmr = planter.AddComponent<MeshRenderer>();
                planter.AddComponent<BoxCollider>();
                pmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(4f, 0.8f, 2.2f), new Color(0.25f, 0.7f, 0.3f));
                pmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.25f, 0.7f, 0.3f));

                // Ripe Strawberries
                for (int b = -1; b <= 1; b++)
                {
                    GameObject berry = new GameObject("Space_Strawberry");
                    berry.transform.SetParent(planter.transform);
                    berry.transform.localPosition = new Vector3(b * 1.1f, 0.6f, 0);
                    MeshFilter bmf = berry.AddComponent<MeshFilter>();
                    MeshRenderer bmr = berry.AddComponent<MeshRenderer>();
                    bmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(0.4f, 0.4f, 0.4f), Color.red);
                    bmr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(Color.red, Color.red, 1.5f);
                }
            }
        }

        private void CreateCrewGymDeck(Vector3 pos)
        {
            GameObject gym = new GameObject("Deck3_Crew_Gym_Quarters");
            gym.transform.position = pos;

            // Floor
            GameObject floor = new GameObject("Gym_Floor");
            floor.transform.SetParent(gym.transform);
            floor.transform.localPosition = Vector3.zero;
            MeshFilter mf = floor.AddComponent<MeshFilter>();
            MeshRenderer mr = floor.AddComponent<MeshRenderer>();
            floor.AddComponent<BoxCollider>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(13f, 0.8f, 12, new Color(0.22f, 0.18f, 0.3f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.22f, 0.18f, 0.3f));

            // ARED Resistance Workout Machine
            GameObject ared = new GameObject("ARED_Space_Workout_Machine");
            ared.transform.SetParent(gym.transform);
            ared.transform.localPosition = new Vector3(0, 1.5f, 4f);
            MeshFilter amf = ared.AddComponent<MeshFilter>();
            MeshRenderer amr = ared.AddComponent<MeshRenderer>();
            ared.AddComponent<BoxCollider>();
            amf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(4f, 3f, 4.5f), new Color(0.7f, 0.4f, 0.9f));
            amr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.7f, 0.4f, 0.9f), 0.4f);

            // Sleep Pods
            foreach (int s in new int[] { -6, 6 })
            {
                GameObject pod = new GameObject("Crew_Sleep_Pod_" + s);
                pod.transform.SetParent(gym.transform);
                pod.transform.localPosition = new Vector3(s, 2f, -3f);
                MeshFilter pmf = pod.AddComponent<MeshFilter>();
                MeshRenderer pmr = pod.AddComponent<MeshRenderer>();
                pod.AddComponent<BoxCollider>();
                pmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(2f, 2.5f, 4.5f), new Color(0.4f, 0.45f, 0.55f));
                pmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.4f, 0.45f, 0.55f));
            }
        }

        private void CreateEngineeringAirlockDeck(Vector3 pos)
        {
            GameObject eng = new GameObject("Deck4_Engineering_Airlock");
            eng.transform.position = pos;

            // Floor
            GameObject floor = new GameObject("Eng_Floor");
            floor.transform.SetParent(eng.transform);
            floor.transform.localPosition = Vector3.zero;
            MeshFilter mf = floor.AddComponent<MeshFilter>();
            MeshRenderer mr = floor.AddComponent<MeshRenderer>();
            floor.AddComponent<BoxCollider>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(13f, 0.8f, 12, new Color(0.28f, 0.22f, 0.15f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.28f, 0.22f, 0.15f));

            // 3D Regolith Dirt-Printer & Workbench
            GameObject printer = new GameObject("Regolith_3D_Printer");
            printer.transform.SetParent(eng.transform);
            printer.transform.localPosition = new Vector3(0, 1.2f, 4f);
            MeshFilter pmf = printer.AddComponent<MeshFilter>();
            MeshRenderer pmr = printer.AddComponent<MeshRenderer>();
            printer.AddComponent<BoxCollider>();
            pmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(3.5f, 2f, 2.5f), new Color(0.9f, 0.6f, 0.2f));
            pmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.9f, 0.6f, 0.2f));

            // Pressurized Airlock Chamber
            GameObject airlock = new GameObject("Pressurized_Airlock_Chamber");
            airlock.transform.SetParent(eng.transform);
            airlock.transform.localPosition = new Vector3(-8.5f, 2.2f, 0);
            MeshFilter hmf = airlock.AddComponent<MeshFilter>();
            MeshRenderer hmr = airlock.AddComponent<MeshRenderer>();
            airlock.AddComponent<BoxCollider>();
            hmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(2f, 4f, 4f), Color.red);
            hmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.red);
        }

        private void CreateCorridor(Vector3 start, Vector3 end)
        {
            GameObject corridor = new GameObject("Corridor_Umbilical");
            Vector3 mid = (start + end) * 0.5f;
            corridor.transform.position = mid;
            corridor.transform.LookAt(end);

            float length = Vector3.Distance(start, end);

            GameObject cFloor = new GameObject("Corridor_Floor");
            cFloor.transform.SetParent(corridor.transform);
            cFloor.transform.localPosition = Vector3.zero;
            MeshFilter mf = cFloor.AddComponent<MeshFilter>();
            MeshRenderer mr = cFloor.AddComponent<MeshRenderer>();
            cFloor.AddComponent<BoxCollider>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(3.4f, 0.4f, length), new Color(0.2f, 0.25f, 0.35f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.2f, 0.25f, 0.35f));
        }

        private void CreateExteriorTruss(Vector3 pos)
        {
            commsDish = new GameObject("Exterior_Comms_Dish");
            commsDish.transform.position = pos;

            MeshFilter mf = commsDish.AddComponent<MeshFilter>();
            MeshRenderer mr = commsDish.AddComponent<MeshRenderer>();
            commsDish.AddComponent<BoxCollider>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(3.5f, 1.6f, 10, new Color(0.85f, 0.9f, 0.95f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.85f, 0.9f, 0.95f));
        }

        private void CreateExteriorLunarTerrain(Vector3 pos)
        {
            GameObject lunar = new GameObject("Lunar_Surface_Terrain");
            lunar.transform.position = pos;

            MeshFilter mf = lunar.AddComponent<MeshFilter>();
            MeshRenderer mr = lunar.AddComponent<MeshRenderer>();
            MeshCollider mc = lunar.AddComponent<MeshCollider>();

            Mesh craterMesh = LowPolyMeshGenerator.CreateFacetedTerrain(45, 4.2f, 26f, true);
            mf.sharedMesh = craterMesh;
            mc.sharedMesh = craterMesh;
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.18f, 0.22f, 0.3f), 0.2f);

            // Glowing Cyan Water Ice Crystals in Shackleton Crater
            for (int i = 0; i < 3; i++)
            {
                GameObject ice = new GameObject("Water_Ice_Deposit_" + (i + 1));
                ice.transform.position = pos + new Vector3(15 + i * 16, 0.8f, (i - 1) * 20);
                MeshFilter imf = ice.AddComponent<MeshFilter>();
                MeshRenderer imr = ice.AddComponent<MeshRenderer>();
                ice.AddComponent<BoxCollider>();
                imf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(2.5f, 2.5f, 2.5f), Color.cyan);
                imr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(Color.cyan, Color.blue, 2.5f);
                iceCrystals.Add(ice);
            }
        }

        private void CreateMarsLaunchPad(Vector3 pos)
        {
            GameObject pad = new GameObject("Mars_Launch_Pad");
            pad.transform.position = pos;

            MeshFilter pmf = pad.AddComponent<MeshFilter>();
            MeshRenderer pmr = pad.AddComponent<MeshRenderer>();
            pad.AddComponent<BoxCollider>();
            pmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(14f, 1.5f, 12, new Color(0.35f, 0.4f, 0.45f));
            pmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.35f, 0.4f, 0.45f));

            // Mars Starbridge Rocket
            marsRocket = new GameObject("Mars_Starbridge_Rocket");
            marsRocket.transform.position = pos + new Vector3(0, 1.5f, 0);

            MeshFilter rmf = marsRocket.AddComponent<MeshFilter>();
            MeshRenderer rmr = marsRocket.AddComponent<MeshRenderer>();
            marsRocket.AddComponent<BoxCollider>();
            rmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(3.2f, 18f, 10, Color.white);
            rmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.white, 0.3f);
        }

        private void CreateCelestialBackground()
        {
            GameObject background = new GameObject("--- CELESTIAL_BACKGROUND ---");

            // Giant Blue Rotating Earth
            GameObject earth = new GameObject("Earth_Sphere");
            earth.transform.SetParent(background.transform);
            earth.transform.position = new Vector3(90, 85, 170);
            MeshFilter emf = earth.AddComponent<MeshFilter>();
            MeshRenderer emr = earth.AddComponent<MeshRenderer>();
            emf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(32f, 10, new Color(0.1f, 0.45f, 0.95f));
            emr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.1f, 0.45f, 0.95f), 0.5f);

            // Sun Light
            GameObject sun = new GameObject("Sun_Directional");
            sun.transform.SetParent(background.transform);
            Light sunLight = sun.AddComponent<Light>();
            sunLight.type = LightType.Directional;
            sunLight.color = new Color(1f, 0.98f, 0.9f);
            sunLight.intensity = 1.5f;
            sun.transform.rotation = Quaternion.Euler(42f, -40f, 0f);
        }

        private void SpawnPlayerAstronaut(Vector3 spawnPos)
        {
            playerAstronaut = new GameObject("Player_Cadet_Astronaut");
            playerAstronaut.tag = "Player";
            playerAstronaut.transform.position = spawnPos;

            CharacterController cc = playerAstronaut.AddComponent<CharacterController>();
            cc.height = 1.8f;
            cc.radius = 0.5f;

            AstronautController ctrl = playerAstronaut.AddComponent<AstronautController>();
            ctrl.mode = MovementMode.SurfaceLowG;

            MeshFilter mf = playerAstronaut.AddComponent<MeshFilter>();
            MeshRenderer mr = playerAstronaut.AddComponent<MeshRenderer>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(1.1f, 1.8f, 0.8f), Color.white);
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.white, 0.3f);
        }

        private void SpawnCoworkerNPCs()
        {
            SpawnSingleNPC(NPCRole.MayaCommander, new Vector3(0, 0.9f, 4.5f), "Commander Maya");
            SpawnSingleNPC(NPCRole.PriyaBotanist, new Vector3(34, 0.9f, -4f), "Dr. Priya");
            SpawnSingleNPC(NPCRole.LeoEngineer, new Vector3(-34, 0.9f, 4f), "Engineer Leo");
            SpawnSingleNPC(NPCRole.SamScientist, new Vector3(-70, -2.5f, 4f), "Scientist Sam");
        }

        private void SpawnSingleNPC(NPCRole role, Vector3 pos, string displayName)
        {
            GameObject npcObj = new GameObject("NPC_" + displayName.Replace(" ", "_"));
            npcObj.transform.position = pos;

            MeshFilter mf = npcObj.AddComponent<MeshFilter>();
            MeshRenderer mr = npcObj.AddComponent<MeshRenderer>();
            npcObj.AddComponent<BoxCollider>();

            CoworkerNPC npc = npcObj.AddComponent<CoworkerNPC>();
            npc.role = role;
            npc.npcName = displayName;

            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(1.1f, 1.8f, 0.8f), npc.suitStripeColor);
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(npc.suitStripeColor, 0.35f);

            activeNPCs.Add(npc);
        }

        private void SpawnScoopRover(Vector3 pos)
        {
            scoopRover = new GameObject("Scoop_Rover_Vehicle");
            scoopRover.transform.position = pos;

            MeshFilter mf = scoopRover.AddComponent<MeshFilter>();
            MeshRenderer mr = scoopRover.AddComponent<MeshRenderer>();
            BoxCollider col = scoopRover.AddComponent<BoxCollider>();
            col.size = new Vector3(3.2f, 1.6f, 4.2f);

            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(3.0f, 1.2f, 3.8f), new Color(0.92f, 0.94f, 0.98f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.92f, 0.94f, 0.98f), 0.3f);

            RoverController rc = scoopRover.AddComponent<RoverController>();

            // Headlight
            GameObject lightObj = new GameObject("Headlight");
            lightObj.transform.SetParent(scoopRover.transform);
            lightObj.transform.localPosition = new Vector3(0, 0.8f, 2.0f);
            Light headLight = lightObj.AddComponent<Light>();
            headLight.type = LightType.Spot;
            headLight.spotAngle = 65f;
            headLight.range = 35f;
            headLight.intensity = 2.8f;
            rc.headlights = new Light[] { headLight };
        }
    }
}

