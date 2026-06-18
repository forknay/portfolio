import * as THREE from "three";
import { fbm } from "../../lib/noise";
import { hashSeed } from "../../lib/rng";

/**
 * A deterministic per-planet axial tilt, so ringed planets open their rings into
 * the iconic Saturn ellipse (and every planet leans a little for variety).
 */
export function planetAxialTilt(id: string): [number, number, number] {
  const h = hashSeed(id);
  const x = -0.55 + ((h % 100) / 100) * 0.22; // lean back ~ -0.55..-0.33
  const z = (((h >> 5) % 100) / 100 - 0.5) * 0.3; // slight roll
  return [x, 0, z];
}

const UP = new THREE.Vector3(0, 1, 0);
const ALT = new THREE.Vector3(1, 0, 0);
const clamp1 = (x: number) => (x < -1 ? -1 : x > 1 ? 1 : x);

/**
 * A low-poly planet sphere with varied-size facets ("plates"). Vertices are
 * moved ONLY tangentially (they stay exactly on the sphere), so the surface
 * keeps connecting as a smooth faceted shell — no radial spikes. Two warps:
 *  - fine jitter — small per-vertex scatter for irregular shapes;
 *  - clustering — vertices flow along the gradient of a low-frequency field, so
 *    they bunch near peaks (small facets) and spread out elsewhere (big plates).
 * The total move is capped below the facet spacing so triangles never fold over
 * (folding is what produced the spiky edges). All offsets derive from a
 * quantised direction, so the non-indexed icosphere's shared vertices move
 * identically — no cracks.
 */
export function buildPlanet(
  radius: number,
  detail: number,
  seed: number,
): THREE.BufferGeometry {
  const fineFreq = 2.4;
  const lowFreq = 1.15;
  // Approx spacing between vertices on the unit icosphere.
  const edge = 1.05 / Math.max(1, detail);
  const fineAmp = 0.1 * edge;
  const clusterAmp = 0.42 * edge;
  const maxOff = 0.45 * edge; // stay under the folding threshold (~0.5)

  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;

  const d = new THREE.Vector3();
  const q = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const bitangent = new THREE.Vector3();
  const nd = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  const field = (x: number, y: number, z: number) =>
    fbm(x * lowFreq + 20, y * lowFreq + 20, z * lowFreq + 20, seed + 200, 3);

  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    // Quantise so all copies of a shared vertex resolve identically.
    q.set(
      Math.round(d.x * 1000) / 1000,
      Math.round(d.y * 1000) / 1000,
      Math.round(d.z * 1000) / 1000,
    ).normalize();

    const ref = Math.abs(q.y) > 0.99 ? ALT : UP;
    tangent.crossVectors(ref, q).normalize();
    bitangent.crossVectors(q, tangent).normalize();

    // Fine per-vertex scatter.
    const jx = (fbm(q.x * fineFreq + 1.3, q.y * fineFreq + 1.3, q.z * fineFreq + 1.3, seed) - 0.5) * 2 * fineAmp;
    const jy = (fbm(q.x * fineFreq + 7.7, q.y * fineFreq + 7.7, q.z * fineFreq + 7.7, seed + 99) - 0.5) * 2 * fineAmp;

    // Clustering: move along the gradient of a low-frequency field.
    const eps = 0.05;
    const f0 = field(q.x, q.y, q.z);
    tmp.copy(q).addScaledVector(tangent, eps).normalize();
    const gx = clamp1((field(tmp.x, tmp.y, tmp.z) - f0) / eps);
    tmp.copy(q).addScaledVector(bitangent, eps).normalize();
    const gy = clamp1((field(tmp.x, tmp.y, tmp.z) - f0) / eps);

    // Combine and clamp the tangential offset so facets never fold (no spikes).
    let ox = jx + gx * clusterAmp;
    let oy = jy + gy * clusterAmp;
    const mag = Math.hypot(ox, oy);
    if (mag > maxOff) {
      ox = (ox / mag) * maxOff;
      oy = (oy / mag) * maxOff;
    }

    // Tangential only — vertex stays on the sphere (radius unchanged).
    nd.copy(q).addScaledVector(tangent, ox).addScaledVector(bitangent, oy).normalize();
    pos.setXYZ(i, nd.x * radius, nd.y * radius, nd.z * radius);
  }

  geo.computeVertexNormals();
  return geo;
}

// Cache built geometries so re-entering a planet/system doesn't rebuild (the
// scene only shows one level at a time, and these are small + reused).
const cache = new Map<string, THREE.BufferGeometry>();

/** Cached `buildPlanet` keyed by its inputs. */
export function getPlanetGeometry(
  radius: number,
  detail: number,
  seed: number,
): THREE.BufferGeometry {
  const key = `${radius}|${detail}|${seed}`;
  let g = cache.get(key);
  if (!g) {
    g = buildPlanet(radius, detail, seed);
    cache.set(key, g);
  }
  return g;
}
