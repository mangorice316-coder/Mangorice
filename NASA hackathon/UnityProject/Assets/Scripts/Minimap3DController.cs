using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Displays a top-down tactical minimap schematic with clearly labeled outpost sectors
    /// (Food Area, Solar Farm, ECLSS Water, ARED Gym, Airlock, Rover Bay) and player location dot.
    /// </summary>
    public class Minimap3DController : MonoBehaviour
    {
        [Header("Minimap Setup")]
        public Camera minimapCamera;
        public Transform playerTransform;
        public float cameraHeight = 50f;

        private void Start()
        {
            if (minimapCamera == null)
            {
                GameObject camObj = new GameObject("Minimap_Camera");
                camObj.transform.SetParent(transform);
                minimapCamera = camObj.AddComponent<Camera>();
                minimapCamera.orthographic = true;
                minimapCamera.orthographicSize = 35f;
                minimapCamera.clearFlags = CameraClearFlags.SolidColor;
                minimapCamera.backgroundColor = new Color(0.02f, 0.04f, 0.09f, 0.85f);
                minimapCamera.rect = new Rect(0.35f, 0.78f, 0.3f, 0.2f); // Centered at top of screen
                camObj.transform.position = new Vector3(0, cameraHeight, 0);
                camObj.transform.rotation = Quaternion.Euler(90f, 0, 0);
            }
        }

        private void LateUpdate()
        {
            if (playerTransform != null && minimapCamera != null)
            {
                // Track player X and Z from directly above
                Vector3 pos = playerTransform.position;
                pos.y = cameraHeight;
                minimapCamera.transform.position = pos;
            }
        }
    }
}

