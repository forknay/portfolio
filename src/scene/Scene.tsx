import { Suspense, lazy } from "react";
import { CameraRig } from "../engine/CameraRig";
import { PauseOnHidden } from "../engine/PauseOnHidden";
import { SETTINGS } from "../engine/settings";
import { useNavigation, type Level } from "../state/navigation";
import { GalaxyView } from "./galaxy/GalaxyView";

// Lazy per-level so the initial load only pulls the galaxy.
const SystemView = lazy(() =>
  import("./system/SystemView").then((m) => ({ default: m.SystemView })),
);
const PlanetView = lazy(() =>
  import("./planet/PlanetView").then((m) => ({ default: m.PlanetView })),
);
const PostFX = lazy(() => import("./PostFX"));

/**
 * Renders the view matching the current route. If ids don't resolve we fall
 * back to the galaxy (the URL is corrected separately by the route guard).
 */
export function Scene() {
  const { level, system, planet } = useNavigation();

  // Effective level once we know whether the ids actually resolved.
  let view = <GalaxyView />;
  let effectiveLevel: Level = "galaxy";
  if (planet && system) {
    view = <PlanetView planet={planet} />;
    effectiveLevel = "planet";
  } else if (system && level !== "planet") {
    view = <SystemView system={system} />;
    effectiveLevel = "system";
  }

  return (
    <>
      <PauseOnHidden />
      <CameraRig level={effectiveLevel} />
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 60, 140]} />

      <Suspense fallback={null}>{view}</Suspense>

      {SETTINGS.bloom && (
        <Suspense fallback={null}>
          <PostFX />
        </Suspense>
      )}
    </>
  );
}
