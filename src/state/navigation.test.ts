import { describe, expect, it } from "vitest";
import { paths } from "./navigation";

describe("path builders", () => {
  it("builds galaxy / system / planet urls", () => {
    expect(paths.galaxy()).toBe("/");
    expect(paths.system("projects")).toBe("/system/projects");
    expect(paths.planet("projects", "paper-planes")).toBe(
      "/system/projects/paper-planes",
    );
  });
});
