import { useNavigation } from "../state/navigation";
import { PlanetInfo } from "./PlanetInfo";
import { InfoColumn } from "./InfoColumn";
import { Hologram } from "./Hologram";

/** Only these sections show the hologram feed. */
const HOLOGRAM_SYSTEMS = new Set(["projects", "about"]);

/**
 * Planet-level overlay: a left text column, plus EITHER a hologram (Projects /
 * About) OR an optional second text column on the right (text-heavy sections
 * like Experience). Boxless, keyed by planet id so the animations replay.
 */
export function PlanetPanel() {
  const { level, system, planet } = useNavigation();
  const open = level === "planet" && !!planet && !!system;

  if (!open || !planet || !system) return null;

  const hologram = HOLOGRAM_SYSTEMS.has(system.id) && planet.hologram !== false;
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
