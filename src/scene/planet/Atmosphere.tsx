import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { AtmosphereSpec, Planet } from "../../universe/types";
import { buildContinents } from "./continents";
import { LowPolyAtmosphere } from "./LowPolyAtmosphere";

/**
 * Thin, continent-like white cloud cover carved from noise: a layer that hugs
 * the surface with fluctuating thickness (not puffy blobs). Parented to the
 * rotating planet group so it turns with the surface.
 */
function CloudLayer({ planet, spec }: { planet: Planet; spec: AtmosphereSpec }) {
  const params = spec.params ?? {};
  const geometry = useMemo(
    () =>
      buildContinents(planet.radius, {
        coverage: params.coverage,
        freq: params.freq,
        topBias: params.topBias,
        pattern: params.pattern,
      }),
    [planet.radius, params.coverage, params.freq, params.topBias, params.pattern],
  );

  // Dispose the generated geometry when it changes / unmounts.
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={spec.color ?? "#eef4ff"}
        flatShading
        roughness={1}
        metalness={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * Per-planet atmosphere. `shell` and `clouds` are mutually exclusive:
 * - `shell`  — a full translucent faceted shell (static "halo" layer).
 * - `clouds` — thin continent-like white cover (rotates with the surface).
 */
export function Atmosphere({
  planet,
  spec,
  layer,
}: {
  planet: Planet;
  spec: AtmosphereSpec;
  /** "surface" = rotates with the planet; "halo" = static shell. */
  layer: "surface" | "halo";
}) {
  if (spec.type === "clouds") {
    return layer === "surface" ? <CloudLayer planet={planet} spec={spec} /> : null;
  }

  if (spec.type === "shell") {
    return layer === "halo" ? (
      <LowPolyAtmosphere radius={planet.radius} color={planet.accentColor} />
    ) : null;
  }

  return null;
}
