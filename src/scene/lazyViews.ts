import { lazy } from "react";
import type { System } from "../universe/types";

// Per-level chunks, code-split so the initial galaxy load stays small.
const importSystem = () => import("./system/SystemView");
const importPlanet = () => import("./planet/PlanetView");

export const SystemView = lazy(() =>
  importSystem().then((m) => ({ default: m.SystemView })),
);
export const PlanetView = lazy(() =>
  importPlanet().then((m) => ({ default: m.PlanetView })),
);
export const PostFX = lazy(() => import("./PostFX"));

/**
 * Warm up a level's chunk ahead of navigation (on hover / when idle) so clicking
 * in doesn't pay the import cost. The browser caches the module, so the later
 * lazy() resolves instantly.
 */
export const preloadSystem = () => {
  void importSystem();
};
export const preloadPlanet = () => {
  void importPlanet();
};

/** Load the system chunk AND pre-build the system's (mini) planet geometry. */
export async function warmSystem(system: System) {
  const [, warm] = await Promise.all([importSystem(), import("./system/warm")]);
  warm.warmSystemGeometries(system);
}

/** Ensure every level chunk is loaded (used by the shader warm-up). */
export function loadAllViews() {
  return Promise.all([importSystem(), importPlanet(), import("./PostFX")]);
}
