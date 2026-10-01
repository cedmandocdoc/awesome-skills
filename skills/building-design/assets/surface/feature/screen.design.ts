import { defineScreen } from "../../system/define";
import [ui] from "../../ui/[ui]/[ui].design";
import { [Screen] } from "./[Screen]";

export default defineScreen([Screen], {
  intent: "[What this screen must achieve]",
  uses: [[ui]],
  viewports: ["desktop", "tablet", "mobile"],
  states: {
    default: { props: {}, description: "[The view on arrival]" },
    "[state]": { props: { [state]: true }, trigger: "[what causes it]", description: "[what the view shows]", shows: "[ui]#[Preset]" },
    "[error]": { props: { error: "[Error copy]" }, trigger: "[what causes it]", description: "[what the view shows]" },
  },
  motion: [ // only motion the user decided; omit otherwise
    {
      id: "[section]-error",
      target: "[section]-error",
      trigger: "state",
      when: "[error]",
      description: "[How the error enters]",
      uses: ["[primitive]"],
      reduced: "[instant]",
    },
  ],
  content: [
    { slot: "[section]-title", role: "material", source: "[PRD section, fact source]" },
    { slot: "[section]-error", role: "canonical", source: "[where the words come from]" },
  ],
});
