<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import type { SkeletonType } from "./Skeleton.svelte";
	import Skeleton from "./Skeleton.svelte";
	import type { Variant } from "./types.js";

	type SkeletonStoryArgs = {
		animated: boolean;
		type: SkeletonType;
		variant: Variant;
	};

	const types: SkeletonType[] = ["avatar", "button", "card", "rectangle", "text", "title"];
	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];

	const { Story } = defineMeta({
		args: {
			animated: true,
			type: "rectangle",
			variant: "default",
		},
		argTypes: {
			animated: {
				control: "boolean",
				description: "Applies reduced-motion-aware pulse and shimmer animations.",
				table: { category: "Behavior", defaultValue: { summary: "true" }, type: { summary: "boolean" } },
			},
			type: {
				control: "select",
				description: "Built-in placeholder dimensions and shape.",
				options: types,
				table: { category: "Appearance", defaultValue: { summary: "'rectangle'" }, type: { summary: "SkeletonType" } },
			},
			variant: {
				control: "select",
				description: "Tint used by the placeholder surface.",
				options: variants,
				table: { category: "Appearance", defaultValue: { summary: "'default'" }, type: { summary: "Variant" } },
			},
		},
		parameters: {
			controls: { include: ["animated", "type", "variant"] },
			docs: {
				description: {
					component:
						"An aria-hidden visual placeholder with built-in content shapes. Class overrides can customize dimensions for specific layouts.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Skeleton",
	});
</script>

{#snippet template(args: SkeletonStoryArgs)}
	<Skeleton animated={args.animated} type={args.type} variant={args.variant} />
{/snippet}

<Story name="Default" />

<Story name="Profile">
	{#snippet template(args: SkeletonStoryArgs)}
		<div class="flex max-w-sm items-center gap-3">
			<Skeleton animated={args.animated} type="avatar" variant={args.variant} />

			<div class="min-w-0 flex-1 space-y-2">
				<Skeleton animated={args.animated} type="title" variant={args.variant} />
				<Skeleton animated={args.animated} type="text" variant={args.variant} />
			</div>
		</div>
	{/snippet}
</Story>

<Story name="All types">
	{#snippet template(args: SkeletonStoryArgs)}
		<div class="max-w-lg space-y-4">
			{#each types as type}
				<Skeleton animated={args.animated} {type} variant={args.variant} />
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: SkeletonStoryArgs)}
		<div class="max-w-lg space-y-3">
			{#each variants as variant}
				<Skeleton animated={args.animated} type={args.type} {variant} />
			{/each}
		</div>
	{/snippet}
</Story>
