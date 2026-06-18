import { describe, expect, it } from "vitest";
import { getPlanet, getSystem, validateUniverse } from "./selectors";
import { UNIVERSE } from "./universe";

describe("universe selectors", () => {
  it("ships valid content (no duplicate ids, well-formed links)", () => {
    expect(validateUniverse()).toEqual([]);
  });

  it("resolves a known system and planet", () => {
    const system = getSystem("projects");
    expect(system?.name).toBe("Projects");
    const planet = getPlanet("projects", "pocketllm");
    expect(planet?.name).toBe("PocketLLM");
  });

  it("returns undefined for unknown ids", () => {
    expect(getSystem("nope")).toBeUndefined();
    expect(getPlanet("projects", "nope")).toBeUndefined();
    expect(getPlanet("nope", "paper-planes")).toBeUndefined();
  });

  it("uses only known clothing and atmosphere types", () => {
    for (const system of UNIVERSE.systems) {
      for (const planet of system.planets) {
        if (planet.clothing) {
          expect(["ring", "belt", "moons"]).toContain(planet.clothing.type);
        }
        if (planet.atmosphere) {
          expect(["shell", "clouds"]).toContain(planet.atmosphere.type);
        }
      }
    }
  });
});
