using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Generates the full 3D space station interior with physical wall box colliders,
    /// transparent panoramic cupola observation windows looking out at Earth, holographic tables,
    /// ARED resistive exercise machine, strawberry planters, ECLSS distillation tanks,
    /// and exterior crater terrain for Moon and Mars.
    /// </summary>
    public class Station3DInteriorBuilder : MonoBehaviour
    {
        public static Station3DInteriorBuilder Instance { get; private set; }

        [Header("Spawned References")]
        public GameObject playerAstronaut;
        public GameObject earthGlobe;
        public GameObject directionalSun;
        public GameObject scoopRover;
        public GameObject marsRocket;
        private readonly Dictionary<string, Material> visualMaterialCache = new Dictionary<string, Material>();

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            BuildFull3DStation();
        }

        public void BuildFull3DStation()
        {
            Debug.Log("[Station3DInteriorBuilder] Building 3D Explorable Space Station with Wall Collisions...");

            // 1. Celestial Space Backdrop
            BuildCelestialSky();

            // 2. Central Flight Command Bridge (0, 0, 0)
            BuildCentralCommandBridge();

            // 3. Hydroponics Biome Dome (24, 0, 0)
            BuildHydroponicsDome();

            // 4. Crew Quarters & ARED Gym Bay (0, 0, 22)
            BuildCrewGymBay();

            // 4b. Dedicated Solar Farm
            BuildSolarFarm();

            // 5. ECLSS Water Recovery & Air Center (-22, 0, 0)
            BuildECLSSCenter();

            // 6. Engineering Airlock Bay (-40, 0, 0)
            BuildAirlockBay();

            // 7. Exterior Lunar & Martian Crater Expanse (-60 to -100)
            BuildExteriorCraterTerrain();

            // 8. Spawn 3D NASA Spacesuit Astronaut
            SpawnNASACharacter();
            SpawnCrewNPCs();

            // 9. Attach Minimap Controller
            gameObject.AddComponent<Minimap3DController>().playerTransform = playerAstronaut.transform;
            gameObject.AddComponent<WindowWeatherViewer>();

            Debug.Log("[Station3DInteriorBuilder] Station Generation Complete!");
        }

        private void BuildCelestialSky()
        {
            GameObject sky = new GameObject("--- CELESTIAL_SKY ---");

            earthGlobe = new GameObject("Earth_Globe");
            earthGlobe.transform.SetParent(sky.transform);
            earthGlobe.transform.position = new Vector3(90, 80, 160);
            MeshFilter emf = earthGlobe.AddComponent<MeshFilter>();
            MeshRenderer emr = earthGlobe.AddComponent<MeshRenderer>();
            emf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(36f, 8, new Color(0.12f, 0.45f, 0.95f));
            emr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.12f, 0.45f, 0.95f), 0.4f);

            directionalSun = new GameObject("Directional_Sun");
            directionalSun.transform.SetParent(sky.transform);
            Light sunLight = directionalSun.AddComponent<Light>();
            sunLight.type = LightType.Directional;
            sunLight.color = new Color(1f, 0.98f, 0.92f);
            sunLight.intensity = 1.5f;
            directionalSun.transform.rotation = Quaternion.Euler(45f, -40f, 0f);
        }

        private void BuildCentralCommandBridge()
        {
            GameObject deck = new GameObject("Deck_Central_Command");
            deck.transform.position = Vector3.zero;

            // Floor with BoxCollider
            CreateRoomFloor(deck.transform, Vector3.zero, new Vector3(14f, 0.6f, 14f), new Color(0.12f, 0.16f, 0.25f));

            // Four Surrounding Walls with Doorways
            CreateWallWithDoor(deck.transform, new Vector3(0, 2.5f, 7f), new Vector3(14f, 5f, 0.6f));
            CreateWallWithDoor(deck.transform, new Vector3(0, 2.5f, -7f), new Vector3(14f, 5f, 0.6f));
            CreateWallWithDoor(deck.transform, new Vector3(7f, 2.5f, 0), new Vector3(0.6f, 5f, 14f));
            CreateWallWithDoor(deck.transform, new Vector3(-7f, 2.5f, 0), new Vector3(0.6f, 5f, 14f));

            // Holographic Planet Table
            GameObject table = new GameObject("Holo_Planet_Table");
            table.transform.SetParent(deck.transform);
            table.transform.localPosition = new Vector3(0, 0.8f, 0);
            MeshFilter mf = table.AddComponent<MeshFilter>();
            MeshRenderer mr = table.AddComponent<MeshRenderer>();
            table.AddComponent<BoxCollider>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(2f, 1.2f, 8, Color.cyan);
            mr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(Color.cyan, Color.blue, 2f);
            CreateWorldLabel("COMMAND", new Vector3(0f, 5.5f, 0f), new Color(0.28f, 0.82f, 1f));
        }

        private void BuildHydroponicsDome()
        {
            GameObject deck = new GameObject("Deck_Hydroponics_Dome");
            deck.transform.position = new Vector3(24, 0, 0);

            CreateRoomFloor(deck.transform, Vector3.zero, new Vector3(14f, 0.6f, 12f), new Color(0.12f, 0.22f, 0.16f));

            // Transparent Dome Shell
            GameObject dome = new GameObject("Greenhouse_Dome_Shell");
            dome.transform.SetParent(deck.transform);
            dome.transform.localPosition = new Vector3(0, 0.4f, 0);
            MeshFilter dmf = dome.AddComponent<MeshFilter>();
            MeshRenderer dmr = dome.AddComponent<MeshRenderer>();
            dmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(12f, 8, new Color(0.2f, 0.9f, 0.5f, 0.45f));
            dmr.sharedMaterial = LowPolyMaterialFactory.GetTranslucentMaterial(new Color(0.2f, 0.9f, 0.5f, 0.45f));

            // Strawberry Planter Beds
            for (int i = -1; i <= 1; i++)
            {
                GameObject planter = new GameObject("Strawberry_Planter_" + i);
                planter.transform.SetParent(deck.transform);
                planter.transform.localPosition = new Vector3(i * 3.5f, 0.6f, i * 2.5f);
                MeshFilter pmf = planter.AddComponent<MeshFilter>();
                MeshRenderer pmr = planter.AddComponent<MeshRenderer>();
                planter.AddComponent<BoxCollider>();
                pmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(3f, 0.8f, 2f), new Color(0.2f, 0.7f, 0.35f));
                pmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.2f, 0.7f, 0.35f));
                CreateVisualPart(deck.transform, "Grow_Light_" + i, PrimitiveType.Cube,
                    new Vector3(i * 3.5f, 3.3f, i * 2.5f), new Vector3(2.8f, 0.08f, 0.12f), new Color(0.72f, 0.42f, 1f), true);
                for (int berry = -1; berry <= 1; berry++)
                {
                    CreateVisualPart(deck.transform, "Strawberry_" + i + "_" + berry, PrimitiveType.Sphere,
                        new Vector3(i * 3.5f + berry * 0.7f, 1.28f, i * 2.5f), new Vector3(0.26f, 0.32f, 0.26f), new Color(0.91f, 0.18f, 0.25f));
                }
            }
            CreateWorldLabel("FOOD DOME", deck.transform.position + new Vector3(0f, 6f, 0f), new Color(0.25f, 0.95f, 0.58f));
        }

        private void BuildCrewGymBay()
        {
            GameObject deck = new GameObject("Deck_ARED_Gym");
            deck.transform.position = new Vector3(0, 0, 22);

            CreateRoomFloor(deck.transform, Vector3.zero, new Vector3(12f, 0.6f, 12f), new Color(0.2f, 0.16f, 0.28f));

            // ARED Workout Machine with Collider
            GameObject ared = new GameObject("ARED_Workout_Machine");
            ared.transform.SetParent(deck.transform);
            ared.transform.localPosition = new Vector3(0, 1.4f, 0);
            MeshFilter amf = ared.AddComponent<MeshFilter>();
            MeshRenderer amr = ared.AddComponent<MeshRenderer>();
            ared.AddComponent<BoxCollider>();
            amf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(3.5f, 2.5f, 3.5f), new Color(0.7f, 0.4f, 0.9f));
            amr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.7f, 0.4f, 0.9f));
            CreateVisualPart(deck.transform, "ARED_Frame_Left", PrimitiveType.Cylinder, new Vector3(-2.1f, 2f, 0f), new Vector3(0.12f, 2.8f, 0.12f), new Color(0.72f, 0.78f, 0.86f));
            CreateVisualPart(deck.transform, "ARED_Frame_Right", PrimitiveType.Cylinder, new Vector3(2.1f, 2f, 0f), new Vector3(0.12f, 2.8f, 0.12f), new Color(0.72f, 0.78f, 0.86f));
            CreateVisualPart(deck.transform, "ARED_Frame_Top", PrimitiveType.Cylinder, new Vector3(0f, 3.35f, 0f), new Vector3(0.12f, 2.2f, 0.12f), new Color(1f, 0.72f, 0.26f), true, new Vector3(0f, 0f, 90f));
            CreateWorldLabel("ARED GYM", deck.transform.position + new Vector3(0f, 4.6f, 0f), new Color(0.78f, 0.62f, 1f));
        }

        private void BuildSolarFarm()
        {
            GameObject deck = new GameObject("Deck_Solar_Farm");
            deck.transform.position = new Vector3(0f, 0f, -22f);
            CreateRoomFloor(deck.transform, Vector3.zero, new Vector3(12f, 0.6f, 12f), new Color(0.12f, 0.18f, 0.28f));

            Material panelMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(new Color(0.06f, 0.2f, 0.4f), new Color(0.03f, 0.16f, 0.32f), 0.5f);
            for (int side = -1; side <= 1; side += 2)
            {
                float x = side * 3.2f;
                CreateVisualPart(deck.transform, "Solar_Array_Panel_" + side, PrimitiveType.Cube,
                    new Vector3(x, 2.5f, 0f), new Vector3(5f, 0.14f, 2.7f), new Color(0.06f, 0.2f, 0.4f));
                GameObject panel = deck.transform.Find("Solar_Array_Panel_" + side).gameObject;
                panel.GetComponent<Renderer>().sharedMaterial = panelMaterial;
                panel.transform.localRotation = Quaternion.Euler(-10f, 0f, 0f);
                for (int post = -1; post <= 1; post += 2)
                {
                    CreateVisualPart(deck.transform, "Solar_Support_" + side + "_" + post, PrimitiveType.Cylinder,
                        new Vector3(x + post * 1.7f, 1.35f, post * 0.45f), new Vector3(0.12f, 2.2f, 0.12f), new Color(0.72f, 0.8f, 0.88f));
                }
                for (int line = -2; line <= 2; line++)
                {
                    CreateVisualPart(deck.transform, "Solar_Cell_Line_" + side + "_" + line, PrimitiveType.Cube,
                        new Vector3(x + line * 0.82f, 2.59f, 0f), new Vector3(0.035f, 0.02f, 2.5f), new Color(0.35f, 0.78f, 0.95f), true);
                }
            }
            CreateWorldLabel("SOLAR FARM", deck.transform.position + new Vector3(0f, 4.8f, 0f), new Color(1f, 0.75f, 0.28f));
        }

        private void BuildECLSSCenter()
        {
            GameObject deck = new GameObject("Deck_ECLSS_Center");
            deck.transform.position = new Vector3(-22, 0, 0);

            CreateRoomFloor(deck.transform, Vector3.zero, new Vector3(12f, 0.6f, 12f), new Color(0.12f, 0.18f, 0.26f));

            // Distillation Water Recovery Tank
            GameObject tank = new GameObject("ECLSS_Water_Recovery_Tank");
            tank.transform.SetParent(deck.transform);
            tank.transform.localPosition = new Vector3(0, 2.5f, 0);
            MeshFilter tmf = tank.AddComponent<MeshFilter>();
            MeshRenderer tmr = tank.AddComponent<MeshRenderer>();
            tank.AddComponent<BoxCollider>();
            tmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(3.5f, 5f, 8, new Color(0.1f, 0.5f, 0.9f));
            tmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.1f, 0.5f, 0.9f));
            CreateVisualPart(deck.transform, "ECLSS_Tank_Band_Lower", PrimitiveType.Cylinder, new Vector3(0f, 1.1f, 0f), new Vector3(3.7f, 0.16f, 3.7f), new Color(0.28f, 0.82f, 0.95f), true);
            CreateVisualPart(deck.transform, "ECLSS_Tank_Band_Upper", PrimitiveType.Cylinder, new Vector3(0f, 3.9f, 0f), new Vector3(3.7f, 0.16f, 3.7f), new Color(0.28f, 0.82f, 0.95f), true);
            CreateVisualPart(deck.transform, "ECLSS_Status_Screen", PrimitiveType.Cube, new Vector3(4.5f, 2.2f, -3f), new Vector3(1.6f, 1.15f, 0.12f), new Color(0.12f, 0.72f, 0.82f), true);
            CreateWorldLabel("ECLSS WATER", deck.transform.position + new Vector3(0f, 5.6f, 0f), new Color(0.32f, 0.82f, 1f));
        }

        private void BuildAirlockBay()
        {
            GameObject deck = new GameObject("Deck_Airlock_Bay");
            deck.transform.position = new Vector3(-40, 0, 0);

            CreateRoomFloor(deck.transform, Vector3.zero, new Vector3(10f, 0.6f, 8f), new Color(0.24f, 0.2f, 0.15f));

            // Blast Hatch Door
            GameObject hatch = new GameObject("Pressurized_Blast_Hatch");
            hatch.transform.SetParent(deck.transform);
            hatch.transform.localPosition = new Vector3(-5f, 2f, 0);
            MeshFilter hmf = hatch.AddComponent<MeshFilter>();
            MeshRenderer hmr = hatch.AddComponent<MeshRenderer>();
            hatch.AddComponent<BoxCollider>();
            hmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(1.2f, 4f, 3.5f), Color.red);
            hmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.82f, 0.24f, 0.22f));
            CreateVisualPart(deck.transform, "Airlock_Hatch_Ring", PrimitiveType.Cylinder, new Vector3(-4.25f, 2f, 0f), new Vector3(2.1f, 0.16f, 2.1f), new Color(1f, 0.72f, 0.25f), true, new Vector3(0f, 0f, 90f));
            CreateWorldLabel("AIRLOCK", deck.transform.position + new Vector3(0f, 4.6f, 0f), new Color(1f, 0.74f, 0.28f));
        }

        private void BuildExteriorCraterTerrain()
        {
            GameObject exterior = new GameObject("Exterior_Crater_Terrain");
            exterior.transform.position = new Vector3(-73f, -0.3f, 0f);

            MeshFilter mf = exterior.AddComponent<MeshFilter>();
            MeshRenderer mr = exterior.AddComponent<MeshRenderer>();
            MeshCollider mc = exterior.AddComponent<MeshCollider>();

            Mesh terrain = LowPolyMeshGenerator.CreateFacetedTerrain(33, 1.64f, 1.8f, true);
            mf.sharedMesh = terrain;
            mc.sharedMesh = terrain;
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.18f, 0.22f, 0.3f), 0.2f);

            // Scoop 6-Wheel Rover
            scoopRover = new GameObject("Scoop_Rover_Vehicle");
            scoopRover.transform.position = new Vector3(-62, 0.5f, 10);
            MeshFilter rmf = scoopRover.AddComponent<MeshFilter>();
            MeshRenderer rmr = scoopRover.AddComponent<MeshRenderer>();
            scoopRover.AddComponent<BoxCollider>();
            rmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(3.8f, 1.5f, 4.5f), Color.white);
            rmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.82f, 0.88f, 0.94f));
            for (int side = -1; side <= 1; side++)
            {
                for (int flank = -1; flank <= 1; flank += 2)
                {
                    CreateVisualPart(scoopRover.transform, "Rover_Wheel_" + side + "_" + flank, PrimitiveType.Cylinder,
                        new Vector3(flank * 1.95f, -0.45f, side * 1.5f), new Vector3(0.55f, 0.34f, 0.55f), new Color(0.12f, 0.18f, 0.25f), false, new Vector3(0f, 0f, 90f));
                    CreateVisualPart(scoopRover.transform, "Rover_Hub_" + side + "_" + flank, PrimitiveType.Cylinder,
                        new Vector3(flank * 2.14f, -0.45f, side * 1.5f), new Vector3(0.23f, 0.37f, 0.23f), new Color(1f, 0.72f, 0.25f), true, new Vector3(0f, 0f, 90f));
                }
            }
            CreateVisualPart(scoopRover.transform, "Rover_Windshield", PrimitiveType.Cube, new Vector3(0f, 0.4f, 2.28f), new Vector3(2.1f, 0.62f, 0.12f), new Color(0.12f, 0.38f, 0.58f), true);
            CreateVisualPart(scoopRover.transform, "Rover_Solar_Rack", PrimitiveType.Cube, new Vector3(0f, 1.0f, -0.1f), new Vector3(2.4f, 0.12f, 1.5f), new Color(0.06f, 0.2f, 0.4f));

            // Mars Starbridge Rocket
            marsRocket = new GameObject("Mars_Starbridge_Rocket");
            marsRocket.transform.position = new Vector3(-85, 8f, 0);
            MeshFilter kmf = marsRocket.AddComponent<MeshFilter>();
            MeshRenderer kmr = marsRocket.AddComponent<MeshRenderer>();
            marsRocket.AddComponent<BoxCollider>();
            kmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(2.6f, 16f, 8, Color.white);
            kmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.88f, 0.92f, 0.96f));
            CreateVisualPart(marsRocket.transform, "Rocket_Amber_Band", PrimitiveType.Cylinder,
                new Vector3(0f, -2.9f, 0f), new Vector3(2.7f, 0.28f, 2.7f), new Color(1f, 0.68f, 0.22f), true);
            for (int i = 0; i < 4; i++)
            {
                float angle = i * 90f;
                GameObject fin = CreateVisualPart(marsRocket.transform, "Rocket_Fin_" + i, PrimitiveType.Cube,
                    new Vector3(Mathf.Sin(angle * Mathf.Deg2Rad) * 2.2f, -6.1f, Mathf.Cos(angle * Mathf.Deg2Rad) * 2.2f),
                    new Vector3(0.18f, 2.8f, 1.1f), new Color(0.76f, 0.23f, 0.2f));
                fin.transform.localRotation = Quaternion.Euler(0f, angle, 10f);
            }
        }

        private void SpawnCrewNPCs()
        {
            SpawnCrewNPC("Commander_Maya", NPCRole.MayaCommander, new Vector3(2.6f, 1.2f, 1.5f), new Color(0.9f, 0.25f, 0.3f));
            SpawnCrewNPC("Engineer_Leo", NPCRole.LeoEngineer, new Vector3(-39f, 1.2f, 2.0f), new Color(1f, 0.55f, 0.18f));
            SpawnCrewNPC("Dr_Priya", NPCRole.PriyaBotanist, new Vector3(25f, 1.2f, 2.8f), new Color(0.25f, 0.82f, 0.42f));
            SpawnCrewNPC("Scientist_Sam", NPCRole.SamScientist, new Vector3(-21f, 1.2f, 3.2f), new Color(0.25f, 0.58f, 0.95f));
        }

        private void SpawnCrewNPC(string objectName, NPCRole role, Vector3 position, Color accent)
        {
            GameObject npc = new GameObject(objectName);
            npc.transform.position = position;
            CoworkerNPC coworker = npc.AddComponent<CoworkerNPC>();
            coworker.role = role;
            coworker.suitStripeColor = accent;
            CreateAstronautVisual(npc.transform, accent, objectName + "_Suit");
            CreateWorldLabel(role.ToString().Replace("MayaCommander", "COMMANDER MAYA")
                .Replace("LeoEngineer", "ENGINEER LEO").Replace("PriyaBotanist", "DR. PRIYA")
                .Replace("SamScientist", "SCIENTIST SAM"), position + new Vector3(0f, 2.75f, 0f), accent);
        }

        private void CreateAstronautVisual(Transform parent, Color accent, string name)
        {
            GameObject rig = new GameObject(name);
            rig.transform.SetParent(parent, false);
            rig.transform.localPosition = new Vector3(0f, -0.84f, 0f);

            CreateVisualPart(rig.transform, "Pressure_Suit_Torso", PrimitiveType.Capsule, new Vector3(0f, 1.12f, 0f), new Vector3(0.62f, 0.72f, 0.48f), new Color(0.9f, 0.94f, 0.98f));
            CreateVisualPart(rig.transform, "Helmet_Shell", PrimitiveType.Sphere, new Vector3(0f, 1.9f, 0f), new Vector3(0.74f, 0.72f, 0.72f), new Color(0.95f, 0.97f, 1f));
            CreateVisualPart(rig.transform, "Reflective_Visor", PrimitiveType.Sphere, new Vector3(0f, 1.91f, 0.31f), new Vector3(0.59f, 0.42f, 0.2f), new Color(0.08f, 0.22f, 0.36f), true);
            CreateVisualPart(rig.transform, "Visor_Glint", PrimitiveType.Cube, new Vector3(-0.12f, 2.04f, 0.49f), new Vector3(0.2f, 0.035f, 0.02f), new Color(0.55f, 0.92f, 1f), true);
            CreateVisualPart(rig.transform, "PLSS_Backpack", PrimitiveType.Cube, new Vector3(0f, 1.13f, -0.43f), new Vector3(0.62f, 0.88f, 0.35f), new Color(0.35f, 0.45f, 0.56f));
            CreateVisualPart(rig.transform, "Chest_Telemetry", PrimitiveType.Cube, new Vector3(0f, 1.22f, 0.43f), new Vector3(0.42f, 0.34f, 0.09f), new Color(0.12f, 0.22f, 0.34f));
            CreateVisualPart(rig.transform, "Chest_Suit_Stripe", PrimitiveType.Cube, new Vector3(0f, 0.72f, 0.37f), new Vector3(0.48f, 0.09f, 0.08f), accent, true);
            CreateVisualPart(rig.transform, "Shoulder_Stripe_Left", PrimitiveType.Cube, new Vector3(-0.54f, 1.35f, 0f), new Vector3(0.22f, 0.1f, 0.48f), accent, true);
            CreateVisualPart(rig.transform, "Shoulder_Stripe_Right", PrimitiveType.Cube, new Vector3(0.54f, 1.35f, 0f), new Vector3(0.22f, 0.1f, 0.48f), accent, true);
            for (int side = -1; side <= 1; side += 2)
            {
                CreateVisualPart(rig.transform, "Upper_Arm_" + side, PrimitiveType.Capsule, new Vector3(side * 0.59f, 1.0f, 0f), new Vector3(0.25f, 0.43f, 0.25f), new Color(0.88f, 0.93f, 0.98f));
                CreateVisualPart(rig.transform, "Glove_" + side, PrimitiveType.Sphere, new Vector3(side * 0.61f, 0.48f, 0.03f), new Vector3(0.24f, 0.22f, 0.22f), new Color(0.81f, 0.88f, 0.94f));
                CreateVisualPart(rig.transform, "Leg_" + side, PrimitiveType.Capsule, new Vector3(side * 0.24f, 0.43f, 0f), new Vector3(0.29f, 0.4f, 0.3f), new Color(0.86f, 0.91f, 0.97f));
                CreateVisualPart(rig.transform, "Boot_" + side, PrimitiveType.Cube, new Vector3(side * 0.24f, 0.08f, 0.08f), new Vector3(0.38f, 0.22f, 0.52f), new Color(0.14f, 0.24f, 0.36f));
                CreateVisualPart(rig.transform, "Boot_Sole_" + side, PrimitiveType.Cube, new Vector3(side * 0.24f, -0.035f, 0.08f), new Vector3(0.38f, 0.06f, 0.52f), accent, true);
            }
            CreateVisualPart(rig.transform, "Helmet_Status_Light", PrimitiveType.Sphere, new Vector3(0.31f, 2.23f, -0.04f), new Vector3(0.1f, 0.1f, 0.1f), accent, true);
        }

        private GameObject CreateVisualPart(Transform parent, string partName, PrimitiveType shape, Vector3 localPosition, Vector3 scale, Color color, bool emissive = false, Vector3 localEuler = default)
        {
            GameObject part = GameObject.CreatePrimitive(shape);
            part.name = partName;
            part.transform.SetParent(parent, false);
            part.transform.localPosition = localPosition;
            part.transform.localScale = scale;
            part.transform.localEulerAngles = localEuler;
            Collider collider = part.GetComponent<Collider>();
            if (collider != null)
            {
                if (Application.isPlaying) Destroy(collider);
                else DestroyImmediate(collider);
            }
            Renderer renderer = part.GetComponent<Renderer>();
            string materialKey = ColorUtility.ToHtmlStringRGBA(color) + (emissive ? "_emissive" : "_lit");
            if (!visualMaterialCache.TryGetValue(materialKey, out Material material))
            {
                material = emissive
                    ? LowPolyMaterialFactory.GetEmissiveMaterial(color, color, 0.8f)
                    : LowPolyMaterialFactory.GetLitMaterial(color, 0.38f);
                visualMaterialCache.Add(materialKey, material);
            }
            renderer.sharedMaterial = material;
            return part;
        }

        private void CreateWorldLabel(string label, Vector3 position, Color color)
        {
            GameObject textObject = new GameObject("Label_" + label.Replace(" ", "_"));
            textObject.transform.position = position;
            TextMesh text = textObject.AddComponent<TextMesh>();
            text.text = label;
            text.fontSize = 48;
            text.characterSize = 0.07f;
            text.anchor = TextAnchor.MiddleCenter;
            text.alignment = TextAlignment.Center;
            text.color = color;
        }

        private void CreateRoomFloor(Transform parent, Vector3 localPos, Vector3 size, Color color)
        {
            GameObject floor = new GameObject("Room_Floor");
            floor.transform.SetParent(parent);
            floor.transform.localPosition = localPos;
            MeshFilter mf = floor.AddComponent<MeshFilter>();
            MeshRenderer mr = floor.AddComponent<MeshRenderer>();
            BoxCollider col = floor.AddComponent<BoxCollider>();
            col.size = size;
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(size, color);
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(color, 0.25f);
        }

        private void CreateWallWithDoor(Transform parent, Vector3 localPos, Vector3 size)
        {
            GameObject wall = new GameObject("Physical_Station_Wall");
            wall.transform.SetParent(parent);
            wall.transform.localPosition = localPos;
            MeshFilter mf = wall.AddComponent<MeshFilter>();
            MeshRenderer mr = wall.AddComponent<MeshRenderer>();
            BoxCollider col = wall.AddComponent<BoxCollider>();
            col.size = size;
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(size, new Color(0.18f, 0.22f, 0.32f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.18f, 0.22f, 0.32f), 0.3f);
        }

        private void SpawnNASACharacter()
        {
            playerAstronaut = new GameObject("NASA_Astronaut_Cadet");
            playerAstronaut.tag = "Player";
            playerAstronaut.transform.position = new Vector3(0, 1.2f, 0);

            CharacterController cc = playerAstronaut.AddComponent<CharacterController>();
            cc.height = 2.3f;
            cc.radius = 0.48f;
            cc.center = new Vector3(0f, 0.25f, 0f);

            Astronaut3DController ctrl = playerAstronaut.AddComponent<Astronaut3DController>();
            ctrl.moveSpeed = 5.0f;
            ctrl.jumpForce = 5.5f;

            CreateAstronautVisual(playerAstronaut.transform, new Color(0.25f, 0.74f, 0.9f), "Cadet_Spacesuit");

            // Camera Setup
            GameObject camObj = Camera.main != null ? Camera.main.gameObject : new GameObject("Main Camera");
            camObj.tag = "MainCamera";
            CameraController camCtrl = camObj.GetComponent<CameraController>() ?? camObj.AddComponent<CameraController>();
            camCtrl.target = playerAstronaut.transform;
        }
    }
}

