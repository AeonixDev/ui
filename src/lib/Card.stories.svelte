<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Button from "./Button.svelte";
	import Card from "./Card.svelte";
	import Divider from "./Divider.svelte";
	import type { Size, Variant } from "./types.js";

	type CardStoryArgs = { distinguished: boolean; size: Size; variant: Variant };
	const sizes: Size[] = ["sm", "md", "lg"];
	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];

	const { Story } = defineMeta({
		args: { distinguished: false, size: "md", variant: "default" },
		argTypes: {
			distinguished: {
				control: "boolean",
				description: "Separates header and footer into tinted, bordered sections.",
				table: { category: "Appearance", defaultValue: { summary: "false" }, type: { summary: "boolean" } },
			},
			size: {
				control: "inline-radio",
				description: "Card spacing and padding.",
				options: sizes,
				table: { category: "Appearance", defaultValue: { summary: "'md'" }, type: { summary: "Size" } },
			},
			variant: {
				control: "select",
				description: "Card surface and foreground color treatment.",
				options: variants,
				table: { category: "Appearance", defaultValue: { summary: "'default'" }, type: { summary: "Variant" } },
			},
		},
		parameters: {
			controls: { include: ["distinguished", "size", "variant"] },
			docs: {
				description: {
					component:
						"A semantic article container with optional header and footer snippets. Native article attributes are forwarded.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Card",
	});
</script>

{#snippet template(args: CardStoryArgs)}
	<Card class="max-w-md" distinguished={args.distinguished} size={args.size} variant={args.variant}>
		{#snippet header()}
			<h2 class="text-lg font-semibold">Project overview</h2>
			<p class="mt-1 text-sm opacity-75">Production deployment</p>
		{/snippet}

		<p class="text-sm">Review the latest deployment status and environment configuration.</p>

		{#snippet footer()}
			<Button size="sm" variant={args.variant === "default" ? "primary" : "default"}>View project</Button>
		{/snippet}
	</Card>
{/snippet}

<Story name="Default" />

<Story name="Distinguished sections" args={{ distinguished: true }} />

<Story name="Composed sections">
	{#snippet template(args: CardStoryArgs)}
		<Card class="max-w-md" distinguished={args.distinguished} size={args.size} variant={args.variant}>
			{#snippet header()}
				<h2 class="font-semibold">Usage this month</h2>
			{/snippet}

			<Divider variant={args.variant} />
			<p class="text-3xl font-semibold">84%</p>
			<p class="text-sm opacity-75">8,400 of 10,000 requests</p>

			{#snippet footer()}
				<Divider class="mb-4" variant={args.variant} />
				<p class="text-xs opacity-75">Resets in 12 days</p>
			{/snippet}
		</Card>
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template(args: CardStoryArgs)}
		<div class="grid max-w-3xl gap-4 md:grid-cols-3">
			{#each sizes as size}
				<Card distinguished={args.distinguished} {size} variant={args.variant}>
					<strong>{size}</strong>
					<p class="text-sm opacity-75">Card spacing</p>
				</Card>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: CardStoryArgs)}
		<div class="grid max-w-3xl gap-4 md:grid-cols-2">
			{#each variants as variant}
				<Card distinguished={args.distinguished} size={args.size} {variant}>
					<strong class="capitalize">{variant}</strong>
					<p class="text-sm opacity-75">Card surface treatment</p>
				</Card>
			{/each}
		</div>
	{/snippet}
</Story>
