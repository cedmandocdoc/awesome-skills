import { createRoot } from "react-dom/client";

// The frame renders design code; the viewer is chrome only. Separate imports keep their CSS apart.
const root = createRoot(document.getElementById("root")!);
if (new URLSearchParams(location.search).has("frame")) import("./Frame").then(({ Frame }) => root.render(<Frame />));
else import("./App").then(({ App }) => root.render(<App />));
