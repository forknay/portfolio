import { useEffect } from "react";
import type { System } from "../../universe/types";
import { onIdle } from "../../lib/idle";
import { preloadPlanet } from "../lazyViews";
import { VoidDots } from "../common/VoidDots";
import { Sun } from "./Sun";
import { OrbitingPlanet } from "./OrbitingPlanet";

/**
 * System (biome) level: a central sun with planets orbiting, over only the tiny
 * cosmic void dots (no decorative star field here). The accent tints the ambient.
 */
export function SystemView({ system }: { system: System }) {
  // Warm the planet chunk while idle so clicking a planet is instant.
  useEffect(() => onIdle(preloadPlanet), []);

  return (
    <group>
      <VoidDots count={420} />

      <ambientLight color={system.accentColor} intensity={0.25} />
      <Sun color={system.sun.color} size={system.sun.size} />

      {system.planets.map((planet) => (
        <OrbitingPlanet key={planet.id} planet={planet} systemId={system.id} />
      ))}
    </group>
  );
}
