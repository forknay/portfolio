import type { Constellation } from "./types";

/**
 * Five real constellations (each with 5+ stars). On load one is chosen at random
 * as the landing-page variant. In each, four stars are mapped to the four
 * sections (systems) via `systemStars`; the remaining stars are decorative.
 *
 * Coordinates are rough 2D layouts (x right, y up); the view normalises +
 * centres them, so absolute values only matter relative to each other.
 */
export const CONSTELLATIONS: Constellation[] = [
  {
    id: "ursa-major",
    name: "Ursa Major",
    stars: [
      { id: "dubhe", pos: [6.0, 4.0] },
      { id: "merak", pos: [6.0, 2.5] },
      { id: "phecda", pos: [4.6, 2.2] },
      { id: "megrez", pos: [4.8, 3.4] },
      { id: "alioth", pos: [3.4, 3.6] },
      { id: "mizar", pos: [2.1, 3.7] },
      { id: "alkaid", pos: [0.9, 3.1] },
    ],
    lines: [
      ["dubhe", "merak"],
      ["merak", "phecda"],
      ["phecda", "megrez"],
      ["megrez", "dubhe"],
      ["megrez", "alioth"],
      ["alioth", "mizar"],
      ["mizar", "alkaid"],
    ],
    systemStars: {
      projects: "dubhe",
      about: "alkaid",
      experience: "phecda",
      contact: "mizar",
    },
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    stars: [
      { id: "caph", pos: [0.0, 2.0] },
      { id: "schedar", pos: [1.2, 1.2] },
      { id: "gamma", pos: [2.4, 2.0] },
      { id: "ruchbah", pos: [3.6, 1.1] },
      { id: "segin", pos: [4.8, 2.0] },
    ],
    lines: [
      ["caph", "schedar"],
      ["schedar", "gamma"],
      ["gamma", "ruchbah"],
      ["ruchbah", "segin"],
    ],
    systemStars: {
      projects: "caph",
      about: "gamma",
      experience: "segin",
      contact: "schedar",
    },
  },
  {
    id: "orion",
    name: "Orion",
    stars: [
      { id: "betelgeuse", pos: [4.2, 5.0] },
      { id: "bellatrix", pos: [2.0, 5.2] },
      { id: "meissa", pos: [3.1, 6.0] },
      { id: "alnitak", pos: [3.9, 3.2] },
      { id: "alnilam", pos: [3.1, 3.0] },
      { id: "mintaka", pos: [2.3, 2.8] },
      { id: "saiph", pos: [4.1, 1.2] },
      { id: "rigel", pos: [1.8, 1.0] },
    ],
    lines: [
      ["bellatrix", "betelgeuse"],
      ["meissa", "bellatrix"],
      ["meissa", "betelgeuse"],
      ["betelgeuse", "alnitak"],
      ["bellatrix", "mintaka"],
      ["mintaka", "alnilam"],
      ["alnilam", "alnitak"],
      ["mintaka", "rigel"],
      ["alnitak", "saiph"],
    ],
    systemStars: {
      projects: "betelgeuse",
      about: "rigel",
      experience: "bellatrix",
      contact: "saiph",
    },
  },
  {
    id: "cygnus",
    name: "Cygnus",
    stars: [
      { id: "deneb", pos: [3.0, 6.0] },
      { id: "sadr", pos: [3.0, 4.0] },
      { id: "gienah", pos: [0.6, 3.6] },
      { id: "delta", pos: [5.4, 4.0] },
      { id: "albireo", pos: [3.0, 1.0] },
    ],
    lines: [
      ["deneb", "sadr"],
      ["sadr", "albireo"],
      ["gienah", "sadr"],
      ["sadr", "delta"],
    ],
    systemStars: {
      projects: "deneb",
      about: "gienah",
      experience: "delta",
      contact: "albireo",
    },
  },
  {
    id: "lyra",
    name: "Lyra",
    stars: [
      { id: "vega", pos: [2.0, 5.0] },
      { id: "zeta", pos: [1.2, 3.2] },
      { id: "delta", pos: [2.9, 3.4] },
      { id: "sheliak", pos: [1.4, 1.8] },
      { id: "sulafat", pos: [3.0, 2.0] },
    ],
    lines: [
      ["vega", "zeta"],
      ["vega", "delta"],
      ["zeta", "sheliak"],
      ["delta", "sulafat"],
      ["sheliak", "sulafat"],
    ],
    systemStars: {
      projects: "vega",
      about: "sheliak",
      experience: "delta",
      contact: "sulafat",
    },
  },
];
