import { Suspense, useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { UNIVERSE } from "../universe/universe";
import { onIdle } from "../lib/idle";
import { loadAllViews, SystemView, PlanetView } from "./lazyViews";

// Far beyond the camera's far plane: frustum-culled at render (never visible),
// but still processed by the renderer's shader compile.
const FAR = 50000;

/** Skip the warm-up on clearly weak devices so they don't spend startup compiling. */
function lowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores < 4) return true;
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(pointer: coarse)").matches;
  }
  return false;
}

type Phase = "wait" | "system" | "planet" | "done";

/**
 * Idle shader warm-up. After the galaxy is interactive, it mounts a system and a
 * planet view far off-screen for a couple of frames and precompiles their shaders
 * (via the renderer's parallel compile). This moves the one-time shader-compile
 * hitch off the first click. Each level is compiled separately so the light
 * counts match the real views (programs are light-count-specific). Runs once.
 */
export function ShaderWarmup() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const [phase, setPhase] = useState<Phase>("wait");
  const started = useRef(false);

  // Kick off once the main thread is idle.
  useEffect(() => {
    if (started.current || lowPowerDevice()) return;
    started.current = true;
    let cancelled = false;
    const cancelIdle = onIdle(async () => {
      await loadAllViews();
      if (!cancelled) setPhase("system");
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, []);

  // When a content phase is mounted, compile after two frames, then advance.
  useEffect(() => {
    if (phase !== "system" && phase !== "planet") return;
    const next: Phase = phase === "system" ? "planet" : "done";
    let cancelled = false;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        Promise.resolve(gl.compileAsync(scene, camera))
          .catch(() => {})
          .then(() => {
            if (!cancelled) setPhase(next);
          });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [phase, gl, scene, camera]);

  // `projects` carries every clothing/atmosphere type, so warming it covers the
  // whole system level; one planet covers the planet-level body + atmosphere.
  const projects = UNIVERSE.systems.find((s) => s.id === "projects") ?? UNIVERSE.systems[0];

  if (phase === "system") {
    return (
      <group position={[0, 0, FAR]}>
        <Suspense fallback={null}>
          <SystemView system={projects} />
        </Suspense>
      </group>
    );
  }
  if (phase === "planet") {
    return (
      <group position={[0, 0, FAR]}>
        <Suspense fallback={null}>
          <PlanetView planet={projects.planets[0]} />
        </Suspense>
      </group>
    );
  }
  return null;
}
