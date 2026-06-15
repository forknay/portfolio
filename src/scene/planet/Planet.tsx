import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Planet as PlanetData } from "../../universe/types";
import { SETTINGS } from "../../engine/settings";
import { hashSeed } from "../../lib/rng";
import { useReducedMotion } from "../../engine/useReducedMotion";
import { Clothing } from "./Clothing";
import { Atmosphere } from "./Atmosphere";
import { buildPlanet } from "./planetGeometry";

/**
 * The centred, slowly-rotating planet shown at the planet level: a flat-shaded
 * low-poly icosphere wearing its optional clothing and atmosphere. Cloud cover
 * rotates with the surface; the translucent shell/rim stays static.
 */
export function Planet({ planet }: { planet: PlanetData }) {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const showAtmosphere = SETTINGS.atmosphere && !!planet.atmosphere;

  const geometry = useMemo(
    () => buildPlanet(planet.radius, planet.polyDetail ?? 3, hashSeed(planet.id)),
    [planet.radius, planet.polyDetail, planet.id],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, dt) => {
    if (!reduced && group.current) group.current.rotation.y += dt * planet.rotationSpeed;
  });

  return (
    <group>
      {/* Rotating body + clothing + surface clouds. */}
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={planet.baseColor}
            flatShading
            roughness={0.8}
            metalness={0.05}
            emissive={planet.accentColor}
            emissiveIntensity={0.06}
          />
        </mesh>
        {planet.clothing && <Clothing planet={planet} spec={planet.clothing} />}
        {showAtmosphere && (
          <Atmosphere planet={planet} spec={planet.atmosphere!} layer="surface" />
        )}
      </group>

      {/* Static shell / rim. */}
      {showAtmosphere && (
        <Atmosphere planet={planet} spec={planet.atmosphere!} layer="halo" />
      )}
    </group>
  );
}
