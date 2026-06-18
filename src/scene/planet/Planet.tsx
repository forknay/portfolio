import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Planet as PlanetData } from "../../universe/types";
import { useReducedMotion } from "../../engine/useReducedMotion";
import { PlanetBody } from "./PlanetBody";
import { planetAxialTilt } from "./planetGeometry";

/**
 * The centred, slowly-rotating planet shown at the planet level — full detail.
 * The spin happens inside a static axial-tilt group so rings stay open.
 */
export function Planet({ planet }: { planet: PlanetData }) {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!reduced && group.current) group.current.rotation.y += dt * planet.rotationSpeed;
  });

  return (
    <group rotation={planetAxialTilt(planet.id)}>
      <group ref={group}>
        <PlanetBody planet={planet} />
      </group>
    </group>
  );
}
