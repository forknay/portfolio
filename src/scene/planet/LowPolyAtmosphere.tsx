import * as THREE from "three";

/**
 * A faceted low-poly translucent shell over the planet. Cheap, no custom shader,
 * matches the low-poly aesthetic. Used for `shell` atmospheres and (faint, white)
 * as the rim under `clouds`.
 */
export function LowPolyAtmosphere({
  radius,
  color,
  scale = 1.16,
  opacity = 0.16,
  detail = 1,
}: {
  radius: number;
  color: string;
  scale?: number;
  opacity?: number;
  detail?: number;
}) {
  return (
    <mesh scale={scale}>
      <icosahedronGeometry args={[radius, detail]} />
      <meshStandardMaterial
        color={color}
        flatShading
        transparent
        opacity={opacity}
        roughness={1}
        metalness={0}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
