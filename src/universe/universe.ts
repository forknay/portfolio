import type { Universe } from "./types";
import { CONSTELLATIONS } from "./constellations";

/**
 * Placeholder portfolio content. Structure is final; copy/links/colours are
 * meant to be iterated on later. Four systems (biomes), each with a few planets
 * (sections). `paper-planes` lives in the Projects system. The landing-page
 * positions come from a randomly chosen constellation (see constellations.ts).
 */
export const UNIVERSE: Universe = {
  voidDotCount: 520,
  constellations: CONSTELLATIONS,
  systems: [
    {
      id: "projects",
      name: "Projects",
      subtitle: "Things I've designed, built, and shipped.",
      accentColor: "#ff8a3d", // warm burnt-orange / amber
      sun: { color: "#ffb066", size: 3.2 },
      planets: [
        {
          id: "paper-planes",
          name: "Paper Planes",
          subtitle: "A playful WebGL experiment.",
          sectionBody:
            "An interactive, low-poly toy built with Three.js. Placeholder copy — describe the project, the stack, and what you learned here.",
          links: [
            { label: "Live", url: "https://example.com/paper-planes" },
            { label: "Source", url: "https://github.com/" },
          ],
          baseColor: "#d8753a",
          accentColor: "#ffd9a0",
          radius: 1.85,
          polyDetail: 4,
          rotationSpeed: 0.18,
          orbit: { radius: 8.5, speed: 0.12, inclination: 0.06, phase: 0.2 },
          // Reference "Paper Planes" planet: chunky, top-heavy continent cover.
          atmosphere: { type: "clouds", color: "#d8efff", params: { pattern: 0, coverage: 0.5 } },
        },
        {
          id: "nebula-cli",
          name: "Nebula CLI",
          subtitle: "A fast terminal toolkit.",
          sectionBody:
            "Placeholder — a command-line tool. Describe what it does, the stack, and why you built it.",
          links: [
            { label: "Source", url: "https://github.com/" },
            { label: "npm", url: "https://npmjs.com/" },
          ],
          baseColor: "#b85a2c",
          accentColor: "#ffcf9e",
          radius: 1.35,
          polyDetail: 2,
          rotationSpeed: 0.2,
          orbit: { radius: 11.5, speed: 0.1, inclination: 0.18, phase: 1.3 },
          clothing: { type: "belt", params: { inner: 1.4, outer: 2.1, count: 90 } },
        },
        {
          id: "atlas-tool",
          name: "Atlas Tool",
          subtitle: "A data-viz dashboard.",
          sectionBody:
            "Placeholder copy for a project. Swap in a real one — what problem it solved and the outcome.",
          links: [{ label: "Source", url: "https://github.com/" }],
          baseColor: "#c25a2a",
          accentColor: "#ffcf99",
          radius: 0.95,
          polyDetail: 1,
          rotationSpeed: 0.22,
          orbit: { radius: 14.5, speed: 0.08, inclination: -0.12, phase: 2.4 },
          clothing: { type: "moons", params: { count: 2 } },
        },
        {
          id: "tide-engine",
          name: "Tide Engine",
          subtitle: "A 2D physics playground.",
          sectionBody:
            "Placeholder — a real-time physics sandbox. Describe the simulation, the tech, and a highlight.",
          links: [
            { label: "Live", url: "https://example.com/tide-engine" },
            { label: "Source", url: "https://github.com/" },
          ],
          baseColor: "#e08a3c",
          accentColor: "#ffe2b0",
          radius: 1.6,
          polyDetail: 3,
          rotationSpeed: 0.15,
          orbit: { radius: 17.8, speed: 0.07, inclination: -0.1, phase: 3.9 },
          atmosphere: { type: "shell" },
        },
        {
          id: "mosaic",
          name: "Mosaic",
          subtitle: "Generative art in the browser.",
          sectionBody:
            "Placeholder — a generative-art piece. Describe the algorithm, the inspiration, and how to interact with it.",
          links: [
            { label: "Live", url: "https://example.com/mosaic" },
            { label: "Source", url: "https://github.com/" },
          ],
          baseColor: "#a83e22",
          accentColor: "#ffb27a",
          radius: 1.15,
          polyDetail: 1,
          rotationSpeed: 0.24,
          orbit: { radius: 21, speed: 0.055, inclination: 0.22, phase: 5.2 },
          clothing: { type: "ring", params: { inner: 1.45, outer: 2.4 } },
        },
      ],
    },
    {
      id: "about",
      name: "About",
      subtitle: "Who I am and what I care about.",
      accentColor: "#34d3c2", // cool teal / cyan
      sun: { color: "#7af0e3", size: 2.6 },
      planets: [
        {
          id: "bio",
          name: "Bio",
          subtitle: "The short version.",
          sectionBody:
            "Placeholder bio. A few sentences on background, interests, and what you're looking for.",
          links: [{ label: "Resume", url: "https://example.com/resume.pdf" }],
          baseColor: "#2bb6a8",
          accentColor: "#c8fff7",
          radius: 1.75,
          polyDetail: 3,
          rotationSpeed: 0.15,
          orbit: { radius: 8.5, speed: 0.1, inclination: 0.1, phase: 1.1 },
          atmosphere: { type: "clouds", color: "#cfeccd", params: { pattern: 1, coverage: 0.46 } },
        },
        {
          id: "skills",
          name: "Skills",
          subtitle: "Tools of the trade.",
          sectionBody:
            "Placeholder skills list. Languages, frameworks, and the things you're strongest at.",
          links: [],
          baseColor: "#1f9488",
          accentColor: "#bff7ef",
          radius: 1.15,
          polyDetail: 2,
          rotationSpeed: 0.2,
          orbit: { radius: 13.5, speed: 0.07, inclination: -0.08, phase: 3.5 },
          clothing: { type: "ring", params: { inner: 1.35, outer: 2.15 } },
          atmosphere: { type: "shell" },
        },
      ],
    },
    {
      id: "experience",
      name: "Experience",
      subtitle: "Where I've worked and studied.",
      accentColor: "#a472ff", // violet / magenta
      sun: { color: "#c6a6ff", size: 2.8 },
      planets: [
        {
          id: "work",
          name: "Work",
          subtitle: "Roles and internships.",
          sectionBody:
            "Placeholder work history. List roles, dates, and a line on impact for each.",
          links: [{ label: "LinkedIn", url: "https://linkedin.com/" }],
          baseColor: "#8a5cf0",
          accentColor: "#e3d4ff",
          radius: 1.95,
          polyDetail: 4,
          rotationSpeed: 0.16,
          orbit: { radius: 9.5, speed: 0.11, inclination: 0.14, phase: 0.7 },
          clothing: { type: "belt", params: { inner: 1.45, outer: 2.2, count: 90 } },
          atmosphere: { type: "shell" },
        },
        {
          id: "education",
          name: "Education",
          subtitle: "Studies and certifications.",
          sectionBody:
            "Placeholder education. Degrees, school, focus areas, notable coursework.",
          links: [],
          baseColor: "#6f44d6",
          accentColor: "#dccaff",
          radius: 1.05,
          polyDetail: 1,
          rotationSpeed: 0.19,
          orbit: { radius: 14, speed: 0.06, inclination: -0.1, phase: 4.2 },
          clothing: { type: "moons", params: { count: 3 } },
        },
      ],
    },
    {
      id: "contact",
      name: "Contact",
      subtitle: "Let's get in touch.",
      accentColor: "#ff7a9c", // coral / pink
      sun: { color: "#ffa9c0", size: 2.4 },
      planets: [
        {
          id: "reach-out",
          name: "Reach Out",
          subtitle: "Email and socials.",
          sectionBody:
            "The fastest way to reach me is email, I usually reply within a day. Open to internships, collaborations, and interesting problems :)",
          links: [
            { label: "Email", url: "mailto:julien.yang@mail.mcgill.ca" },
            { label: "GitHub", url: "https://github.com/" },
          ],
          baseColor: "#f0608a",
          accentColor: "#ffd2de",
          radius: 1.45,
          polyDetail: 2,
          rotationSpeed: 0.17,
          orbit: { radius: 9, speed: 0.1, inclination: 0.08, phase: 2.0 },
          atmosphere: { type: "clouds", color: "#ffdfe9", params: { pattern: 1, coverage: 0.48 } },
        },
      ],
    },
  ],
};
