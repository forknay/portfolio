import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import type { AtmosphereSpec, Planet } from "../../universe/types";
import { hashSeed, mulberry32, range } from "../../lib/rng";
import { fibonacciSphere, UP } from "../../lib/sphere";
import { LowPolyAtmosphere } from "./LowPolyAtmosphere";

const dummy = new THREE.Object3D();

/**
 * Partial, opaque white cloud cover: low-poly "puffs" sitting just above the
 * surface at scattered points — like clouds on Earth, NOT a full shell. Parented
 * to the rotating planet group so the clouds turn with the surface.
 */
function CloudCover({ planet, params }: { planet: Planet; params: Record<string, number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = params.count ?? 9;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = mulberry32(hashSeed(planet.id + "-clouds"));
    for (let i = 0; i < count; i++) {
      const n = fibonacciSphere(i, count);
      dummy.position.copy(n).multiplyScalar(planet.radius * 1.06);
      dummy.quaternion.setFromUnitVectors(UP, n);
      dummy.rotateY(rand() * Math.PI * 2);
      const s = range(rand, 0.45, 0.85) * planet.radius;
      dummy.scale.set(s, s * 0.26, s * 0.72);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [planet.id, count, planet.radius]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#f4f7ff" flatShading roughness={1} metalness={0} />
    </instancedMesh>
  );
}

/**
 * Per-planet atmosphere. `shell` is a full translucent faceted shell; `clouds`
 * is partial opaque white cover. The pieces that should turn with the planet
 * (clouds) are returned separately from the static rim/shell via `layer`.
 */
export function Atmosphere({
  planet,
  spec,
  layer,
}: {
  planet: Planet;
  spec: AtmosphereSpec;
  /** "surface" = rotates with the planet; "halo" = static shell/rim. */
  layer: "surface" | "halo";
}) {
  const params = spec.params ?? {};

  if (spec.type === "clouds") {
    if (layer === "surface") return <CloudCover planet={planet} params={params} />;
    // Faint white rim so cloudy planets read as having air.
    return (
      <LowPolyAtmosphere radius={planet.radius} color="#dfe8ff" scale={1.2} opacity={0.1} />
    );
  }

  // shell: only the static translucent shell.
  if (spec.type === "shell" && layer === "halo") {
    return <LowPolyAtmosphere radius={planet.radius} color={planet.accentColor} />;
  }

  return null;
}
