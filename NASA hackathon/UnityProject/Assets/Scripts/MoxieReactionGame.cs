using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    public class GasMolecule
    {
        public GameObject obj;
        public bool isCracked;
        public float speed;
    }

    /// <summary>
    /// Mini-Game 4: NASA's MOXIE Experiment on Mars (800°C Atmospheric Squeezer).
    /// Time catalytic electrolysis pulses to crack 95% CO2 Martian air into breathable O2.
    /// </summary>
    public class MoxieReactionGame : MonoBehaviour
    {
        [Header("Reaction Specs")]
        public Transform reactionChamber;
        public float chamberXMin = -2.5f;
        public float chamberXMax = 2.5f;
        public float timeRemaining = 30.0f;
        public int o2Collected = 0;
        public int targetO2 = 10;
        public bool isGameActive = false;

        private List<GasMolecule> molecules = new List<GasMolecule>();
        private float spawnTimer = 0f;

        private void Start()
        {
            StartGame();
        }

        public void StartGame()
        {
            timeRemaining = 30.0f;
            o2Collected = 0;
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

            // Spawn drifting CO2 molecules
            spawnTimer += Time.deltaTime;
            if (spawnTimer >= 0.75f)
            {
                spawnTimer = 0f;
                SpawnCO2Molecule();
            }

            // Move molecules
            for (int i = molecules.Count - 1; i >= 0; i--)
            {
                var mol = molecules[i];
                mol.obj.transform.position += Vector3.right * mol.speed * Time.deltaTime;

                // Check cracking pulse
                if (Input.GetKeyDown(KeyCode.Space) && !mol.isCracked)
                {
                    float x = mol.obj.transform.position.x;
                    if (x >= chamberXMin && x <= chamberXMax)
                    {
                        mol.isCracked = true;
                        o2Collected++;
                        // Change color to cyan O2
                        var mr = mol.obj.GetComponent<MeshRenderer>();
                        if (mr) mr.sharedMaterial = LowPolyMaterialFactory.GetEmissiveMaterial(new Color(0.1f, 0.8f, 0.6f), Color.cyan, 1.8f);

                        if (o2Collected >= targetO2)
                        {
                            EndGame(true);
                            return;
                        }
                    }
                }

                // Despawn offscreen
                if (mol.obj.transform.position.x > 12f)
                {
                    Destroy(mol.obj);
                    molecules.RemoveAt(i);
                }
            }
        }

        private void SpawnCO2Molecule()
        {
            GameObject molObj = new GameObject("CO2_Molecule");
            molObj.transform.position = new Vector3(-12f, Random.Range(-1.5f, 1.5f), 0f);

            MeshFilter mf = molObj.AddComponent<MeshFilter>();
            MeshRenderer mr = molObj.AddComponent<MeshRenderer>();
            mf.sharedMesh = LowPolyMeshGenerator.CreateFacetedDome(0.6f, 4, Color.red);
            mr.sharedMaterial = LowPolyMaterialFactory.GetLitMaterial(Color.red);

            molecules.Add(new GasMolecule
            {
                obj = molObj,
                isCracked = false,
                speed = Random.Range(4.5f, 6.5f)
            });
        }

        private void EndGame(bool success)
        {
            isGameActive = false;
            foreach (var m in molecules) if (m.obj) Destroy(m.obj);
            molecules.Clear();

            MiniGameManager.Instance.FinishMiniGame(MiniGameType.MoxieSqueezer, success);
        }
    }
}

