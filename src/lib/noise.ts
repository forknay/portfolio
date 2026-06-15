/**
 * Tiny deterministic 3D value noise + fbm. Used to carve continent/cloud
 * patches onto a sphere. No dependencies, stable across loads.
 */

function hash(x: number, y: number, z: number, seed: number): number {
  let h = seed ^ Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 3D value noise in [0, 1). */
export function valueNoise(x: number, y: number, z: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = smooth(x - xi);
  const v = smooth(y - yi);
  const w = smooth(z - zi);

  const c000 = hash(xi, yi, zi, seed);
  const c100 = hash(xi + 1, yi, zi, seed);
  const c010 = hash(xi, yi + 1, zi, seed);
  const c110 = hash(xi + 1, yi + 1, zi, seed);
  const c001 = hash(xi, yi, zi + 1, seed);
  const c101 = hash(xi + 1, yi, zi + 1, seed);
  const c011 = hash(xi, yi + 1, zi + 1, seed);
  const c111 = hash(xi + 1, yi + 1, zi + 1, seed);

  const x00 = lerp(c000, c100, u);
  const x10 = lerp(c010, c110, u);
  const x01 = lerp(c001, c101, u);
  const x11 = lerp(c011, c111, u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

/** Fractal Brownian motion (layered value noise) in ~[0, 1). */
export function fbm(
  x: number,
  y: number,
  z: number,
  seed: number,
  octaves = 3,
): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq, z * freq, seed + i * 101);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}
