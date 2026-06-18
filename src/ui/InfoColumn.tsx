import type { CSSProperties } from "react";
import type { PlanetLink } from "../universe/types";
import { ScrambleText } from "./ScrambleText";

interface InfoColumnProps {
  accent: string;
  side: "left" | "right";
  body: string;
  eyebrow?: string;
  links?: PlanetLink[];
  /** Stagger base (ms) so a second column can decode just after the first. */
  delayBase?: number;
}

/**
 * One boxless text column on the void: optional mono eyebrow, the body in a techy
 * sans, and optional links — with the glitch-scramble decode and accent glow.
 * Positioned left or right by `side`.
 */
export function InfoColumn({
  accent,
  side,
  body,
  eyebrow,
  links,
  delayBase = 0,
}: InfoColumnProps) {
  return (
    <div className={`planet-info is-${side}`} style={{ "--accent": accent } as CSSProperties}>
      <div className="planet-info-glow" />
      <div className="planet-info-inner">
        {eyebrow && (
          <ScrambleText as="p" className="info-eyebrow" text={eyebrow} active delay={delayBase} />
        )}
        <ScrambleText
          as="p"
          className="info-desc"
          text={body}
          active
          delay={delayBase + 120}
        />
        {links && links.length > 0 && (
          <div className="info-links">
            {links.map((link, i) => (
              <a
                key={link.url}
                className="info-link"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="info-link-arrow">▸</span>
                <ScrambleText text={link.label} active delay={delayBase + 260 + i * 90} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
