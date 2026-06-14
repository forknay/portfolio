import { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uCore;
  uniform vec3 uHalo;
  uniform float uGlow;
  void main() {
    float d = distance(vUv, vec2(0.5));
    // Sharp round core...
    float core = smoothstep(0.17, 0.10, d);
    // ...with a faint hue around it.
    float halo = smoothstep(0.5, 0.17, d);
    vec3 col = mix(uHalo, uCore, core);
    float a = core + halo * uGlow;
    if (a < 0.01) discard;
    gl_FragColor = vec4(col, min(a, 1.0));
  }
`;

interface StarSpriteProps {
  position: THREE.Vector3 | [number, number, number];
  size: number;
  coreColor?: string;
  haloColor?: string;
  glow?: number;
  interactive?: boolean;
  /** World-size of the (invisible) click/hover target. Defaults to ~4x size. */
  hitSize?: number;
  onActivate?: () => void;
  onOver?: () => void;
  onOut?: () => void;
}

/**
 * A crisp, camera-facing star: sharp white core with a slight coloured hue
 * around it. Clickable (section) stars get a biome hue, grow on hover, and
 * carry a large invisible hit plane so they're easy to click.
 */
export function StarSprite({
  position,
  size,
  coreColor = "#ffffff",
  haloColor = "#bcc6ee",
  glow = 0.2,
  interactive = false,
  hitSize,
  onActivate,
  onOver,
  onOut,
}: StarSpriteProps) {
  const group = useRef<THREE.Group>(null);
  const visible = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const uniforms = useMemo(
    () => ({
      uCore: { value: new THREE.Color(coreColor) },
      uHalo: { value: new THREE.Color(haloColor) },
      uGlow: { value: glow },
    }),
    [coreColor, haloColor, glow],
  );

  useFrame((state) => {
    const g = group.current;
    const v = visible.current;
    if (!g || !v) return;
    // Billboard the whole group toward the camera.
    g.quaternion.copy(state.camera.quaternion);
    // Smoothly grow the visible star on hover (hit plane stays fixed).
    const target = (hovered ? 1.35 : 1) * size;
    v.scale.x += (target - v.scale.x) * 0.2;
    v.scale.y = v.scale.x;
  });

  const handlers = interactive
    ? {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
          onOver?.();
        },
        onPointerOut: () => {
          setHovered(false);
          document.body.style.cursor = "auto";
          onOut?.();
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onActivate?.();
        },
      }
    : {};

  return (
    <group ref={group} position={position}>
      <mesh ref={visible} scale={size}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {interactive && (
        <mesh scale={hitSize ?? size * 4} {...handlers}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
