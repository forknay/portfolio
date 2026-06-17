import { useEffect, useState, type CSSProperties } from "react";
import type { Planet } from "../universe/types";

const PLACEHOLDER_COUNT = 3;
/** Feed powers on a beat after the text has finished deciphering. */
const FEED_DELAY_MS = 2700;

/**
 * Right-side "hologram" projector for a planet: a translucent, biome-tinted CRT
 * screen that powers on (flicker) a couple of seconds after the text decodes,
 * then cycles the planet's preprocessed images (or procedural placeholders).
 * The light cone projects up from a point ("nothing"). Pure CSS effect.
 */
export function Hologram({ planet, active }: { planet: Planet; active: boolean }) {
  const frames = planet.media && planet.media.length > 0 ? planet.media : null;
  const frameCount = frames ? frames.length : PLACEHOLDER_COUNT;
  const [live, setLive] = useState(false);
  const [idx, setIdx] = useState(0);

  // Delay the feed so it appears after the text finishes decoding.
  useEffect(() => {
    if (!active) {
      setLive(false);
      return;
    }
    const t = window.setTimeout(() => setLive(true), FEED_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [active]);

  // Cycle frames once live.
  useEffect(() => {
    if (!live || frameCount <= 1) return;
    const id = window.setInterval(() => setIdx((i) => i + 1), 2800);
    return () => window.clearInterval(id);
  }, [live, frameCount]);

  const current = idx % frameCount;

  return (
    <div
      className={`hologram ${live ? "is-on" : ""}`}
      style={{ "--accent": planet.accentColor } as CSSProperties}
      aria-hidden="true"
    >
      <div className="hologram-beam" />
      <div className="hologram-screen">
        {frames ? (
          <img className="hologram-img" src={frames[current]} alt="" />
        ) : (
          <div className="hologram-placeholder">
            <span className="holo-grid" />
            <span className="holo-label">SIGNAL {String(current + 1).padStart(2, "0")}</span>
          </div>
        )}
        <span className="hologram-scanlines" />
        <span className="hologram-flicker" />
      </div>
      <div className="hologram-caption">{frames ? "REC ●" : "NO FEED // PLACEHOLDER"}</div>
    </div>
  );
}
