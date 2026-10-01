import { defineUI } from "../../system/define";
import { [Name] } from "./[Name]";

export default defineUI([Name], {
  intent: "[What this block is for, in one line]",
  props: {
    variant: ["[variant-a]", "[variant-b]"], // enum: first is the default
    [state]: false,                           // boolean toggle
    label: "[Sample label]",                  // text input
  },
  presets: {
    "[Variant A]": {},
    "[Variant B]": { variant: "[variant-b]" },
    "[State]": { [state]: true },
  },
  motion: [ // only motion the user decided; omit otherwise
    {
      id: "[name]-[motion]",
      target: "[name]-[motion]",
      trigger: "state",
      when: "[state] turns on",
      description: "[What moves and how]",
      uses: ["[primitive]"],
      reduced: "[instant]",
    },
  ],
  content: [{ slot: "[name]-label", role: "canonical", source: "[where the words come from]" }],
});
