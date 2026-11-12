using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Adds a cohesive visual pass to the procedural Starbridge scene without replacing its gameplay systems.
    /// </summary>
    public static class StationVisualEnhancements
    {
        private static readonly Dictionary<int, Material> Materials = new Dictionary<int, Material>();
        private static Material suitWhite;
        private static Material suitDark;
        private static Material visor;
        private static Material steel;
        private static Material starMaterial;
        private static Material iceGlow;

        public static void Apply(StationMapGenerator map)
        {
            if (map == null) return;
            CreateMaterials();
            TuneEnvironment();
            ImproveAstronaut(map.playerAstronaut, new Color(0.12f, 0.78f, 0.96f));
            if (map.activeNPCs != null)
                foreach (CoworkerNPC npc in map.activeNPCs)
                    if (npc != null) ImproveAstronaut(npc.gameObject, RoleAccent(npc.role));

            AddDeckTrim("Deck1_Central_Command", 14.2f, new Color(0.12f, 0.78f, 0.96f));
            AddDeckTrim("Deck2_Hydroponics_Dome", 12.3f, new Color(0.2f, 0.95f, 0.66f));
            AddDeckTrim("Deck3_Crew_Gym_Quarters", 12.1f, new Color(0.76f, 0.55f, 1f));
            AddDeckTrim("Deck4_Engineering_Airlock", 12.1f, new Color(1f, 0.55f, 0.22f));
            AddCorridorMarkers();
            AddLunarSurfaceDetail();
            AddRoverDetails(map.scoopRover);
            AddRocketAndDishDetails(map.marsRocket, map.commsDish);
            AddStarfield();
        }

        private static Color RoleAccent(NPCRole role)
        {
            switch (role)
            {
                case NPCRole.MayaCommander: return new Color(0.9f, 0.2f, 0.2f);
                case NPCRole.LeoEngineer: return new Color(0.95f, 0.55f, 0.1f);
                case NPCRole.PriyaBotanist: return new Color(0.2f, 0.85f, 0.4f);
                case NPCRole.SamScientist: return new Color(0.2f, 0.6f, 0.95f);
                default: return new Color(0.12f, 0.78f, 0.96f);
            }
        }
        private static void CreateMaterials()
        {
            suitWhite = MaterialFor(new Color(0.86f, 0.92f, 0.98f), false, 0.32f);
            suitDark = MaterialFor(new Color(0.12f, 0.19f, 0.29f), false, 0.55f);
            visor = MaterialFor(new Color(0.035f, 0.19f, 0.29f), true, 0.9f);
            steel = MaterialFor(new Color(0.36f, 0.48f, 0.59f), false, 0.76f);
            starMaterial = MaterialFor(new Color(0.62f, 0.84f, 1f), true, 0.1f);
            iceGlow = MaterialFor(new Color(0.14f, 0.68f, 0.96f), true, 0.2f);
        }

        private static Material MaterialFor(Color color, bool emission, float smoothness)
        {
            int key = ColorUtility.ToHtmlStringRGBA(color).GetHashCode() ^ (emission ? 7919 : 0);
            if (Materials.TryGetValue(key, out Material cached) && cached != null) return cached;
            Material material = emission
                ? LowPolyMaterialFactory.GetEmissiveMaterial(color, color, 1.25f)
                : LowPolyMaterialFactory.GetLitMaterial(color, smoothness);
            material.name = emission ? "Starbridge_Glow_" + ColorUtility.ToHtmlStringRGB(color) : "Starbridge_Surface_" + ColorUtility.ToHtmlStringRGB(color);
            Materials[key] = material;
            return material;
        }

        private static void TuneEnvironment()
        {
            RenderSettings.ambientMode = AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.16f, 0.24f, 0.38f);
            RenderSettings.ambientEquatorColor = new Color(0.11f, 0.15f, 0.22f);
            RenderSettings.ambientGroundColor = new Color(0.035f, 0.045f, 0.075f);
            RenderSettings.ambientIntensity = 1.05f;
            RenderSettings.reflectionIntensity = 0.7f;
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.Linear;
            RenderSettings.fogColor = new Color(0.018f, 0.035f, 0.075f);
            RenderSettings.fogStartDistance = 150f;
            RenderSettings.fogEndDistance = 360f;
        }

        private static void ImproveAstronaut(GameObject actor, Color accent)
        {
            if (actor == null || actor.transform.Find("Suit_Visual_Rig") != null) return;
            MeshFilter oldMesh = actor.GetComponent<MeshFilter>();
            MeshRenderer oldRenderer = actor.GetComponent<MeshRenderer>();
            if (oldRenderer != null) Object.Destroy(oldRenderer);
            if (oldMesh != null) Object.Destroy(oldMesh);

            CharacterController controller = actor.GetComponent<CharacterController>();
            if (controller != null)
            {
                controller.height = 2.15f;
                controller.radius = 0.43f;
                controller.center = new Vector3(0f, 0.06f, 0f);
            }

            Transform rig = new GameObject("Suit_Visual_Rig").transform;
            rig.SetParent(actor.transform, false);
            rig.localPosition = Vector3.zero;

            Part(rig, "Pressure_Suit_Torso", PrimitiveType.Capsule, new Vector3(0f, 0.06f, 0f), new Vector3(0.46f, 0.43f, 0.32f), suitWhite);
            Part(rig, "Lower_Hip_Seal", PrimitiveType.Cylinder, new Vector3(0f, -0.35f, 0f), new Vector3(0.43f, 0.12f, 0.31f), steel);
            Part(rig, "Helmet_Shell", PrimitiveType.Sphere, new Vector3(0f, 0.78f, 0f), new Vector3(0.62f, 0.57f, 0.57f), suitWhite);
            Part(rig, "Helmet_Neck_Ring", PrimitiveType.Cylinder, new Vector3(0f, 0.49f, 0f), new Vector3(0.43f, 0.13f, 0.42f), steel);
            Part(rig, "Reflective_Visor", PrimitiveType.Sphere, new Vector3(0f, 0.79f, 0.245f), new Vector3(0.49f, 0.34f, 0.19f), visor);
            Part(rig, "Visor_Highlight", PrimitiveType.Cube, new Vector3(-0.12f, 0.91f, 0.34f), new Vector3(0.16f, 0.035f, 0.025f), starMaterial);
            Part(rig, "Life_Support_Pack", PrimitiveType.Cube, new Vector3(0f, 0.03f, -0.34f), new Vector3(0.55f, 0.74f, 0.3f), suitDark);
            Part(rig, "Pack_Left_Canister", PrimitiveType.Cylinder, new Vector3(-0.22f, 0.04f, -0.51f), new Vector3(0.12f, 0.54f, 0.12f), steel);
            Part(rig, "Pack_Right_Canister", PrimitiveType.Cylinder, new Vector3(0.22f, 0.04f, -0.51f), new Vector3(0.12f, 0.54f, 0.12f), steel);
            Part(rig, "Telemetry_Display", PrimitiveType.Cube, new Vector3(0f, 0.11f, 0.3f), new Vector3(0.31f, 0.23f, 0.07f), visor);
            Part(rig, "Telemetry_Glow", PrimitiveType.Cube, new Vector3(0f, 0.12f, 0.343f), new Vector3(0.18f, 0.045f, 0.018f), starMaterial);
            Part(rig, "Chest_Accent", PrimitiveType.Cube, new Vector3(0f, -0.19f, 0.286f), new Vector3(0.4f, 0.065f, 0.055f), MaterialFor(accent, true, 0.45f));

            for (int side = -1; side <= 1; side += 2)
            {
                Part(rig, "Arm_Upper_" + side, PrimitiveType.Capsule, new Vector3(side * 0.49f, -0.02f, 0f), new Vector3(0.19f, 0.35f, 0.19f), suitWhite);
                Part(rig, "Arm_Cuff_" + side, PrimitiveType.Cylinder, new Vector3(side * 0.53f, -0.34f, 0f), new Vector3(0.22f, 0.13f, 0.22f), MaterialFor(accent, false, 0.45f));
                Part(rig, "Glove_" + side, PrimitiveType.Sphere, new Vector3(side * 0.53f, -0.48f, 0.015f), new Vector3(0.2f, 0.19f, 0.2f), suitDark);
                Part(rig, "Leg_" + side, PrimitiveType.Capsule, new Vector3(side * 0.19f, -0.58f, 0f), new Vector3(0.2f, 0.36f, 0.22f), suitWhite);
                Part(rig, "Knee_Plate_" + side, PrimitiveType.Cube, new Vector3(side * 0.19f, -0.55f, 0.19f), new Vector3(0.22f, 0.12f, 0.06f), steel);
                Part(rig, "Boot_" + side, PrimitiveType.Cube, new Vector3(side * 0.19f, -0.91f, 0.055f), new Vector3(0.34f, 0.21f, 0.43f), suitDark);
                Part(rig, "Boot_Accent_" + side, PrimitiveType.Cube, new Vector3(side * 0.19f, -0.91f, 0.27f), new Vector3(0.23f, 0.055f, 0.025f), MaterialFor(accent, true, 0.45f));
                Part(rig, "Shoulder_Patch_" + side, PrimitiveType.Cube, new Vector3(side * 0.48f, 0.2f, 0.12f), new Vector3(0.16f, 0.14f, 0.08f), MaterialFor(accent, false, 0.4f));
            }
            Part(rig, "Helmet_Beacon", PrimitiveType.Sphere, new Vector3(0.26f, 1.06f, 0f), new Vector3(0.09f, 0.09f, 0.09f), MaterialFor(accent, true, 0.3f));
        }

        private static void AddDeckTrim(string deckName, float radius, Color accent)
        {
            GameObject deck = GameObject.Find(deckName);
            if (deck == null || deck.transform.Find("Visual_Upgrade_Trim") != null) return;
            Transform trim = new GameObject("Visual_Upgrade_Trim").transform;
            trim.SetParent(deck.transform, false);
            Material glow = MaterialFor(accent, true, 0.5f);
            Material structure = MaterialFor(new Color(0.28f, 0.39f, 0.51f), false, 0.65f);

            for (int i = 0; i < 16; i++)
            {
                float angle = i * 22.5f;
                float radians = angle * Mathf.Deg2Rad;
                Vector3 position = new Vector3(Mathf.Cos(radians) * radius, 0.48f, Mathf.Sin(radians) * radius);
                Part(trim, "Perimeter_Light_" + i, PrimitiveType.Cube, position, new Vector3(0.95f, 0.08f, 0.18f), glow, Quaternion.Euler(0f, -angle, 0f));
                if (i % 2 == 0)
                    Part(trim, "Hull_Rib_" + i, PrimitiveType.Cube, new Vector3(Mathf.Cos(radians) * (radius + 0.45f), 0.95f, Mathf.Sin(radians) * (radius + 0.45f)), new Vector3(0.16f, 1.9f, 0.2f), structure, Quaternion.Euler(0f, -angle, 0f));
            }

            AddPointLight(trim, "Deck_Ambient_Light", accent, new Vector3(0f, 5.5f, 0f), 12f, 1.35f);
        }

        private static void AddCorridorMarkers()
        {
            Material cyan = MaterialFor(new Color(0.14f, 0.78f, 0.98f), true, 0.5f);
            Material amber = MaterialFor(new Color(1f, 0.58f, 0.2f), true, 0.5f);
            for (int i = 1; i <= 8; i++)
            {
                float x = i * 3.8f;
                PartAt("Corridor_Guide_X_" + i, new Vector3(x, 0.35f, -1.42f), new Vector3(0.75f, 0.08f, 0.12f), i % 2 == 0 ? cyan : amber);
                PartAt("Corridor_Guide_Z_" + i, new Vector3(1.42f, 0.35f, x), new Vector3(0.12f, 0.08f, 0.75f), i % 2 == 0 ? cyan : amber);
                PartAt("Corridor_Guide_NegX_" + i, new Vector3(-x, 0.35f, 1.42f), new Vector3(0.75f, 0.08f, 0.12f), i % 2 == 0 ? cyan : amber);
            }
        }

        private static void AddLunarSurfaceDetail()
        {
            GameObject terrain = GameObject.Find("Lunar_Surface_Terrain");
            if (terrain == null || terrain.transform.Find("Visual_Upgrade_Rock_Field") != null) return;
            Transform field = new GameObject("Visual_Upgrade_Rock_Field").transform;
            field.SetParent(terrain.transform, false);
            Random.State previous = Random.state;
            Random.InitState(91372);
            Material basalt = MaterialFor(new Color(0.2f, 0.24f, 0.32f), false, 0.15f);
            Material regolith = MaterialFor(new Color(0.35f, 0.38f, 0.45f), false, 0.08f);
            const float size = 45f;
            const float spacing = 4.2f;
            const float maxHeight = 26f;
            float halfSize = size * spacing * 0.5f;
            for (int i = 0; i < 48; i++)
            {
                float x = Random.Range(-42f, 42f);
                float z = Random.Range(-42f, 42f);
                float radius = Mathf.Sqrt(x * x + z * z);
                float craterRadius = halfSize * 0.65f;
                float height;
                if (radius < craterRadius)
                    height = Mathf.Cos(radius / craterRadius * Mathf.PI) * (maxHeight * 0.4f);
                else
                    height = Mathf.Max(0f, maxHeight * 0.35f - (radius - craterRadius) * 0.25f);
                float gx = (x + halfSize) / spacing;
                float gz = (z + halfSize) / spacing;
                height += Mathf.PerlinNoise(gx * 0.15f, gz * 0.15f) * (maxHeight * 0.25f);
                float rockScale = Random.Range(0.45f, 1.4f);
                GameObject rock = Part(field, "Basalt_Boulder_" + i, PrimitiveType.Sphere,
                    new Vector3(x, height + rockScale * 0.22f, z),
                    new Vector3(rockScale * Random.Range(0.75f, 1.35f), rockScale * 0.55f, rockScale * Random.Range(0.75f, 1.35f)),
                    i % 3 == 0 ? basalt : regolith,
                    Quaternion.Euler(Random.Range(-12f, 12f), Random.Range(0f, 360f), Random.Range(-12f, 12f)));
                if (i % 6 == 0)
                    Part(field, "Ice_Crystal_Glint_" + i, PrimitiveType.Cube, rock.transform.localPosition + new Vector3(0f, 0.3f, 0f), new Vector3(0.09f, 0.65f, 0.09f), iceGlow, Quaternion.Euler(0f, Random.Range(0f, 360f), 24f));
            }
            Random.state = previous;
        }

        private static void AddRoverDetails(GameObject rover)
        {
            if (rover == null || rover.transform.Find("Visual_Upgrade_Rover") != null) return;
            Transform detail = new GameObject("Visual_Upgrade_Rover").transform;
            detail.SetParent(rover.transform, false);
            Material panel = MaterialFor(new Color(0.035f, 0.13f, 0.26f), false, 0.8f);
            Material gold = MaterialFor(new Color(1f, 0.62f, 0.2f), true, 0.45f);
            Part(detail, "Solar_Panel_Left", PrimitiveType.Cube, new Vector3(-1.95f, 0.78f, -0.1f), new Vector3(1.05f, 0.09f, 2.7f), panel, Quaternion.Euler(0f, 0f, -9f));
            Part(detail, "Solar_Panel_Right", PrimitiveType.Cube, new Vector3(1.95f, 0.78f, -0.1f), new Vector3(1.05f, 0.09f, 2.7f), panel, Quaternion.Euler(0f, 0f, 9f));
            for (int side = -1; side <= 1; side += 2)
            for (int row = -1; row <= 1; row++)
                Part(detail, "Solar_Cell_" + side + "_" + row, PrimitiveType.Cube, new Vector3(side * 1.95f, 0.84f, row * 0.76f), new Vector3(0.9f, 0.025f, 0.035f), gold);
            Part(detail, "Sensor_Mast", PrimitiveType.Cylinder, new Vector3(0f, 1.28f, -1.2f), new Vector3(0.06f, 0.62f, 0.06f), steel);
            Part(detail, "Sensor_Head", PrimitiveType.Sphere, new Vector3(0f, 1.88f, -1.2f), new Vector3(0.2f, 0.16f, 0.22f), gold);
            Part(detail, "Front_Bumper", PrimitiveType.Cube, new Vector3(0f, -0.35f, 2.05f), new Vector3(2.9f, 0.18f, 0.2f), steel);
        }

        private static void AddRocketAndDishDetails(GameObject rocket, GameObject dish)
        {
            if (rocket != null && rocket.transform.Find("Visual_Upgrade_Rocket") == null)
            {
                Transform details = new GameObject("Visual_Upgrade_Rocket").transform;
                details.SetParent(rocket.transform, false);
                Material dark = MaterialFor(new Color(0.08f, 0.16f, 0.25f), false, 0.62f);
                Material amber = MaterialFor(new Color(1f, 0.58f, 0.16f), true, 0.4f);
                Part(details, "Upper_Thermal_Band", PrimitiveType.Cylinder, new Vector3(0f, 4.2f, 0f), new Vector3(2.65f, 0.18f, 2.65f), dark);
                Part(details, "Lower_Thermal_Band", PrimitiveType.Cylinder, new Vector3(0f, -2.2f, 0f), new Vector3(2.75f, 0.16f, 2.75f), amber);
                Part(details, "Nose_Cap", PrimitiveType.Sphere, new Vector3(0f, 9.1f, 0f), new Vector3(1.3f, 1.7f, 1.3f), suitWhite);
            }
            if (dish != null && dish.transform.Find("Visual_Upgrade_Dish") == null)
            {
                Transform details = new GameObject("Visual_Upgrade_Dish").transform;
                details.SetParent(dish.transform, false);
                Material white = MaterialFor(new Color(0.88f, 0.93f, 0.98f), false, 0.72f);
                Part(details, "Dish_Feed_Arm", PrimitiveType.Cylinder, new Vector3(0f, 1.9f, 0.1f), new Vector3(0.1f, 1.8f, 0.1f), white, Quaternion.Euler(0f, 0f, 20f));
                Part(details, "Dish_Feed_Horn", PrimitiveType.Sphere, new Vector3(0f, 2.95f, 0.15f), new Vector3(0.32f, 0.32f, 0.32f), MaterialFor(new Color(0.18f, 0.8f, 1f), true, 0.3f));
            }
        }

        private static void AddStarfield()
        {
            if (GameObject.Find("--- STARFIELD ---") != null) return;
            Transform field = new GameObject("--- STARFIELD ---").transform;
            Material warmStar = MaterialFor(new Color(1f, 0.76f, 0.49f), true, 0.1f);
            Random.State previous = Random.state;
            Random.InitState(38621);
            for (int i = 0; i < 110; i++)
            {
                Vector3 direction = Random.onUnitSphere;
                float distance = Random.Range(180f, 330f);
                Vector3 scale = Vector3.one * Random.Range(0.22f, 0.58f);
                Part(field, "Star_" + i, PrimitiveType.Sphere, direction * distance, scale,
                    i % 7 == 0 ? warmStar : starMaterial);
            }
            Random.state = previous;
        }

        private static void AddPointLight(Transform parent, string name, Color color, Vector3 position, float range, float intensity)
        {
            GameObject lightObject = new GameObject(name);
            lightObject.transform.SetParent(parent, false);
            lightObject.transform.localPosition = position;
            Light light = lightObject.AddComponent<Light>();
            light.type = LightType.Point;
            light.color = color;
            light.range = range;
            light.intensity = intensity;
            light.shadows = LightShadows.None;
        }

        private static void PartAt(string name, Vector3 worldPosition, Vector3 scale, Material material)
        {
            GameObject part = Part(null, name, PrimitiveType.Cube, worldPosition, scale, material);
            part.transform.position = worldPosition;
        }

        private static GameObject Part(Transform parent, string name, PrimitiveType shape, Vector3 position, Vector3 scale, Material material, Quaternion rotation = default)
        {
            GameObject part = GameObject.CreatePrimitive(shape);
            part.name = name;
            Collider collider = part.GetComponent<Collider>();
            if (collider != null) Object.Destroy(collider);
            part.transform.SetParent(parent, false);
            part.transform.localPosition = position;
            part.transform.localScale = scale;
            if (rotation != default) part.transform.localRotation = rotation;
            Renderer renderer = part.GetComponent<Renderer>();
            renderer.sharedMaterial = material;
            return part;
        }
    }
}

