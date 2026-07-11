import type { Variant } from "./types.js";

export const buttonGroupContextKey = Symbol("button-group");

export type ButtonGroupContext = { readonly disabled?: boolean; readonly variant?: Variant };
