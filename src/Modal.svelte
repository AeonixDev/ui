<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLDialogAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	export type ModalClose = (returnValue?: string) => void;

	const modalVariants = cva(
		"m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-xl border p-0 shadow-2xl backdrop:bg-background/75 backdrop:backdrop-blur-sm",
		{
			defaultVariants: { size: "md", variant: "default" },
			variants: {
				size: {
					lg: "max-w-3xl",
					md: "max-w-xl",
					sm: "max-w-md",
				},
				variant: {
					default: "border-foreground/10 bg-surface text-surface-foreground",
					error: "border-error bg-error text-error-foreground",
					info: "border-info bg-info text-info-foreground",
					primary: "border-primary bg-primary text-primary-foreground",
					secondary: "border-secondary bg-secondary text-secondary-foreground",
					success: "border-success bg-success text-success-foreground",
					warning: "border-warning bg-warning text-warning-foreground",
				},
			},
		},
	);

	const sectionPaddingClasses = {
		lg: "px-6 py-5",
		md: "px-5 py-4",
		sm: "px-4 py-3",
	} satisfies Record<Size, string>;

	type NativeModalProps = Omit<HTMLDialogAttributes, "aria-label" | "class" | "open">;

	export type ModalProps = NativeModalProps & {
		children?: Snippet<[close: ModalClose]>;
		class?: string;
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		footer?: Snippet<[close: ModalClose]>;
		header?: Snippet<[close: ModalClose]>;
		label: string;
		open?: boolean;
		size?: Size;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let {
		children,
		class: className = "",
		closeOnBackdrop = true,
		closeOnEscape = true,
		footer,
		header,
		label,
		oncancel,
		onclick,
		onclose,
		onkeydown,
		open: isOpen = $bindable(false),
		size = "md",
		variant = "default",
		...restProps
	}: ModalProps = $props();

	let dialog = $state<HTMLDialogElement>();
	const classes = $derived(modalVariants({ class: className, size, variant }));
	const sectionPadding = $derived(sectionPaddingClasses[size]);

	$effect(() => {
		if (!dialog) {
			return;
		}

		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	});

	const close: ModalClose = (returnValue = "") => {
		if (dialog?.open) {
			dialog.close(returnValue);
		} else {
			isOpen = false;
		}
	};

	function isBackdropClick(event: MouseEvent): boolean {
		if (!dialog || event.target !== dialog) {
			return false;
		}

		const bounds = dialog.getBoundingClientRect();

		return (
			event.clientX < bounds.left ||
			event.clientX > bounds.right ||
			event.clientY < bounds.top ||
			event.clientY > bounds.bottom
		);
	}
</script>

<dialog
	{...restProps}
	aria-label={label}
	bind:this={dialog}
	class={classes}
	oncancel={(event) => {
		if (!closeOnEscape) {
			event.preventDefault();
		}

		oncancel?.(event);
	}}
	onclick={(event) => {
		onclick?.(event);

		if (!event.defaultPrevented && closeOnBackdrop && isBackdropClick(event)) {
			close();
		}
	}}
	{onkeydown}
	onclose={(event) => {
		isOpen = false;
		onclose?.(event);
	}}
>
	{#if header}
		<header class={["shrink-0 border-b border-current/10", sectionPadding]}>
			{@render header(close)}
		</header>
	{/if}

	{#if children}
		<div class={["min-h-0 flex-1 overflow-y-auto", sectionPadding]}>
			{@render children(close)}
		</div>
	{/if}

	{#if footer}
		<footer class={["shrink-0 border-t border-current/10 bg-current/5", sectionPadding]}>
			{@render footer(close)}
		</footer>
	{/if}
</dialog>

<style>
	dialog {
		display: none;
		opacity: 0;
		transform: translateY(0.75rem) scale(0.97);
		transition:
			display 180ms,
			overlay 180ms,
			opacity 180ms ease,
			transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-behavior: allow-discrete;
	}

	dialog[open] {
		display: flex;
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: translateY(0.75rem) scale(0.97);
		}
	}

	dialog::backdrop {
		opacity: 0;
		transition:
			display 180ms,
			overlay 180ms,
			opacity 180ms ease;
		transition-behavior: allow-discrete;
	}

	dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		dialog,
		dialog::backdrop {
			transition-duration: 0.01ms;
		}

		dialog,
		dialog[open] {
			transform: none;
		}
	}
</style>
