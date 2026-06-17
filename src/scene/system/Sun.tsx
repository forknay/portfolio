import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../../engine/useReducedMotion";

const coreVert = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  varying float vDisp;

  // Cheap animated turbulence => a "boiling" molten surface.
  float boil(vec3 p) {
    float t = uTime;
    float n = sin(p.x * uFreq + t * 1.3)
            + sin(p.y * uFreq * 1.1 - t * 1.1)
            + sin(p.z * uFreq * 0.9 + t * 1.7)
            + sin((p.x + p.y) * uFreq * 0.7 + t * 0.9);
    return n * 0.25; // -1..1
  }

  void main() {
    vec3 nrm = normalize(position);
    float d = boil(position);
    vDisp = d;
    vec3 displaced = position + nrm * d * uAmp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const coreFrag = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vDisp;
  void main() {
    float h = clamp(vDisp * 0.5 + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(mix(uColor, uHot, h), 1.0);
  }
`;

const coronaVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coronaFrag = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float glow = pow(smoothstep(1.0, 0.0, r), 2.0);
    float ang = atan(p.y, p.x);
    // Faint slowly-rotating rays.
    float rays = 0.82 + 0.18 * sin(ang * 12.0 + uTime * 0.6);
    float a = glow * rays * 0.5;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * The system's star, made visibly different from planets: a "boiling" molten
 * surface (animated vertex displacement + hot/cool shading), a slow breathing
 * pulse, and a soft animated corona with faint rotating rays. Reduced-motion
 * freezes all of it.
 */
export function Sun({ color, size }: { color: string; size: number }) {
  const reduced = useReducedMotion();
  const core = useRef<THREE.Mesh>(null);
  const corona = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.ShaderMaterial>(null);
  const coronaMat = useRef<THREE.ShaderMaterial>(null);

  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: size * 0.038 },
      uFreq: { value: 2.0 / size },
      uColor: { value: new THREE.Color(color) },
      uHot: { value: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.6) },
    }),
    [color, size],
  );
  const coronaUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }),
    [color],
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (!reduced) {
      if (coreMat.current) coreMat.current.uniforms.uTime.value += dt * 0.3;
      if (coronaMat.current) coronaMat.current.uniforms.uTime.value += dt;
      if (core.current) {
        core.current.rotation.y += dt * 0.05;
        core.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02); // breathing pulse
      }
    }
    // Keep the corona facing the camera.
    if (corona.current) corona.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group>
      <pointLight color={color} intensity={2.2} distance={120} decay={0.6} />

      <mesh ref={core}>
        <icosahedronGeometry args={[size, 3]} />
        <shaderMaterial
          ref={coreMat}
          uniforms={coreUniforms}
          vertexShader={coreVert}
          fragmentShader={coreFrag}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={corona} scale={size * 2.1}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={coronaMat}
          uniforms={coronaUniforms}
          vertexShader={coronaVert}
          fragmentShader={coronaFrag}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
