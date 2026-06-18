import * as THREE from "three";
import { fbm } from "../../lib/noise";

/** A small set of pre-baked pattern seeds (pick 1 of these per planet). */
const PATTERN_SEEDS = [13577, 91237];

interface ContinentOptions {
  detail?: number;
  /** Noise frequency — lower = bigger, more connected floes. */
  freq?: number;
  /** ~Fraction of the sphere covered (0..1). */
  coverage?: number;
  /** Minimum slab thickness as a fraction of radius. */
  baseThick?: number;
  /** Extra fluctuating thickness as a fraction of radius. */
  ampThick?: number;
  /** How strongly coverage + height concentrate toward the top (north). */
  topBias?: number;
  /** How far the slab's underside floats above the planet surface. */
  baseLift?: number;
  /** Which pre-baked pattern (0..N) to use. */
  pattern?: number;
}

/**
 * Builds a chunky "ice sheet" cloud layer: noise selects floes (kept faces);
 * each floe has a raised top of fluctuating, top-heavy thickness AND vertical
 * walls down to a thin shared base — so it reads like sheets of ice of varying
 * thickness on water, not floating membranes. Lower coverage keeps the floes
 * separated. Deterministic per pattern.
 *
 * IcosahedronGeometry is non-indexed, so adjacency (for the walls) is found by
 * matching shared vertex *positions* rather than a vertex index.
 */
export function buildContinents(
  radius: number,
  opts: ContinentOptions = {},
): THREE.BufferGeometry {
  const detail = opts.detail ?? 3;
  const freq = opts.freq ?? 1.8;
  const coverage = opts.coverage ?? 0.47;
  const baseThick = opts.baseThick ?? 0.02;
  const ampThick = opts.ampThick ?? 0.14;
  const topBias = opts.topBias ?? 0;
  const baseLift = opts.baseLift ?? 0.05;
  const seed = PATTERN_SEEDS[(opts.pattern ?? 0) % PATTERN_SEEDS.length];
  const threshold = 1 - coverage;

  const ico = new THREE.IcosahedronGeometry(1, detail);
  const pos = ico.attributes.position;
  const faceCount = pos.count / 3;

  // Unit direction per vertex (index).
  const dirs: THREE.Vector3[] = [];
  for (let i = 0; i < pos.count; i++) {
    dirs.push(new THREE.Vector3().fromBufferAttribute(pos, i).normalize());
  }

  const topRadius = (d: THREE.Vector3): number => {
    const fluct = fbm(d.x * freq * 1.4, d.y * freq * 1.4, d.z * freq * 1.4, seed + 57, 2);
    const t = baseThick + fluct * ampThick; // uniform thickness (no latitude bias)
    return radius * (1 + baseLift + t);
  };
  const baseR = radius * (1 + baseLift);

  // Which faces are ice (latitude-biased coverage).
  const kept = new Uint8Array(faceCount);
  for (let f = 0; f < faceCount; f++) {
    const a = dirs[f * 3], b = dirs[f * 3 + 1], c = dirs[f * 3 + 2];
    let mx = (a.x + b.x + c.x) / 3;
    let my = (a.y + b.y + c.y) / 3;
    let mz = (a.z + b.z + c.z) / 3;
    const ml = Math.hypot(mx, my, mz) || 1;
    mx /= ml; my /= ml; mz /= ml;
    const local = threshold - topBias * Math.max(0, my);
    kept[f] = fbm(mx * freq, my * freq, mz * freq, seed, 3) >= local ? 1 : 0;
  }

  // Count kept faces per edge (by quantised vertex positions). ==1 => boundary.
  const pk = (d: THREE.Vector3) => `${d.x.toFixed(3)},${d.y.toFixed(3)},${d.z.toFixed(3)}`;
  const ekey = (i: number, j: number) => {
    const ki = pk(dirs[i]);
    const kj = pk(dirs[j]);
    return ki < kj ? `${ki}|${kj}` : `${kj}|${ki}`;
  };
  const edgeCount = new Map<string, number>();
  for (let f = 0; f < faceCount; f++) {
    if (!kept[f]) continue;
    const a = f * 3;
    for (const [i, j] of [[a, a + 1], [a + 1, a + 2], [a + 2, a]]) {
      const k = ekey(i, j);
      edgeCount.set(k, (edgeCount.get(k) ?? 0) + 1);
    }
  }

  const out: number[] = [];
  const push = (d: THREE.Vector3, r: number) => out.push(d.x * r, d.y * r, d.z * r);

  for (let f = 0; f < faceCount; f++) {
    if (!kept[f]) continue;
    const a = f * 3;
    const da = dirs[a], db = dirs[a + 1], dc = dirs[a + 2];

    // Raised top face.
    push(da, topRadius(da));
    push(db, topRadius(db));
    push(dc, topRadius(dc));

    // Walls down to the base on boundary edges (DoubleSide material shows them).
    for (const [i, j] of [[a, a + 1], [a + 1, a + 2], [a + 2, a]]) {
      if (edgeCount.get(ekey(i, j)) !== 1) continue;
      const di = dirs[i], dj = dirs[j];
      const ti = topRadius(di), tj = topRadius(dj);
      push(di, ti); push(dj, tj); push(dj, baseR);
      push(di, ti); push(dj, baseR); push(di, baseR);
    }
  }

  ico.dispose();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(out, 3));
  geo.computeVertexNormals();
  return geo;
}

// Cache so repeated planet/system entries don't rebuild the (small) layers.
const cache = new Map<string, THREE.BufferGeometry>();

/** Cached `buildContinents` keyed by radius + options. */
export function getContinents(
  radius: number,
  opts: ContinentOptions = {},
): THREE.BufferGeometry {
  const key = radius + "|" + JSON.stringify(opts);
  let g = cache.get(key);
  if (!g) {
    g = buildContinents(radius, opts);
    cache.set(key, g);
  }
  return g;
}
