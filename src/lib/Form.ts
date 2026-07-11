export const formContextKey = Symbol("form");

export type FormContext = { readonly fullWidth: boolean; readonly isReadonly: boolean };
