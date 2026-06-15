import { useNavigation } from "../state/navigation";
import { PlanetInfo } from "./PlanetInfo";
import { Hologram } from "./Hologram";

/** Only these sections show the hologram feed. */
const HOLOGRAM_SYSTEMS = new Set(["projects", "about"]);

/**
 * Planet-level overlay: text column on the left, hologram on the right, planet
 * centred between them. Boxless — no back button (the breadcrumb handles going
 * up). Keyed by planet id so the decode/power-on animations replay per planet.
 */
export function PlanetPanel() {
  const { level, system, planet } = useNavigation();
  const open = level === "planet" && !!planet && !!system;

  if (!open || !planet || !system) return null;

  return (
    <div className="planet-stage" key={planet.id}>
      <PlanetInfo system={system} planet={planet} />
      {HOLOGRAM_SYSTEMS.has(system.id) && <Hologram planet={planet} active />}
    </div>
  );
}
