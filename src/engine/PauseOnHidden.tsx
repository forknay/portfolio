import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Stops the render loop while the tab is hidden, so a backgrounded portfolio
 * costs ~zero GPU/CPU. Mounted inside the <Canvas>. Renders nothing.
 */
export function PauseOnHidden() {
  const setFrameloop = useThree((s) => s.setFrameloop);

  useEffect(() => {
    const onVisibility = () => {
      setFrameloop(document.hidden ? "never" : "always");
    };
    document.addEventListener("visibilitychange", onVisibility);
    // Apply current state immediately.
    onVisibility();
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [setFrameloop]);

  return null;
}
