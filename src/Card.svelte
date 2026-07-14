<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	const cardVariants = cva("box-border flex max-w-full flex-col rounded-xl", {
		compoundVariants: [
			{ class: "gap-5 p-6", distinguished: false, size: "lg" },
			{ class: "gap-4 p-4", distinguished: false, size: "md" },
			{ class: "gap-3 p-3", distinguished: false, size: "sm" },
		],
		defaultVariants: { distinguished: false, size: "md", variant: "default" },
		variants: {
			distinguished: {
				false: null,
				true: "gap-0 overflow-hidden",
			},
			size: {
				lg: null,
				md: null,
				sm: null,
			},
			variant: {
				default: "border border-foreground/10 bg-surface text-foreground shadow-sm",
				error: "bg-error text-on-fill shadow-sm",
				info: "bg-info text-on-fill shadow-sm",
				primary: "bg-primary text-on-fill shadow-sm",
				secondary: "bg-secondary text-on-fill shadow-sm",
				success: "bg-success text-on-fill shadow-sm",
				warning: "bg-warning text-on-fill shadow-sm",
			},
		},
	});

	const sectionPaddingClasses = {
		lg: "px-6 py-5",
		md: "px-4 py-4",
		sm: "px-3 py-3",
	} satisfies Record<Size, string>;

	type NativeCardProps = Omit<HTMLAttributes<HTMLElement>, "class">;

	export type CardProps = NativeCardProps & {
		children?: Snippet;
		class?: string;
		distinguished?: boolean;
		footer?: Snippet;
		header?: Snippet;
		size?: Size;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let {
		children,
		class: className = "",
		distinguished = false,
		footer,
		header,
		size = "md",
		variant = "default",
		...restProps
	}: CardProps = $props();

	const classes = $derived(cardVariants({ class: className, distinguished, size, variant }));
	const sectionPadding = $derived(sectionPaddingClasses[size]);
</script>

<article {...restProps} class={classes}>
	{#if header}
		<header
			class={["min-w-0", distinguished && "border-b border-current/15 bg-current/5", distinguished && sectionPadding]}
		>
			{@render header()}
		</header>
	{/if}

	{#if children}
		<div class={["min-w-0 flex-1", distinguished && sectionPadding]}>{@render children()}</div>
	{/if}

	{#if footer}
		<footer
			class={["min-w-0", distinguished && "border-t border-current/15 bg-current/5", distinguished && sectionPadding]}
		>
			{@render footer()}
		</footer>
	{/if}
</article>
