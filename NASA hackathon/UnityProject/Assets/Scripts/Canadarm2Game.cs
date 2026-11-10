using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Mini-Game 2: Canadarm2 3D Cargo Grapple (Low Earth Orbit / Gateway).
    /// Steer the robotic arm grapple claw to capture a drifting resupply capsule.
    /// </summary>
    public class Canadarm2Game : MonoBehaviour
    {
        [Header("Arm Hierarchy")]
        public Transform shoulderJoint;
        public Transform elbowJoint;
        public Transform wristJoint;
        public Transform grappleClaw;

        [Header("Target Capsule")]
        public Transform cargoCapsule;
        public Transform grapplePin;

        [Header("Game State")]
        public float timeRemaining = 30.0f;
        public float captureDistance = 1.8f;
        public bool isGrappled = false;
        public bool isGameActive = false;

        private float armPitch = 0f;
        private float armYaw = 0f;

        private void Start()
        {
            if (cargoCapsule == null)
            {
                SpawnCapsule();
            }
            StartGame();
        }

        public void StartGame()
        {
            timeRemaining = 30.0f;
            isGrappled = false;
            isGameActive = true;
        }

        private void Update()
        {
            if (!isGameActive) return;

            timeRemaining -= Time.deltaTime;
            if (timeRemaining <= 0f)
            {
                EndGame(false);
                return;
            }

            // Move Canadarm Joints
            float h = Input.GetAxis("Horizontal");
            float v = Input.GetAxis("Vertical");

            armYaw += h * 45f * Time.deltaTime;
            armPitch += v * 40f * Time.deltaTime;
            armPitch = Mathf.Clamp(armPitch, -60f, 60f);

            if (shoulderJoint) shoulderJoint.localRotation = Quaternion.Euler(0f, armYaw, 0f);
            if (elbowJoint) elbowJoint.localRotation = Quaternion.Euler(armPitch, 0f, 0f);

            // Capsule gently floats and tumbles
            if (cargoCapsule != null)
            {
                cargoCapsule.Rotate(new Vector3(3f, 8f, 5f) * Time.deltaTime);
                cargoCapsule.position += new Vector3(Mathf.Sin(Time.time * 0.5f) * 0.01f, Mathf.Cos(Time.time * 0.3f) * 0.005f, 0f);
            }

            // Check capture zone
            if (grappleClaw != null && grapplePin != null)
            {
                float dist = Vector3.Distance(grappleClaw.position, grapplePin.position);
                if (dist < captureDistance && Input.GetKeyDown(KeyCode.Space))
                {
                    isGrappled = true;
                    EndGame(true);
                }
            }
        }

        private void SpawnCapsule()
        {
            GameObject capsule = new GameObject("Cygnus_Cargo_Capsule");
            capsule.transform.position = new Vector3(0f, 1.5f, 8f);

            MeshFilter mf = capsule.AddComponent<MeshFilter>();
            MeshRenderer mr = capsule.AddComponent<MeshRenderer>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(1.5f, 3.5f, 8, Color.white);
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.white, 0.4f);

            // Grapple pin target
            GameObject pin = new GameObject("Grapple_Pin");
            pin.transform.SetParent(capsule.transform);
            pin.transform.localPosition = new Vector3(0f, 0f, -1.8f);

            MeshFilter pmf = pin.AddComponent<MeshFilter>();
            MeshRenderer pmr = pin.AddComponent<MeshRenderer>();
            pmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(0.2f, 0.5f, 6, Color.green);
            pmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.green);

            cargoCapsule = capsule.transform;
            grapplePin = pin.transform;
        }

        private void EndGame(bool success)
        {
            isGameActive = false;
            MiniGameManager.Instance.FinishMiniGame(MiniGameType.CanadarmCatch, success);
        }
    }
}

