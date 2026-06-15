import * as THREE from "three";
import { fbm } from "../../lib/noise";

/**
 * A low-poly planet sphere with irregular faceting: each vertex of an icosphere
 * is nudged in/out by noise so the triangulation no longer looks uniform.
 * Deterministic per seed; flat-shaded.
 */
export function buildPlanet(
  radius: number,
  detail: number,
  seed: number,
  amp = 0.05,
): THREE.BufferGeometry {
  const freq = 1.9;
  // IcosahedronGeometry is already non-indexed (each face has its own verts),
  // so displacing per vertex + recomputing normals gives flat, irregular facets.
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const len = v.length() || 1;
    const nx = v.x / len, ny = v.y / len, nz = v.z / len;
    const n = fbm(nx * freq + 5, ny * freq + 5, nz * freq + 5, seed, 3);
    const r = radius * (1 + (n - 0.5) * 2 * amp);
    pos.setXYZ(i, nx * r, ny * r, nz * r);
  }

  geo.computeVertexNormals();
  return geo;
}
