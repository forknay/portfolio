import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import type { Planet } from "../../universe/types";
import { paths } from "../../state/navigation";
import { useUIStore } from "../../state/store";
import { useReducedMotion } from "../../engine/useReducedMotion";

/**
 * A planet orbiting its sun in the system view. Hover shows the corner subtitle;
 * click navigates to the planet level. A faint orbit ring hints at the path.
 */
export function OrbitingPlanet({
  planet,
  systemId,
}: {
  planet: Planet;
  systemId: string;
}) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const setHovered = useUIStore((s) => s.setHovered);
  const [hovered, setHover] = useState(false);

  const orbitGroup = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const angle = useRef(planet.orbit.phase);

  useFrame((_, dt) => {
    if (!reduced) angle.current += dt * planet.orbit.speed;
    if (orbitGroup.current) {
      orbitGroup.current.position.set(
        Math.cos(angle.current) * planet.orbit.radius,
        0,
        Math.sin(angle.current) * planet.orbit.radius,
      );
    }
    if (body.current && !reduced) body.current.rotation.y += dt * planet.rotationSpeed;
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(true);
    document.body.style.cursor = "pointer";
    setHovered({ name: planet.name, subtitle: planet.subtitle, color: planet.accentColor });
  };
  const onOut = () => {
    setHover(false);
    document.body.style.cursor = "auto";
    setHovered(null);
  };

  return (
    <group rotation={[planet.orbit.inclination, 0, 0]}>
      {/* Orbit hint ring in the orbital plane. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.orbit.radius - 0.015, planet.orbit.radius + 0.015, 96]} />
        <meshBasicMaterial color={planet.accentColor} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>

      <group ref={orbitGroup}>
        <mesh
          ref={body}
          scale={hovered ? 1.12 : 1}
          onPointerOver={onOver}
          onPointerOut={onOut}
          onClick={(e) => {
            e.stopPropagation();
            navigate(paths.planet(systemId, planet.id));
          }}
        >
          <icosahedronGeometry args={[planet.radius, 2]} />
          <meshStandardMaterial
            color={planet.baseColor}
            flatShading
            roughness={0.85}
            metalness={0.05}
            emissive={planet.accentColor}
            emissiveIntensity={hovered ? 0.25 : 0.08}
          />
        </mesh>
      </group>
    </group>
  );
}
