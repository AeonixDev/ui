<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import type { BreadcrumbSeparator, BreadcrumbType, BuiltInBreadcrumbSeparator } from "./Breadcrumb.js";
	import type { Size, Variant } from "./types.js";

	export type { BreadcrumbSeparator, BreadcrumbType, BuiltInBreadcrumbSeparator } from "./Breadcrumb.js";

	const builtInSeparators = {
		arrow: "→",
		backslash: "\\",
		chevron: "›",
		dash: "-",
		dot: "•",
		pipe: "|",
		slash: "/",
	} satisfies Record<BuiltInBreadcrumbSeparator, string>;

	const breadcrumbVariants = cva("box-border max-w-full", {
		defaultVariants: {
			size: "md",
			type: "default",
			variant: "default",
		},
		variants: {
			size: {
				lg: "text-base",
				md: "text-sm",
				sm: "text-xs",
			},
			type: {
				boxed: null,
				default: null,
				gradient: null,
				pills: null,
				wrapped: "rounded-lg border border-current/15 bg-current/5 px-4 py-3 shadow-sm",
			},
			variant: {
				default: "text-foreground",
				error: "text-error",
				info: "text-info",
				primary: "text-primary",
				secondary: "text-secondary",
				success: "text-success",
				warning: "text-warning",
			},
		},
	});

	type NativeBreadcrumbProps = Omit<HTMLAttributes<HTMLElement>, "aria-label" | "class">;

	export type BreadcrumbProps = NativeBreadcrumbProps & {
		children?: Snippet;
		class?: string;
		label?: string;
		separator?: BreadcrumbSeparator;
		size?: Size;
		type?: BreadcrumbType;
		variant?: Variant;
	};
</script>

<script lang="ts">
	import { setContext } from "svelte";
	import { breadcrumbContextKey, type BreadcrumbContext } from "./Breadcrumb.js";

	let {
		children,
		class: className = "",
		label = "Breadcrumb",
		separator = "slash",
		size = "md",
		type = "default",
		variant = "default",
		...restProps
	}: BreadcrumbProps = $props();

	const context: BreadcrumbContext = {
		get separator() {
			return separator in builtInSeparators ? builtInSeparators[separator as BuiltInBreadcrumbSeparator] : separator;
		},
		get type() {
			return type;
		},
	};

	setContext(breadcrumbContextKey, context);

	const classes = $derived(breadcrumbVariants({ class: className, size, type, variant }));
</script>

<nav {...restProps} aria-label={label} class={classes}>
	<ol class="m-0 flex list-none flex-wrap items-center gap-y-1 p-0">
		{#if children}
			{@render children()}
		{/if}
	</ol>
</nav>
