<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import { getContext } from "svelte";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { buttonGroupContextKey, type ButtonGroupContext } from "./ButtonGroup.js";
	import type { Size, Variant } from "./types.js";

	const variantClasses = {
		default:
			"bg-foreground/10 shadow-sm hover:bg-foreground/15 active:bg-foreground/20 focus-visible:ring-foreground/40",
		error: "bg-error text-on-fill shadow-sm hover:bg-error/90 active:bg-error/80 focus-visible:ring-error/40",
		info: "bg-info text-on-fill shadow-sm hover:bg-info/90 active:bg-info/80 focus-visible:ring-info/40",
		primary: "bg-primary text-on-fill shadow-sm hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary/40",
		secondary:
			"bg-secondary text-on-fill shadow-sm hover:bg-secondary/90 active:bg-secondary/80 focus-visible:ring-secondary/40",
		success: "bg-success text-on-fill shadow-sm hover:bg-success/90 active:bg-success/80 focus-visible:ring-success/40",
		warning: "bg-warning text-on-fill shadow-sm hover:bg-warning/90 active:bg-warning/80 focus-visible:ring-warning/40",
	} satisfies Record<Variant, string>;

	const sizeClasses = {
		lg: "h-12 px-5 text-base",
		md: "h-10 px-4 text-sm",
		sm: "h-8 px-3 text-sm",
	} satisfies Record<Size, string>;

	const buttonVariants = cva(
		"inline-flex items-center justify-center rounded-lg border-0 border-none font-medium no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
		{
			defaultVariants: {
				size: "md",
				variant: "default",
			},
			variants: {
				size: sizeClasses,
				variant: variantClasses,
			},
		},
	);

	type SharedButtonProps = {
		children?: Snippet;
		class?: string;
		disabled?: boolean;
		size?: Size;
		variant?: Variant;
	};

	export type ButtonElementProps = Omit<HTMLButtonAttributes, "class" | "disabled" | "type"> &
		SharedButtonProps & {
			as?: "button";
			type?: "button" | "submit" | "reset";
		};

	export type ButtonLinkProps = Omit<HTMLAnchorAttributes, "aria-disabled" | "class" | "href"> &
		SharedButtonProps & {
			as: "a";
			href: NonNullable<HTMLAnchorAttributes["href"]>;
			type?: never;
		};

	export type ButtonProps = ButtonElementProps | ButtonLinkProps;
	type NativeButtonProps = Omit<ButtonElementProps, "as" | "children" | "class" | "disabled" | "size" | "variant">;
	type NativeButtonLinkProps = Omit<ButtonLinkProps, "as" | "children" | "class" | "disabled" | "size" | "variant">;
</script>

<script lang="ts">
	const buttonGroup = getContext<ButtonGroupContext | undefined>(buttonGroupContextKey);

	let {
		as = "button",
		children,
		class: className = "",
		disabled,
		size = "md",
		variant,
		...restProps
	}: ButtonProps = $props();

	const effectiveVariant = $derived(variant ?? buttonGroup?.variant ?? "default");
	const effectiveDisabled = $derived(disabled ?? buttonGroup?.disabled ?? false);
	const classes = $derived(buttonVariants({ class: className, size, variant: effectiveVariant }));
	const buttonProps = $derived(restProps as NativeButtonProps);
	const linkProps = $derived(restProps as NativeButtonLinkProps);
</script>

{#if as === "a"}
	<a
		{...linkProps}
		aria-disabled={effectiveDisabled ? true : undefined}
		class={classes}
		href={linkProps.href}
		onclick={(event) => {
			if (effectiveDisabled) {
				event.preventDefault();
				event.stopPropagation();

				return;
			}

			linkProps.onclick?.(event);
		}}
		tabindex={effectiveDisabled ? -1 : linkProps.tabindex}
	>
		{#if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button {...buttonProps} class={classes} disabled={effectiveDisabled} type={buttonProps.type ?? "button"}>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
