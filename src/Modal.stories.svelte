<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import type { Size, Variant } from "./types.js";

	type ModalStoryArgs = {
		closeOnBackdrop: boolean;
		closeOnEscape: boolean;
		size: Size;
		variant: Variant;
	};
	const variants = ["default", "primary", "secondary", "error", "info", "success", "warning"] satisfies Variant[];

	const { Story } = defineMeta({
		args: {
			closeOnBackdrop: true,
			closeOnEscape: true,
			size: "md",
			variant: "default",
		},
		argTypes: {
			closeOnBackdrop: {
				control: "boolean",
				description: "Closes the modal when the backdrop is selected.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "true" },
					type: { summary: "boolean" },
				},
			},
			closeOnEscape: {
				control: "boolean",
				description: "Allows the native dialog cancel action to close the modal.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "true" },
					type: { summary: "boolean" },
				},
			},
			size: {
				control: "inline-radio",
				description: "Maximum width and section padding.",
				options: ["sm", "md", "lg"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'md'" },
					type: { summary: "'sm' | 'md' | 'lg'" },
				},
			},
			variant: {
				control: "inline-radio",
				description: "Semantic color treatment for the modal surface.",
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
				include: ["variant", "size", "closeOnBackdrop", "closeOnEscape"],
			},
			docs: {
				description: {
					component:
						"A native dialog-based modal with bindable open state, top-layer focus management, accessible labeling, optional section snippets, and configurable Escape and backdrop dismissal.",
				},
			},
		},
		tags: ["autodocs"],
		title: "Components/Modal",
	});
</script>

<script lang="ts">
	import Button from "./Button.svelte";
	import Modal from "./Modal.svelte";

	let allVariantsOpen = $state(false);
	let modalOpen = $state(false);
	let selectedVariant = $state<Variant>("default");

	function openVariant(variant: Variant): void {
		selectedVariant = variant;
		allVariantsOpen = true;
	}
</script>

{#snippet modalTemplate(args: ModalStoryArgs)}
	<Button onclick={() => (modalOpen = true)} variant={args.variant}>Open modal</Button>

	<Modal
		bind:open={modalOpen}
		closeOnBackdrop={args.closeOnBackdrop}
		closeOnEscape={args.closeOnEscape}
		label="Create deployment"
		size={args.size}
		variant={args.variant}
	>
		{#snippet header(close)}
			<div class="flex items-center justify-between gap-4">
				<div>
					<h2 class="m-0 text-lg font-semibold">Create deployment</h2>
					<p class="m-0 mt-1 text-sm opacity-60">Review the target before continuing.</p>
				</div>

				<Button aria-label="Close modal" onclick={() => close()} size="sm">Close</Button>
			</div>
		{/snippet}

		<p class="m-0 text-sm leading-6">
			The latest commit on the main branch will be deployed to the production environment in US East.
		</p>

		{#snippet footer(close)}
			<div class="flex justify-end gap-2">
				<Button onclick={() => close()}>Cancel</Button>
				<Button onclick={() => close("confirmed")} variant="primary">Deploy</Button>
			</div>
		{/snippet}
	</Modal>
{/snippet}

<Story name="Default">
	{#snippet template(args: ModalStoryArgs)}
		{@render modalTemplate(args)}
	{/snippet}
</Story>

<Story name="Small" args={{ size: "sm" }}>
	{#snippet template(args: ModalStoryArgs)}
		{@render modalTemplate(args)}
	{/snippet}
</Story>

<Story name="Large" args={{ size: "lg" }}>
	{#snippet template(args: ModalStoryArgs)}
		{@render modalTemplate(args)}
	{/snippet}
</Story>

<Story name="All variants">
	{#snippet template(args: ModalStoryArgs)}
		<div class="flex flex-wrap gap-2">
			{#each variants as variant}
				<Button onclick={() => openVariant(variant)} {variant}>
					{variant.charAt(0).toUpperCase() + variant.slice(1)}
				</Button>
			{/each}
		</div>

		<Modal
			bind:open={allVariantsOpen}
			closeOnBackdrop={args.closeOnBackdrop}
			closeOnEscape={args.closeOnEscape}
			label={`${selectedVariant} modal example`}
			size={args.size}
			variant={selectedVariant}
		>
			{#snippet header(close)}
				<div class="flex items-center justify-between gap-4">
					<div>
						<h2 class="m-0 text-lg font-semibold">
							{selectedVariant.charAt(0).toUpperCase() + selectedVariant.slice(1)} modal
						</h2>
						<p class="m-0 mt-1 text-sm opacity-60">Semantic variant preview.</p>
					</div>

					<Button aria-label="Close modal" onclick={() => close()} size="sm">Close</Button>
				</div>
			{/snippet}

			<p class="m-0 text-sm leading-6">
				This example uses the {selectedVariant} surface and foreground theme tokens.
			</p>

			{#snippet footer(close)}
				<div class="flex justify-end gap-2">
					<Button onclick={() => close()}>Cancel</Button>
					<Button onclick={() => close("confirmed")} variant="primary">Continue</Button>
				</div>
			{/snippet}
		</Modal>
	{/snippet}
</Story>

<Story name="Error" args={{ variant: "error" }}>
	{#snippet template(args: ModalStoryArgs)}
		{@render modalTemplate(args)}
	{/snippet}
</Story>

<Story name="Explicit dismissal" args={{ closeOnBackdrop: false, closeOnEscape: false }}>
	{#snippet template(args: ModalStoryArgs)}
		{@render modalTemplate(args)}
	{/snippet}
</Story>
