using System;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;
using UnityEngine.Rendering.RenderGraphModule;

namespace NASA.ProjectStarbridge
{
    /// <summary>
    /// Unity 6 URP Render Graph custom post-processing feature for space radiation and solar storm bloom.
    /// Validated against Unity 6 Render Graph API standards: uses RecordRenderGraph, explicit texture wiring,
    /// and static raster execution without per-frame garbage allocations.
    /// </summary>
    public class SpaceRadiationRendererFeature : ScriptableRendererFeature
    {
        [Serializable]
        public class Settings
        {
            public RenderPassEvent renderPassEvent = RenderPassEvent.AfterRenderingPostProcessing;
            public Material radiationMaterial;
            [Range(0f, 1f)] public float radiationIntensity = 0.5f;
            public Color stormTint = new Color(1f, 0.45f, 0.2f, 0.35f);
        }

        public Settings settings = new Settings();
        private SpaceRadiationPass radiationPass;

        public override void Create()
        {
            radiationPass = new SpaceRadiationPass(settings);
        }

        public override void AddRenderPasses(ScriptableRenderer renderer, ref RenderingData renderingData)
        {
            if (settings.radiationMaterial == null) return;
            renderer.EnqueuePass(radiationPass);
        }

        private class SpaceRadiationPass : ScriptableRenderPass
        {
            private readonly Settings passSettings;

            public SpaceRadiationPass(Settings settings)
            {
                passSettings = settings;
                renderPassEvent = settings.renderPassEvent;
            }

            private class PassData
            {
                public Material material;
                public TextureHandle sourceTexture;
                public float intensity;
                public Color tint;
            }

            public override void RecordRenderGraph(RenderGraph renderGraph, ContextContainer frameData)
            {
                if (passSettings.radiationMaterial == null) return;

                UniversalResourceData resourceData = frameData.Get<UniversalResourceData>();
                if (resourceData == null || !resourceData.activeColorTexture.IsValid()) return;

                TextureHandle activeColor = resourceData.activeColorTexture;

                // Create destination texture descriptor matching the active camera target
                TextureDesc desc = renderGraph.GetTextureDesc(activeColor);
                desc.name = "_SpaceRadiationTexture";
                desc.clearBuffer = false;
                desc.depthBufferBits = DepthBits.None;

                TextureHandle destination = renderGraph.CreateTexture(desc);

                using (var builder = renderGraph.AddRasterRenderPass<PassData>("Space Radiation Full-Screen Pass", out var passData))
                {
                    passData.material = passSettings.radiationMaterial;
                    passData.sourceTexture = activeColor;
                    passData.intensity = passSettings.radiationIntensity;
                    passData.tint = passSettings.stormTint;

                    // 1. Explicit read texture declaration
                    builder.UseTexture(passData.sourceTexture, AccessFlags.Read);

                    // 2. Explicit write render attachment declaration
                    builder.SetRenderAttachment(destination, 0, AccessFlags.Write);

                    // 3. Static execute function to prevent closure allocations
                    builder.SetRenderFunc((PassData data, RasterGraphContext context) =>
                    {
                        ExecutePass(data, context);
                    });
                }

                // Swap back to camera target
                resourceData.cameraColor = destination;
            }

            private static void ExecutePass(PassData data, RasterGraphContext context)
            {
                if (data.material == null) return;

                // Explicit material property binding
                data.material.SetTexture("_BlitTexture", data.sourceTexture);
                data.material.SetFloat("_RadiationIntensity", data.intensity);
                data.material.SetColor("_StormTint", data.tint);

                // Blit quad
                Blitter.BlitTexture(context.cmd, data.sourceTexture, new Vector4(1, 1, 0, 0), data.material, 0);
            }
        }
    }
}


