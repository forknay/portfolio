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
      subtitle: "Best way to learn is practice",
      accentColor: "#ff8a3d", // warm burnt-orange / amber
      sun: { color: "#ffb066", size: 3.2 },
      planets: [
        {
          id: "pocketllm",
          name: "PocketLLM",
          subtitle: "A transformer built from scratch",
          sectionBody:
            "A PyTorch transformer implemented from scratch. The full architecture, written and trained from the ground up to really understand how LLMs work",
          links: [{ label: "Source", url: "https://github.com/forknay/pocketllm" }],
          hologram: false,
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
          id: "cpulite",
          name: "CPULITE",
          subtitle: "A RISC-V CPU in Verilog.",
          sectionBody:
            "A 5-stage pipelined RISC-V processor with a reduced ISA, designed in Verilog",
          links: [{ label: "Source", url: "https://github.com/forknay/cpulite" }],
          hologram: false,
          baseColor: "#b85a2c",
          accentColor: "#ffcf9e",
          radius: 1.35,
          polyDetail: 2,
          rotationSpeed: 0.2,
          orbit: { radius: 11.5, speed: 0.1, inclination: 0.18, phase: 1.3 },
          clothing: { type: "belt", params: { inner: 1.4, outer: 2.1, count: 90 } },
        },
        {
          id: "ozymandias",
          name: "Ozymandias",
          subtitle: "A game jam game in Godot.",
          sectionBody:
            "An Iron Lung inspired game built in Godot for a game jam, built with Teo and Jessie",
          links: [{ label: "Play", url: "https://julienfork.itch.io/ozymandias" }],
          baseColor: "#c25a2a",
          accentColor: "#ffcf99",
          radius: 0.95,
          polyDetail: 1,
          rotationSpeed: 0.22,
          orbit: { radius: 14.5, speed: 0.08, inclination: -0.12, phase: 2.4 },
          clothing: { type: "moons", params: { count: 2 } },
        },
        {
          id: "terminal-portfolio",
          name: "Terminal Portfolio",
          subtitle: "A portfolio you SSH into.",
          sectionBody:
            "A portfolio that lives entirely in the terminal, deployed as a Docker container on Azure. For the true devs who never leave the shell \n\nssh julyang.space",
          links: [],
          baseColor: "#e08a3c",
          accentColor: "#ffe2b0",
          radius: 1.6,
          polyDetail: 3,
          rotationSpeed: 0.15,
          orbit: { radius: 17.8, speed: 0.07, inclination: -0.1, phase: 3.9 },
          atmosphere: { type: "shell" },
        },
        {
          id: "galaxy-portfolio",
          name: "Galaxy Portfolio",
          subtitle: "This site, an explorable galaxy.",
          sectionBody:
            "This very site: a portfolio in Three.js inspired by No Man's Sky",
          links: [{ label: "Source", url: "https://github.com/forknay/portfolio" }],
          hologram: false,
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
      cameraZoom: 0.8, // zoom in ~20%
      sun: { color: "#7af0e3", size: 2.6 },
      planets: [
        {
          id: "bio",
          name: "Bio",
          subtitle: "The short version.",
          sectionBody: "montreal based student",
          links: [
            {
              label: "CV",
              url: "https://drive.google.com/file/d/1WaFUe0ptKP6-O7W4jiKef6aLweH3NDrI/view?usp=sharing",
            },
          ],
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
            "Languages: Python, C++, C, Java\nML: PyTorch\nHardware: Verilog, STM32\nTooling: Linux",
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
      cameraZoom: 0.8, // zoom in ~20%
      sun: { color: "#c6a6ff", size: 2.8 },
      planets: [
        {
          id: "work",
          name: "Work",
          subtitle: "Roles and internships.",
          sectionBody:
            "Sunlune\nSWE Intern, Summer 2025\nDistributed training for LLMs.\n\nARA Robotics\nEmbedded Intern, Summer 2026\nAvionics and flight controller for a UAV.",
          bodyRight:
            "Your company\nAnytime you want, 2027\nOpen to roles, let's build",
          links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/julienyang12/" }],
          baseColor: "#6f44d6",
          accentColor: "#dccaff",
          radius: 1.05,
          polyDetail: 1,
          rotationSpeed: 0.19,
          orbit: { radius: 14, speed: 0.06, inclination: -0.1, phase: 4.2 },
          clothing: { type: "moons", params: { count: 3 } },
        },
        {
          id: "education",
          name: "Education",
          subtitle: "Studies and certifications.",
          sectionBody:
            "Software Engineering at McGill University.\n2028 · GPA 3.8.",
          links: [],
          baseColor: "#8a5cf0",
          accentColor: "#e3d4ff",
          radius: 1.95,
          polyDetail: 4,
          rotationSpeed: 0.16,
          orbit: { radius: 9.5, speed: 0.11, inclination: 0.14, phase: 0.7 },
          clothing: { type: "belt", params: { inner: 1.45, outer: 2.2, count: 90 } },
          atmosphere: { type: "shell" },
        },
      ],
    },
    {
      id: "contact",
      name: "Contact",
      subtitle: "Let's get in touch.",
      accentColor: "#ff7a9c", // coral / pink
      cameraZoom: 0.7, // zoom in ~30%
      sun: { color: "#ffa9c0", size: 2.4 },
      planets: [
        {
          id: "reach-out",
          name: "Reach Out",
          subtitle: "Email and socials.",
          sectionBody:
            "The fastest way to reach me is email, I usually reply within a day. Open to internships, collaborations, and interesting problems :)",
          links: [
            { label: "Email", url: "mailto:julienyang12@gmail.com" },
            { label: "GitHub", url: "https://github.com/forknay" },
            { label: "LinkedIn", url: "https://www.linkedin.com/in/julienyang12/" },
            {
              label: "CV",
              url: "https://drive.google.com/file/d/1WaFUe0ptKP6-O7W4jiKef6aLweH3NDrI/view?usp=sharing",
            },
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
