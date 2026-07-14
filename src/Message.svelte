<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Variant } from "./types.js";

	const messageVariants = cva("box-border w-full rounded-lg px-4 py-3 text-sm shadow-sm", {
		defaultVariants: {
			variant: "default",
		},
		variants: {
			variant: {
				default: "bg-foreground/10",
				error: "bg-error text-on-fill",
				info: "bg-info text-on-fill",
				primary: "bg-primary text-on-fill",
				secondary: "bg-secondary text-on-fill",
				success: "bg-success text-on-fill",
				warning: "bg-warning text-on-fill",
			},
		},
	});

	type NativeMessageProps = Omit<HTMLAttributes<HTMLDivElement>, "class" | "role">;

	export type MessageProps = NativeMessageProps & {
		children?: Snippet;
		class?: string;
		dismissable?: boolean;
		duration?: number;
		ondismiss?: () => void;
		role?: "alert" | "status";
		variant?: Variant;
	};
</script>

<script lang="ts">
	import { cubicOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	let {
		children,
		class: className = "",
		dismissable = false,
		duration,
		ondismiss,
		role,
		variant = "default",
		...restProps
	}: MessageProps = $props();

	let visible = $state(true);
	const classes = $derived(messageVariants({ class: className, variant }));
	const effectiveRole = $derived(role ?? (variant === "error" || variant === "warning" ? "alert" : "status"));

	$effect(() => {
		if (!visible || duration === undefined || !Number.isFinite(duration)) {
			return;
		}

		const timer = setTimeout(dismiss, Math.max(0, duration));
		return () => clearTimeout(timer);
	});

	function dismiss(): void {
		if (!visible) {
			return;
		}

		visible = false;
		ondismiss?.();
	}
</script>

{#if visible}
	<div
		{...restProps}
		class={[classes, "flex items-start gap-3"]}
		in:fly={{ duration: 220, easing: cubicOut, y: -8 }}
		out:fly={{ duration: 160, easing: cubicOut, y: -8 }}
		role={effectiveRole}
	>
		<div class="min-w-0 flex-1">
			{#if children}
				{@render children()}
			{/if}
		</div>

		{#if dismissable}
			<button
				aria-label="Dismiss message"
				class="-m-1 shrink-0 cursor-pointer rounded p-1 text-current/70 hover:text-current focus:outline-none focus:ring-2 focus:ring-current/50"
				onclick={dismiss}
				type="button"
			>
				&times;
			</button>
		{/if}
	</div>
{/if}
