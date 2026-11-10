using UnityEngine;

namespace NASA.ProjectStarbridge
{
    public enum CameraViewMode
    {
        BaseBuilderOrbit,
        RoverFollow,
        AstronautFollow
    }

    /// <summary>
    /// Smooth orbital and follow camera supporting base building, rover driving, and astronaut exploration.
    /// </summary>
    public class CameraController : MonoBehaviour
    {
        public static CameraController Instance { get; private set; }

        public CameraViewMode mode = CameraViewMode.BaseBuilderOrbit;
        public Transform target;

        [Header("Orbit Mode Settings")]
        public Vector3 baseCenter = new Vector3(0, 0, 0);
        public float orbitDistance = 45f;
        public float orbitHeight = 35f;
        public float rotateSpeed = 60f;

        [Header("Follow Settings")]
        public Vector3 followOffset = new Vector3(0, 6f, -12f);
        public float followSmooth = 5f;

        private float currentYaw = 45f;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void LateUpdate()
        {
            if (mode == CameraViewMode.BaseBuilderOrbit)
            {
                // Right click or A/D to orbit
                if (Input.GetMouseButton(1))
                {
                    currentYaw += Input.GetAxis("Mouse X") * rotateSpeed * 3f * Time.deltaTime;
                }

                Quaternion rotation = Quaternion.Euler(38f, currentYaw, 0f);
                Vector3 position = baseCenter + rotation * new Vector3(0, 0, -orbitDistance) + Vector3.up * orbitHeight;
                transform.position = Vector3.Lerp(transform.position, position, Time.deltaTime * 6f);
                transform.LookAt(baseCenter);
            }
            else if (target != null)
            {
                Vector3 desiredPos = target.position + target.TransformDirection(followOffset);
                transform.position = Vector3.Lerp(transform.position, desiredPos, Time.deltaTime * followSmooth);
                transform.LookAt(target.position + Vector3.up * 1.5f);
            }
        }

        public void SetMode(CameraViewMode newMode, Transform newTarget = null)
        {
            mode = newMode;
            target = newTarget;
        }
    }
}

