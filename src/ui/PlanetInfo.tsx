import type { CSSProperties } from "react";
import type { Planet, System } from "../universe/types";
import { UNIVERSE } from "../universe/universe";
import { hashSeed } from "../lib/rng";
import { ScrambleText } from "./ScrambleText";

/** A deterministic faux "catalog" tag for flavour (not the section name). */
function catalogTag(system: System, planet: Planet): string {
  const sector = UNIVERSE.systems.findIndex((s) => s.id === system.id) + 1;
  const code = hashSeed(planet.id).toString(16).slice(0, 4).toUpperCase();
  return `SECTOR ${String(sector).padStart(2, "0")} · CAT-${code}`;
}

/**
 * Left-side text for the planet level: a monospace catalog eyebrow, the
 * description in a techy sans, and links — all set directly on the void with a
 * soft accent glow behind them (no card). Decodes in on arrival.
 */
export function PlanetInfo({ system, planet }: { system: System; planet: Planet }) {
  const accent = planet.accentColor;

  return (
    <div className="planet-info" style={{ "--accent": accent } as CSSProperties}>
      <div className="planet-info-glow" />
      <div className="planet-info-inner">
        <ScrambleText
          as="p"
          className="info-eyebrow"
          text={catalogTag(system, planet)}
          active
        />
        <ScrambleText
          as="p"
          className="info-desc"
          text={planet.sectionBody}
          active
          delay={120}
        />
        {planet.links.length > 0 && (
          <div className="info-links">
            {planet.links.map((link, i) => (
              <a
                key={link.url}
                className="info-link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="info-link-arrow">▸</span>
                <ScrambleText text={link.label} active delay={260 + i * 90} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
