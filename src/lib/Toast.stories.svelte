<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";

	type ToastStoryArgs = {
		duration: number;
		maxToasts: number;
	};

	const { Story } = defineMeta({
		args: {
			duration: 5000,
			maxToasts: 2,
		},
		argTypes: {
			duration: {
				control: { min: 0, step: 500, type: "number" },
				description: "Default auto-dismiss duration in milliseconds. Use 0 to disable auto-dismissal.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "5000" },
					type: { summary: "number" },
				},
			},
			maxToasts: {
				control: { min: 0, step: 1, type: "number" },
				description: "Maximum visible notifications in each positioned region.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "3" },
					type: { summary: "number" },
				},
			},
		},
		parameters: {
			docs: {
				description: {
					component:
						"ToastContainer registers its notification queue when initialized, groups toasts into six viewport regions, and limits each region independently. Import addToast and removeToast from @aeonixdev/ui/toast to manage notifications anywhere in the client application.",
				},
			},
		},
		tags: ["autodocs"],
		title: "Components/Toast",
	});
</script>

<script lang="ts">
	import { addToast } from "./Toast.js";
	import ToastContainer, { type ToastPosition } from "./ToastContainer.svelte";

	const positions: ToastPosition[] = [
		"top-left",
		"top-center",
		"top-right",
		"bottom-left",
		"bottom-center",
		"bottom-right",
	];

	function showAllPositions(): void {
		for (const position of positions) {
			for (let index = 1; index <= 3; index += 1) {
				addToast({
					duration: index === 3 ? 10000 : undefined,
					message: `Notification ${index} rendered in this region.`,
					position,
					title: position
						.split("-")
						.map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
						.join(" "),
					variant: position.startsWith("top") ? "primary" : "secondary",
				});
			}
		}
	}
</script>

<Story name="All positions">
	{#snippet template(args: ToastStoryArgs)}
		<div style="min-height: 48rem">
			<p class="mx-auto max-w-md text-center text-sm text-foreground/70">
				One context-backed ToastContainer groups notifications without overlapping adjacent regions.
			</p>

			<button
				class="mx-auto mt-4 block rounded-lg bg-primary px-4 py-2 text-primary-foreground"
				onclick={showAllPositions}
				type="button"
			>
				Show notifications
			</button>

			<ToastContainer duration={args.duration} maxToasts={args.maxToasts} />
		</div>
	{/snippet}
</Story>
