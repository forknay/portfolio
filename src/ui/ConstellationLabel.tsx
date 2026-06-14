import { useUIStore } from "../state/store";
import { useNavigation } from "../state/navigation";

/**
 * The active constellation's name, shown on the landing page in an engraved
 * "celestial" font (the star-chart vibe). Only visible at the galaxy level.
 */
export function ConstellationLabel() {
  const { level } = useNavigation();
  const name = useUIStore((s) => s.constellationName);
  const show = level === "galaxy" && !!name;

  return (
    <div className={`constellation-label ${show ? "is-visible" : ""}`} aria-hidden={!show}>
      {name}
    </div>
  );
}
