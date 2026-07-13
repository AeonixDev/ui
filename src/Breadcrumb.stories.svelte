<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Breadcrumb from "./Breadcrumb.svelte";
	import type { BreadcrumbType } from "./Breadcrumb.svelte";
	import BreadcrumbItem from "./BreadcrumbItem.svelte";
	import type { Size, Variant } from "./types.js";

	type BreadcrumbStoryArgs = {
		separator: string;
		size: Size;
		type: BreadcrumbType;
		variant: Variant;
	};

	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];
	const breadcrumbTypes: BreadcrumbType[] = ["default", "pills", "boxed", "gradient", "wrapped"];

	const { Story } = defineMeta({
		args: {
			separator: "slash",
			size: "md",
			type: "default",
			variant: "default",
		},
		argTypes: {
			separator: {
				control: "text",
				description:
					"Built-in separator name (slash, backslash, chevron, arrow, dot, dash, pipe) or any custom string.",
				table: {
					category: "Content",
					defaultValue: { summary: "'slash'" },
					type: { summary: "string" },
				},
			},
			size: {
				control: "inline-radio",
				description: "Breadcrumb text size.",
				options: ["sm", "md", "lg"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'md'" },
					type: { summary: "Size" },
				},
			},
			type: {
				control: "inline-radio",
				description: "Visual format used for breadcrumb items and separators.",
				options: breadcrumbTypes,
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "BreadcrumbType" },
				},
			},
			variant: {
				control: "select",
				description: "Color treatment inherited by links, separators, and the current item.",
				options: variants,
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: { include: ["separator", "size", "type", "variant"] },
			docs: {
				description: {
					component:
						"A semantic breadcrumb navigation composed from typed link and current-page items with a configurable separator.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Breadcrumb",
	});
</script>

{#snippet template(args: BreadcrumbStoryArgs)}
	<Breadcrumb separator={args.separator} size={args.size} type={args.type} variant={args.variant}>
		<BreadcrumbItem href="#home">Home</BreadcrumbItem>
		<BreadcrumbItem href="#projects">Projects</BreadcrumbItem>
		<BreadcrumbItem current>Website redesign</BreadcrumbItem>
	</Breadcrumb>
{/snippet}

<Story name="Default" />

<Story name="Custom separator" args={{ separator: ">" }} />

<Story name="Built-in separators">
	{#snippet template(args: BreadcrumbStoryArgs)}
		<div class="space-y-4">
			{#each ["slash", "backslash", "chevron", "arrow", "dot", "dash", "pipe"] as separator}
				<Breadcrumb {separator} size={args.size} type={args.type} variant={args.variant}>
					<BreadcrumbItem href="#projects">Projects</BreadcrumbItem>
					<BreadcrumbItem current>{separator}</BreadcrumbItem>
				</Breadcrumb>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Types">
	{#snippet template(args: BreadcrumbStoryArgs)}
		<div class="space-y-4">
			{#each breadcrumbTypes as type}
				<Breadcrumb separator={args.separator} size={args.size} {type} variant={args.variant}>
					<BreadcrumbItem href="#projects">Projects</BreadcrumbItem>
					<BreadcrumbItem current>{type}</BreadcrumbItem>
				</Breadcrumb>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: BreadcrumbStoryArgs)}
		<div class="space-y-4">
			{#each variants as variant}
				<Breadcrumb separator={args.separator} size={args.size} type={args.type} {variant}>
					<BreadcrumbItem href={`#${variant}`}>Projects</BreadcrumbItem>
					<BreadcrumbItem current>{variant}</BreadcrumbItem>
				</Breadcrumb>
			{/each}
		</div>
	{/snippet}
</Story>
