import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ClothingSpec, Planet } from "../../universe/types";
import { hashSeed, mulberry32, range } from "../../lib/rng";
import { useReducedMotion } from "../../engine/useReducedMotion";

const dummy = new THREE.Object3D();

/**
 * A smooth, Saturn-style ring: flat banded discs in the planet's equatorial
 * plane (not a belt of rocks). Two bands with a Cassini-like gap, tinted toward
 * the planet's accent. Sits in the local xz plane so the planet's spin doesn't
 * tumble it; the planet's axial tilt is what opens it into the iconic ellipse.
 */
function Ring({ planet, params }: { planet: Planet; params: Record<string, number> }) {
  const r = planet.radius;
  const inner = (params.inner ?? 1.35) * r;
  const outer = (params.outer ?? 2.2) * r;
  const span = outer - inner;
  const band1Outer = inner + span * 0.55;
  const band2Inner = inner + span * 0.66;

  const colors = useMemo(() => {
    const accent = new THREE.Color(planet.accentColor);
    return {
      c1: accent.clone().lerp(new THREE.Color("#e7dcc0"), 0.6).getStyle(),
      c2: accent.clone().lerp(new THREE.Color("#cdbf9a"), 0.6).getStyle(),
    };
  }, [planet.accentColor]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[inner, band1Outer, 72]} />
        <meshStandardMaterial
          color={colors.c1}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.9}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[band2Inner, outer, 72]} />
        <meshStandardMaterial
          color={colors.c2}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.72}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** A belt of low-poly rocks in the planet's equatorial plane (not Saturn-smooth). */
function Belt({ planet, params }: { planet: Planet; params: Record<string, number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = params.count ?? 90;
  const inner = (params.inner ?? 1.4) * planet.radius;
  const outer = (params.outer ?? 2.1) * planet.radius;

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = mulberry32(hashSeed(planet.id + "-belt"));
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + range(rand, -0.05, 0.05);
      const rad = range(rand, inner, outer);
      dummy.position.set(
        Math.cos(a) * rad,
        range(rand, -0.05, 0.05) * planet.radius,
        Math.sin(a) * rad,
      );
      dummy.rotation.set(rand() * 6.28, rand() * 6.28, rand() * 6.28);
      dummy.scale.setScalar(range(rand, 0.04, 0.1) * planet.radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [planet.id, planet.radius, count, inner, outer]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={planet.accentColor} flatShading roughness={0.9} />
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
  useFrame((_, dt) => {
    moons.forEach((m, i) => {
      const g = refs.current[i];
      if (!g) return;
      m.phase += reduced ? 0 : dt * m.speed;
      g.position.set(Math.cos(m.phase) * m.dist, 0, Math.sin(m.phase) * m.dist);
    });
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
    case "belt":
      return <Belt planet={planet} params={params} />;
    case "moons":
      return <Moons planet={planet} params={params} />;
    default:
      return null;
  }
}
