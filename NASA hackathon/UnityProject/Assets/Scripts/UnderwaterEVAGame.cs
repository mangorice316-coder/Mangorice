using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Mini-Game 1: Neutral Buoyancy Lab 3D Spacewalk (Houston, Earth).
    /// Player swims an astronaut in the giant water pool around an ISS truss mockup
    /// to tighten orbital valves before their 40-second oxygen timer runs out.
    /// </summary>
    public class UnderwaterEVAGame : MonoBehaviour
    {
        [Header("Game Elements")]
        public AstronautController playerAstronaut;
        public List<Transform> orbitalValves = new List<Transform>();
        public ParticleSystem bubbleParticles;

        [Header("State")]
        public float airSupplySeconds = 40.0f;
        public int valvesFixed = 0;
        public int totalValves = 3;
        public bool isGameActive = false;

        private void Start()
        {
            if (orbitalValves.Count == 0)
            {
                SpawnMockupAndValves();
            }
            StartGame();
        }

        public void StartGame()
        {
            airSupplySeconds = 40.0f;
            valvesFixed = 0;
            isGameActive = true;
            if (playerAstronaut != null)
            {
                playerAstronaut.mode = MovementMode.UnderwaterEVA;
                playerAstronaut.suitOxygen = airSupplySeconds;
            }
        }

        private void Update()
        {
            if (!isGameActive) return;

            airSupplySeconds -= Time.deltaTime;
            if (airSupplySeconds <= 0f)
            {
                EndGame(false);
                return;
            }

            CheckValveProximity();
        }

        private void CheckValveProximity()
        {
            if (playerAstronaut == null) return;

            for (int i = orbitalValves.Count - 1; i >= 0; i--)
            {
                var valve = orbitalValves[i];
                if (valve == null) continue;

                float dist = Vector3.Distance(playerAstronaut.transform.position, valve.position);
                if (dist < 2.5f && playerAstronaut.IsRepairing)
                {
                    valvesFixed++;
                    Destroy(valve.gameObject);
                    orbitalValves.RemoveAt(i);

                    if (valvesFixed >= totalValves)
                    {
                        EndGame(true);
                        return;
                    }
                }
            }
        }

        private void SpawnMockupAndValves()
        {
            // Spawn ISS Truss Box
            GameObject truss = new GameObject("ISS_Truss_Mockup");
            truss.transform.position = new Vector3(0, 3f, 10f);
            MeshFilter mf = truss.AddComponent<MeshFilter>();
            MeshRenderer mr = truss.AddComponent<MeshRenderer>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedBox(new Vector3(4f, 4f, 16f), new Color(0.3f, 0.4f, 0.5f));
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(new Color(0.3f, 0.4f, 0.5f));

            // Spawn 3 valves
            Vector3[] valvePositions = new Vector3[]
            {
                new Vector3(-2.2f, 3f, 6f),
                new Vector3(2.2f, 4f, 10f),
                new Vector3(0f, 5.2f, 14f)
            };

            for (int i = 0; i < valvePositions.Length; i++)
            {
                GameObject vObj = new GameObject("Valve_" + (i + 1));
                vObj.transform.position = valvePositions[i];
                MeshFilter vmf = vObj.AddComponent<MeshFilter>();
                MeshRenderer vmr = vObj.AddComponent<MeshRenderer>();
                vmf.sharedMesh = LowPolyMeshGenerator.CreateFacetedCylinder(0.4f, 0.3f, 6, Color.yellow);
                vmr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.yellow);
                orbitalValves.Add(vObj.transform);
            }
        }

        private void EndGame(bool success)
        {
            isGameActive = false;
            MiniGameManager.Instance.FinishMiniGame(MiniGameType.PoolEVA, success);
        }
    }
}

