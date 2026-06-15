import { useEffect, useState, type ElementType } from "react";
import { useReducedMotion } from "../engine/useReducedMotion";

const GLYPHS = "!<>-_\\/[]{}=+*^?#абвＱＷア01";

interface ScrambleTextProps {
  text: string;
  /** Replay the decode whenever this turns true (e.g. panel opened). */
  active: boolean;
  /** Delay before this line starts decoding (ms) — used to stagger lines. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Renders text that "decodes" from random glyphs into the final string — a
 * techy scanner reveal. Honors reduced-motion (shows final text instantly).
 */
export function ScrambleText({
  text,
  active,
  delay = 0,
  className,
  as: Tag = "span",
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!active || reduced) {
      setOut(text);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const duration = Math.min(900, 260 + text.length * 22);

    const run = (t: number) => {
      if (start === null) start = t;
      const elapsed = t - start - delay;
      if (elapsed < 0) {
        setOut("");
        raf = requestAnimationFrame(run);
        return;
      }
      const p = Math.min(1, elapsed / duration);
      const revealed = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " " || i < revealed) s += c;
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(run);
      else setOut(text);
    };

    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [text, active, reduced, delay]);

  return <Tag className={className}>{out}</Tag>;
}
