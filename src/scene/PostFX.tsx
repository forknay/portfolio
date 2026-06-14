import { Bloom, EffectComposer } from "@react-three/postprocessing";

/**
 * Bloom post-processing, isolated in its own module so it can be lazy-loaded
 * (keeps the initial galaxy chunk small). Only the bright, tone-mapping-exempt
 * materials (stars, suns) cross the luminance threshold and glow.
 */
export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
    </EffectComposer>
  );
}
