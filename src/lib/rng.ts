/**
 * Tiny deterministic PRNG so procedurally-placed things (decorative stars,
 * clothing scatter, etc.) look "random" but are identical on every load.
 * No runtime randomness => stable visuals and cache-friendly behaviour.
 */

/** mulberry32 — fast, good-enough 32-bit seeded generator. Returns [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string into a 32-bit integer seed (FNV-1a). */
export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Random float in [min, max) from a generator. */
export function range(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}
