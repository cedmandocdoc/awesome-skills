import "./[name].css";

// Presentational only: everything it shows comes in as props.
export interface [Name]Props {
  variant?: "[variant-a]" | "[variant-b]";
  [state]?: boolean;
  label: string;
}

export function [Name]({ variant = "[variant-a]", [state] = false, label }: [Name]Props) {
  return (
    <div data-component="[name]" data-motion="[name]-[motion]" className={`[name] [name]-${variant}`} data-[state]={[state] || undefined}>
      <span data-slot="[name]-label">{label}</span>
    </div>
  );
}
