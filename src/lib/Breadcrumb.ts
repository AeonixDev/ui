export type BuiltInBreadcrumbSeparator = "arrow" | "backslash" | "chevron" | "dash" | "dot" | "pipe" | "slash";
export type BreadcrumbSeparator = BuiltInBreadcrumbSeparator | (string & Record<never, never>);
export type BreadcrumbType = "boxed" | "default" | "gradient" | "pills" | "wrapped";

export type BreadcrumbContext = { readonly separator: string; readonly type: BreadcrumbType };

export const breadcrumbContextKey = Symbol("breadcrumb");
