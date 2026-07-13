<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Badge from "./Badge.svelte";
	import Table from "./Table.svelte";
	import type { Variant } from "./types.js";

	type TableStoryArgs = {
		hoverable: boolean;
		showCaption: boolean;
		striped: boolean;
		variant: Variant;
	};

	const projectRows = [
		{ environment: "Production", project: "Website", status: "Healthy", updated: "2 minutes ago" },
		{ environment: "Staging", project: "Dashboard", status: "Review", updated: "18 minutes ago" },
		{ environment: "Development", project: "API", status: "Building", updated: "1 hour ago" },
	];

	const typedRows = [
		{ active: true, deployments: 1284, launchedAt: new Date("2025-03-12"), project: "Website" },
		{ active: false, deployments: 342, launchedAt: new Date("2026-01-08"), project: "Dashboard" },
		{ active: true, deployments: 57, launchedAt: new Date("2026-06-21"), project: "API" },
	];

	const performanceRows = Array.from({ length: 1000 }, (_, index) => ({
		id: index + 1,
		requests: 10000 + ((index * 7919) % 90000),
		service: `Service ${String(index + 1).padStart(4, "0")}`,
		status: (["Healthy", "Degraded", "Offline"] as const)[index % 3],
		updatedAt: new Date(2026, index % 12, (index % 28) + 1),
	}));

	const { Story } = defineMeta({
		args: {
			hoverable: true,
			showCaption: true,
			striped: false,
			variant: "default",
		},
		argTypes: {
			hoverable: {
				control: "boolean",
				description: "Applies a variant-aware background when a body row is hovered.",
				table: {
					category: "Behavior",
					defaultValue: { summary: "true" },
					type: { summary: "boolean" },
				},
			},
			showCaption: {
				control: "boolean",
				description: "Shows the accessible table caption used by this example.",
				table: {
					category: "Example",
					defaultValue: { summary: "true" },
					type: { summary: "boolean" },
				},
			},
			striped: {
				control: "boolean",
				description: "Alternates body row backgrounds using the selected variant.",
				table: {
					category: "Appearance",
					defaultValue: { summary: "false" },
					type: { summary: "boolean" },
				},
			},
			variant: {
				control: "inline-radio",
				description: "Table, row, border, hover, and stripe color treatment.",
				options: ["default", "primary", "secondary", "error", "info", "success", "warning"],
				table: {
					category: "Appearance",
					defaultValue: { summary: "'default'" },
					type: { summary: "Variant" },
				},
			},
		},
		parameters: {
			controls: { include: ["variant", "striped", "hoverable", "showCaption"] },
			docs: {
				description: {
					component:
						"A responsive native table wrapper with styled captions, headers, rows, and cells. Native table attributes are forwarded to the table element.",
				},
			},
		},
		render: template,
		tags: ["autodocs"],
		title: "Components/Table",
	});
</script>

{#snippet template(args: TableStoryArgs)}
	<Table hoverable={args.hoverable} striped={args.striped} variant={args.variant}>
		{#if args.showCaption}
			<caption>Project environments</caption>
		{/if}

		<thead>
			<tr>
				<th scope="col">Project</th>
				<th scope="col">Environment</th>
				<th scope="col">Status</th>
				<th scope="col">Updated</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Website</td>
				<td>Production</td>
				<td><span class="font-medium">Healthy</span></td>
				<td>2 minutes ago</td>
			</tr>
			<tr>
				<td>Dashboard</td>
				<td>Staging</td>
				<td><span class="font-medium">Review</span></td>
				<td>18 minutes ago</td>
			</tr>
			<tr>
				<td>API</td>
				<td>Development</td>
				<td><span class="font-medium">Building</span></td>
				<td>1 hour ago</td>
			</tr>
		</tbody>
	</Table>
{/snippet}

<Story name="Default" />

<Story name="Striped" args={{ striped: true }} />

<Story name="Primary" args={{ variant: "primary" }} />

<Story name="Primary striped" args={{ striped: true, variant: "primary" }} />

<Story name="Secondary" args={{ variant: "secondary" }} />

<Story name="Secondary striped" args={{ striped: true, variant: "secondary" }} />

<Story name="Rows prop">
	{#snippet template(args: TableStoryArgs)}
		<Table hoverable={args.hoverable} rows={projectRows} striped={args.striped} variant={args.variant} />
	{/snippet}
</Story>

<Story name="Rows with child template">
	{#snippet template(args: TableStoryArgs)}
		<Table hoverable={args.hoverable} rows={projectRows} striped={args.striped} variant={args.variant}>
			{#snippet children(row, key)}
				{#if key === "status"}
					<Badge
						size="sm"
						variant={row[key] === "Building" ? "primary" : row[key] === "Review" ? "secondary" : "default"}
					>
						{row[key]}
					</Badge>
				{:else}
					{row[key]}
				{/if}
			{/snippet}
		</Table>
	{/snippet}
</Story>

<Story name="Typed rows with custom header labels">
	{#snippet template(args: TableStoryArgs)}
		<Table
			hoverable={args.hoverable}
			rowOptions={{
				active: { label: "Enabled", type: "boolean" },
				deployments: { label: "Total deployments", type: "number" },
				launchedAt: { label: "Launch date", type: "date" },
				project: { type: "string" },
			}}
			rows={typedRows}
			striped={args.striped}
			variant={args.variant}
		/>
	{/snippet}
</Story>

<Story name="Large data set with child rendering">
	{#snippet template(args: TableStoryArgs)}
		<Table
			hoverable={args.hoverable}
			rowOptions={{
				id: { label: "ID" },
				requests: { label: "Requests" },
				service: { label: "Service" },
				status: { label: "Health" },
				updatedAt: { label: "Last updated" },
			}}
			rows={performanceRows}
			striped={true}
			variant={args.variant}
		>
			{#snippet children(row, key)}
				{#if key === "status"}
					<Badge
						size="sm"
						variant={row[key] === "Healthy" ? "default" : row[key] === "Degraded" ? "secondary" : "primary"}
					>
						{row[key]}
					</Badge>
				{:else if key === "requests"}
					{row[key].toLocaleString()}
				{:else if key === "updatedAt"}
					{row[key].toLocaleDateString()}
				{:else if key === "id"}
					<code>{row[key]}</code>
				{:else}
					{row[key]}
				{/if}
			{/snippet}
		</Table>
	{/snippet}
</Story>
