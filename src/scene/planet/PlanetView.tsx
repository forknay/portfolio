import type { Planet as PlanetData } from "../../universe/types";
import { VoidDots } from "../common/VoidDots";
import { Planet } from "./Planet";

/**
 * Planet (section) level: the planet centred and lit, over the cosmic void
 * dots. The HTML info panel lives outside the canvas (see ui/PlanetPanel).
 */
export function PlanetView({ planet }: { planet: PlanetData }) {
  return (
    <group>
      <VoidDots count={360} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-6, -2, -3]} intensity={0.5} color={planet.accentColor} />

      <Planet planet={planet} />
    </group>
  );
}
