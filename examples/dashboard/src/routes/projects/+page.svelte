<script lang="ts">
	import PageActions from "$lib/PageActions.svelte";
	import Badge from "@aeonixdev/ui/Badge.svelte";
	import Button from "@aeonixdev/ui/Button.svelte";
	import Card from "@aeonixdev/ui/Card.svelte";
	import Input from "@aeonixdev/ui/Input.svelte";
	import Pagination from "@aeonixdev/ui/Pagination.svelte";
	import Progress from "@aeonixdev/ui/Progress.svelte";
	import Select from "@aeonixdev/ui/Select.svelte";
	import Table from "@aeonixdev/ui/Table.svelte";
	import { addToast } from "@aeonixdev/ui/toast";

	type Project = {
		name: string;
		owner: string;
		services: number;
		status: "Active" | "Paused" | "Provisioning";
		updated: string;
	};

	let projects = $state<Project[]>([
		{ name: "Orbit Commerce", owner: "Platform", services: 8, status: "Active", updated: "4 min ago" },
		{ name: "Atlas Identity", owner: "Security", services: 5, status: "Active", updated: "18 min ago" },
		{ name: "Beacon Analytics", owner: "Data", services: 11, status: "Provisioning", updated: "1 hour ago" },
		{ name: "Relay Messaging", owner: "Core", services: 4, status: "Active", updated: "3 hours ago" },
		{ name: "Northstar Labs", owner: "Research", services: 3, status: "Paused", updated: "Yesterday" },
		{ name: "Ledger Billing", owner: "Finance", services: 7, status: "Active", updated: "Yesterday" },
	]);

	let query = $state("");
	let status = $state("all");
	let currentPage = $state(1);
	let projectNumber = 1;
	const pageSize = 4;
	const activeServiceCount = $derived(
		projects.filter((project) => project.status === "Active").reduce((total, project) => total + project.services, 0),
	);
	const serviceCount = $derived(projects.reduce((total, project) => total + project.services, 0));
	const teamCount = $derived(new Set(projects.map((project) => project.owner)).size);
	const filteredProjects = $derived(
		projects.filter(
			(project) =>
				project.name.toLowerCase().includes(query.toLowerCase()) && (status === "all" || project.status === status),
		),
	);
	const totalPages = $derived(Math.max(1, Math.ceil(filteredProjects.length / pageSize)));
	const visibleProjects = $derived(filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize));

	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	function resetFilters() {
		query = "";
		status = "all";
		currentPage = 1;
	}

	function createProject() {
		const name = projectNumber === 1 ? "Aurora Checkout" : `Aurora Checkout ${projectNumber}`;
		projectNumber += 1;
		projects.unshift({ name, owner: "Growth", services: 2, status: "Provisioning", updated: "Just now" });
		resetFilters();

		addToast({
			message: `${name} is provisioning with two starter services.`,
			title: "Project created",
			variant: "success",
		});
	}

	function statusVariant(value: Project["status"]): "info" | "success" | "warning" {
		if (value === "Active") {
			return "success";
		}

		if (value === "Paused") {
			return "warning";
		}

		return "info";
	}
</script>

<PageActions>
	<Button onclick={createProject} variant="primary">New project</Button>
</PageActions>

<section aria-label="Project summary" class="summary-grid">
	<Card>
		<div class="summary-stat">
			<span class="label">Total projects</span>
			<strong>{projects.length}</strong>
			<small>Across {teamCount} teams</small>
		</div>
	</Card>

	<Card>
		<div class="summary-stat">
			<span class="label">Active services</span>
			<strong>{activeServiceCount}</strong>
			<small>{serviceCount} services total</small>
		</div>
	</Card>

	<Card>
		<div class="summary-stat">
			<span class="label">Build minutes</span>
			<strong>72%</strong>
			<Progress label="Build minutes used" max={100} size="sm" value={72} />
		</div>
	</Card>
</section>

<Card distinguished>
	{#snippet header()}
		<div class="card-header">
			<div>
				<p class="eyebrow">Directory</p>
				<h2>All projects</h2>
			</div>

			<Badge>{filteredProjects.length} results</Badge>
		</div>
	{/snippet}

	<div class="filters">
		<label for="project-search">Search projects</label>
		<Input
			id="project-search"
			bind:value={query}
			oninput={() => (currentPage = 1)}
			placeholder="Search by project name"
		/>

		<label for="project-status">Status</label>
		<Select id="project-status" bind:value={status} onchange={() => (currentPage = 1)}>
			<option value="all">All statuses</option>
			<option value="Active">Active</option>
			<option value="Provisioning">Provisioning</option>
			<option value="Paused">Paused</option>
		</Select>
	</div>

	{#if visibleProjects.length > 0}
		<Table aria-label="Projects" rows={visibleProjects} striped>
			{#snippet children(row, key)}
				{#if key === "status"}
					<Badge size="sm" variant={statusVariant(row.status)}>{row.status}</Badge>
				{:else if key === "name"}
					<a href="/deployments"><strong>{row.name}</strong></a>
				{:else}
					{row[key]}
				{/if}
			{/snippet}
		</Table>
	{:else}
		<div class="empty-state" role="status">
			<strong>No projects found</strong>
			<p>Try another project name or status.</p>
			<Button onclick={resetFilters} size="sm">Clear filters</Button>
		</div>
	{/if}

	{#snippet footer()}
		<div class="card-footer">
			<span>Page {currentPage} of {totalPages}</span>

			<Pagination onchange={(page) => (currentPage = page)} page={currentPage} size="sm" {totalPages} type="outlined" />
		</div>
	{/snippet}
</Card>

<style>
	small,
	.card-footer {
		color: color-mix(in srgb, var(--color-foreground) 58%, transparent);
	}
	.label {
		color: var(--color-primary);
		font-weight: 750;
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.summary-grid {
		grid-template-columns: repeat(3, 1fr);
		margin-bottom: 1rem;
	}
	.summary-grid strong {
		display: block;
		margin: 0.55rem 0 0.2rem;
		font-size: 1.8rem;
	}
	.summary-grid small {
		font-size: 0.78rem;
	}
	.filters {
		display: grid;
		grid-template-columns: auto minmax(12rem, 1fr) auto 12rem;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	.filters label {
		font-weight: 650;
		font-size: 0.75rem;
	}
	a {
		color: inherit;
	}
	.empty-state {
		padding: 2.5rem 1rem;
		text-align: center;
	}
	.empty-state p {
		margin: 0.4rem 0 1rem;
		color: color-mix(in srgb, var(--color-foreground) 58%, transparent);
	}
	@media (max-width: 700px) {
		.summary-grid {
			grid-template-columns: 1fr;
		}
		.filters {
			grid-template-columns: 1fr;
		}
		.card-footer {
			align-items: flex-start;
			flex-direction: column;
			overflow-x: auto;
		}
	}
</style>
