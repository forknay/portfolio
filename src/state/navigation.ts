import { useParams } from "react-router-dom";
import type { Planet, System } from "../universe/types";
import { getPlanet, getSystem } from "../universe/selectors";

export type Level = "galaxy" | "system" | "planet";

export interface Navigation {
  level: Level;
  systemId?: string;
  planetId?: string;
  system?: System;
  planet?: Planet;
}

/** Path builders — the single place that knows the URL shape. */
export const paths = {
  galaxy: () => "/",
  system: (systemId: string) => `/system/${systemId}`,
  planet: (systemId: string, planetId: string) =>
    `/system/${systemId}/${planetId}`,
};

/**
 * Derive the current navigation state from the route. The router is the source
 * of truth; everything else (camera, scene, overlay) reads from this.
 *
 * Returns `null` for `system`/`planet` when the ids don't resolve, so callers
 * can redirect to the galaxy.
 */
export function useNavigation(): Navigation {
  const { systemId, planetId } = useParams();
  const system = getSystem(systemId);
  const planet = getPlanet(systemId, planetId);

  let level: Level = "galaxy";
  if (systemId && planetId) level = "planet";
  else if (systemId) level = "system";

  return { level, systemId, planetId, system, planet };
}
