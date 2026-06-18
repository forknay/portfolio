type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Run a callback when the main thread is idle (falls back to a short timeout).
 * Used to warm up next-level chunks without competing with the current render.
 * Returns a cancel function.
 */
export function onIdle(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const w = window as IdleWindow;
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout: 1500 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 300);
  return () => window.clearTimeout(id);
}
