using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Interactive 3D Base Builder in Unity.
    /// Handles terrain raycasting, grid snapping, spawning low-poly 3D rooms,
    /// and generating connecting umbilical tunnels between adjacent modules.
    /// </summary>
    public class BaseBuilder3D : MonoBehaviour
    {
        public static BaseBuilder3D Instance { get; private set; }

        [Header("Grid Settings")]
        public float gridSize = 14f; // Spacing between rooms
        public LayerMask terrainLayer;

        [Header("Spawned Rooms")]
        public List<BaseModule> spawnedModules = new List<BaseModule>();

        private RoomType? selectedBuildType = null;
        private GameObject ghostPreviewObj;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Update()
        {
            if (selectedBuildType.HasValue)
            {
                UpdateGhostPreview();

                if (Input.GetMouseButtonDown(0))
                {
                    TryPlaceSelectedRoom();
                }

                if (Input.GetMouseButtonDown(1) || Input.GetKeyDown(KeyCode.Escape))
                {
                    CancelBuilding();
                }
            }
        }

        public void SelectRoomToBuild(RoomType type)
        {
            selectedBuildType = type;
            CreateGhostPreview(type);
        }

        private void CreateGhostPreview(RoomType type)
        {
            if (ghostPreviewObj != null) Destroy(ghostPreviewObj);

            ghostPreviewObj = new GameObject("Build_Ghost_Preview");
            MeshFilter mf = ghostPreviewObj.AddComponent<MeshFilter>();
            MeshRenderer mr = ghostPreviewObj.AddComponent<MeshRenderer>();

            Mesh m = LowPolyMeshGenerator.CreateFacetedDome(4.5f, 5, new Color(0.2f, 0.8f, 1f, 0.5f));
            mf.sharedMesh = m;
            mr.sharedMaterial = LowPolyMaterialFactory.GetTranslucentMaterial(new Color(0.2f, 0.8f, 1f, 0.45f));
        }

        private void UpdateGhostPreview()
        {
            if (ghostPreviewObj == null) return;

            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out RaycastHit hit, 300f, terrainLayer))
            {
                Vector3 snappedPos = SnapToGrid(hit.point);
                ghostPreviewObj.transform.position = snappedPos;
            }
        }

        private Vector3 SnapToGrid(Vector3 worldPos)
        {
            float x = Mathf.Round(worldPos.x / gridSize) * gridSize;
            float z = Mathf.Round(worldPos.z / gridSize) * gridSize;
            return new Vector3(x, worldPos.y, z);
        }

        private void TryPlaceSelectedRoom()
        {
            if (!selectedBuildType.HasValue || ghostPreviewObj == null) return;

            Vector3 spawnPos = ghostPreviewObj.transform.position;

            // Check if slot already occupied
            foreach (var mod in spawnedModules)
            {
                if (Vector3.Distance(mod.transform.position, spawnPos) < gridSize * 0.7f)
                {
                    Debug.LogWarning("Module slot already occupied!");
                    return;
                }
            }

            // Build via BaseGridManager
            if (BaseGridManager.Instance.BuildRoom(selectedBuildType.Value))
            {
                Spawn3DModuleAt(selectedBuildType.Value, spawnPos);
                CancelBuilding();
            }
        }

        public BaseModule Spawn3DModuleAt(RoomType type, Vector3 position)
        {
            GameObject modObj = new GameObject("Module_" + type.ToString());
            modObj.transform.position = position;

            MeshFilter mf = modObj.AddComponent<MeshFilter>();
            MeshRenderer mr = modObj.AddComponent<MeshRenderer>();
            modObj.AddComponent<BoxCollider>();

            BaseModule module = modObj.AddComponent<BaseModule>();
            module.roomType = type;
            module.roomName = type.ToString();
            module.isBuilt = true;

            // Generate low-poly model based on room type
            Color roomColor = GetColorForRoom(type);
            Mesh roomMesh;

            if (type == RoomType.Greenhouse)
            {
                roomMesh = LowPolyMeshGenerator.CreateFacetedDome(5.0f, 6, roomColor);
                mr.sharedMaterial = LowPolyMaterialFactory.GetTranslucentMaterial(new Color(0.2f, 0.9f, 0.5f, 0.6f));
            }
            else if (type == RoomType.FuelDepot)
            {
                roomMesh = LowPolyMeshGenerator.CreateFacetedCylinder(3.5f, 7.0f, 8, roomColor);
                mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(roomColor, 0.3f);
            }
            else
            {
                roomMesh = LowPolyMeshGenerator.CreateFacetedDome(4.5f, 5, roomColor);
                mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(roomColor, 0.2f);
            }

            mf.sharedMesh = roomMesh;
            spawnedModules.Add(module);

            // Generate connecting umbilical tunnels to existing adjacent modules
            ConnectUmbilicals(module);

            return module;
        }

        private void ConnectUmbilicals(BaseModule newModule)
        {
            foreach (var existing in spawnedModules)
            {
                if (existing == newModule) continue;

                float dist = Vector3.Distance(newModule.transform.position, existing.transform.position);
                if (dist <= gridSize * 1.25f)
                {
                    // Create low-poly tunnel between them
                    GameObject tunnel = new GameObject("Tunnel_Umbilical");
                    Vector3 midPoint = (newModule.transform.position + existing.transform.position) * 0.5f;
                    tunnel.transform.position = midPoint;
                    tunnel.transform.LookAt(existing.transform.position);

                    MeshFilter tmf = tunnel.AddComponent<MeshFilter>();
                    MeshRenderer tmr = tunnel.AddComponent<MeshRenderer>();
                    tmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(1.2f, dist * 0.7f, 6, new Color(0.3f, 0.4f, 0.55f));
                    tmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.3f, 0.4f, 0.55f));
                }
            }
        }

        private Color GetColorForRoom(RoomType type)
        {
            switch (type)
            {
                case RoomType.StarterHab: return new Color(0.2f, 0.5f, 0.95f);
                case RoomType.SolarWingArm: return new Color(0.95f, 0.8f, 0.2f);
                case RoomType.GymMedBay: return new Color(0.6f, 0.3f, 0.9f);
                case RoomType.WaterShelter: return new Color(0.1f, 0.6f, 0.85f);
                case RoomType.Greenhouse: return new Color(0.2f, 0.85f, 0.5f);
                case RoomType.RoverGarageMoxie: return new Color(0.95f, 0.5f, 0.1f);
                case RoomType.FuelDepot: return new Color(0.9f, 0.25f, 0.25f);
                default: return Color.white;
            }
        }

        public void CancelBuilding()
        {
            selectedBuildType = null;
            if (ghostPreviewObj != null) Destroy(ghostPreviewObj);
        }
    }
}

