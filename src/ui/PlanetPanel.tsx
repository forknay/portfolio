import { useNavigation } from "../state/navigation";
import { PlanetInfo } from "./PlanetInfo";
import { InfoColumn } from "./InfoColumn";
import { Hologram } from "./Hologram";

// Sections that show the hologram feed. Empty for now (feature kept; add e.g.
// "projects" / "about" back here, or set a planet's `hologram: true`, to re-enable).
const HOLOGRAM_SYSTEMS = new Set<string>([]);

/**
 * Planet-level overlay: a left text column, plus EITHER a hologram (Projects /
 * About) OR an optional second text column on the right (text-heavy sections
 * like Experience). Boxless, keyed by planet id so the animations replay.
 */
export function PlanetPanel() {
  const { level, system, planet } = useNavigation();
  const open = level === "planet" && !!planet && !!system;

  if (!open || !planet || !system) return null;

  const hologram =
    planet.hologram === true ||
    (HOLOGRAM_SYSTEMS.has(system.id) && planet.hologram !== false);
  const showRight = !!planet.bodyRight && !hologram;

  return (
    <div className="planet-stage" key={planet.id}>
      <div className="planet-text">
        <PlanetInfo system={system} planet={planet} />
        {showRight && (
          <InfoColumn side="right" accent={planet.accentColor} body={planet.bodyRight!} delayBase={200} />
        )}
      </div>
      {hologram && <Hologram planet={planet} active />}
    </div>
  );
}
