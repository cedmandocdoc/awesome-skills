// Interfaces the project's support code implements. Copied by building-tests; never edited.

export type Value = string | number | boolean;
export type Params = Record<string, Value>;
export type Subject = Record<string, Value | null>;

/** A named state: support/states/<area>.ts default-exports `States`. */
export interface State {
  /** Creates the state through the app's own backend calls and returns its subject, e.g. { orderId }. */
  build(params: Params): Promise<Subject>;
  /** Finds the latest subject matching params, or null. */
  lookup(params: Params): Promise<Subject | null>;
  /** Confirms the state holds for the subject. */
  check(subject: Subject, params: Params): Promise<boolean>;
}

export type States = Record<string, State>;

/** support/personas.ts default-exports `Personas`. */
export interface Personas {
  /** Environment variables that sign the persona in on the surface, without a one-time code. */
  session(persona: string, surface: string): Promise<Record<string, string>>;
}
