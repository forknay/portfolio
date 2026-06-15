import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../../engine/useReducedMotion";

/** The system's central star: an emissive low-poly sphere with a soft halo. */
export function Sun({ color, size }: { color: string; size: number }) {
  const reduced = useReducedMotion();
  const core = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (!reduced && core.current) core.current.rotation.y += dt * 0.05;
  });

  return (
    <group>
      <pointLight color={color} intensity={2.2} distance={120} decay={0.6} />
      <mesh ref={core}>
        <icosahedronGeometry args={[size, 2]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}
