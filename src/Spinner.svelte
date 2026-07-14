<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	export type SpinnerType =
		| "bars"
		| "chase"
		| "circular"
		| "dual-ring"
		| "hourglass"
		| "marching-dots"
		| "orbit"
		| "pinwheel"
		| "pulse"
		| "radar"
		| "ripple"
		| "square"
		| "wave";

	const spinnerVariants = cva("inline-flex shrink-0", {
		defaultVariants: {
			size: "md",
			type: "circular",
			variant: "default",
		},
		variants: {
			size: {
				lg: "h-6",
				md: "h-5",
				sm: "h-4",
			},
			type: {
				bars: "items-center justify-center gap-0.5",
				chase: "aspect-square",
				circular: "aspect-square",
				"dual-ring": "aspect-square",
				hourglass: "aspect-square",
				"marching-dots": "items-center justify-center gap-1",
				orbit: "aspect-square",
				pinwheel: "aspect-square",
				pulse: "aspect-square items-center justify-center",
				radar: "aspect-square",
				ripple: "relative aspect-square",
				square: "aspect-square",
				wave: "items-center justify-center gap-0.5",
			},
			variant: {
				default: null,
				error: "text-error",
				info: "text-info",
				primary: "text-primary",
				secondary: "text-secondary",
				success: "text-success",
				warning: "text-warning",
			},
		},
	});

	const dotSizeClasses = {
		lg: "size-2",
		md: "size-1.5",
		sm: "size-1",
	} satisfies Record<Size, string>;

	const barSizeClasses = {
		lg: "h-5 w-1.5",
		md: "h-4 w-1",
		sm: "h-3 w-0.5",
	} satisfies Record<Size, string>;

	const pulseSizeClasses = {
		lg: "size-5",
		md: "size-4",
		sm: "size-3",
	} satisfies Record<Size, string>;

	const motionDelays = [0, 0.15, 0.3];
	const waveDelays = [0, 0.1, 0.2, 0.3, 0.4];
	const chaseDotPositionClasses = [
		"top-0 left-1/2 -translate-x-1/2",
		"top-1/2 right-0 -translate-y-1/2",
		"bottom-0 left-1/2 -translate-x-1/2",
		"top-1/2 left-0 -translate-y-1/2",
	];

	type NativeSpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, "aria-label" | "class" | "role">;

	export type SpinnerProps = NativeSpinnerProps & {
		class?: string;
		label?: string;
		size?: Size;
		type?: SpinnerType;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let {
		class: className = "",
		label = "Loading",
		size = "md",
		type = "circular",
		variant = "default",
		...restProps
	}: SpinnerProps = $props();

	const classes = $derived(spinnerVariants({ class: className, size, type, variant }));
</script>

<span {...restProps} aria-label={label} class={classes} role="status">
	{#if type === "circular"}
		<svg aria-hidden="true" class="size-full animate-spin motion-reduce:animate-none" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"></circle>
			<path class="opacity-90" d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-linecap="round" stroke-width="3"
			></path>
		</svg>
	{:else if type === "marching-dots"}
		{#each motionDelays as delay}
			<span
				aria-hidden="true"
				class={["marching-dot rounded-full", dotSizeClasses[size]]}
				style:animation-delay={`${delay}s`}
			></span>
		{/each}
	{:else if type === "pulse"}
		<span aria-hidden="true" class={["relative inline-flex", pulseSizeClasses[size]]}>
			<span class="absolute inset-0 animate-ping rounded-full bg-current opacity-50 motion-reduce:animate-none"></span>
			<span class="absolute inset-1/4 rounded-full bg-current"></span>
		</span>
	{:else if type === "bars"}
		{#each motionDelays as delay}
			<span
				aria-hidden="true"
				class={["spinner-bar rounded-full", barSizeClasses[size]]}
				style:animation-delay={`${delay}s`}
			></span>
		{/each}
	{:else if type === "orbit"}
		<span
			aria-hidden="true"
			class="relative size-full animate-spin rounded-full border border-current/25 motion-reduce:animate-none"
		>
			<span class={["absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-current", dotSizeClasses[size]]}></span>
		</span>
	{:else if type === "chase"}
		<span aria-hidden="true" class="relative size-full animate-spin motion-reduce:animate-none">
			{#each chaseDotPositionClasses as positionClass}
				<span class={["absolute rounded-full bg-current", dotSizeClasses[size], positionClass]}></span>
			{/each}
		</span>
	{:else if type === "dual-ring"}
		<span aria-hidden="true" class="relative size-full">
			<span
				class="absolute inset-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
			></span>
			<span class="reverse-ring absolute inset-1 rounded-full border border-current/60 border-l-transparent"></span>
		</span>
	{:else if type === "ripple"}
		<span aria-hidden="true" class="ripple-ring absolute inset-0 rounded-full border-2 border-current"></span>
		<span
			aria-hidden="true"
			class="ripple-ring absolute inset-0 rounded-full border-2 border-current"
			style:animation-delay="0.5s"
		></span>
	{:else if type === "square"}
		<span aria-hidden="true" class="spinner-square size-full rounded-sm border-2 border-current"></span>
	{:else if type === "hourglass"}
		<span
			aria-hidden="true"
			class="spinner-hourglass size-full rounded-sm border-2 border-current border-t-transparent border-b-transparent"
		></span>
	{:else if type === "pinwheel"}
		<svg aria-hidden="true" class="size-full animate-spin motion-reduce:animate-none" viewBox="0 0 24 24">
			<rect fill="currentColor" height="10" rx="2" width="4" x="10" y="1"></rect>
			<rect fill="currentColor" height="10" opacity="0.75" rx="2" transform="rotate(90 12 12)" width="4" x="10" y="1"
			></rect>
			<rect fill="currentColor" height="10" opacity="0.5" rx="2" transform="rotate(180 12 12)" width="4" x="10" y="1"
			></rect>
			<rect fill="currentColor" height="10" opacity="0.25" rx="2" transform="rotate(270 12 12)" width="4" x="10" y="1"
			></rect>
		</svg>
	{:else if type === "radar"}
		<span aria-hidden="true" class="relative size-full rounded-full border border-current/30">
			<span class="radar-sweep absolute top-1/2 left-1/2 h-px w-1/2 origin-left bg-current"></span>
			<span class="absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full bg-current"></span>
		</span>
	{:else}
		{#each waveDelays as delay}
			<span
				aria-hidden="true"
				class={["spinner-wave rounded-full", barSizeClasses[size]]}
				style:animation-delay={`${delay}s`}
			></span>
		{/each}
	{/if}
</span>

<style>
	.marching-dot {
		animation: marching-dot 1.2s ease-in-out infinite;
		background-color: currentColor;
	}

	.spinner-bar {
		animation: spinner-bar 1.2s ease-in-out infinite;
		background-color: currentColor;
		opacity: 0.35;
		transform: scaleY(0.6);
	}

	.reverse-ring {
		animation: reverse-ring 700ms linear infinite;
	}

	.ripple-ring {
		animation: ripple-ring 1s ease-out infinite;
	}

	.spinner-square {
		animation: spinner-square 1.2s ease-in-out infinite;
	}

	.spinner-hourglass {
		animation: spinner-hourglass 1.2s ease-in-out infinite;
	}

	.radar-sweep {
		animation: radar-sweep 1s linear infinite;
	}

	.spinner-wave {
		animation: spinner-wave 1s ease-in-out infinite;
		background-color: currentColor;
		transform: scaleY(0.35);
	}

	@keyframes marching-dot {
		0%,
		70%,
		100% {
			background-color: currentColor;
			transform: translateY(0);
		}

		35% {
			background-color: color-mix(in srgb, currentColor 65%, black);
			transform: translateY(-50%);
		}
	}

	@keyframes spinner-bar {
		0%,
		70%,
		100% {
			opacity: 0.35;
			transform: scaleY(0.6);
		}

		35% {
			opacity: 1;
			transform: scaleY(1);
		}
	}

	@keyframes reverse-ring {
		to {
			transform: rotate(-360deg);
		}
	}

	@keyframes ripple-ring {
		0% {
			opacity: 0.8;
			transform: scale(0.2);
		}

		100% {
			opacity: 0;
			transform: scale(1);
		}
	}

	@keyframes spinner-square {
		0%,
		100% {
			transform: rotate(0deg) scale(0.65);
		}

		50% {
			transform: rotate(180deg) scale(1);
		}
	}

	@keyframes spinner-hourglass {
		0%,
		100% {
			transform: rotate(0deg) scale(0.7);
		}

		50% {
			transform: rotate(180deg) scale(1);
		}
	}

	@keyframes radar-sweep {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes spinner-wave {
		0%,
		60%,
		100% {
			opacity: 0.35;
			transform: scaleY(0.35);
		}

		30% {
			opacity: 1;
			transform: scaleY(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marching-dot,
		.radar-sweep,
		.reverse-ring,
		.ripple-ring,
		.spinner-bar,
		.spinner-hourglass,
		.spinner-square,
		.spinner-wave {
			animation: none;
		}
	}
</style>
