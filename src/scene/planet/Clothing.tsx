import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ClothingSpec, Planet } from "../../universe/types";
import { hashSeed, mulberry32, range } from "../../lib/rng";
import { fibonacciSphere } from "../../lib/sphere";
import { useReducedMotion } from "../../engine/useReducedMotion";

const dummy = new THREE.Object3D();

/** A ring of low-poly rocks in the planet's equatorial plane. */
function Ring({ planet, params }: { planet: Planet; params: Record<string, number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = params.count ?? 80;
  const inner = params.inner ?? planet.radius * 1.5;
  const outer = params.outer ?? planet.radius * 2.0;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = mulberry32(hashSeed(planet.id + "-ring"));
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + range(rand, -0.05, 0.05);
      const rad = range(rand, inner, outer);
      dummy.position.set(Math.cos(a) * rad, range(rand, -0.06, 0.06), Math.sin(a) * rad);
      dummy.rotation.set(rand() * 6.28, rand() * 6.28, rand() * 6.28);
      dummy.scale.setScalar(range(rand, 0.05, 0.14));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [planet.id, count, inner, outer]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={planet.accentColor} flatShading roughness={0.9} />
    </instancedMesh>
  );
}

/** Polygonal mountains poking out of the surface. */
function Mountains({ planet, params }: { planet: Planet; params: Record<string, number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = params.count ?? 50;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = mulberry32(hashSeed(planet.id + "-mtn"));
    for (let i = 0; i < count; i++) {
      const n = fibonacciSphere(i, count);
      const h = range(rand, 0.12, 0.3);
      dummy.position.copy(n).multiplyScalar(planet.radius + h * 0.4);
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
      dummy.scale.set(range(rand, 0.08, 0.16), h, range(rand, 0.08, 0.16));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [planet.id, count, planet.radius]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial color={planet.accentColor} flatShading roughness={0.95} />
    </instancedMesh>
  );
}

/** Small moons orbiting the planet. */
function Moons({ planet, params }: { planet: Planet; params: Record<string, number> }) {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const count = params.count ?? 2;

  const moons = useMemo(() => {
    const rand = mulberry32(hashSeed(planet.id + "-moon"));
    return Array.from({ length: count }, () => ({
      dist: range(rand, planet.radius * 2.0, planet.radius * 2.8),
      size: range(rand, 0.18, 0.32),
      tilt: range(rand, -0.5, 0.5),
      phase: rand() * 6.28,
      speed: range(rand, 0.3, 0.6),
    }));
  }, [planet.id, count, planet.radius]);

  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame((state, dt) => {
    moons.forEach((m, i) => {
      const g = refs.current[i];
      if (!g) return;
      m.phase += reduced ? 0 : dt * m.speed;
      g.position.set(Math.cos(m.phase) * m.dist, 0, Math.sin(m.phase) * m.dist);
    });
    void state;
  });

  return (
    <group ref={group}>
      {moons.map((m, i) => (
        <group key={i} rotation={[m.tilt, 0, 0]}>
          <group ref={(el) => (refs.current[i] = el)}>
            <mesh scale={m.size}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color={planet.accentColor} flatShading roughness={0.9} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Dispatches to the one clothing piece a planet wears. */
export function Clothing({ planet, spec }: { planet: Planet; spec: ClothingSpec }) {
  const params = spec.params ?? {};
  switch (spec.type) {
    case "ring":
      return <Ring planet={planet} params={params} />;
    case "mountains":
      return <Mountains planet={planet} params={params} />;
    case "moons":
      return <Moons planet={planet} params={params} />;
    default:
      return null;
  }
}
