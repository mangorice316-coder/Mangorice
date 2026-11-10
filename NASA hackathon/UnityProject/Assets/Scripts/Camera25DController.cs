using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Smooth 2.5D tracking camera for Unity 6.
    /// Follows the player along the X/Y plane with depth perspective,
    /// dynamic lookahead, and smooth parallax offset.
    /// </summary>
    public class Camera25DController : MonoBehaviour
    {
        [Header("Target Tracking")]
        public Transform target;
        public Vector3 offset = new Vector3(0, 3.5f, -18f);
        public float smoothSpeed = 5.0f;
        public float lookAheadDistance = 2.0f;

        [Header("Parallax Elements")]
        public Transform distantEarth;
        public Transform backgroundMountains;

        private Vector3 velocity = Vector3.zero;

        private void LateUpdate()
        {
            if (target == null) return;

            // Compute target position with lookahead
            float targetX = target.position.x;
            float targetY = Mathf.Max(target.position.y + offset.y, 2.5f);
            Vector3 desiredPosition = new Vector3(targetX + offset.x, targetY, offset.z);

            transform.position = Vector3.SmoothDamp(transform.position, desiredPosition, ref velocity, 1.0f / smoothSpeed);
            transform.LookAt(new Vector3(transform.position.x, target.position.y + 1.5f, 0));

            // Parallax effect for deep space Earth and mountains
            if (distantEarth != null)
            {
                distantEarth.position = new Vector3(transform.position.x * 0.92f + 40f, 35f, 120f);
            }
            if (backgroundMountains != null)
            {
                backgroundMountains.position = new Vector3(transform.position.x * 0.4f, -4f, 40f);
            }
        }
    }
}

