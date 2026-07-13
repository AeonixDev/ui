<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Pagination from "./Pagination.svelte";
	import type { PaginationType } from "./Pagination.svelte";
	import type { Size, Variant } from "./types.js";

	type PaginationStoryArgs = {
		page: number;
		showFirstLast: boolean;
		siblingCount: number;
		size: Size;
		totalPages: number;
		type: PaginationType;
		variant: Variant;
	};

	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];
	const types: PaginationType[] = ["default", "ghost", "outlined", "pills", "square", "underlined"];

	const { Story } = defineMeta({
		args: {
			page: 6,
			showFirstLast: false,
			siblingCount: 1,
			size: "md",
			totalPages: 20,
			type: "default",
			variant: "primary",
		},
		argTypes: {
			page: {
				control: { min: 1, step: 1, type: "number" },
				description: "Current page, clamped to the available range.",
				table: { category: "Content", defaultValue: { summary: "1" }, type: { summary: "number" } },
			},
			showFirstLast: {
				control: "boolean",
				description: "Displays direct First and Last controls.",
				table: { category: "Behavior", defaultValue: { summary: "false" }, type: { summary: "boolean" } },
			},
			siblingCount: {
				control: { min: 0, step: 1, type: "number" },
				description: "Number of pages shown on either side of the current page.",
				table: { category: "Behavior", defaultValue: { summary: "1" }, type: { summary: "number" } },
			},
			size: {
				control: "inline-radio",
				description: "Pagination control dimensions.",
				options: ["sm", "md", "lg"],
				table: { category: "Appearance", defaultValue: { summary: "'md'" }, type: { summary: "Size" } },
			},
			totalPages: {
				control: { min: 1, step: 1, type: "number" },
				description: "Total number of pages.",
				table: { category: "Content", type: { summary: "number" } },
			},
			type: {
				control: "select",
				description: "Visual format for spacing, shape, borders, and grouping.",
				options: types,
				table: { category: "Appearance", defaultValue: { summary: "'default'" }, type: { summary: "PaginationType" } },
			},
			variant: {
				control: "select",
				description: "Color treatment for the active page.",
				options: variants,
				table: { category: "Appearance", defaultValue: { summary: "'primary'" }, type: { summary: "Variant" } },
			},
		},
		parameters: {
			controls: { include: ["page", "totalPages", "siblingCount", "showFirstLast", "size", "type", "variant"] },
			docs: {
				description: {
					component:
						"Accessible page navigation with clamped ranges, sibling ellipses, optional boundary controls, and button or generated-link modes.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Pagination",
	});
</script>

{#snippet template(args: PaginationStoryArgs)}
	<Pagination
		page={args.page}
		showFirstLast={args.showFirstLast}
		siblingCount={args.siblingCount}
		size={args.size}
		totalPages={args.totalPages}
		type={args.type}
		variant={args.variant}
	/>
{/snippet}

<Story name="Default" />

<Story name="With boundaries" args={{ showFirstLast: true }} />

<Story name="Links">
	{#snippet template(args: PaginationStoryArgs)}
		<Pagination
			getHref={(page) => `?page=${page}`}
			page={args.page}
			siblingCount={args.siblingCount}
			size={args.size}
			totalPages={args.totalPages}
			type={args.type}
			variant={args.variant}
		/>
	{/snippet}
</Story>

<Story name="Types">
	{#snippet template(args: PaginationStoryArgs)}
		<div class="space-y-4">
			{#each types as type}
				<Pagination page={args.page} size="sm" totalPages={args.totalPages} {type} variant={args.variant} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: PaginationStoryArgs)}
		<div class="space-y-4">
			{#each variants as variant}
				<Pagination page={args.page} size="sm" totalPages={args.totalPages} type={args.type} {variant} />
			{/each}
		</div>
	{/snippet}
</Story>
