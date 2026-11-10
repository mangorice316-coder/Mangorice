using UnityEngine;

namespace NASA.ProjectStarbridge
{
    public enum MovementMode
    {
        SurfaceLowG, // Lunar / Martian surface low-gravity walking & jumping
        UnderwaterEVA // Neutral Buoyancy Lab swimming
    }

    /// <summary>
    /// Controls low-poly cadet astronauts in 3D across low-gravity surface walking
    /// and underwater Neutral Buoyancy Lab simulation.
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    public class AstronautController : MonoBehaviour
    {
        [Header("Movement")]
        public MovementMode mode = MovementMode.SurfaceLowG;
        public float moveSpeed = 4.5f;
        public float jumpForce = 4.0f;
        public float gravity = 3.5f; // Low gravity default (1/6g Moon)

        [Header("Underwater Buoyancy")]
        public float waterDrag = 0.92f;
        public float swimSpeed = 3.5f;

        [Header("Life Support (Suit)")]
        public float suitOxygen = 100f; // Seconds
        public bool isOxygenDepleted = false;

        private CharacterController controller;
        private Vector3 velocity;

        public bool IsRepairing { get; private set; }

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
        }

        private void Update()
        {
            if (mode == MovementMode.SurfaceLowG)
            {
                UpdateSurfaceMovement();
            }
            else
            {
                UpdateUnderwaterMovement();
            }

            IsRepairing = Input.GetKey(KeyCode.Space);

            // Deplete suit oxygen
            if (suitOxygen > 0f)
            {
                suitOxygen -= Time.deltaTime;
                if (suitOxygen <= 0f)
                {
                    suitOxygen = 0f;
                    isOxygenDepleted = true;
                }
            }
        }

        private void UpdateSurfaceMovement()
        {
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");

            Vector3 move = transform.right * h + transform.forward * v;
            controller.Move(move * moveSpeed * Time.deltaTime);

            if (controller.isGrounded)
            {
                velocity.y = -0.5f;
                if (Input.GetButtonDown("Jump"))
                {
                    velocity.y = jumpForce;
                }
            }
            else
            {
                velocity.y -= gravity * Time.deltaTime;
            }

            controller.Move(velocity * Time.deltaTime);
        }

        private void UpdateUnderwaterMovement()
        {
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");
            float up = 0f;

            if (Input.GetKey(KeyCode.E) || Input.GetKey(KeyCode.Space)) up = 1f;
            if (Input.GetKey(KeyCode.Q) || Input.GetKey(KeyCode.LeftControl)) up = -1f;

            Vector3 swimVector = (transform.right * h + transform.forward * v + transform.up * up) * swimSpeed;
            velocity = Vector3.Lerp(velocity, swimVector, Time.deltaTime * 3f);
            velocity *= waterDrag;

            controller.Move(velocity * Time.deltaTime);
        }

        public void SetGravityForWorld(int worldIdx)
        {
            if (worldIdx == 0) // Earth NBL Pool
            {
                mode = MovementMode.UnderwaterEVA;
            }
            else if (worldIdx == 2) // Moon
            {
                mode = MovementMode.SurfaceLowG;
                gravity = 1.62f; // 1/6th g
                jumpForce = 5.5f;
            }
            else if (worldIdx == 3) // Mars
            {
                mode = MovementMode.SurfaceLowG;
                gravity = 3.72f; // 3/8th g
                jumpForce = 4.2f;
            }
        }
    }
}

