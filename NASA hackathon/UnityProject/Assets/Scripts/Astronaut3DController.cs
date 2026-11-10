using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// 3D NASA Spacesuit Astronaut Controller for Unity 6.
    /// Provides 360-degree movement, smooth mouse look, physical collision detection
    /// with station walls and obstacles, and customizable planetary gravity (Moon 0.166g vs Mars 0.38g).
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    public class Astronaut3DController : MonoBehaviour
    {
        [Header("Movement Settings")]
        public float moveSpeed = 5.0f;
        public float jumpForce = 4.5f;
        public float gravity = 9.81f * 0.166f; // Default Lunar 0.166g
        public bool isMarsGravity = false;

        [Header("Look Settings")]
        public Transform cameraFollowTarget;
        public float mouseSensitivity = 2.0f;
        public float minPitch = -45f;
        public float maxPitch = 60f;

        private CharacterController controller;
        private Vector3 velocity = Vector3.zero;
        private float pitch = 0f;

        private void Start()
        {
            controller = GetComponent<CharacterController>();
            SetPlanetaryGravity(isMarsGravity);
        }

        public void SetPlanetaryGravity(bool mars)
        {
            isMarsGravity = mars;
            gravity = mars ? (9.81f * 0.38f) : (9.81f * 0.166f);
        }

        private void Update()
        {
            // 1. Mouse Look Rotation
            float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
            float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

            transform.Rotate(Vector3.up * mouseX);
            pitch = Mathf.Clamp(pitch - mouseY, minPitch, maxPitch);

            if (cameraFollowTarget != null)
            {
                cameraFollowTarget.localRotation = Quaternion.Euler(pitch, 0, 0);
            }

            // 2. 360-Degree WASD Movement
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");

            Vector3 move = (transform.right * h + transform.forward * v).normalized * moveSpeed;

            // 3. Ground & Gravity Check
            if (controller.isGrounded)
            {
                if (velocity.y < 0) velocity.y = -1.0f;

                if (Input.GetButtonDown("Jump"))
                {
                    velocity.y = isMarsGravity ? 4.0f : 5.5f; // Floaty lunar jump
                }
            }
            else
            {
                velocity.y -= gravity * Time.deltaTime;
            }

            // 4. Move with physical collision against walls and doors
            Vector3 finalVelocity = (move + velocity) * Time.deltaTime;
            controller.Move(finalVelocity);
        }
    }
}

