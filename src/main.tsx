import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { validateUniverse } from "./universe/selectors";
import "./index.css";

// Dev-only sanity check on the content config.
if (import.meta.env.DEV) {
  const issues = validateUniverse();
  if (issues.length > 0) {
    console.warn("[universe] validation issues:", issues);
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
