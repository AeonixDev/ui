<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Message from "./Message.svelte";
	import type { Variant } from "./types.js";

	type MessageStoryArgs = {
		dismissable: boolean;
		duration?: number;
		variant: Variant;
	};

	const variants: Variant[] = ["default", "primary", "secondary", "error", "info", "success", "warning"];

	const { Story } = defineMeta({
		args: {
			dismissable: true,
			duration: undefined,
			variant: "default",
		},
		argTypes: {
			dismissable: {
				control: "boolean",
				description: "Displays a manual dismissal control.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "false" },
					type: { summary: "boolean" },
				},
			},
			duration: {
				control: { min: 0, step: 500, type: "number" },
				description: "Automatically dismisses the message after this many milliseconds when specified.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "undefined" },
					type: { summary: "number" },
				},
			},
			variant: {
				control: "select",
				description: "Visual and semantic emphasis for the message.",
				options: variants,
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: { include: ["variant", "dismissable", "duration"] },
			docs: {
				description: {
					component:
						"A full-width message region. Error and warning messages default to an alert role; other variants default to status.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Message",
	});
</script>

{#snippet template(args: MessageStoryArgs)}
	<Message dismissable={args.dismissable} duration={args.duration} variant={args.variant}>
		This is a {args.variant} message.
	</Message>
{/snippet}

<Story name="Default" />

<Story name="All variants">
	{#snippet template()}
		<div class="space-y-3">
			{#each variants as variant}
				<Message {variant}>This is a {variant} message.</Message>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="Auto dismiss" args={{ duration: 3000 }} />
