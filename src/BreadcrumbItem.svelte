<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes, HTMLAttributes } from "svelte/elements";

	type BreadcrumbItemBaseProps = {
		children?: Snippet;
		class?: string;
	};

	export type BreadcrumbLinkItemProps = BreadcrumbItemBaseProps &
		Omit<HTMLAnchorAttributes, "aria-current" | "class" | "href"> & {
			current?: false;
			href: NonNullable<HTMLAnchorAttributes["href"]>;
		};

	export type BreadcrumbCurrentItemProps = BreadcrumbItemBaseProps &
		Omit<HTMLAttributes<HTMLSpanElement>, "aria-current" | "class"> & {
			current: true;
			href?: never;
		};

	export type BreadcrumbItemProps = BreadcrumbLinkItemProps | BreadcrumbCurrentItemProps;

	const itemVariants = cva("truncate", {
		defaultVariants: { current: false, type: "default" },
		variants: {
			current: {
				false: "transition-opacity hover:opacity-70",
				true: "font-medium",
			},
			type: {
				boxed: "rounded-md border border-current/20 px-2.5 py-1",
				default: "underline-offset-4",
				gradient: "py-1.5",
				pills: "rounded-full bg-current/10 px-3 py-1",
				wrapped: "underline-offset-4",
			},
		},
	});

	const separatorVariants = cva("breadcrumb-separator shrink-0", {
		defaultVariants: { type: "default" },
		variants: {
			type: {
				boxed: "mx-1.5",
				default: "mx-2",
				gradient: "hidden",
				pills: "mx-1",
				wrapped: "mx-2",
			},
		},
	});
</script>

<script lang="ts">
	import { getContext } from "svelte";
	import { breadcrumbContextKey, type BreadcrumbContext } from "./Breadcrumb.js";

	let { children, class: className = "", current = false, href, ...restProps }: BreadcrumbItemProps = $props();

	const breadcrumb = getContext<BreadcrumbContext | undefined>(breadcrumbContextKey);
	const separator = $derived(breadcrumb?.separator ?? "/");
	const type = $derived(breadcrumb?.type ?? "default");
	const itemClasses = $derived(itemVariants({ class: className, current, type }));
	const separatorClasses = $derived(separatorVariants({ type }));
	const linkProps = $derived(restProps as Omit<BreadcrumbLinkItemProps, "children" | "class" | "current" | "href">);
	const currentProps = $derived(restProps as Omit<BreadcrumbCurrentItemProps, "children" | "class" | "current">);
</script>

<li class="breadcrumb-item inline-flex min-w-0 items-center" data-current={current} data-type={type}>
	<span aria-hidden="true" class={separatorClasses}>{separator}</span>

	{#if current}
		<span {...currentProps} aria-current="page" class={[itemClasses, "breadcrumb-content"]}>
			{#if children}
				{@render children()}
			{/if}
		</span>
	{:else}
		<a {...linkProps} {href} class={[itemClasses, "breadcrumb-content hover:underline"]}>
			{#if children}
				{@render children()}
			{/if}
		</a>
	{/if}
</li>

<style>
	.breadcrumb-separator {
		color: color-mix(in srgb, currentColor 70%, white);
	}

	.breadcrumb-item:first-child .breadcrumb-separator {
		display: none;
	}

	.breadcrumb-item[data-type="gradient"] .breadcrumb-content {
		margin-left: -0.5rem;
		padding-right: 1.5rem;
		padding-left: 1.5rem;
		background-color: color-mix(in srgb, currentColor 18%, var(--color-surface));
		clip-path: polygon(0 0, calc(100% - 0.5rem) 0, 100% 50%, calc(100% - 0.5rem) 100%, 0 100%, 0.5rem 50%);
	}

	.breadcrumb-item[data-type="gradient"]:first-child .breadcrumb-content {
		margin-left: 0;
		padding-left: 1rem;
		clip-path: polygon(0 0, calc(100% - 0.5rem) 0, 100% 50%, calc(100% - 0.5rem) 100%, 0 100%);
	}

	.breadcrumb-item[data-type="gradient"][data-current="true"] .breadcrumb-content {
		background-color: transparent;
	}
</style>
