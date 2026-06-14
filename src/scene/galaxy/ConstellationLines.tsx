import { useMemo } from "react";
import * as THREE from "three";

/**
 * Very fine, faint lines connecting the stars of a constellation. Positions are
 * resolved by the parent and passed in as a star-id → point map.
 */
export function ConstellationLines({
  points,
  lines,
}: {
  points: Map<string, THREE.Vector3>;
  lines: [string, string][];
}) {
  const geometry = useMemo(() => {
    const verts: number[] = [];
    for (const [a, b] of lines) {
      const pa = points.get(a);
      const pb = points.get(b);
      if (!pa || !pb) continue;
      verts.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, [points, lines]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#9fb0e0" transparent opacity={0.22} depthWrite={false} />
    </lineSegments>
  );
}
