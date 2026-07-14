<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import { getContext } from "svelte";
	import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from "svelte/elements";
	import Divider from "./Divider.svelte";
	import { navContextKey, type NavContext } from "./Nav.js";

	const navItemVariants = cva("box-border min-w-0 max-w-full", {
		compoundVariants: [
			{
				class:
					"hover:bg-foreground/10 focus-visible:ring-foreground/40 focus-visible:ring-offset-background active:bg-foreground/15 aria-[current=page]:bg-foreground/15",
				type: ["link", "button"],
				variant: "default",
			},
			{
				class:
					"text-on-fill hover:bg-on-fill/15 focus-visible:ring-on-fill/60 focus-visible:ring-offset-primary active:bg-on-fill/25 aria-[current=page]:bg-on-fill/20",
				type: ["link", "button"],
				variant: "primary",
			},
			{
				class:
					"text-on-fill hover:bg-on-fill/15 focus-visible:ring-on-fill/60 focus-visible:ring-offset-secondary active:bg-on-fill/25 aria-[current=page]:bg-on-fill/20",
				type: ["link", "button"],
				variant: "secondary",
			},
			{
				class:
					"text-on-fill hover:bg-on-fill/15 focus-visible:ring-on-fill/60 focus-visible:ring-offset-error active:bg-on-fill/25 aria-[current=page]:bg-on-fill/20",
				type: ["link", "button"],
				variant: "error",
			},
			{
				class:
					"text-on-fill hover:bg-on-fill/15 focus-visible:ring-on-fill/60 focus-visible:ring-offset-info active:bg-on-fill/25 aria-[current=page]:bg-on-fill/20",
				type: ["link", "button"],
				variant: "info",
			},
			{
				class:
					"text-on-fill hover:bg-on-fill/15 focus-visible:ring-on-fill/60 focus-visible:ring-offset-success active:bg-on-fill/25 aria-[current=page]:bg-on-fill/20",
				type: ["link", "button"],
				variant: "success",
			},
			{
				class:
					"text-on-fill hover:bg-on-fill/15 focus-visible:ring-on-fill/60 focus-visible:ring-offset-warning active:bg-on-fill/25 aria-[current=page]:bg-on-fill/20",
				type: ["link", "button"],
				variant: "warning",
			},
			{ class: "justify-start", mode: "vertical", type: "button" },
		],
		defaultVariants: {
			mode: "horizontal",
			type: "link",
			variant: "default",
		},
		variants: {
			mode: {
				horizontal: null,
				vertical: "w-full",
			},
			type: {
				button:
					"inline-flex h-auto cursor-pointer appearance-none items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md border-0 bg-transparent px-3 py-2 font-medium text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				divider: null,
				link: "inline-flex items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
			},
			variant: {
				default: null,
				error: null,
				info: null,
				primary: null,
				secondary: null,
				success: null,
				warning: null,
			},
		},
	});

	export type NavLinkItemProps = Omit<HTMLAnchorAttributes, "class" | "href"> & {
		children?: Snippet;
		class?: string;
		href: NonNullable<HTMLAnchorAttributes["href"]>;
		type: "link";
	};

	export type NavButtonItemProps = Omit<HTMLButtonAttributes, "class" | "onclick" | "type"> & {
		children?: Snippet;
		class?: string;
		onclick: NonNullable<HTMLButtonAttributes["onclick"]>;
		type: "button";
	};

	export type NavDividerItemProps = Omit<HTMLAttributes<HTMLHRElement>, "aria-orientation" | "class"> & {
		children?: never;
		class?: string;
		type: "divider";
	};

	export type NavItemProps = NavLinkItemProps | NavButtonItemProps | NavDividerItemProps;

	type LinkElementProps = Omit<NavLinkItemProps, "children" | "class" | "type">;
	type ButtonElementProps = Omit<NavButtonItemProps, "children" | "class" | "type">;
	type DividerElementProps = Omit<NavDividerItemProps, "children" | "class" | "type">;
</script>

<script lang="ts">
	const nav = getContext<NavContext | undefined>(navContextKey);

	let { children, class: className = "", type, ...restProps }: NavItemProps = $props();

	const mode = $derived(nav?.mode ?? "horizontal");
	const variant = $derived(nav?.variant ?? "default");
	const classes = $derived(navItemVariants({ class: className, mode, type, variant }));
	const dividerOrientation = $derived(mode === "horizontal" ? "vertical" : "horizontal");
	const linkProps = $derived(restProps as LinkElementProps);
	const buttonProps = $derived(restProps as ButtonElementProps);
	const dividerProps = $derived(restProps as DividerElementProps);
</script>

{#if type === "link"}
	<a {...linkProps} class={classes} href={linkProps.href}>
		{#if children}
			{@render children()}
		{/if}
	</a>
{:else if type === "button"}
	<button {...buttonProps} class={classes} type="button">
		{#if children}
			{@render children()}
		{/if}
	</button>
{:else}
	<Divider {...dividerProps} class={classes} orientation={dividerOrientation} {variant} />
{/if}
