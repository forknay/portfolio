import type { Planet as PlanetData } from "../../universe/types";
import { SETTINGS } from "../../engine/settings";
import { hashSeed } from "../../lib/rng";
import { getPlanetGeometry } from "./planetGeometry";
import { Clothing } from "./Clothing";
import { Atmosphere } from "./Atmosphere";

/**
 * The visual planet — irregular low-poly body + its one clothing piece + its
 * atmosphere — with no rotation/orbit of its own (the caller animates it). Shared
 * between the planet level (full detail) and the system view, where it renders a
 * reduced-detail version so each orbiting planet still shows its real features
 * (ring / clouds / moons / shell) instead of looking like every other sphere.
 */
export function PlanetBody({
  planet,
  detail,
  atmosphereDetail,
}: {
  planet: PlanetData;
  detail?: number;
  atmosphereDetail?: number;
}) {
  const d = detail ?? planet.polyDetail ?? 3;
  const geometry = getPlanetGeometry(planet.radius, d, hashSeed(planet.id));
  const showAtmosphere = SETTINGS.atmosphere && !!planet.atmosphere;

  return (
    <group>
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

      {showAtmosphere && planet.atmosphere && (
        <>
          <Atmosphere planet={planet} spec={planet.atmosphere} layer="surface" detail={atmosphereDetail} />
          <Atmosphere planet={planet} spec={planet.atmosphere} layer="halo" detail={atmosphereDetail} />
        </>
      )}
    </group>
  );
}
