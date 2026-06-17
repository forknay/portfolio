import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { UNIVERSE } from "../../universe/universe";
import { pickRandomConstellation } from "../../universe/selectors";
import type { System } from "../../universe/types";
import { paths } from "../../state/navigation";
import { useUIStore } from "../../state/store";
import { hashSeed } from "../../lib/rng";
import { VoidDots } from "../common/VoidDots";
import { StarSprite } from "../common/StarSprite";
import { ConstellationLines } from "./ConstellationLines";

const TARGET_EXTENT = 34; // how wide the constellation spans, in scene units

/** Lighten a colour toward white (for the near-white section-star hue). */
function lighten(hex: string, t: number): string {
  return new THREE.Color(hex).lerp(new THREE.Color("#ffffff"), t).getStyle();
}

/**
 * Landing page: one randomly chosen constellation over the cosmic void. Stars
 * mapped to a section are clickable (near-white with a hint of biome hue); the
 * rest are decorative.
 */
export function GalaxyView() {
  const navigate = useNavigate();
  const setHovered = useUIStore((s) => s.setHovered);
  const setConstellationName = useUIStore((s) => s.setConstellationName);

  // Pick a variant once on mount; resolve its 2D layout into centred 3D points.
  const layout = useMemo(() => {
    const constellation = pickRandomConstellation();

    const xs = constellation.stars.map((s) => s.pos[0]);
    const ys = constellation.stars.map((s) => s.pos[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
    const scale = TARGET_EXTENT / (span || 1);

    const points = new Map<string, THREE.Vector3>();
    for (const star of constellation.stars) {
      const z = ((hashSeed(star.id) % 1000) / 1000 - 0.5) * 3; // tiny depth jitter
      points.set(
        star.id,
        new THREE.Vector3((star.pos[0] - cx) * scale, (star.pos[1] - cy) * scale, z),
      );
    }

    // Invert systemStars: which star id belongs to which system.
    const starToSystem = new Map<string, System>();
    for (const system of UNIVERSE.systems) {
      const starId = constellation.systemStars[system.id];
      if (starId) starToSystem.set(starId, system);
    }

    return { constellation, points, starToSystem };
  }, []);

  // Publish the active constellation's name to the overlay label.
  useEffect(() => {
    setConstellationName(layout.constellation.name);
    return () => setConstellationName(null);
  }, [layout.constellation.name, setConstellationName]);

  return (
    <group>
      <VoidDots count={UNIVERSE.voidDotCount} />
      <ConstellationLines points={layout.points} lines={layout.constellation.lines} />

      {layout.constellation.stars.map((star) => {
        const pos = layout.points.get(star.id)!;
        const system = layout.starToSystem.get(star.id);

        if (system) {
          return (
            <StarSprite
              key={star.id}
              position={pos}
              size={1.7}
              coreColor="#ffffff"
              haloColor={lighten(system.accentColor, 0.55)}
              glow={0.5}
              interactive
              hitSize={7}
              onActivate={() => navigate(paths.system(system.id))}
              onOver={() =>
                setHovered({ name: system.name, subtitle: system.subtitle, color: system.accentColor })
              }
              onOut={() => setHovered(null)}
            />
          );
        }

        return (
          <StarSprite
            key={star.id}
            position={pos}
            size={1.05}
            coreColor="#eef2ff"
            haloColor="#9fb0e0"
            glow={0.16}
          />
        );
      })}
    </group>
  );
}
