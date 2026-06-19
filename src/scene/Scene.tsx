import { Suspense } from "react";
import { CameraRig } from "../engine/CameraRig";
import { PauseOnHidden } from "../engine/PauseOnHidden";
import { SETTINGS } from "../engine/settings";
import { useNavigation, type Level } from "../state/navigation";
import { GalaxyView } from "./galaxy/GalaxyView";
import { SystemView, PlanetView, PostFX } from "./lazyViews";

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
      <CameraRig level={effectiveLevel} systemZoom={system?.cameraZoom ?? 1} />
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
