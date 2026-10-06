// Serializable registry the stage frame posts to the viewer. The viewer never imports design code.
import type { Content, Control, Motion, Viewport } from "../system/define";

export interface UIMeta {
  id: string;
  title: string;
  intent: string;
  viewports?: Viewport[];
  controls: Record<string, Control>;
  presets: Record<string, Record<string, unknown>>;
  motion: Motion[];
  content: Content[];
}

export interface StateMeta {
  id: string;
  description: string;
  trigger?: string;
  shows?: string;
}

export interface ScreenMeta {
  id: string;
  title: string;
  intent: string;
  viewports: Viewport[];
  uses: string[];
  states: StateMeta[];
  motion: Motion[];
  content: Content[];
}

export interface FlowMeta {
  id: string;
  title: string;
  steps: { screen: string; state: string }[];
}

export interface FeatureMeta {
  id: string;
  title: string;
  intent: string;
  flows: FlowMeta[];
  unflowed: string[]; // screen#state not reached by any flow
}

export interface Registry {
  features: FeatureMeta[];
  screens: Record<string, ScreenMeta>;
  ui: UIMeta[];
}

export interface Target {
  id: string;
  state?: string;
  preset?: string;
  overrides?: Record<string, unknown>;
  key: number;
}

export const SIZES: Record<Viewport, [number, number]> = { desktop: [1440, 900], tablet: [768, 1024], mobile: [390, 844] };

export const controlDefault = (c: Control) => (Array.isArray(c) ? c[0] : c);
