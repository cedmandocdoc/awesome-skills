import { defineFeature, step } from "../../system/define";
import [screen] from "./[screen].design";
import [next] from "./[next].design";

// Each flow is an ordered list of steps; a step is one screen in one state.
export default defineFeature({
  title: "[Feature]",
  intent: "[What the feature lets the user do]",
  flows: {
    "Happy path": [step([screen], "default"), step([screen], "[state]"), step([next], "default")],
    "[Error path]": [step([screen], "default"), step([screen], "[state]"), step([screen], "[error]")],
  },
});
