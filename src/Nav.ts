import type { Variant } from "./types.js";

export type NavMode = "horizontal" | "vertical";

export const navContextKey = Symbol("nav");

export type NavContext = { readonly mode: NavMode; readonly variant: Variant };
