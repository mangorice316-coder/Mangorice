using UnityEngine;
using UnityEngine.Rendering;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Generates vibrant flat-shaded materials for low-poly rendering across URP and Built-in pipelines.
    /// Supports vertex coloring, emission for solar cells & crater ice, and water-translucent shaders.
    /// </summary>
    public static class LowPolyMaterialFactory
    {
        private static Material defaultLitMat;
        private static Material translucentMat;
        private static Material emissiveIceMat;

        public static Material GetLitMaterial(Color baseColor, float smoothness = 0.2f)
        {
            Shader s = GraphicsSettings.currentRenderPipeline == null ? Shader.Find("Standard") : Shader.Find("Universal Render Pipeline/Lit");
            if (s == null) s = Shader.Find("Diffuse");

            Material mat = new Material(s);
            mat.name = "LowPoly_Lit_" + ColorUtility.ToHtmlStringRGB(baseColor);
            mat.color = baseColor;
            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", baseColor);
            if (mat.HasProperty("_Smoothness")) mat.SetFloat("_Smoothness", smoothness);
            if (mat.HasProperty("_Glossiness")) mat.SetFloat("_Glossiness", smoothness);
            return mat;
        }

        public static Material GetTranslucentMaterial(Color tint)
        {
            Shader s = GraphicsSettings.currentRenderPipeline == null ? Shader.Find("Standard") : Shader.Find("Universal Render Pipeline/Lit");

            Material mat = new Material(s);
            mat.name = "LowPoly_Translucent";
            mat.color = tint;

            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", tint);
            if (mat.HasProperty("_Surface")) mat.SetFloat("_Surface", 1); // Transparent in URP
            
            // Standard blend setup
            mat.SetFloat("_Mode", 3);
            mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
            mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
            mat.SetInt("_ZWrite", 0);
            mat.DisableKeyword("_ALPHATEST_ON");
            mat.EnableKeyword("_ALPHABLEND_ON");
            mat.DisableKeyword("_ALPHAPREMULTIPLY_ON");
            mat.renderQueue = 3000;
            return mat;
        }

        public static Material GetEmissiveMaterial(Color baseColor, Color emissiveColor, float intensity = 1.5f)
        {
            Material mat = GetLitMaterial(baseColor, 0.4f);
            mat.name = "LowPoly_Emissive";
            mat.EnableKeyword("_EMISSION");
            if (mat.HasProperty("_EmissionColor"))
            {
                mat.SetColor("_EmissionColor", emissiveColor * intensity);
            }
            return mat;
        }
    }
}




