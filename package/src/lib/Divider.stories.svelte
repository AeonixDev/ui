<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Divider from "./Divider.svelte";
	import type { DividerOrientation } from "./Divider.svelte";
	import type { Variant } from "./types.js";

	type DividerStoryArgs = {
		orientation: DividerOrientation;
		variant: Variant;
	};

	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];

	const { Story } = defineMeta({
		args: {
			orientation: "horizontal",
			variant: "default",
		},
		argTypes: {
			orientation: {
				control: "inline-radio",
				description: "Direction in which the divider separates content.",
				options: ["horizontal", "vertical"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'horizontal'" },
					type: { summary: "DividerOrientation" },
				},
			},
			variant: {
				control: "select",
				description: "Color treatment for the dividing line.",
				options: variants,
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: { include: ["orientation", "variant"] },
			docs: {
				description: {
					component:
						"A semantic separator for horizontal or vertical content. Native hr attributes are forwarded to the element.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Divider",
	});
</script>

{#snippet template(args: DividerStoryArgs)}
	{#if args.orientation === "vertical"}
		<div class="flex h-24 items-center gap-4">
			<span>Before</span>
			<Divider orientation="vertical" variant={args.variant} />
			<span>After</span>
		</div>
	{:else}
		<div class="space-y-4">
			<p>Before</p>
			<Divider variant={args.variant} />
			<p>After</p>
		</div>
	{/if}
{/snippet}

<Story name="Horizontal" />

<Story name="Vertical" args={{ orientation: "vertical" }} />

<Story name="All variants">
	{#snippet template()}
		<div class="space-y-4">
			{#each variants as variant}
				<div class="space-y-2">
					<span class="text-sm capitalize">{variant}</span>
					<Divider {variant} />
				</div>
			{/each}
		</div>
	{/snippet}
</Story>
