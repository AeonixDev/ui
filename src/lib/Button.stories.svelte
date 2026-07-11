<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Button from "./Button.svelte";
	import type { Size, Variant } from "./types.js";

	type ButtonType = "button" | "submit" | "reset";

	type ButtonStoryArgs = {
		variant: Variant;
		size: Size;
		type: ButtonType;
		disabled: boolean;
	};

	const { Story } = defineMeta({
		args: {
			disabled: false,
			size: "md",
			type: "button",
			variant: "default",
		},
		argTypes: {
			disabled: {
				control: "boolean",
				description: "Prevents interaction and applies the disabled visual state.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "false" },
					type: { summary: "boolean" },
				},
			},
			size: {
				control: "inline-radio",
				description: "Button height, horizontal padding, and text size.",
				options: ["sm", "md", "lg"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'md'" },
					type: { summary: "'sm' | 'md' | 'lg'" },
				},
			},
			type: {
				control: "inline-radio",
				description: "Native button type attribute.",
				options: ["button", "submit", "reset"],
				table: {
					category: "Behavior",
					defaultValue: { summary: "'button'" },
					type: { summary: "'button' | 'submit' | 'reset'" },
				},
			},
			variant: {
				control: "inline-radio",
				description: "Visual emphasis for the button.",
				options: ["default", "primary", "secondary", "error", "info", "success", "warning"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: {
				include: ["variant", "size", "type", "disabled"],
			},
			docs: {
				description: {
					component:
						"A borderless button component. Use child content for the label and control visual treatment with shared Variant and Size values.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Button",
	});
</script>

{#snippet template(args: ButtonStoryArgs)}
	<Button variant={args.variant} size={args.size} type={args.type} disabled={args.disabled}>Button</Button>
{/snippet}

<Story name="Default">
	{#snippet template(args: ButtonStoryArgs)}
		<Button variant={args.variant} size={args.size} type={args.type} disabled={args.disabled}>Default button</Button>
	{/snippet}
</Story>

<Story name="Primary" args={{ variant: "primary" }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button variant={args.variant} size={args.size} type={args.type} disabled={args.disabled}>Primary button</Button>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: "secondary" }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button variant={args.variant} size={args.size} type={args.type} disabled={args.disabled}>Secondary button</Button>
	{/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true }}>
	{#snippet template(args: ButtonStoryArgs)}
		<Button variant={args.variant} size={args.size} type={args.type} disabled={args.disabled}>Disabled button</Button>
	{/snippet}
</Story>
