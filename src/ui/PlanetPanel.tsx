import { useNavigate } from "react-router-dom";
import { useNavigation, paths } from "../state/navigation";

/**
 * Side info panel for the planet (section) level: title, body copy, and links.
 * Slides in on desktop; becomes a bottom sheet on mobile (see index.css).
 */
export function PlanetPanel() {
  const navigate = useNavigate();
  const { level, system, planet } = useNavigation();
  const open = level === "planet" && !!planet && !!system;

  return (
    <aside className={`planet-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
      {open && planet && system && (
        <div className="planet-panel-inner">
          <button
            className="panel-back"
            onClick={() => navigate(paths.system(system.id))}
          >
            ← {system.name}
          </button>

          <h1 className="panel-title" style={{ color: planet.accentColor }}>
            {planet.name}
          </h1>
          <p className="panel-subtitle">{planet.subtitle}</p>
          <p className="panel-body">{planet.sectionBody}</p>

          {planet.links.length > 0 && (
            <div className="panel-links">
              {planet.links.map((link) => (
                <a
                  key={link.url}
                  className="panel-link"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ borderColor: planet.accentColor }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
