/**
 * Single source of render settings for v1. Performance *tiers* are deliberately
 * deferred — everything runs at full quality. These are only the cheap,
 * universal basics. When tiering lands, this becomes the default tier.
 */
export const SETTINGS = {
  /** Cap device pixel ratio so retina/hi-dpi phones don't render 4x pixels. */
  dprCap: [1, 2] as [number, number],
  /** Bloom post-processing on for everyone in v1. */
  bloom: true,
  /** Low-poly fake-atmosphere shell on planets. */
  atmosphere: true,
  /** Camera transition duration (seconds). */
  transitionDuration: 1.0,
} as const;
