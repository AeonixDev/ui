<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	const variantClasses = {
		default: "bg-foreground/10 shadow-sm",
		error: "bg-error text-on-fill",
		info: "bg-info text-on-fill",
		primary: "bg-primary text-on-fill",
		secondary: "bg-secondary text-on-fill",
		success: "bg-success text-on-fill",
		warning: "bg-warning text-on-fill",
	} satisfies Record<Variant, string>;

	const sizeClasses = {
		lg: "h-7 px-4 text-sm",
		md: "h-6 px-3 text-sm",
		sm: "h-5 px-2 text-xs",
	} satisfies Record<Size, string>;

	const badgeVariants = cva("inline-flex items-center rounded-full font-medium leading-none transition-colors", {
		defaultVariants: {
			size: "md",
			variant: "default",
		},
		variants: {
			size: sizeClasses,
			variant: variantClasses,
		},
	});

	type NativeBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "class">;

	export type BadgeProps = NativeBadgeProps & {
		class?: string;
		variant?: Variant;
		size?: Size;
		children?: Snippet;
	};
</script>

<script lang="ts">
	let { class: className = "", variant = "default", size = "md", children, ...restProps }: BadgeProps = $props();

	const classes = $derived(badgeVariants({ class: className, size, variant }));
</script>

<span {...restProps} class={classes}>
	{#if children}
		{@render children()}
	{/if}
</span>
