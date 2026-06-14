import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation, paths } from "../state/navigation";
import { useUIStore } from "../state/store";
import { Breadcrumb } from "./Breadcrumb";
import { ConstellationLabel } from "./ConstellationLabel";
import { PlanetPanel } from "./PlanetPanel";

/**
 * HTML layer sitting above the canvas. Hosts the breadcrumb, hover subtitle and
 * planet panel, and wires Escape to "go up one level". Pointer events pass
 * through to the canvas except on the interactive widgets (see index.css).
 */
export function Overlay() {
  const navigate = useNavigate();
  const { level, systemId } = useNavigation();
  const setHovered = useUIStore((s) => s.setHovered);

  // Clear any lingering hover when the level changes (pointer-out may not fire
  // when the hovered object unmounts on navigation).
  useEffect(() => {
    setHovered(null);
    document.body.style.cursor = "auto";
  }, [level, systemId, setHovered]);

  // Escape goes up one level.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (level === "planet" && systemId) navigate(paths.system(systemId));
      else if (level === "system") navigate(paths.galaxy());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [level, systemId, navigate]);

  return (
    <div className="overlay">
      <Breadcrumb />
      <ConstellationLabel />
      <PlanetPanel />
    </div>
  );
}
