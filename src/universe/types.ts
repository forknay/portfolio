/**
 * The typed "universe" data model. This is the single backbone that drives the
 * entire 3D scene: galaxy -> systems -> planets. Art and content can change here
 * without touching any engine/scene code.
 */

/** A link shown on a planet's info panel. */
export interface PlanetLink {
  label: string;
  url: string;
}

/**
 * The optional low-poly accessory mesh worn by a planet ("clothing").
 * `params` is loosely typed per clothing kind and read by the matching factory.
 */
export type ClothingType = "ring" | "belt" | "moons";

export interface ClothingSpec {
  type: ClothingType;
  /** Optional knobs interpreted by the specific clothing factory. */
  params?: Record<string, number>;
}

/**
 * A planet's atmosphere, used to give each planet a distinct character:
 * - `shell`  — a faceted translucent low-poly shell over the whole planet.
 * - `clouds` — partial, opaque white low-poly cloud patches above the surface
 *              (like clouds on Earth) plus a faint rim. Does NOT cover all of it.
 * Absent = no atmosphere.
 */
export type AtmosphereType = "shell" | "clouds";

export interface AtmosphereSpec {
  type: AtmosphereType;
  /** Cloud/continent colour (clouds only). Defaults to off-white. */
  color?: string;
  params?: Record<string, number>;
}

/** Orbit of a planet around its system's sun. */
export interface Orbit {
  /** Distance from the sun, in scene units. */
  radius: number;
  /** Angular speed (radians/sec). */
  speed: number;
  /** Orbit tilt in radians. */
  inclination: number;
  /** Starting angle in radians so planets don't all line up. */
  phase: number;
}

/** A planet == one portfolio section. */
export interface Planet {
  id: string;
  name: string;
  /** One-line teaser shown on hover. */
  subtitle: string;
  /** Body copy shown on the planet panel. */
  sectionBody: string;
  /**
   * Optional second column of body text, shown on the right for text-heavy
   * sections (e.g. Experience). Only rendered when the planet has no hologram.
   */
  bodyRight?: string;
  links: PlanetLink[];
  /**
   * Optional preprocessed images shown looping in the planet's "hologram"
   * screen. Keep them small + few (they count toward the size budget, but only
   * load at the planet level). If omitted, a procedural placeholder is shown.
   */
  media?: string[];

  baseColor: string;
  accentColor: string;
  /** Planet sphere radius in scene units. */
  radius: number;
  /** Icosphere subdivision (1 = chunky low-poly … 4 = smooth). Default 3. */
  polyDetail?: number;
  /** Idle self-rotation speed (radians/sec). */
  rotationSpeed: number;

  orbit: Orbit;
  /** Optional accessory mesh. */
  clothing?: ClothingSpec;
  /** Optional atmosphere; varies per planet for character. */
  atmosphere?: AtmosphereSpec;
}

/** A solar system == a themed colour "biome". */
export interface System {
  id: string;
  name: string;
  subtitle: string;
  /** Drives the whole system's palette + its highlighted star colour. */
  accentColor: string;
  sun: {
    color: string;
    /** Sun radius in scene units. */
    size: number;
  };
  planets: Planet[];
}

/** One star of a constellation (laid out in a 2D plane facing the camera). */
export interface ConstellationStar {
  id: string;
  /** Layout coordinates; normalised + scaled by the view. */
  pos: [number, number];
}

/**
 * A real constellation used as one interchangeable variant of the landing page.
 * Its stars are points; `systemStars` maps each section (system id) to the star
 * that acts as its clickable entry point. Stars not mapped are decorative.
 */
export interface Constellation {
  id: string;
  name: string;
  stars: ConstellationStar[];
  /** Fine lines drawn between pairs of star ids. */
  lines: [string, string][];
  /** system id -> star id that is its clickable entry in this constellation. */
  systemStars: Record<string, string>;
}

export interface Universe {
  /** How many tiny background "void" dots to scatter behind everything. */
  voidDotCount: number;
  systems: System[];
  constellations: Constellation[];
}
