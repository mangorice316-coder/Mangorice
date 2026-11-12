using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Controls "Scoop" the 6-wheeled autonomous low-poly ice-mining rover in 3D.
    /// Handles wheel rotation, low-gravity terrain suspension, headlights, and ice core drilling.
    /// </summary>
    [RequireComponent(typeof(Rigidbody))]
    public class RoverController : MonoBehaviour
    {
        [Header("Drive Specs")]
        [SerializeField] private float motorTorque = 18f;
        [SerializeField] private float steerSpeed = 65f;
        [SerializeField] private float maxSpeed = 12f;

        [Header("Wheel Transforms")]
        public Transform[] leftWheels;
        public Transform[] rightWheels;

        [Header("Drill Equipment")]
        public Transform drillArm;
        public Transform drillBit;
        public Light[] headlights;

        private Rigidbody rb;
        private bool isDrilling = false;
        private float drillDepth = 0f;

        public bool IsDrilling => isDrilling;

        private void Awake()
        {
            rb = GetComponent<Rigidbody>();
            rb.mass = 450f; // Rover mass in kg
            rb.linearDamping = 0.5f;
            rb.angularDamping = 1.5f;
        }

        private void Update()
        {
            HandleDrillInput();
            AnimateWheels();
        }

        private void FixedUpdate()
        {
            if (isDrilling) return; // Anchor rover when drilling core sample

            float v = Input.GetAxis("Vertical");
            float h = Input.GetAxis("Horizontal");

            // Steering
            if (Mathf.Abs(h) > 0.05f)
            {
                float turn = h * steerSpeed * Time.fixedDeltaTime;
                Quaternion turnRotation = Quaternion.Euler(0f, turn, 0f);
                rb.MoveRotation(rb.rotation * turnRotation);
            }

            // Motor drive
            if (Mathf.Abs(v) > 0.05f && rb.linearVelocity.magnitude < maxSpeed)
            {
                Vector3 moveForce = transform.forward * (v * motorTorque * rb.mass);
                rb.AddForce(moveForce, ForceMode.Force);
            }
        }

        private void HandleDrillInput()
        {
            if (Input.GetKey(KeyCode.Space))
            {
                isDrilling = true;
                drillDepth = Mathf.MoveTowards(drillDepth, 1.2f, Time.deltaTime * 0.8f);

                if (drillBit != null)
                {
                    drillBit.Rotate(Vector3.forward, 720f * Time.deltaTime, Space.Self);
                }

                if (drillArm != null)
                {
                    drillArm.localPosition = new Vector3(drillArm.localPosition.x, -drillDepth * 0.4f, drillArm.localPosition.z);
                }
            }
            else
            {
                isDrilling = false;
                drillDepth = Mathf.MoveTowards(drillDepth, 0f, Time.deltaTime * 1.5f);
                if (drillArm != null)
                {
                    drillArm.localPosition = new Vector3(drillArm.localPosition.x, -drillDepth * 0.4f, drillArm.localPosition.z);
                }
            }
        }

        private void AnimateWheels()
        {
            float speed = Vector3.Dot(rb.linearVelocity, transform.forward);
            float rotationAmount = (speed / 0.4f) * Mathf.Rad2Deg * Time.deltaTime;

            if (leftWheels != null)
            {
                foreach (var w in leftWheels) if (w) w.Rotate(Vector3.right, rotationAmount, Space.Self);
            }
            if (rightWheels != null)
            {
                foreach (var w in rightWheels) if (w) w.Rotate(Vector3.right, rotationAmount, Space.Self);
            }
        }

        public void ToggleHeadlights(bool on)
        {
            if (headlights != null)
            {
                foreach (var light in headlights) if (light) light.enabled = on;
            }
        }
    }
}

