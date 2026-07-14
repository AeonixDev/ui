<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import { setContext } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { navContextKey, type NavContext, type NavMode as SharedNavMode } from "./Nav.js";
	import type { Variant } from "./types.js";

	export type NavMode = SharedNavMode;

	const navVariants = cva("box-border flex min-w-0 max-w-full justify-between gap-1 rounded-lg p-1", {
		defaultVariants: {
			mode: "horizontal",
			variant: "default",
		},
		variants: {
			mode: {
				horizontal: "flex-row flex-wrap items-center",
				vertical: "flex-col items-stretch",
			},
			variant: {
				default: "bg-foreground/10 shadow-sm",
				error: "bg-error text-on-fill",
				info: "bg-info text-on-fill",
				primary: "bg-primary text-on-fill",
				secondary: "bg-secondary text-on-fill",
				success: "bg-success text-on-fill",
				warning: "bg-warning text-on-fill",
			},
		},
	});

	type NativeNavProps = Omit<HTMLAttributes<HTMLElement>, "class">;

	export type NavProps = NativeNavProps & {
		children?: Snippet;
		class?: string;
		mode?: NavMode;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let { children, class: className = "", mode = "horizontal", variant = "default", ...restProps }: NavProps = $props();

	const context: NavContext = {
		get mode() {
			return mode;
		},
		get variant() {
			return variant;
		},
	};

	setContext(navContextKey, context);

	const classes = $derived(navVariants({ class: className, mode, variant }));
</script>

<nav {...restProps} class={classes} data-mode={mode}>
	{#if children}
		{@render children()}
	{/if}
</nav>
