using System.Collections.Generic;
using UnityEngine;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Procedural Low-Poly 3D Mesh Generator.
    /// Creates faceted, flat-shaded 3D geometry for habitats, rovers, astronauts,
    /// solar arrays, and crater terrain directly in Unity with zero external modeling dependencies.
    /// </summary>
    public static class LowPolyMeshGenerator
    {
        /// <summary>
        /// Converts any mesh into a faceted flat-shaded mesh by giving each triangle
        /// its own independent, unshared vertices with face normals.
        /// </summary>
        public static Mesh MakeFaceted(Mesh inputMesh)
        {
            Vector3[] origVerts = inputMesh.vertices;
            int[] origTris = inputMesh.triangles;
            Vector2[] origUVs = inputMesh.uv;
            Color[] origColors = inputMesh.colors;

            int triCount = origTris.Length;
            Vector3[] newVerts = new Vector3[triCount];
            Vector2[] newUVs = new Vector2[triCount];
            Color[] newColors = new Color[triCount];
            int[] newTris = new int[triCount];
            Vector3[] newNormals = new Vector3[triCount];

            for (int i = 0; i < triCount; i += 3)
            {
                int i0 = origTris[i];
                int i1 = origTris[i + 1];
                int i2 = origTris[i + 2];

                Vector3 v0 = origVerts[i0];
                Vector3 v1 = origVerts[i1];
                Vector3 v2 = origVerts[i2];

                newVerts[i] = v0;
                newVerts[i + 1] = v1;
                newVerts[i + 2] = v2;

                if (origUVs != null && origUVs.Length == origVerts.Length)
                {
                    newUVs[i] = origUVs[i0];
                    newUVs[i + 1] = origUVs[i1];
                    newUVs[i + 2] = origUVs[i2];
                }

                if (origColors != null && origColors.Length == origVerts.Length)
                {
                    newColors[i] = origColors[i0];
                    newColors[i + 1] = origColors[i1];
                    newColors[i + 2] = origColors[i2];
                }
                else
                {
                    newColors[i] = Color.white;
                    newColors[i + 1] = Color.white;
                    newColors[i + 2] = Color.white;
                }

                newTris[i] = i;
                newTris[i + 1] = i + 1;
                newTris[i + 2] = i + 2;

                // Calculate flat face normal
                Vector3 faceNormal = Vector3.Cross(v1 - v0, v2 - v0).normalized;
                newNormals[i] = faceNormal;
                newNormals[i + 1] = faceNormal;
                newNormals[i + 2] = faceNormal;
            }

            Mesh faceted = new Mesh();
            faceted.name = inputMesh.name + "_Faceted";
            faceted.vertices = newVerts;
            faceted.triangles = newTris;
            faceted.normals = newNormals;
            faceted.uv = newUVs;
            faceted.colors = newColors;
            return faceted;
        }

        /// <summary>
        /// Generates a low-poly faceted box with vertex colors.
        /// </summary>
        public static Mesh CreateFacetedBox(Vector3 size, Color color)
        {
            Mesh m = new Mesh();
            float x = size.x * 0.5f;
            float y = size.y * 0.5f;
            float z = size.z * 0.5f;

            Vector3[] p = new Vector3[]
            {
                new Vector3(-x, -y, -z), new Vector3( x, -y, -z), new Vector3( x,  y, -z), new Vector3(-x,  y, -z),
                new Vector3(-x, -y,  z), new Vector3( x, -y,  z), new Vector3( x,  y,  z), new Vector3(-x,  y,  z)
            };

            int[] tris = new int[]
            {
                0, 2, 1, 0, 3, 2, // Front
                1, 2, 6, 1, 6, 5, // Right
                5, 6, 7, 5, 7, 4, // Back
                4, 7, 3, 4, 3, 0, // Left
                3, 7, 6, 3, 6, 2, // Top
                0, 1, 5, 0, 5, 4  // Bottom
            };

            Color[] colors = new Color[p.Length];
            for (int i = 0; i < colors.Length; i++) colors[i] = color;

            m.vertices = p;
            m.triangles = tris;
            m.colors = colors;
            return MakeFaceted(m);
        }

        /// <summary>
        /// Generates a low-poly faceted geodesic dome (for Habitat Pods & Greenhouses).
        /// </summary>
        public static Mesh CreateFacetedDome(float radius, int segments, Color color)
        {
            Mesh m = new Mesh();
            List<Vector3> verts = new List<Vector3>();
            List<int> tris = new List<int>();

            // Apex vertex
            verts.Add(new Vector3(0, radius, 0));

            for (int ring = 1; ring <= segments; ring++)
            {
                float phi = (Mathf.PI * 0.5f) * (ring / (float)segments);
                float y = Mathf.Cos(phi) * radius;
                float rRing = Mathf.Sin(phi) * radius;

                int ringPoints = segments * 2;
                for (int p = 0; p < ringPoints; p++)
                {
                    float theta = (2 * Mathf.PI * p) / ringPoints;
                    float x = Mathf.Cos(theta) * rRing;
                    float z = Mathf.Sin(theta) * rRing;
                    verts.Add(new Vector3(x, y, z));
                }
            }

            int pointsPerRing = segments * 2;
            // Cap triangles connecting apex
            for (int p = 0; p < pointsPerRing; p++)
            {
                int next = (p + 1) % pointsPerRing;
                tris.Add(0);
                tris.Add(1 + p);
                tris.Add(1 + next);
            }

            // Ring quads
            for (int ring = 1; ring < segments; ring++)
            {
                int rStart = 1 + (ring - 1) * pointsPerRing;
                int nextRStart = 1 + ring * pointsPerRing;

                for (int p = 0; p < pointsPerRing; p++)
                {
                    int nextP = (p + 1) % pointsPerRing;

                    int cur0 = rStart + p;
                    int cur1 = rStart + nextP;
                    int nxt0 = nextRStart + p;
                    int nxt1 = nextRStart + nextP;

                    tris.Add(cur0);
                    tris.Add(nxt0);
                    tris.Add(cur1);

                    tris.Add(cur1);
                    tris.Add(nxt0);
                    tris.Add(nxt1);
                }
            }

            Color[] colors = new Color[verts.Count];
            for (int i = 0; i < colors.Length; i++) colors[i] = color;

            m.vertices = verts.ToArray();
            m.triangles = tris.ToArray();
            m.colors = colors;
            return MakeFaceted(m);
        }

        /// <summary>
        /// Generates a low-poly faceted cylinder (for pipes, tanks, wheels, rocket stages).
        /// </summary>
        public static Mesh CreateFacetedCylinder(float radius, float height, int segments, Color color)
        {
            Mesh m = new Mesh();
            List<Vector3> verts = new List<Vector3>();
            List<int> tris = new List<int>();

            float halfH = height * 0.5f;

            // Top center and bottom center
            int topCenter = 0;
            verts.Add(new Vector3(0, halfH, 0));
            int botCenter = 1;
            verts.Add(new Vector3(0, -halfH, 0));

            for (int i = 0; i < segments; i++)
            {
                float theta = (2 * Mathf.PI * i) / segments;
                float x = Mathf.Cos(theta) * radius;
                float z = Mathf.Sin(theta) * radius;

                verts.Add(new Vector3(x, halfH, z));  // top ring
                verts.Add(new Vector3(x, -halfH, z)); // bottom ring
            }

            for (int i = 0; i < segments; i++)
            {
                int next = (i + 1) % segments;
                int top0 = 2 + i * 2;
                int bot0 = 2 + i * 2 + 1;
                int top1 = 2 + next * 2;
                int bot1 = 2 + next * 2 + 1;

                // Side quad
                tris.Add(top0); tris.Add(bot0); tris.Add(top1);
                tris.Add(top1); tris.Add(bot0); tris.Add(bot1);

                // Top cap
                tris.Add(topCenter); tris.Add(top0); tris.Add(top1);

                // Bottom cap
                tris.Add(botCenter); tris.Add(bot1); tris.Add(bot0);
            }

            Color[] colors = new Color[verts.Count];
            for (int i = 0; i < colors.Length; i++) colors[i] = color;

            m.vertices = verts.ToArray();
            m.triangles = tris.ToArray();
            m.colors = colors;
            return MakeFaceted(m);
        }

        /// <summary>
        /// Generates low-poly crater terrain (Shackleton on Moon or Jezero on Mars).
        /// </summary>
        public static Mesh CreateFacetedTerrain(int size, float spacing, float maxHeight, bool isMoon)
        {
            Mesh m = new Mesh();
            List<Vector3> verts = new List<Vector3>();
            List<int> tris = new List<int>();
            List<Color> colors = new List<Color>();

            Color baseColor = isMoon ? new Color(0.12f, 0.15f, 0.22f) : new Color(0.55f, 0.22f, 0.12f);
            Color rimColor = isMoon ? new Color(0.25f, 0.28f, 0.38f) : new Color(0.75f, 0.35f, 0.18f);
            Color iceColor = new Color(0.22f, 0.74f, 0.95f); // Shackleton crater water ice

            float halfSize = (size * spacing) * 0.5f;

            for (int z = 0; z < size; z++)
            {
                for (int x = 0; x < size; x++)
                {
                    float worldX = x * spacing - halfSize;
                    float worldZ = z * spacing - halfSize;

                    float distFromCenter = Mathf.Sqrt(worldX * worldX + worldZ * worldZ);
                    float craterRadius = halfSize * 0.65f;

                    float h = 0f;
                    // Crater profile: high rim, depressed bowl center
                    if (distFromCenter < craterRadius)
                    {
                        float normalized = distFromCenter / craterRadius;
                        h = Mathf.Cos(normalized * Mathf.PI) * (maxHeight * 0.4f);
                    }
                    else
                    {
                        // Rim wall dropoff
                        float rimDist = distFromCenter - craterRadius;
                        h = Mathf.Max(0f, (maxHeight * 0.35f) - rimDist * 0.25f);
                    }

                    // Faceted noise perturbation
                    h += Mathf.PerlinNoise(x * 0.15f, z * 0.15f) * (maxHeight * 0.25f);

                    verts.Add(new Vector3(worldX, h, worldZ));

                    // Vertex coloring
                    if (isMoon && distFromCenter < craterRadius * 0.35f)
                    {
                        colors.Add(iceColor); // Ice deposit at bottom of crater
                    }
                    else if (h > maxHeight * 0.3f)
                    {
                        colors.Add(rimColor); // Sunlight crater rim
                    }
                    else
                    {
                        colors.Add(baseColor);
                    }
                }
            }

            for (int z = 0; z < size - 1; z++)
            {
                for (int x = 0; x < size - 1; x++)
                {
                    int i0 = z * size + x;
                    int i1 = z * size + (x + 1);
                    int i2 = (z + 1) * size + x;
                    int i3 = (z + 1) * size + (x + 1);

                    tris.Add(i0); tris.Add(i2); tris.Add(i1);
                    tris.Add(i1); tris.Add(i2); tris.Add(i3);
                }
            }

            m.vertices = verts.ToArray();
            m.triangles = tris.ToArray();
            m.colors = colors.ToArray();
            return MakeFaceted(m);
        }
    }
}

