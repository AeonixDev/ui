<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Button from "./Button.svelte";
	import type { Size, Variant } from "./types.js";

	type ButtonType = "button" | "submit" | "reset";

	type ButtonStoryArgs = {
		as: "a" | "button";
		disabled: boolean;
		href: string;
		size: Size;
		type: ButtonType;
		variant: Variant;
	};

	const { Story } = defineMeta({
		args: {
			as: "button",
			disabled: false,
			href: "#button-destination",
			size: "md",
			type: "button",
			variant: "default",
		},
		argTypes: {
			as: {
				control: "inline-radio",
				description: "Native element to render. Anchor mode requires href; button mode is the default.",
				options: ["button", "a"],
				table: {
					category: "Behavior",
					defaultValue: { summary: "'button'" },
					type: { summary: "'button' | 'a'" },
				},
			},
			disabled: {
				control: "boolean",
				description: "Prevents interaction and applies the disabled visual state.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "false" },
					type: { summary: "boolean" },
				},
			},
			href: {
				control: "text",
				description: "Required destination when as is 'a'; unavailable in button mode.",
				table: {
					category: "Behavior",
					type: { summary: "string" },
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
				include: ["as", "variant", "size", "type", "href", "disabled"],
			},
			docs: {
				description: {
					component:
						"A borderless action component that renders a native button by default or a native anchor with as='a'. Its discriminated props expose only the native attributes applicable to the selected element.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Button",
	});
</script>

{#snippet template(args: ButtonStoryArgs)}
	{#if args.as === "a"}
		<Button as="a" disabled={args.disabled} href={args.href} size={args.size} variant={args.variant}>
			Button link
		</Button>
	{:else}
		<Button disabled={args.disabled} size={args.size} type={args.type} variant={args.variant}>Button</Button>
	{/if}
{/snippet}

<Story name="Default" />

<Story name="Primary" args={{ variant: "primary" }} />

<Story name="Secondary" args={{ variant: "secondary" }} />

<Story name="Link" args={{ as: "a", variant: "primary" }} />

<Story name="Disabled" args={{ disabled: true }} />
