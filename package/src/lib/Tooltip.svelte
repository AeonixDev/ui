<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	export type TooltipPosition = "bottom" | "left" | "right" | "top";

	export type TooltipTriggerProps = {
		"aria-describedby": string;
		onblur: () => void;
		onfocus: () => void;
		onkeydown: (event: KeyboardEvent) => void;
		onmouseenter: () => void;
		onmouseleave: () => void;
	};

	const tooltipVariants = cva(
		"pointer-events-none fixed z-50 w-max max-w-[calc(100vw-1rem)] rounded-md text-center shadow-lg sm:max-w-xs",
		{
			defaultVariants: {
				size: "md",
				variant: "default",
			},
			variants: {
				size: {
					lg: "px-3 py-2 text-sm",
					md: "px-2.5 py-1.5 text-xs",
					sm: "px-2 py-1 text-[0.6875rem]",
				},
				variant: {
					default: "bg-foreground text-background",
					error: "bg-error text-error-foreground",
					info: "bg-info text-info-foreground",
					primary: "bg-primary text-primary-foreground",
					secondary: "bg-secondary text-secondary-foreground",
					success: "bg-success text-success-foreground",
					warning: "bg-warning text-warning-foreground",
				},
			},
		},
	);

	type NativeTooltipProps = Omit<HTMLAttributes<HTMLSpanElement>, "children" | "class" | "content">;

	export type TooltipProps = NativeTooltipProps & {
		children: Snippet<[props: TooltipTriggerProps]>;
		class?: string;
		content: string;
		delay?: number;
		position?: TooltipPosition;
		size?: Size;
		variant?: Variant;
	};
</script>

<script lang="ts">
	import { onDestroy, tick } from "svelte";
	import { cubicOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	let {
		children,
		class: className = "",
		content,
		delay = 300,
		position = "top",
		size = "md",
		variant = "default",
		...restProps
	}: TooltipProps = $props();

	const tooltipId = $props.id();
	let focused = false;
	let hovered = false;
	let open = $state(false);
	let positioned = $state(false);
	let resolvedPosition = $state<TooltipPosition>("top");
	let triggerElement = $state<HTMLSpanElement>();
	let tooltipElement = $state<HTMLSpanElement>();
	let arrowLeft = $state(0);
	let arrowTop = $state(0);
	let tooltipLeft = $state(0);
	let tooltipTop = $state(0);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const classes = $derived(tooltipVariants({ size, variant }));
	const triggerProps: TooltipTriggerProps = {
		"aria-describedby": tooltipId,
		onblur: handleBlur,
		onfocus: handleFocus,
		onkeydown: handleKeydown,
		onmouseenter: handleMouseenter,
		onmouseleave: handleMouseleave,
	};

	onDestroy(clearTimer);

	$effect(() => {
		if (!open) {
			return;
		}

		position;
		content;

		void tick().then(updatePosition);

		const observer = new ResizeObserver(updatePosition);
		if (triggerElement) {
			observer.observe(triggerElement);
		}
		if (tooltipElement) {
			observer.observe(tooltipElement);
		}

		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition, true);

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
		};
	});

	function clearTimer(): void {
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
	}

	function show(): void {
		clearTimer();

		timer = setTimeout(
			() => {
				positioned = false;
				open = true;
				timer = undefined;
			},
			Math.max(0, delay),
		);
	}

	function hide(): void {
		clearTimer();
		open = false;
	}

	function handleFocus(): void {
		focused = true;
		show();
	}

	function handleBlur(): void {
		focused = false;

		if (!hovered) {
			hide();
		}
	}

	function handleMouseenter(): void {
		hovered = true;
		show();
	}

	function handleMouseleave(): void {
		hovered = false;

		if (!focused) {
			hide();
		}
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === "Escape") {
			hide();
		}
	}

	function getOffset(): { x: number; y: number } {
		return {
			x: resolvedPosition === "left" ? -6 : resolvedPosition === "right" ? 6 : 0,
			y: resolvedPosition === "top" ? -6 : resolvedPosition === "bottom" ? 6 : 0,
		};
	}

	function portal(node: HTMLElement): { destroy: () => void } {
		document.body.append(node);

		return {
			destroy() {
				node.remove();
			},
		};
	}

	function updatePosition(): void {
		if (!triggerElement || !tooltipElement) {
			return;
		}

		const trigger = triggerElement.getBoundingClientRect();
		const tooltip = tooltipElement.getBoundingClientRect();
		const gap = 10;
		const viewportPadding = 8;
		const opposite: Record<TooltipPosition, TooltipPosition> = {
			bottom: "top",
			left: "right",
			right: "left",
			top: "bottom",
		};
		const perpendicular: Record<TooltipPosition, TooltipPosition[]> = {
			bottom: ["right", "left"],
			left: ["top", "bottom"],
			right: ["top", "bottom"],
			top: ["right", "left"],
		};
		const candidates = [position, opposite[position], ...perpendicular[position]];

		const coordinates = (placement: TooltipPosition) => {
			if (placement === "top") {
				return { left: trigger.left + (trigger.width - tooltip.width) / 2, top: trigger.top - tooltip.height - gap };
			}

			if (placement === "bottom") {
				return { left: trigger.left + (trigger.width - tooltip.width) / 2, top: trigger.bottom + gap };
			}

			if (placement === "left") {
				return { left: trigger.left - tooltip.width - gap, top: trigger.top + (trigger.height - tooltip.height) / 2 };
			}

			return { left: trigger.right + gap, top: trigger.top + (trigger.height - tooltip.height) / 2 };
		};

		const fits = ({ left, top }: { left: number; top: number }) =>
			left >= viewportPadding &&
			top >= viewportPadding &&
			left + tooltip.width <= window.innerWidth - viewportPadding &&
			top + tooltip.height <= window.innerHeight - viewportPadding;

		resolvedPosition = candidates.find((candidate) => fits(coordinates(candidate))) ?? position;

		const resolved = coordinates(resolvedPosition);

		tooltipLeft = Math.min(
			window.innerWidth - tooltip.width - viewportPadding,
			Math.max(viewportPadding, resolved.left),
		);

		tooltipTop = Math.min(
			window.innerHeight - tooltip.height - viewportPadding,
			Math.max(viewportPadding, resolved.top),
		);

		if (resolvedPosition === "top" || resolvedPosition === "bottom") {
			arrowLeft = Math.min(tooltip.width - 8, Math.max(8, trigger.left + trigger.width / 2 - tooltipLeft));
			arrowTop = resolvedPosition === "top" ? tooltip.height : 0;
		} else {
			arrowLeft = resolvedPosition === "left" ? tooltip.width : 0;
			arrowTop = Math.min(tooltip.height - 8, Math.max(8, trigger.top + trigger.height / 2 - tooltipTop));
		}

		positioned = true;
	}
</script>

<span {...restProps} bind:this={triggerElement} class={["inline-flex", className]}>
	{@render children(triggerProps)}

	<span class="sr-only" id={tooltipId} role="tooltip">{content}</span>

	{#if open}
		<span
			aria-hidden="true"
			bind:this={tooltipElement}
			class={[classes, !positioned && "invisible"]}
			in:fly={{ ...getOffset(), duration: 180, easing: cubicOut }}
			out:fly={{ ...getOffset(), duration: 120, easing: cubicOut }}
			style:left={`${tooltipLeft}px`}
			style:top={`${tooltipTop}px`}
			use:portal
		>
			{content}

			<span
				class="absolute size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-inherit"
				style:left={`${arrowLeft}px`}
				style:top={`${arrowTop}px`}
			></span>
		</span>
	{/if}
</span>
