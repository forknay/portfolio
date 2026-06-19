import type { Constellation, Planet, System, Universe } from "./types";
import { UNIVERSE } from "./universe";

/** Look up a system by id. */
export function getSystem(
  id: string | null | undefined,
  universe: Universe = UNIVERSE,
): System | undefined {
  if (!id) return undefined;
  return universe.systems.find((s) => s.id === id);
}

/** Look up a planet within a system by ids. */
export function getPlanet(
  systemId: string | null | undefined,
  planetId: string | null | undefined,
  universe: Universe = UNIVERSE,
): Planet | undefined {
  const system = getSystem(systemId, universe);
  if (!system || !planetId) return undefined;
  return system.planets.find((p) => p.id === planetId);
}

/** Pick a random constellation variant for the landing page. */
export function pickRandomConstellation(
  universe: Universe = UNIVERSE,
  rand: () => number = Math.random,
): Constellation {
  const list = universe.constellations;
  return list[Math.floor(rand() * list.length)];
}

// Chosen once per page load (module singleton) — stays the same across in-app
// navigation (back to galaxy doesn't reshuffle); only a refresh / new visit
// picks a fresh one.
let sessionConstellation: Constellation | null = null;

/** The constellation for this page visit (stable until refresh). */
export function getSessionConstellation(universe: Universe = UNIVERSE): Constellation {
  if (!sessionConstellation) sessionConstellation = pickRandomConstellation(universe);
  return sessionConstellation;
}

export interface ValidationIssue {
  level: "error";
  message: string;
}

/**
 * Runtime sanity check on the universe config. Catches duplicate ids and
 * malformed links early (helpful when editing content by hand).
 */
export function validateUniverse(universe: Universe = UNIVERSE): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const systemIds = new Set<string>();

  for (const system of universe.systems) {
    if (systemIds.has(system.id)) {
      issues.push({ level: "error", message: `Duplicate system id: ${system.id}` });
    }
    systemIds.add(system.id);

    const planetIds = new Set<string>();
    for (const planet of system.planets) {
      if (planetIds.has(planet.id)) {
        issues.push({
          level: "error",
          message: `Duplicate planet id "${planet.id}" in system "${system.id}"`,
        });
      }
      planetIds.add(planet.id);

      for (const link of planet.links) {
        if (!link.label || !link.url) {
          issues.push({
            level: "error",
            message: `Malformed link on planet "${system.id}/${planet.id}"`,
          });
        }
      }
    }
  }

  // Every constellation must map all systems to real, distinct stars, and its
  // lines must reference stars it actually contains.
  for (const c of universe.constellations) {
    const starIds = new Set(c.stars.map((s) => s.id));
    if (starIds.size < 4) {
      issues.push({ level: "error", message: `Constellation "${c.id}" has <4 stars` });
    }
    for (const system of universe.systems) {
      const mapped = c.systemStars[system.id];
      if (!mapped) {
        issues.push({
          level: "error",
          message: `Constellation "${c.id}" missing star for system "${system.id}"`,
        });
      } else if (!starIds.has(mapped)) {
        issues.push({
          level: "error",
          message: `Constellation "${c.id}" maps "${system.id}" to unknown star "${mapped}"`,
        });
      }
    }
    for (const [a, b] of c.lines) {
      if (!starIds.has(a) || !starIds.has(b)) {
        issues.push({
          level: "error",
          message: `Constellation "${c.id}" line references unknown star (${a}-${b})`,
        });
      }
    }
  }

  return issues;
}
