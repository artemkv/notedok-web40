import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppStatefulContainer from "./AppStatefulContainer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStatefulContainer />
  </StrictMode>
);
