<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Progress from "./Progress.svelte";
	import type { Size, Variant } from "./types.js";

	type ProgressStoryArgs = {
		indeterminate: boolean;
		showValue: boolean;
		size: Size;
		value: number;
		variant: Variant;
	};

	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];

	const { Story } = defineMeta({
		args: {
			indeterminate: false,
			showValue: true,
			size: "md",
			value: 64,
			variant: "primary",
		},
		argTypes: {
			indeterminate: {
				control: "boolean",
				description: "Omits the value to communicate activity without known completion.",
				table: { category: "Behavior", defaultValue: { summary: "false" }, type: { summary: "boolean" } },
			},
			showValue: {
				control: "boolean",
				description: "Displays the formatted determinate value.",
				table: { category: "Content", defaultValue: { summary: "false" }, type: { summary: "boolean" } },
			},
			size: {
				control: "inline-radio",
				description: "Progress track height.",
				options: ["sm", "md", "lg"],
				table: { category: "Appearance", defaultValue: { summary: "'md'" }, type: { summary: "Size" } },
			},
			value: {
				control: { max: 100, min: 0, step: 1, type: "range" },
				description: "Current progress value.",
				table: { category: "Content", defaultValue: { summary: "undefined" }, type: { summary: "number" } },
			},
			variant: {
				control: "select",
				description: "Color treatment for the progress indicator.",
				options: variants,
				table: { category: "Appearance", defaultValue: { summary: "'default'" }, type: { summary: "Variant" } },
			},
		},
		parameters: {
			controls: { include: ["value", "indeterminate", "showValue", "size", "variant"] },
			docs: {
				description: {
					component:
						"An accessible progress indicator with determinate and indeterminate states, optional formatted values, and clamped numeric input.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Progress",
	});
</script>

{#snippet template(args: ProgressStoryArgs)}
	<Progress
		showValue={args.showValue}
		size={args.size}
		value={args.indeterminate ? undefined : args.value}
		variant={args.variant}
	/>
{/snippet}

<Story name="Determinate" />

<Story name="Indeterminate" args={{ indeterminate: true, showValue: false }} />

<Story name="Sizes">
	{#snippet template(args: ProgressStoryArgs)}
		<div class="space-y-4">
			<Progress size="sm" value={args.value} variant={args.variant} />
			<Progress size="md" value={args.value} variant={args.variant} />
			<Progress size="lg" value={args.value} variant={args.variant} />
		</div>
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: ProgressStoryArgs)}
		<div class="space-y-4">
			{#each variants as variant}
				<Progress showValue size={args.size} value={args.value} {variant} />
			{/each}
		</div>
	{/snippet}
</Story>
