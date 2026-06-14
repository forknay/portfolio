import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Level } from "../state/navigation";
import { useReducedMotion } from "./useReducedMotion";

/** Camera pose per level — all views are framed around the origin. */
const POSES: Record<Level, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  // Galaxy: head-on and zoomed out so the constellation sits in part of a wide void.
  galaxy: { pos: new THREE.Vector3(0, 0, 62), target: new THREE.Vector3(0, 0, 0) },
  // System: raised angle so planets clear the sun rather than hiding behind it.
  system: { pos: new THREE.Vector3(0, 16, 24), target: new THREE.Vector3(0, 0, 0) },
  planet: { pos: new THREE.Vector3(0, 0.3, 6.8), target: new THREE.Vector3(0, 0, 0) },
};

/** Small pointer-parallax per level. Galaxy is intentionally subtle (~2D feel). */
const PARALLAX: Record<Level, number> = { galaxy: 1.2, system: 2.2, planet: 1 };

/**
 * Eases the camera toward the current level's pose every frame using
 * frame-rate-independent exponential smoothing. Reduced-motion snaps instantly.
 */
export function CameraRig({ level }: { level: Level }) {
  const reduced = useReducedMotion();
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const pose = POSES[level];

    desiredPos.current.copy(pose.pos);
    // Subtle pointer parallax (skipped for reduced motion).
    if (!reduced) {
      const amt = PARALLAX[level];
      desiredPos.current.x += state.pointer.x * amt;
      desiredPos.current.y += state.pointer.y * amt;
    }

    // 1 - pow(c, dt): smooth approach that's independent of frame rate.
    const k = reduced ? 1 : 1 - Math.pow(0.0008, dt);
    state.camera.position.lerp(desiredPos.current, k);
    lookAt.current.lerp(pose.target, k);
    state.camera.lookAt(lookAt.current);
  });

  return null;
}
