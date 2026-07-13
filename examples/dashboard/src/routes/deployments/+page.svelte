<script lang="ts">
	import PageActions from "$lib/PageActions.svelte";
	import Badge from "@aeonixdev/ui/Badge.svelte";
	import Button from "@aeonixdev/ui/Button.svelte";
	import ButtonGroup from "@aeonixdev/ui/ButtonGroup.svelte";
	import Card from "@aeonixdev/ui/Card.svelte";
	import Message from "@aeonixdev/ui/Message.svelte";
	import Pagination from "@aeonixdev/ui/Pagination.svelte";
	import Progress from "@aeonixdev/ui/Progress.svelte";
	import Table from "@aeonixdev/ui/Table.svelte";
	import { addToast } from "@aeonixdev/ui/toast";

	type Deployment = {
		author: string;
		environment: string;
		release: string;
		service: string;
		state: "Live" | "Building" | "Failed";
	};

	let deployments = $state<Deployment[]>([
		{ author: "Jane Doe", environment: "Production", release: "v2.18.0", service: "web-console", state: "Live" },
		{ author: "John Doe", environment: "Staging", release: "8f2ac91", service: "billing-worker", state: "Building" },
		{ author: "Jane Doe", environment: "Production", release: "v4.7.3", service: "api-gateway", state: "Live" },
		{ author: "John Doe", environment: "Preview", release: "2c019ab", service: "event-router", state: "Failed" },
		{ author: "Jane Doe", environment: "Production", release: "v1.12.1", service: "identity", state: "Live" },
		{ author: "John Doe", environment: "Staging", release: "a94dd70", service: "audit-stream", state: "Live" },
	]);

	let filter = $state("all");
	let currentPage = $state(1);
	let deploymentNumber = 1;
	const filtered = $derived(filter === "all" ? deployments : deployments.filter((item) => item.state === filter));
	const pageSize = 4;
	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
	const visible = $derived(filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize));

	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	function setFilter(value: string) {
		filter = value;
		currentPage = 1;
	}

	function variant(state: Deployment["state"]): "error" | "info" | "success" {
		if (state === "Live") {
			return "success";
		}

		if (state === "Failed") {
			return "error";
		}

		return "info";
	}

	function queueDeployment() {
		const release = `c84d${String(210 + deploymentNumber).padStart(3, "0")}`;
		deploymentNumber += 1;
		deployments.unshift({
			author: "Jane Doe",
			environment: "Staging",
			release,
			service: "checkout-api",
			state: "Building",
		});
		setFilter("all");

		addToast({
			message: `checkout-api ${release} is building for staging.`,
			title: "Deployment queued",
			variant: "primary",
		});
	}
</script>

<PageActions>
	<Button onclick={queueDeployment} variant="primary">Create deployment</Button>
</PageActions>

<Message variant="info">
	<strong>Automatic promotion is active.</strong>
	Successful staging releases move to production after a 30 minute observation window.
</Message>

<section class="status-grid">
	<Card>
		<div class="status-stat">
			<span>Production rollout</span>
			<strong>100%</strong>
			<Progress label="Production rollout" max={100} value={100} variant="success" />
		</div>
	</Card>

	<Card>
		<div class="status-stat">
			<span>Staging build</span>
			<strong>64%</strong>
			<Progress label="Staging build" max={100} value={64} variant="info" />
		</div>
	</Card>

	<Card>
		<div class="status-stat">
			<span>Queue time</span>
			<strong>1m 42s</strong>
			<small>18 seconds faster than average</small>
		</div>
	</Card>
</section>

<Card distinguished>
	{#snippet header()}
		<div class="card-header">
			<div>
				<p class="eyebrow">Release history</p>
				<h2>Latest activity</h2>
			</div>

			<ButtonGroup aria-label="Filter deployments by status">
				<Button aria-pressed={filter === "all"} onclick={() => setFilter("all")} size="sm">All</Button>
				<Button aria-pressed={filter === "Live"} onclick={() => setFilter("Live")} size="sm">Live</Button>
				<Button aria-pressed={filter === "Building"} onclick={() => setFilter("Building")} size="sm">Building</Button>
				<Button aria-pressed={filter === "Failed"} onclick={() => setFilter("Failed")} size="sm">Failed</Button>
			</ButtonGroup>
		</div>
	{/snippet}

	{#if visible.length > 0}
		<Table aria-label="Deployment history" rows={visible} striped>
			{#snippet children(row, key)}
				{#if key === "state"}
					<Badge size="sm" variant={variant(row.state)}>{row.state}</Badge>
				{:else if key === "release"}
					<strong>{row.release}</strong>
				{:else}
					{row[key]}
				{/if}
			{/snippet}
		</Table>
	{:else}
		<div class="empty-state" role="status">
			<strong>No {filter.toLowerCase()} deployments</strong>
			<p>There are no deployments with this status yet.</p>
			<Button onclick={() => setFilter("all")} size="sm">Show all deployments</Button>
		</div>
	{/if}

	{#snippet footer()}
		<div class="card-footer">
			<span>{filtered.length} deployments</span>

			<Pagination onchange={(page) => (currentPage = page)} page={currentPage} size="sm" {totalPages} type="pills" />
		</div>
	{/snippet}
</Card>

<style>
	small,
	.card-footer {
		color: color-mix(in srgb, var(--color-foreground) 58%, transparent);
	}
	.status-grid {
		grid-template-columns: repeat(3, 1fr);
		margin: 1rem 0;
	}
	.status-grid span {
		font-size: 0.78rem;
	}
	.status-grid strong {
		display: block;
		margin: 0.5rem 0;
		font-size: 1.65rem;
	}
	.status-grid small {
		font-size: 0.75rem;
	}
	.empty-state {
		padding: 2.5rem 1rem;
		text-align: center;
	}
	.empty-state p {
		margin: 0.4rem 0 1rem;
		color: color-mix(in srgb, var(--color-foreground) 58%, transparent);
	}
	@media (max-width: 760px) {
		.card-header,
		.card-footer {
			align-items: flex-start;
			flex-direction: column;
		}
		.status-grid {
			grid-template-columns: 1fr;
		}
		.card-header {
			overflow-x: auto;
		}
	}
</style>
