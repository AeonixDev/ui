<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	const kbdVariants = cva(
		"inline-flex items-center justify-center rounded-md border border-b-2 font-medium font-mono leading-none shadow-sm",
		{
			defaultVariants: {
				size: "md",
				variant: "default",
			},
			variants: {
				size: {
					lg: "h-7 min-w-7 px-2.5 text-sm",
					md: "h-6 min-w-6 px-2 text-xs",
					sm: "h-5 min-w-5 px-1.5 text-[0.625rem]",
				},
				variant: {
					default: "border-foreground/25 bg-foreground/10",
					error: "border-black/25 bg-error text-on-fill",
					info: "border-black/25 bg-info text-on-fill",
					primary: "border-black/25 bg-primary text-on-fill",
					secondary: "border-black/25 bg-secondary text-on-fill",
					success: "border-black/25 bg-success text-on-fill",
					warning: "border-black/25 bg-warning text-on-fill",
				},
			},
		},
	);

	type NativeKbdProps = Omit<HTMLAttributes<HTMLElement>, "class">;

	export type KbdProps = NativeKbdProps & {
		children?: Snippet;
		class?: string;
		size?: Size;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let { children, class: className = "", size = "md", variant = "default", ...restProps }: KbdProps = $props();

	const classes = $derived(kbdVariants({ class: className, size, variant }));
</script>

<kbd {...restProps} class={classes}>
	{#if children}
		{@render children()}
	{/if}
</kbd>
