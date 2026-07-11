<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Button from "./Button.svelte";
	import Tooltip from "./Tooltip.svelte";
	import type { TooltipPosition } from "./Tooltip.svelte";
	import type { Size, Variant } from "./types.js";

	type TooltipStoryArgs = {
		delay: number;
		position: TooltipPosition;
		size: Size;
		variant: Variant;
	};

	const positions: TooltipPosition[] = ["top", "right", "bottom", "left"];
	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];

	const { Story } = defineMeta({
		args: { delay: 300, position: "top", size: "md", variant: "default" },
		argTypes: {
			delay: {
				control: { min: 0, step: 100, type: "number" },
				description: "Delay before the tooltip becomes visible, in milliseconds.",
				table: { category: "Behavior", defaultValue: { summary: "300" }, type: { summary: "number" } },
			},
			position: {
				control: "inline-radio",
				description: "Placement relative to the trigger.",
				options: positions,
				table: { category: "Appearance", defaultValue: { summary: "'top'" }, type: { summary: "TooltipPosition" } },
			},
			size: {
				control: "inline-radio",
				description: "Tooltip padding and text size.",
				options: ["sm", "md", "lg"],
				table: { category: "Appearance", defaultValue: { summary: "'md'" }, type: { summary: "Size" } },
			},
			variant: {
				control: "select",
				description: "Tooltip surface and foreground colors.",
				options: variants,
				table: { category: "Appearance", defaultValue: { summary: "'default'" }, type: { summary: "Variant" } },
			},
		},
		parameters: {
			controls: { include: ["delay", "position", "size", "variant"] },
			docs: {
				description: {
					component:
						"An accessible tooltip with explicit trigger props, hover and focus behavior, Escape dismissal, animated arrows, and collision-aware viewport placement.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Tooltip",
	});
</script>

{#snippet template(args: TooltipStoryArgs)}
	<div class="flex min-h-32 items-center justify-center">
		<Tooltip
			content="View project details"
			delay={args.delay}
			position={args.position}
			size={args.size}
			variant={args.variant}
		>
			{#snippet children(triggerProps)}
				<Button {...triggerProps}>Hover or focus</Button>
			{/snippet}
		</Tooltip>
	</div>
{/snippet}

<Story name="Default" />

<Story name="Positions">
	{#snippet template(args: TooltipStoryArgs)}
		<div class="grid min-h-72 grid-cols-2 place-items-center gap-16">
			{#each positions as position}
				<Tooltip content={`${position} tooltip`} delay={0} {position} size={args.size} variant={args.variant}>
					{#snippet children(triggerProps)}
						<Button {...triggerProps} size="sm">{position}</Button>
					{/snippet}
				</Tooltip>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: TooltipStoryArgs)}
		<div class="flex min-h-32 flex-wrap items-center justify-center gap-4">
			{#each variants as variant}
				<Tooltip content={`${variant} tooltip`} delay={0} position={args.position} size={args.size} {variant}>
					{#snippet children(triggerProps)}
						<Button {...triggerProps} size="sm" {variant}>{variant}</Button>
					{/snippet}
				</Tooltip>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Viewport collision">
	{#snippet template(args: TooltipStoryArgs)}
		<div class="min-h-64">
			<Tooltip
				class="fixed top-2 left-2"
				content="Flips below the trigger"
				delay={0}
				position="top"
				size={args.size}
				variant={args.variant}
			>
				{#snippet children(triggerProps)}
					<Button {...triggerProps} size="sm">Top edge</Button>
				{/snippet}
			</Tooltip>

			<Tooltip
				class="fixed right-2 bottom-2"
				content="Flips above and clamps horizontally"
				delay={0}
				position="bottom"
				size={args.size}
				variant={args.variant}
			>
				{#snippet children(triggerProps)}
					<Button {...triggerProps} size="sm">Bottom edge</Button>
				{/snippet}
			</Tooltip>
		</div>
	{/snippet}
</Story>
