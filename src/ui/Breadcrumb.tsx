import { Link } from "react-router-dom";
import { useNavigation, paths } from "../state/navigation";
import { useUIStore } from "../state/store";

/**
 * Persistent breadcrumb / back affordance: Galaxy ▸ System ▸ Planet, each crumb
 * linking up a level. While hovering a star/planet, its name appears appended as
 * a faded "ghost" crumb — a light preview of where a click would take you.
 */
export function Breadcrumb() {
  const { level, system, planet } = useNavigation();
  const hovered = useUIStore((s) => s.hovered);

  // Only preview a hover that isn't already the current location.
  const showGhost = !!hovered && level !== "planet";

  return (
    <nav className="breadcrumb" aria-label="Location">
      <Link to={paths.galaxy()} className="crumb">
        Galaxy
      </Link>
      {system && (
        <>
          <span className="crumb-sep">▸</span>
          <Link to={paths.system(system.id)} className="crumb">
            {system.name}
          </Link>
        </>
      )}
      {system && planet && (
        <>
          <span className="crumb-sep">▸</span>
          <span className="crumb is-current" style={{ color: planet.accentColor }}>
            {planet.name}
          </span>
        </>
      )}
      {showGhost && hovered && (
        <>
          <span className="crumb-sep is-ghost">▸</span>
          <span className="crumb is-ghost" style={{ color: hovered.color }}>
            {hovered.name}
          </span>
        </>
      )}
    </nav>
  );
}
