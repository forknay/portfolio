import { useEffect, useRef, useState } from "react";
import { useNavigation, type Level } from "../state/navigation";
import { useReducedMotion } from "../engine/useReducedMotion";

const DEPTH: Record<Level, number> = { galaxy: 0, system: 1, planet: 2 };
const BURST_MS = 560;

interface Star {
  x: number;
  y: number;
  z: number;
}

/**
 * A brief FTL "lightspeed" burst on every level change: a projected starfield
 * (à la the classic JS starfield) streaks out from the centre with motion-blur
 * trails, masking the camera jump. Direction follows diving in vs backing out.
 * Canvas-based, short-lived, skipped under reduced-motion.
 */
export function WarpOverlay() {
  const { level } = useNavigation();
  const reduced = useReducedMotion();
  const prev = useRef<Level>(level);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [burst, setBurst] = useState<{ dir: 1 | -1; id: number } | null>(null);

  useEffect(() => {
    const from = prev.current;
    prev.current = level;
    if (from === level || reduced) return;
    const dir = DEPTH[level] > DEPTH[from] ? 1 : -1;
    setBurst({ dir, id: Date.now() });
    const t = window.setTimeout(() => setBurst(null), BURST_MS);
    return () => window.clearTimeout(t);
  }, [level, reduced]);

  useEffect(() => {
    if (!burst) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const cx = w / 2;
    const cy = h / 2;
    const ratio = 256;
    const zmax = (w + h) / 2;
    const count = Math.min(520, Math.floor((w + h) / 3));
    const speed = 26 * burst.dir;
    const trail = zmax * 0.16; // explicit streak length (in z)

    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: (Math.random() * 2 - 1) * w,
        y: (Math.random() * 2 - 1) * h,
        z: 1 + Math.random() * (zmax - 1),
      });
    }

    let raf = 0;
    let stopped = false;

    const frame = () => {
      // Clear fully (transparent) so the scene behind stays visible.
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.z -= speed;
        if (s.z <= 1) {
          s.z += zmax - 1;
          s.x = (Math.random() * 2 - 1) * w;
          s.y = (Math.random() * 2 - 1) * h;
        } else if (s.z >= zmax) {
          s.z -= zmax - 1;
        }

        // Draw an explicit radial streak from a point "behind" to the star.
        const tz = Math.max(1, s.z + trail * burst.dir);
        const sx = cx + (s.x / s.z) * ratio;
        const sy = cy + (s.y / s.z) * ratio;
        const txp = cx + (s.x / tz) * ratio;
        const typ = cy + (s.y / tz) * ratio;

        const prog = 1 - s.z / zmax; // brighter / fatter near the edge
        ctx.strokeStyle = `rgba(222,233,255,${0.25 + prog * 0.7})`;
        ctx.lineWidth = Math.max(0.5, prog * 2.6);
        ctx.beginPath();
        ctx.moveTo(txp, typ);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      if (!stopped) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [burst]);

  if (!burst) return null;
  return <canvas key={burst.id} ref={canvasRef} className="warp-canvas" />;
}
