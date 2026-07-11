<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import { getContext } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { navContextKey, type NavContext } from "./Nav.js";

	const navGroupVariants = cva("box-border flex min-w-0 max-w-full gap-1", {
		defaultVariants: {
			mode: "horizontal",
		},
		variants: {
			mode: {
				horizontal: "flex-row flex-wrap items-center",
				vertical: "w-full flex-col items-stretch",
			},
		},
	});

	type NativeNavGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "class">;

	export type NavGroupProps = NativeNavGroupProps & {
		children?: Snippet;
		class?: string;
	};
</script>

<script lang="ts">
	const nav = getContext<NavContext | undefined>(navContextKey);

	let { children, class: className = "", ...restProps }: NavGroupProps = $props();

	const mode = $derived(nav?.mode ?? "horizontal");
	const classes = $derived(navGroupVariants({ class: className, mode }));
</script>

<div {...restProps} class={classes} data-nav-group>
	{#if children}
		{@render children()}
	{/if}
</div>
