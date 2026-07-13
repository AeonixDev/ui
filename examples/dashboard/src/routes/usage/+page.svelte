<script lang="ts">
	import PageActions from "$lib/PageActions.svelte";
	import Badge from "@aeonixdev/ui/Badge.svelte";
	import Button from "@aeonixdev/ui/Button.svelte";
	import ButtonGroup from "@aeonixdev/ui/ButtonGroup.svelte";
	import Card from "@aeonixdev/ui/Card.svelte";
	import Message from "@aeonixdev/ui/Message.svelte";
	import Progress from "@aeonixdev/ui/Progress.svelte";
	import Table from "@aeonixdev/ui/Table.svelte";
	import { addToast } from "@aeonixdev/ui/toast";

	type Period = "May" | "June" | "July";

	type UsageRow = {
		cost: number;
		resource: string;
		project: string;
		quantity: string;
		trend: "Down" | "Stable" | "Up";
	};

	const periods: Record<Period, { invoiceDate: string; projectedBill: number; rows: UsageRow[] }> = {
		July: {
			invoiceDate: "August 3",
			projectedBill: 6142.2,
			rows: [
				{ cost: 2102.4, project: "Orbit Commerce", quantity: "3,284 hours", resource: "Compute", trend: "Up" },
				{ cost: 1146.2, project: "Orbit Commerce", quantity: "1.8 TB-hours", resource: "Database", trend: "Stable" },
				{ cost: 684.12, project: "Beacon Analytics", quantity: "8.4 TB", resource: "Object storage", trend: "Up" },
				{ cost: 522.36, project: "Relay Messaging", quantity: "12.7 TB", resource: "Data transfer", trend: "Down" },
				{ cost: 366, project: "All projects", quantity: "14,820 min", resource: "Build minutes", trend: "Stable" },
			],
		},
		June: {
			invoiceDate: "July 3",
			projectedBill: 5500,
			rows: [
				{ cost: 2016.8, project: "Orbit Commerce", quantity: "3,151 hours", resource: "Compute", trend: "Up" },
				{ cost: 1108.4, project: "Orbit Commerce", quantity: "1.7 TB-hours", resource: "Database", trend: "Stable" },
				{ cost: 648.72, project: "Beacon Analytics", quantity: "8.0 TB", resource: "Object storage", trend: "Up" },
				{ cost: 505.16, project: "Relay Messaging", quantity: "12.3 TB", resource: "Data transfer", trend: "Down" },
				{ cost: 351, project: "All projects", quantity: "14,040 min", resource: "Build minutes", trend: "Stable" },
			],
		},
		May: {
			invoiceDate: "June 3",
			projectedBill: 5100,
			rows: [
				{ cost: 1884.2, project: "Orbit Commerce", quantity: "2,946 hours", resource: "Compute", trend: "Stable" },
				{ cost: 1042.8, project: "Orbit Commerce", quantity: "1.6 TB-hours", resource: "Database", trend: "Down" },
				{ cost: 612.35, project: "Beacon Analytics", quantity: "7.5 TB", resource: "Object storage", trend: "Up" },
				{ cost: 488.4, project: "Relay Messaging", quantity: "11.9 TB", resource: "Data transfer", trend: "Stable" },
				{ cost: 328.5, project: "All projects", quantity: "13,140 min", resource: "Build minutes", trend: "Down" },
			],
		},
	};
	const monthlyBudget = 8000;
	const formatCurrency = (value: number) =>
		new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(value);
	const escapeCsv = (value: string | number) => {
		const escaped = String(value).replaceAll('"', '""');

		return `"${escaped}"`;
	};

	let period = $state<Period>("July");
	const periodUsage = $derived(periods[period]);
	const total = $derived(periodUsage.rows.reduce((sum, row) => sum + row.cost, 0));
	const budgetConsumed = $derived(Math.round((total / monthlyBudget) * 100));
	const belowBudget = $derived(Math.round((1 - periodUsage.projectedBill / monthlyBudget) * 100));

	function downloadInvoice() {
		const rows = [
			["Resource", "Project", "Quantity", "Cost", "Trend"],
			...periodUsage.rows.map((row) => [row.resource, row.project, row.quantity, row.cost.toFixed(2), row.trend]),
			["Total", "", "", total.toFixed(2), ""],
			["Projected bill", "", "", periodUsage.projectedBill.toFixed(2), ""],
		];
		const blob = new Blob([rows.map((row) => row.map(escapeCsv).join(",")).join("\n")], {
			type: "text/csv;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.href = url;
		link.download = `acme-cloud-${period.toLowerCase()}-invoice.csv`;
		link.click();
		URL.revokeObjectURL(url);
		addToast({ message: `${period} invoice downloaded as CSV.`, title: "Invoice downloaded", variant: "success" });
	}
</script>

<PageActions>
	<Button onclick={downloadInvoice} variant="default">Download invoice</Button>
</PageActions>

<Message variant="success">
	<strong>You are on track.</strong>
	Projected spend is {belowBudget}% below your configured monthly budget.
</Message>

<section class="billing-grid">
	<Card variant="primary">
		<div class="billing-stat">
			<span>Projected {period} bill</span>
			<strong>{formatCurrency(periodUsage.projectedBill)}</strong>
			<small>Includes {formatCurrency(periodUsage.projectedBill - total)} in estimated remaining usage</small>
		</div>
	</Card>

	<Card>
		<div class="billing-stat">
			<span>Current balance</span>
			<strong>{formatCurrency(total)}</strong>
			<small>Auto-pay scheduled for {periodUsage.invoiceDate}</small>
		</div>
	</Card>

	<Card>
		<div class="billing-stat">
			<span>Budget consumed</span>
			<strong>{budgetConsumed}%</strong>
			<Progress label={`${period} budget consumed`} max={monthlyBudget} value={total} variant="warning" />
		</div>
	</Card>

	<Card>
		<div class="billing-stat">
			<span>Credits remaining</span>
			<strong>$1,240</strong>
			<Progress label="Promotional credits remaining" max={2500} value={1240} variant="success" />
		</div>
	</Card>
</section>

<Card distinguished>
	{#snippet header()}
		<div class="card-header">
			<div>
				<p class="eyebrow">Cost analysis</p>
				<h2>Usage by resource</h2>
			</div>

			<ButtonGroup aria-label="Usage billing period">
				<Button aria-pressed={period === "May"} onclick={() => (period = "May")} size="sm">May</Button>
				<Button aria-pressed={period === "June"} onclick={() => (period = "June")} size="sm">June</Button>
				<Button aria-pressed={period === "July"} onclick={() => (period = "July")} size="sm">July</Button>
			</ButtonGroup>
		</div>
	{/snippet}

	<Table
		aria-label={`${period} usage by resource`}
		rowOptions={{ cost: { label: "Cost (USD)" }, quantity: { label: "Usage quantity" } }}
		rows={periodUsage.rows}
		striped
	>
		{#snippet children(row, key)}
			{#if key === "trend"}
				<Badge size="sm" variant={row.trend === "Up" ? "warning" : row.trend === "Down" ? "success" : "default"}>
					{row.trend}
				</Badge>
			{:else if key === "cost"}
				<strong>{formatCurrency(row.cost)}</strong>
			{:else}
				{row[key]}
			{/if}
		{/snippet}
	</Table>

	{#snippet footer()}
		<div class="card-footer">
			<span>Showing recorded usage for {period}</span>
			<strong>Total {formatCurrency(total)}</strong>
		</div>
	{/snippet}
</Card>

<style>
	small,
	.card-footer {
		color: color-mix(in srgb, currentColor 60%, transparent);
	}
	.billing-grid {
		grid-template-columns: repeat(4, 1fr);
		margin: 1rem 0;
	}
	.billing-grid span {
		font-size: 0.78rem;
	}
	.billing-grid strong {
		display: block;
		margin: 0.55rem 0;
		font-size: 1.65rem;
	}
	.billing-grid small {
		font-size: 0.75rem;
	}
	@media (max-width: 1000px) {
		.billing-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 620px) {
		.card-header,
		.card-footer {
			align-items: flex-start;
			flex-direction: column;
		}
		.billing-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
