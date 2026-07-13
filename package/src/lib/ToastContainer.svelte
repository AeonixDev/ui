<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { HTMLAttributes } from "svelte/elements";
	import type { ToastId, ToastOptions, ToastPosition } from "./Toast.js";

	export type { ToastId, ToastOptions, ToastPosition } from "./Toast.js";

	const toastPositions: ToastPosition[] = [
		"top-left",
		"top-center",
		"top-right",
		"bottom-left",
		"bottom-center",
		"bottom-right",
	];

	const toastContainerVariants = cva(
		"pointer-events-none fixed z-50 flex w-[calc((100%-4rem)/3)] max-w-sm flex-col gap-2",
		{
			variants: {
				position: {
					"bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse items-center",
					"bottom-left": "bottom-4 left-4 flex-col-reverse items-start",
					"bottom-right": "right-4 bottom-4 flex-col-reverse items-end",
					"top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
					"top-left": "top-4 left-4 items-start",
					"top-right": "top-4 right-4 items-end",
				},
			},
		},
	);

	type NativeToastContainerProps = Omit<HTMLAttributes<HTMLElement>, "class">;

	export type ToastContainerProps = NativeToastContainerProps & {
		class?: string;
		duration?: number;
		label?: string;
		maxToasts?: number;
	};
</script>

<script lang="ts">
	import { onDestroy, setContext } from "svelte";
	import { flip } from "svelte/animate";
	import { cubicOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import { registerToastContext, toastContextKey, type ToastContext, type ToastData } from "./Toast.js";
	import Toast from "./Toast.svelte";

	let {
		class: className = "",
		duration = 5000,
		label = "Notifications",
		maxToasts = 3,
		...restProps
	}: ToastContainerProps = $props();

	let toasts = $state<ToastData[]>([]);
	let nextId = 0;
	const dismissTimers = new Map<ToastId, ReturnType<typeof setTimeout>>();
	const visibleToastCount = $derived(Math.max(0, Math.floor(maxToasts)));

	const toastContext: ToastContext = {
		addToast(toast) {
			const id = toast.id ?? `toast-${++nextId}`;
			const position = toast.position ?? "bottom-right";
			const toastDuration = toast.duration ?? duration;

			clearDismissTimer(id);

			toasts = [
				...toasts.filter((currentToast) => currentToast.id !== id),
				{
					dismissible: toast.dismissible ?? true,
					duration: toastDuration,
					id,
					message: toast.message,
					position,
					title: toast.title,
					variant: toast.variant ?? "default",
				},
			];

			if (Number.isFinite(toastDuration) && toastDuration > 0) {
				dismissTimers.set(
					id,
					setTimeout(() => toastContext.removeToast(id), toastDuration),
				);
			}

			return id;
		},
		removeToast(id) {
			clearDismissTimer(id);
			toasts = toasts.filter((toast) => toast.id !== id);
		},
		get toasts() {
			return toasts;
		},
	};

	setContext(toastContextKey, toastContext);
	const unregisterToastContext = typeof window === "undefined" ? undefined : registerToastContext(toastContext);

	onDestroy(() => {
		unregisterToastContext?.();

		for (const timer of dismissTimers.values()) {
			clearTimeout(timer);
		}
	});

	export function addToast(toast: ToastOptions): ToastId {
		return toastContext.addToast(toast);
	}

	export function removeToast(id: ToastId): void {
		toastContext.removeToast(id);
	}

	function getVisibleToasts(position: ToastPosition): ToastData[] {
		if (visibleToastCount === 0) {
			return [];
		}

		return toastContext.toasts.filter((toast) => toast.position === position).slice(-visibleToastCount);
	}

	function clearDismissTimer(id: ToastId): void {
		const timer = dismissTimers.get(id);
		if (timer === undefined) {
			return;
		}

		clearTimeout(timer);
		dismissTimers.delete(id);
	}

	function getToastOffset(position: ToastPosition): { x: number; y: number } {
		return {
			x: position.endsWith("left") ? -24 : position.endsWith("right") ? 24 : 0,
			y: position.startsWith("top") ? -16 : 16,
		};
	}
</script>

<div {...restProps} class={className}>
	{#each toastPositions as position}
		<section aria-label={`${label}: ${position.replace("-", " ")}`} class={toastContainerVariants({ position })}>
			{#each getVisibleToasts(position) as toast (toast.id)}
				<div
					animate:flip={{ duration: 200, easing: cubicOut }}
					in:fly={{ ...getToastOffset(position), duration: 220, easing: cubicOut }}
					out:fly={{ ...getToastOffset(position), duration: 160, easing: cubicOut }}
				>
					<Toast
						dismissible={toast.dismissible}
						id={toast.id}
						message={toast.message}
						title={toast.title}
						variant={toast.variant}
					/>
				</div>
			{/each}
		</section>
	{/each}
</div>
