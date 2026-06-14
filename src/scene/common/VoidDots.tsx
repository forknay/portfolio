import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32, hashSeed } from "../../lib/rng";

const vertexShader = /* glsl */ `
  attribute float aSize;
  uniform float uPixelRatio;
  void main() {
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  void main() {
    // Sharp little pinprick: tight core, quick falloff.
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.32, d);
    if (a < 0.02) discard;
    gl_FragColor = vec4(uColor, a * 0.7);
  }
`;

/**
 * The black-void backdrop: tiny, sharp white dots scattered far out on a sphere
 * shell so they sit behind everything in every view. Deterministic positions,
 * single draw call, constant screen size (no distance attenuation).
 */
export function VoidDots({ count, radius = 160 }: { count: number; radius?: number }) {
  const pixelRatio = Math.min(useThree((s) => s.gl.getPixelRatio()), 2);

  const geometry = useMemo(() => {
    const rand = mulberry32(hashSeed("void-dots"));
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Uniform points on a sphere shell.
      const u = rand();
      const v = rand();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.85 + rand() * 0.15);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 1 + rand() * 1.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [count, radius]);

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: pixelRatio },
      uColor: { value: new THREE.Color("#dfe6ff") },
    }),
    [pixelRatio],
  );

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
