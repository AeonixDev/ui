import type { Snippet } from "svelte";

export type PageHeaderContext = { clearActions: (actions: Snippet) => void; setActions: (actions: Snippet) => void };

export const pageHeaderContextKey = Symbol("page-header");
