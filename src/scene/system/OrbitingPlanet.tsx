import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import type { Planet } from "../../universe/types";
import { paths } from "../../state/navigation";
import { useUIStore } from "../../state/store";
import { useReducedMotion } from "../../engine/useReducedMotion";
import { preloadPlanet } from "../lazyViews";
import { PlanetBody } from "../planet/PlanetBody";
import { planetAxialTilt } from "../planet/planetGeometry";

/**
 * A planet orbiting its sun in the system view. Renders a reduced-detail version
 * of the planet's real features (via PlanetBody) so each is recognizable, not
 * just a coloured sphere. Hover previews the name + warms the planet chunk; click
 * navigates in.
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
  const body = useRef<THREE.Group>(null);
  const angle = useRef(planet.orbit.phase);

  // Compressed: cap body detail and use a cheaper cloud layer for the mini view.
  const bodyDetail = Math.min(planet.polyDetail ?? 3, 2);

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
    preloadPlanet();
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
        <group rotation={planetAxialTilt(planet.id)}>
          <group ref={body} scale={hovered ? 1.12 : 1}>
            <PlanetBody planet={planet} detail={bodyDetail} atmosphereDetail={2} />
          </group>
        </group>

        {/* Single invisible hit target — avoids hover flicker between sub-meshes. */}
        <mesh
          onPointerOver={onOver}
          onPointerOut={onOut}
          onClick={(e) => {
            e.stopPropagation();
            navigate(paths.planet(systemId, planet.id));
          }}
        >
          <sphereGeometry args={[planet.radius * 1.3, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
