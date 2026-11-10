using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// 2.5D Astronaut Controller for Unity 6.
    /// Smooth horizontal side-scrolling movement along the X-axis with floaty low-gravity jumping,
    /// thruster particles, and interaction with outpost habitat modules.
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    public class Astronaut25DController : MonoBehaviour
    {
        [Header("2.5D Movement Settings")]
        public float moveSpeed = 6.0f;
        public float jumpForce = 5.5f;
        public float gravity = 9.8f * 0.166f; // Lunar 1/6th gravity by default
        public float fixedZ = 0.0f; // Locked to 2.5D plane

        private CharacterController controller;
        private Vector3 velocity;
        private bool isGrounded;
        private Transform visualSuit;

        private void Start()
        {
            controller = GetComponent<CharacterController>();
            visualSuit = transform.Find("VisualModel") ?? transform;
        }

        private void Update()
        {
            isGrounded = controller.isGrounded;
            if (isGrounded && velocity.y < 0)
            {
                velocity.y = -1.0f;
            }

            // 1. Horizontal 2.5D Input (A/D or Left/Right)
            float moveInput = Input.GetAxis("Horizontal");
            Vector3 move = new Vector3(moveInput * moveSpeed, 0, 0);

            // Turn astronaut visual to face movement direction
            if (Mathf.Abs(moveInput) > 0.1f)
            {
                float targetAngle = moveInput > 0 ? 90f : -90f;
                visualSuit.rotation = Quaternion.Euler(0, targetAngle, 0);
            }

            // 2. Floaty Zero-G Jump
            if (Input.GetButtonDown("Jump") && isGrounded)
            {
                velocity.y = jumpForce;
            }

            // 3. Apply Low Gravity
            velocity.y -= gravity * Time.deltaTime;

            // 4. Move Controller along locked 2.5D plane
            Vector3 finalMove = (move + velocity) * Time.deltaTime;
            controller.Move(finalMove);

            // Strict 2.5D plane locking
            Vector3 p = transform.position;
            if (Mathf.Abs(p.z - fixedZ) > 0.01f)
            {
                p.z = fixedZ;
                transform.position = p;
            }
        }
    }
}

