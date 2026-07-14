<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { HTMLProgressAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	const trackVariants = cva("relative w-full overflow-hidden rounded-full bg-foreground/10", {
		defaultVariants: { size: "md" },
		variants: {
			size: {
				lg: "h-3",
				md: "h-2",
				sm: "h-1.5",
			},
		},
	});

	const indicatorVariants = cva(
		"block h-full rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none",
		{
			defaultVariants: { variant: "default" },
			variants: {
				variant: {
					default: "bg-foreground",
					error: "bg-error",
					info: "bg-info",
					primary: "bg-primary",
					secondary: "bg-secondary",
					success: "bg-success",
					warning: "bg-warning",
				},
			},
		},
	);

	type NativeProgressProps = Omit<HTMLProgressAttributes, "aria-label" | "class" | "max" | "value">;

	export type ProgressProps = NativeProgressProps & {
		class?: string;
		formatValue?: (value: number, max: number) => string;
		label?: string;
		max?: number;
		showValue?: boolean;
		size?: Size;
		value?: number;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let {
		class: className = "",
		formatValue = (currentValue, maximum) => `${Math.round((currentValue / maximum) * 100)}%`,
		label = "Progress",
		max = 100,
		showValue = false,
		size = "md",
		value,
		variant = "default",
		...restProps
	}: ProgressProps = $props();

	const normalizedMax = $derived(Number.isFinite(max) && max > 0 ? max : 100);
	const normalizedValue = $derived(
		value === undefined || !Number.isFinite(value) ? undefined : Math.min(normalizedMax, Math.max(0, value)),
	);
	const percentage = $derived(normalizedValue === undefined ? undefined : (normalizedValue / normalizedMax) * 100);
	const trackClasses = $derived(trackVariants({ class: className, size }));
	const indicatorClasses = $derived(indicatorVariants({ variant }));
</script>

<div class="w-full">
	{#if showValue && normalizedValue !== undefined}
		<div class="mb-1 flex justify-end text-xs">
			{formatValue(normalizedValue, normalizedMax)}
		</div>
	{/if}

	<progress {...restProps} aria-label={label} class="sr-only" max={normalizedMax} value={normalizedValue}></progress>

	<div aria-hidden="true" class={trackClasses}>
		{#if percentage === undefined}
			<span class={[indicatorClasses, "indeterminate absolute inset-y-0 w-2/5 motion-reduce:animate-none"]}></span>
		{:else}
			<span class={indicatorClasses} style:width={`${percentage}%`}></span>
		{/if}
	</div>
</div>

<style>
	.indeterminate {
		animation: progress-indeterminate 1.4s ease-in-out infinite;
	}

	@keyframes progress-indeterminate {
		0% {
			transform: translateX(-110%);
		}

		100% {
			transform: translateX(360%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.indeterminate {
			left: 30%;
			animation: none;
		}
	}
</style>
