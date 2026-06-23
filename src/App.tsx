import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene/Scene";
import { Overlay } from "./ui/Overlay";
import { RouteGuard } from "./ui/RouteGuard";
import { LoadingScreen } from "./ui/LoadingScreen";
import { SETTINGS } from "./engine/settings";

/**
 * One persistent Canvas + overlay, shared across every route. Because the same
 * <Experience> element type is matched at the same position for all routes, the
 * WebGL context is created once and never torn down while navigating.
 */
function Experience() {
  return (
    <>
      <RouteGuard />
      <Canvas
        dpr={SETTINGS.dprCap}
        camera={{ fov: 55, position: [0, 0, 62], near: 0.1, far: 400 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
      <Overlay />
      <LoadingScreen />
    </>
  );
}

export function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<Experience />} />
        <Route path="/system/:systemId" element={<Experience />} />
        <Route path="/system/:systemId/:planetId" element={<Experience />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
