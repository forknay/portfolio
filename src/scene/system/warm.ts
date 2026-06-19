import type { System } from "../../universe/types";
import { hashSeed } from "../../lib/rng";
import { getPlanetGeometry } from "../planet/planetGeometry";
import { getContinents, cloudOptions } from "../planet/continents";

/** Pre-build the reduced-detail geometry shown for the orbiting (mini) planets. */
export function warmSystemGeometries(system: System) {
  for (const p of system.planets) {
    getPlanetGeometry(p.radius, Math.min(p.polyDetail ?? 3, 2), hashSeed(p.id));
    if (p.atmosphere?.type === "clouds") {
      getContinents(p.radius, cloudOptions(p.atmosphere, 2));
    }
  }
}

/** Pre-build the full-detail geometry shown at the planet level. */
export function warmPlanetGeometries(system: System) {
  for (const p of system.planets) {
    getPlanetGeometry(p.radius, p.polyDetail ?? 3, hashSeed(p.id));
    if (p.atmosphere?.type === "clouds") {
      getContinents(p.radius, cloudOptions(p.atmosphere));
    }
  }
}
