<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Avatar from "./Avatar.svelte";
	import type { AvatarStatus } from "./Avatar.svelte";
	import type { Size, Variant } from "./types.js";

	type AvatarStoryArgs = {
		size: Size;
		status: AvatarStatus;
		variant: Variant;
	};

	const { Story } = defineMeta({
		args: {
			size: "md",
			status: "online",
			variant: "default",
		},
		argTypes: {
			size: {
				control: "inline-radio",
				description: "Avatar dimensions and fallback text size.",
				options: ["sm", "md", "lg"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'md'" },
					type: { summary: "'sm' | 'md' | 'lg'" },
				},
			},
			status: {
				control: "select",
				description: "Optional presence indicator displayed at the lower-right edge.",
				options: ["unknown", "online", "offline", "away", "do not disturb"],
				table: {
					category: "Content",
					defaultValue: { summary: "undefined" },
					type: { summary: "AvatarStatus" },
				},
			},
			variant: {
				control: "inline-radio",
				description: "Color treatment used by fallback content.",
				options: ["default", "primary", "secondary", "error", "info", "success", "warning"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: { include: ["size", "status", "variant"] },
			docs: {
				description: {
					component:
						"A circular image with child content as its loading and error fallback. Native span attributes are forwarded to the wrapper.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Avatar",
	});
</script>

{#snippet template(args: AvatarStoryArgs)}
	<Avatar
		alt="Portrait of a team member"
		size={args.size}
		src="https://i.pravatar.cc/192?img=12"
		status={args.status}
		variant={args.variant}
	>
		AD
	</Avatar>
{/snippet}

<Story name="Image" />

<Story name="Fallback">
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar size={args.size} status={args.status} variant={args.variant}>AD</Avatar>
	{/snippet}
</Story>

<Story name="Loading">
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar
			aria-busy="true"
			aria-label="Avatar loading"
			size={args.size}
			src="https://deelay.me/10000/https://i.pravatar.cc/192?img=12"
			status={args.status}
			variant={args.variant}
		>
			<span class="size-3/5 animate-pulse rounded-full bg-current/20"></span>
		</Avatar>
	{/snippet}
</Story>

<Story name="Image error">
	{#snippet template(args: AvatarStoryArgs)}
		<Avatar
			alt="Portrait of a team member"
			size={args.size}
			src="/missing-avatar.png"
			status={args.status}
			variant={args.variant}
		>
			AD
		</Avatar>
	{/snippet}
</Story>

<Story name="Statuses">
	{#snippet template(args: AvatarStoryArgs)}
		<div class="flex items-center gap-3">
			<Avatar size={args.size} status="unknown">UN</Avatar>
			<Avatar size={args.size} status="online">ON</Avatar>
			<Avatar size={args.size} status="offline">OF</Avatar>
			<Avatar size={args.size} status="away">AW</Avatar>
			<Avatar size={args.size} status="do not disturb">DN</Avatar>
		</div>
	{/snippet}
</Story>

<Story name="Group">
	{#snippet template(args: AvatarStoryArgs)}
		<div class="flex -space-x-2">
			<Avatar class="ring-2 ring-background" size={args.size} variant="primary">AM</Avatar>
			<Avatar class="ring-2 ring-background" size={args.size} variant="secondary">JR</Avatar>
			<Avatar class="ring-2 ring-background" size={args.size}>+3</Avatar>
		</div>
	{/snippet}
</Story>

<Story name="Variants">
	{#snippet template(args: AvatarStoryArgs)}
		<div class="flex items-center gap-3">
			<Avatar size={args.size} variant="default">DF</Avatar>
			<Avatar size={args.size} variant="primary">PR</Avatar>
			<Avatar size={args.size} variant="secondary">SC</Avatar>
			<Avatar size={args.size} variant="error">ER</Avatar>
			<Avatar size={args.size} variant="info">IN</Avatar>
			<Avatar size={args.size} variant="success">SU</Avatar>
			<Avatar size={args.size} variant="warning">WA</Avatar>
		</div>
	{/snippet}
</Story>
