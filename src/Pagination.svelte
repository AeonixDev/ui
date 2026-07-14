<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Size, Variant } from "./types.js";

	type PaginationRangeItem = number | "ellipsis";
	export type PaginationType = "default" | "ghost" | "outlined" | "pills" | "square" | "underlined";

	const paginationListVariants = cva("m-0 flex list-none flex-wrap items-center p-0", {
		defaultVariants: { type: "default" },
		variants: {
			type: {
				default: "gap-1",
				ghost: "gap-1",
				outlined: "gap-1",
				pills: "gap-1",
				square: "gap-1",
				underlined: "gap-2",
			},
		},
	});

	const paginationItemVariants = cva(
		"inline-flex items-center justify-center border-0 font-medium no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
		{
			compoundVariants: [
				{ active: true, class: "bg-foreground text-background focus-visible:ring-foreground/40", variant: "default" },
				{ active: true, class: "bg-error text-on-fill focus-visible:ring-error/40", variant: "error" },
				{ active: true, class: "bg-info text-on-fill focus-visible:ring-info/40", variant: "info" },
				{ active: true, class: "bg-primary text-on-fill focus-visible:ring-primary/40", variant: "primary" },
				{
					active: true,
					class: "bg-secondary text-on-fill focus-visible:ring-secondary/40",
					variant: "secondary",
				},
				{ active: true, class: "bg-success text-on-fill focus-visible:ring-success/40", variant: "success" },
				{ active: true, class: "bg-warning text-on-fill focus-visible:ring-warning/40", variant: "warning" },
				{ active: false, class: "bg-transparent!", type: ["ghost", "underlined"] },
				{ active: true, class: "bg-transparent!", type: "underlined", variant: "default" },
				{ active: true, class: "bg-transparent! text-error!", type: "underlined", variant: "error" },
				{ active: true, class: "bg-transparent! text-info!", type: "underlined", variant: "info" },
				{ active: true, class: "bg-transparent! text-primary!", type: "underlined", variant: "primary" },
				{ active: true, class: "bg-transparent! text-secondary!", type: "underlined", variant: "secondary" },
				{ active: true, class: "bg-transparent! text-success!", type: "underlined", variant: "success" },
				{ active: true, class: "bg-transparent! text-warning!", type: "underlined", variant: "warning" },
			],
			defaultVariants: { active: false, size: "md", type: "default", variant: "default" },
			variants: {
				active: {
					false: "bg-foreground/10 hover:bg-foreground/15",
					true: null,
				},
				size: {
					lg: "h-12 min-w-12 px-4 text-base",
					md: "h-10 min-w-10 px-3 text-sm",
					sm: "h-8 min-w-8 px-2 text-xs",
				},
				type: {
					default: "rounded-lg",
					ghost: "rounded-lg",
					outlined: "rounded-lg ring-1 ring-foreground/20 ring-inset",
					pills: "rounded-full",
					square: "rounded-none",
					underlined:
						"rounded-none shadow-none aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-4",
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
		},
	);

	function getPaginationRange(page: number, totalPages: number, siblingCount: number): PaginationRangeItem[] {
		const visiblePages = new Set([1, totalPages]);

		for (let candidate = page - siblingCount; candidate <= page + siblingCount; candidate += 1) {
			if (candidate > 1 && candidate < totalPages) {
				visiblePages.add(candidate);
			}
		}

		const sortedPages = [...visiblePages].sort((left, right) => left - right);
		const items: PaginationRangeItem[] = [];

		for (const currentPage of sortedPages) {
			const previousPage = items.at(-1);
			if (typeof previousPage === "number" && currentPage - previousPage === 2) {
				items.push(previousPage + 1);
			} else if (typeof previousPage === "number" && currentPage - previousPage > 2) {
				items.push("ellipsis");
			}
			items.push(currentPage);
		}

		return items;
	}

	type NativePaginationProps = Omit<HTMLAttributes<HTMLElement>, "aria-label" | "class" | "onchange">;

	export type PaginationProps = NativePaginationProps & {
		class?: string;
		getHref?: (page: number) => string;
		label?: string;
		onchange?: (page: number) => void;
		page?: number;
		showFirstLast?: boolean;
		showPreviousNext?: boolean;
		siblingCount?: number;
		size?: Size;
		totalPages: number;
		type?: PaginationType;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let {
		class: className = "",
		getHref,
		label = "Pagination",
		onchange,
		page = 1,
		showFirstLast = false,
		showPreviousNext = true,
		siblingCount = 1,
		size = "md",
		totalPages,
		type = "default",
		variant = "primary",
		...restProps
	}: PaginationProps = $props();

	const normalizedTotalPages = $derived(Math.max(1, Math.floor(Number.isFinite(totalPages) ? totalPages : 1)));
	const normalizedPage = $derived(
		Math.min(normalizedTotalPages, Math.max(1, Math.floor(Number.isFinite(page) ? page : 1))),
	);
	const normalizedSiblingCount = $derived(Math.max(0, Math.floor(Number.isFinite(siblingCount) ? siblingCount : 1)));
	const range = $derived(getPaginationRange(normalizedPage, normalizedTotalPages, normalizedSiblingCount));
	const inactiveClasses = $derived(paginationItemVariants({ active: false, size, type, variant }));
	const listClasses = $derived(paginationListVariants({ type }));

	function classesFor(targetPage: number): string {
		return paginationItemVariants({ active: targetPage === normalizedPage, size, type, variant });
	}

	function selectPage(targetPage: number): void {
		onchange?.(Math.min(normalizedTotalPages, Math.max(1, targetPage)));
	}
</script>

<nav {...restProps} aria-label={label} class={className}>
	<ul class={listClasses} data-type={type}>
		{#if showFirstLast}
			<li>
				<button class={inactiveClasses} disabled={normalizedPage === 1} onclick={() => selectPage(1)} type="button"
					>First</button
				>
			</li>
		{/if}

		{#if showPreviousNext}
			<li>
				<button
					aria-label="Previous page"
					class={inactiveClasses}
					disabled={normalizedPage === 1}
					onclick={() => selectPage(normalizedPage - 1)}
					type="button"
				>
					Previous
				</button>
			</li>
		{/if}

		{#each range as item}
			<li>
				{#if item === "ellipsis"}
					<span aria-hidden="true" class="inline-flex min-w-6 justify-center opacity-60">…</span>
				{:else if getHref}
					<a
						aria-current={item === normalizedPage ? "page" : undefined}
						aria-label={`Page ${item}`}
						class={classesFor(item)}
						href={getHref(item)}
						onclick={() => selectPage(item)}
					>
						{item}
					</a>
				{:else}
					<button
						aria-current={item === normalizedPage ? "page" : undefined}
						aria-label={`Page ${item}`}
						class={classesFor(item)}
						onclick={() => selectPage(item)}
						type="button"
					>
						{item}
					</button>
				{/if}
			</li>
		{/each}

		{#if showPreviousNext}
			<li>
				<button
					aria-label="Next page"
					class={inactiveClasses}
					disabled={normalizedPage === normalizedTotalPages}
					onclick={() => selectPage(normalizedPage + 1)}
					type="button"
				>
					Next
				</button>
			</li>
		{/if}

		{#if showFirstLast}
			<li>
				<button
					class={inactiveClasses}
					disabled={normalizedPage === normalizedTotalPages}
					onclick={() => selectPage(normalizedTotalPages)}
					type="button"
				>
					Last
				</button>
			</li>
		{/if}
	</ul>
</nav>
