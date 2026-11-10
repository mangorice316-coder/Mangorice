using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Mini-Game 3: Scoop the Rover Ice-Mining in Shackleton Crater (Moon).
    /// Drive the 6-wheeled rover in freezing pitch-black crater shadows to drill
    /// frozen crater water ice cores for rocket propellant.
    /// </summary>
    public class RoverIceMiningGame : MonoBehaviour
    {
        [Header("Rover")]
        public RoverController rover;

        [Header("Crater Elements")]
        public List<Transform> iceDeposits = new List<Transform>();
        public List<Transform> boulders = new List<Transform>();

        [Header("State")]
        public float batterySeconds = 45.0f;
        public float iceExtractedLiters = 0f;
        public float targetLiters = 100f;
        public bool isGameActive = false;

        private void Start()
        {
            if (iceDeposits.Count == 0)
            {
                SpawnDeposits();
            }
            StartGame();
        }

        public void StartGame()
        {
            batterySeconds = 45.0f;
            iceExtractedLiters = 0f;
            isGameActive = true;
            if (rover != null)
            {
                rover.ToggleHeadlights(true);
            }
        }

        private void Update()
        {
            if (!isGameActive) return;

            batterySeconds -= Time.deltaTime;
            if (batterySeconds <= 0f)
            {
                EndGame(false);
                return;
            }

            CheckIceDrilling();
        }

        private void CheckIceDrilling()
        {
            if (rover == null || !rover.IsDrilling) return;

            for (int i = iceDeposits.Count - 1; i >= 0; i--)
            {
                var ice = iceDeposits[i];
                if (ice == null) continue;

                float dist = Vector3.Distance(rover.transform.position, ice.position);
                if (dist < 4.0f)
                {
                    iceExtractedLiters += Time.deltaTime * 25f;
                    ice.localScale = Vector3.MoveTowards(ice.localScale, Vector3.zero, Time.deltaTime * 0.3f);

                    if (ice.localScale.x <= 0.1f)
                    {
                        Destroy(ice.gameObject);
                        iceDeposits.RemoveAt(i);
                    }

                    if (iceExtractedLiters >= targetLiters)
                    {
                        EndGame(true);
                        return;
                    }
                }
            }
        }

        private void SpawnDeposits()
        {
            Vector3[] depositPositions = new Vector3[]
            {
                new Vector3(-12f, 0f, 15f),
                new Vector3(8f, 0f, 22f),
                new Vector3(18f, 0f, 8f)
            };

            for (int i = 0; i < depositPositions.Length; i++)
            {
                GameObject iceObj = new GameObject("IceDeposit_" + (i + 1));
                iceObj.transform.position = depositPositions[i];

                MeshFilter mf = iceObj.AddComponent<MeshFilter>();
                MeshRenderer mr = iceObj.AddComponent<MeshRenderer>();
                mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(1.5f, 4, new Color(0.2f, 0.8f, 1f));
                mr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(new Color(0.1f, 0.5f, 0.9f), Color.cyan, 2.0f);

                iceDeposits.Add(iceObj.transform);
            }
        }

        private void EndGame(bool success)
        {
            isGameActive = false;
            MiniGameManager.Instance.FinishMiniGame(MiniGameType.RoverMining, success);
        }
    }
}

