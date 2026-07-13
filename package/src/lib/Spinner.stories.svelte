<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Spinner from "./Spinner.svelte";
	import type { SpinnerType } from "./Spinner.svelte";
	import type { Size, Variant } from "./types.js";

	type SpinnerStoryArgs = {
		size: Size;
		type: SpinnerType;
		variant: Variant;
	};

	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];

	const { Story } = defineMeta({
		args: {
			size: "md",
			type: "circular",
			variant: "default",
		},
		argTypes: {
			size: {
				control: "inline-radio",
				description: "Indicator dimensions.",
				options: ["sm", "md", "lg"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'md'" },
					type: { summary: "Size" },
				},
			},
			type: {
				control: "inline-radio",
				description: "Motion pattern used by the loading indicator.",
				options: [
					"circular",
					"marching-dots",
					"pulse",
					"bars",
					"orbit",
					"chase",
					"dual-ring",
					"ripple",
					"square",
					"hourglass",
					"pinwheel",
					"radar",
					"wave",
				],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'circular'" },
					type: { summary: "SpinnerType" },
				},
			},
			variant: {
				control: "select",
				description: "Color treatment for the indicator.",
				options: variants,
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: { include: ["size", "type", "variant"] },
			docs: {
				description: {
					component:
						"An accessible inline loading indicator. The label is announced by assistive technology and native span attributes are forwarded.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Spinner",
	});
</script>

{#snippet template(args: SpinnerStoryArgs)}
	<Spinner size={args.size} type={args.type} variant={args.variant} />
{/snippet}

<Story name="Default" />

<Story name="Sizes">
	{#snippet template(args: SpinnerStoryArgs)}
		<div class="flex items-center gap-4">
			<Spinner size="sm" type={args.type} variant={args.variant} />
			<Spinner size="md" type={args.type} variant={args.variant} />
			<Spinner size="lg" type={args.type} variant={args.variant} />
		</div>
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: SpinnerStoryArgs)}
		<div class="flex items-center gap-4">
			{#each variants as variant}
				<Spinner size={args.size} type={args.type} {variant} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Types">
	{#snippet template(args: SpinnerStoryArgs)}
		<div class="flex items-center gap-6">
			<Spinner size={args.size} type="circular" variant={args.variant} />
			<Spinner size={args.size} type="marching-dots" variant={args.variant} />
			<Spinner size={args.size} type="pulse" variant={args.variant} />
			<Spinner size={args.size} type="bars" variant={args.variant} />
			<Spinner size={args.size} type="orbit" variant={args.variant} />
			<Spinner size={args.size} type="chase" variant={args.variant} />
			<Spinner size={args.size} type="dual-ring" variant={args.variant} />
			<Spinner size={args.size} type="ripple" variant={args.variant} />
			<Spinner size={args.size} type="square" variant={args.variant} />
			<Spinner size={args.size} type="hourglass" variant={args.variant} />
			<Spinner size={args.size} type="pinwheel" variant={args.variant} />
			<Spinner size={args.size} type="radar" variant={args.variant} />
			<Spinner size={args.size} type="wave" variant={args.variant} />
		</div>
	{/snippet}
</Story>
