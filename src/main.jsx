import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../artist360_landing";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
