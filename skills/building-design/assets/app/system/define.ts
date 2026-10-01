// Design spec API. Every *.design.ts default-exports one of defineUI, defineScreen, defineFeature.
// The viewer discovers those files; tsc checks presets, states, and flow steps against the real components.
import type { ComponentType } from "react";

export type Viewport = "desktop" | "tablet" | "mobile";
export type Trigger = "load" | "in-view" | "scroll" | "hover" | "focus" | "action" | "state";

export interface Motion {
  id: string;
  target: string; // data-motion value
  trigger: Trigger;
  when?: string;
  description: string;
  uses: string[]; // primitives from design.md → Motion
  params?: Record<string, string>;
  reduced: string;
}

export interface Content {
  slot: string; // data-slot value
  role: "sample" | "canonical" | "material";
  source: string;
}

// Enum options (first is the default) | boolean | text | number.
export type Control = readonly string[] | boolean | string | number;

export interface UIDesign<P = any> {
  kind: "ui";
  component: ComponentType<P>;
  title?: string; // defaults to the folder name
  intent: string;
  viewports?: Viewport[];
  base?: Partial<P>; // props every render needs but no control edits
  props: { [K in keyof P]?: Control };
  presets: Record<string, Partial<P>>; // first is the default
  motion?: Motion[];
  content?: Content[];
}

export interface State<P> {
  props: Partial<P>; // merged over the screen's base
  description: string;
  trigger?: string;
  shows?: string; // ui#preset
}

export interface ScreenDesign<P = any, S extends string = string> {
  kind: "screen";
  component: ComponentType<P>;
  title?: string; // defaults to the file name
  intent: string;
  uses?: UIDesign[];
  viewports: Viewport[];
  base?: Partial<P>;
  states: { default: State<P> } & Record<S, State<P>>;
  motion?: Motion[];
  content?: Content[];
}

export interface Step {
  screen: ScreenDesign;
  state: string;
}

export interface FeatureDesign {
  kind: "feature";
  title: string;
  intent: string;
  flows: Record<string, Step[]>;
}

export const defineUI = <P,>(component: ComponentType<P>, d: Omit<UIDesign<P>, "kind" | "component">): UIDesign<P> => ({ kind: "ui", component, ...d });

export const defineScreen = <P, S extends string>(
  component: ComponentType<P>,
  d: Omit<ScreenDesign<P, S>, "kind" | "component">,
): ScreenDesign<P, S> => ({ kind: "screen", component, ...d });

export const defineFeature = (d: Omit<FeatureDesign, "kind">): FeatureDesign => ({ kind: "feature", ...d });

export const step = <S extends string>(screen: ScreenDesign<any, S>, state: S | "default"): Step => ({ screen, state });
