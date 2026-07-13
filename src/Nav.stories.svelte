<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import type { NavMode } from "./Nav.svelte";
	import Nav from "./Nav.svelte";
	import NavGroup from "./NavGroup.svelte";
	import NavItem from "./NavItem.svelte";
	import type { Variant } from "./types.js";

	type NavStoryArgs = {
		mode: NavMode;
		variant: Variant;
	};

	const { Story } = defineMeta({
		args: {
			mode: "horizontal",
			variant: "default",
		},
		argTypes: {
			mode: {
				control: "inline-radio",
				description: "Navigation layout direction.",
				options: ["horizontal", "vertical"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'horizontal'" },
					type: { summary: "'horizontal' | 'vertical'" },
				},
			},
			variant: {
				control: "inline-radio",
				description: "Navigation and link color treatment.",
				options: ["default", "primary", "secondary", "error", "info", "success", "warning"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: { include: ["mode", "variant"] },
			docs: {
				description: {
					component:
						"A semantic navigation wrapper that distributes NavGroup sections. Each group keeps its typed NavItem links, buttons, and dividers compact.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Nav",
	});
</script>

{#snippet template(args: NavStoryArgs)}
	<Nav
		aria-label="Primary navigation"
		class={args.mode === "vertical" ? "min-h-128" : ""}
		mode={args.mode}
		variant={args.variant}
	>
		<NavGroup aria-label="Workspace">
			<NavItem aria-current="page" href="#home" type="link">Home</NavItem>
			<NavItem href="#projects" type="link">Projects</NavItem>
			<NavItem href="#activity" type="link">Activity</NavItem>
		</NavGroup>

		<NavGroup aria-label="Organization">
			<NavItem href="#team" type="link">Team</NavItem>
			<NavItem href="#reports" type="link">Reports</NavItem>
			<NavItem type="divider" />
			<NavItem href="#billing" type="link">Billing</NavItem>
			<NavItem onclick={() => undefined} type="button">Invite</NavItem>
		</NavGroup>

		<NavGroup aria-label="Account">
			<NavItem href="#settings" type="link">Settings</NavItem>
			<NavItem type="divider" />
			<NavItem onclick={() => undefined} type="button">Sign out</NavItem>
			<NavItem disabled onclick={() => undefined} type="button">Locked</NavItem>
		</NavGroup>
	</Nav>
{/snippet}

<Story name="Default horizontal" />

<Story name="Default vertical" args={{ mode: "vertical" }} />

<Story name="Primary horizontal" args={{ variant: "primary" }} />

<Story name="Primary vertical" args={{ mode: "vertical", variant: "primary" }} />

<Story name="Secondary horizontal" args={{ variant: "secondary" }} />

<Story name="Secondary vertical" args={{ mode: "vertical", variant: "secondary" }} />
