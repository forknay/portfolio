import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigation } from "../state/navigation";

/**
 * Sends unknown deep links back to the galaxy: if a system/planet id in the URL
 * doesn't resolve to real content, replace the route with "/".
 */
export function RouteGuard() {
  const navigate = useNavigate();
  const { systemId, planetId, system, planet } = useNavigation();

  useEffect(() => {
    if (systemId && !system) navigate("/", { replace: true });
    else if (planetId && !planet) navigate("/", { replace: true });
  }, [systemId, planetId, system, planet, navigate]);

  return null;
}
