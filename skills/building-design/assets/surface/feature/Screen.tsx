import { [Ui] } from "../../ui/[ui]/[Ui]";
import "./[screen].css";

// One component per screen; every state is a set of these props.
export interface [Screen]Props {
  [state]?: boolean;
  error?: string;
}

export function [Screen]({ [state] = false, error }: [Screen]Props) {
  return (
    <main className="[screen]">
      <section data-section="[section]">
        <h1 className="text-heading-xl" data-slot="[section]-title">[Material copy]</h1>
        <p data-slot="[section]-lede">[Copy]</p>
        {error && <p role="alert" data-slot="[section]-error" data-motion="[section]-error">{error}</p>}
        <[Ui] label="[CTA]" [state]={[state]} />
      </section>
    </main>
  );
}
