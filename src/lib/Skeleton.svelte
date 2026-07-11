<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Variant } from "./types.js";

	export type SkeletonType = "avatar" | "button" | "card" | "rectangle" | "text" | "title";

	const skeletonVariants = cva("relative block max-w-full overflow-hidden", {
		defaultVariants: {
			animated: true,
			type: "rectangle",
			variant: "default",
		},
		variants: {
			animated: {
				false: null,
				true: "animate-pulse motion-reduce:animate-none",
			},
			type: {
				avatar: "size-10 rounded-full",
				button: "h-10 w-28 rounded-lg",
				card: "h-40 w-full rounded-lg",
				rectangle: "h-24 w-full rounded-lg",
				text: "h-4 w-full rounded",
				title: "h-7 w-2/3 rounded-md",
			},
			variant: {
				default: "bg-foreground/10",
				error: "bg-error/20",
				info: "bg-info/20",
				primary: "bg-primary/20",
				secondary: "bg-secondary/20",
				success: "bg-success/20",
				warning: "bg-warning/20",
			},
		},
	});

	type NativeSkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, "aria-hidden" | "class">;

	export type SkeletonProps = NativeSkeletonProps & {
		animated?: boolean;
		class?: string;
		type?: SkeletonType;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let {
		animated = true,
		class: className = "",
		type = "rectangle",
		variant = "default",
		...restProps
	}: SkeletonProps = $props();

	const classes = $derived(skeletonVariants({ animated, class: className, type, variant }));
</script>

<div {...restProps} aria-hidden="true" class={classes}>
	{#if animated}
		<span class="skeleton-shimmer absolute inset-y-0 -left-1/2 w-1/2"></span>
	{/if}
</div>

<style>
	.skeleton-shimmer {
		animation: skeleton-shimmer 1.8s ease-in-out infinite;
		background: linear-gradient(
			110deg,
			transparent 0%,
			rgb(0 0 0 / 0.02) 18%,
			rgb(0 0 0 / 0.07) 36%,
			rgb(0 0 0 / 0.14) 50%,
			rgb(0 0 0 / 0.07) 64%,
			rgb(0 0 0 / 0.02) 82%,
			transparent 100%
		);
		filter: blur(2px);
		will-change: opacity, transform;
	}

	@keyframes skeleton-shimmer {
		0% {
			opacity: 0;
			transform: translateX(0);
		}

		15%,
		85% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: translateX(300%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.skeleton-shimmer {
			display: none;
		}
	}
</style>
