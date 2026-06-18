import type { Planet, System } from "../universe/types";
import { UNIVERSE } from "../universe/universe";
import { hashSeed } from "../lib/rng";
import { InfoColumn } from "./InfoColumn";

/** A deterministic faux "catalog" tag for flavour (not the section name). */
function catalogTag(system: System, planet: Planet): string {
  const sector = UNIVERSE.systems.findIndex((s) => s.id === system.id) + 1;
  const code = hashSeed(planet.id).toString(16).slice(0, 4).toUpperCase();
  return `SECTOR ${String(sector).padStart(2, "0")} · CAT-${code}`;
}

/** Left-side text for the planet level: catalog eyebrow, description, links. */
export function PlanetInfo({ system, planet }: { system: System; planet: Planet }) {
  return (
    <InfoColumn
      side="left"
      accent={planet.accentColor}
      eyebrow={catalogTag(system, planet)}
      body={planet.sectionBody}
      links={planet.links}
    />
  );
}
