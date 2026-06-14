import { useEffect, useState } from "react";

/**
 * Brief intro veil that fades out once the app has mounted, hiding the initial
 * canvas flash. Kept tiny and CSS-driven — no spinner library.
 */
export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Next frame after mount: scene/canvas is up, fade the veil away.
    const id = requestAnimationFrame(() => setDone(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`loading-screen ${done ? "is-done" : ""}`} aria-hidden={done}>
      <div className="loading-mark">◍</div>
      <div className="loading-label">entering orbit…</div>
    </div>
  );
}
