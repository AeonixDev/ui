<script lang="ts">
	import PageActions from "$lib/PageActions.svelte";
	import Badge from "@aeonixdev/ui/Badge.svelte";
	import Button from "@aeonixdev/ui/Button.svelte";
	import ButtonGroup from "@aeonixdev/ui/ButtonGroup.svelte";
	import Card from "@aeonixdev/ui/Card.svelte";
	import Checkbox from "@aeonixdev/ui/Checkbox.svelte";
	import Form from "@aeonixdev/ui/Form.svelte";
	import Input from "@aeonixdev/ui/Input.svelte";
	import Message from "@aeonixdev/ui/Message.svelte";
	import Pagination from "@aeonixdev/ui/Pagination.svelte";
	import Progress from "@aeonixdev/ui/Progress.svelte";
	import Select from "@aeonixdev/ui/Select.svelte";
	import Skeleton from "@aeonixdev/ui/Skeleton.svelte";
	import Spinner from "@aeonixdev/ui/Spinner.svelte";
	import Table from "@aeonixdev/ui/Table.svelte";
	import Textarea from "@aeonixdev/ui/Textarea.svelte";
	import Tooltip from "@aeonixdev/ui/Tooltip.svelte";
	import { addToast } from "@aeonixdev/ui/toast";

	type Range = "24h" | "7d" | "30d";

	type ChartRange = {
		axis: string[];
		description: string;
		series: number[];
		summary: string;
	};

	type Deployment = {
		environment: string;
		region: string;
		service: string;
		status: "Degraded" | "Healthy" | "Queued";
		updated: string;
	};

	const chartRanges: Record<Range, ChartRange> = {
		"7d": {
			axis: ["Mon", "Wed", "Fri", "Today"],
			description:
				"Request volume across the last 7 days, totaling 8.42 million requests. Today is tracking near the weekly peak.",
			series: [42, 58, 48, 72, 66, 84, 76, 92, 73, 88, 96, 81],
			summary: "8.42M",
		},
		"24h": {
			axis: ["12 AM", "8 AM", "4 PM", "Now"],
			description:
				"Hourly request volume for the last 24 hours, totaling 1.18 million requests. Traffic peaked this evening.",
			series: [28, 24, 31, 38, 46, 61, 72, 66, 78, 92, 84, 88],
			summary: "1.18M",
		},
		"30d": {
			axis: ["Jun 12", "Jun 22", "Jul 2", "Today"],
			description:
				"Request volume across the last 30 days, totaling 34.7 million requests. Volume rose steadily through the period.",
			series: [35, 39, 44, 41, 52, 57, 63, 68, 71, 79, 86, 94],
			summary: "34.7M",
		},
	};

	let deployments = $state<Deployment[]>([
		{ environment: "Production", region: "us-east-1", service: "api-gateway", status: "Healthy", updated: "2 min ago" },
		{
			environment: "Production",
			region: "eu-west-1",
			service: "billing-worker",
			status: "Degraded",
			updated: "8 min ago",
		},
		{ environment: "Staging", region: "us-west-2", service: "event-router", status: "Healthy", updated: "14 min ago" },
		{ environment: "Preview", region: "us-east-1", service: "web-console", status: "Queued", updated: "19 min ago" },
		{
			environment: "Production",
			region: "ap-southeast-1",
			service: "audit-stream",
			status: "Healthy",
			updated: "27 min ago",
		},
		{ environment: "Staging", region: "eu-central-1", service: "identity", status: "Healthy", updated: "34 min ago" },
		{
			environment: "Production",
			region: "us-east-1",
			service: "usage-meter",
			status: "Healthy",
			updated: "41 min ago",
		},
		{ environment: "Preview", region: "us-west-2", service: "mail-dispatch", status: "Queued", updated: "53 min ago" },
	]);

	const pageSize = 4;
	let currentPage = $state(1);
	let range = $state<Range>("7d");
	let refreshing = $state(false);
	let showSkeletons = $state(false);
	let projectName = $state("checkout-service");
	let environment = $state("staging");
	let releaseReference = $state("main@latest");
	let releaseNotes = $state("");
	let rollbackEnabled = $state(true);
	const chartRange = $derived(chartRanges[range]);
	const totalPages = $derived(Math.ceil(deployments.length / pageSize));
	const visibleDeployments = $derived(deployments.slice((currentPage - 1) * pageSize, currentPage * pageSize));

	function statusVariant(status: Deployment["status"]): "success" | "warning" | "info" {
		if (status === "Healthy") {
			return "success";
		}

		if (status === "Degraded") {
			return "warning";
		}

		return "info";
	}

	async function refreshDashboard() {
		refreshing = true;

		await new Promise((resolve) => setTimeout(resolve, 700));

		refreshing = false;

		addToast({
			message: "Metrics and deployment health are up to date.",
			title: "Dashboard refreshed",
			variant: "success",
		});
	}

	function submitDeployment(event: SubmitEvent) {
		event.preventDefault();
		const formattedEnvironment = environment.charAt(0).toUpperCase() + environment.slice(1);
		const deployment: Deployment = {
			environment: formattedEnvironment,
			region: environment === "production" ? "us-east-1" : environment === "staging" ? "us-west-2" : "us-east-1",
			service: projectName.trim(),
			status: "Queued",
			updated: "Just now",
		};
		const existingDeployment = deployments.find(
			(item) => item.service === deployment.service && item.environment === deployment.environment,
		);

		deployments = [
			deployment,
			...deployments.filter(
				(item) => item.service !== deployment.service || item.environment !== deployment.environment,
			),
		];
		currentPage = 1;

		addToast({
			message: `${deployment.service} at ${releaseReference.trim()} is queued for ${formattedEnvironment} with ${rollbackEnabled ? "automatic rollback enabled" : "automatic rollback disabled"}. ${releaseNotes.trim() || "No release notes were provided."}`,
			title: existingDeployment ? "Deployment updated" : "Deployment created",
			variant: "primary",
		});

		releaseNotes = "";
	}

	function resetDeploymentForm() {
		projectName = "checkout-service";
		environment = "staging";
		releaseReference = "main@latest";
		releaseNotes = "";
		rollbackEnabled = true;
	}
</script>

<PageActions>
	<Button onclick={() => (showSkeletons = !showSkeletons)} variant="default">
		{showSkeletons ? "Show metrics" : "Test loading"}
	</Button>

	<Button disabled={refreshing} onclick={refreshDashboard} variant="primary">
		{#if refreshing}
			<Spinner label="Refreshing dashboard" size="sm" type="circular" />
		{:else}
			Refresh data
		{/if}
	</Button>
</PageActions>

<Message dismissable variant="warning">
	<strong>Elevated latency in EU West.</strong> Billing webhooks may take up to 90 seconds while traffic is rebalanced.
</Message>

<section aria-busy={showSkeletons} aria-label="Key metrics" class="metrics-grid" id="projects">
	{#if showSkeletons}
		<span class="sr-only" role="status">Loading key metrics</span>

		{#each Array(4) as _}
			<Card>
				<Skeleton animated type="card" />
			</Card>
		{/each}
	{:else}
		<Card>
			<div class="metric-top">
				<span>Monthly requests</span>
				<Badge size="sm" variant="success">+12.4%</Badge>
			</div>

			<strong class="metric-value">8.42M</strong>

			<p class="metric-note">932K more than last period</p>
		</Card>

		<Card>
			<div class="metric-top">
				<span>Active services</span>
				<Badge size="sm" variant="info">24 live</Badge>
			</div>

			<strong class="metric-value">31</strong>

			<p class="metric-note">Across 6 global regions</p>
		</Card>

		<Card>
			<div class="metric-top">
				<span>Success rate</span>
				<Badge size="sm" variant="success">Healthy</Badge>
			</div>

			<strong class="metric-value">99.98%</strong>

			<p class="metric-note">Within the 99.95% SLO</p>
		</Card>

		<Card>
			<div class="metric-top">
				<span>Current spend</span>
				<Badge size="sm" variant="warning">76%</Badge>
			</div>

			<strong class="metric-value">$4,821</strong>

			<Progress label="Monthly budget used" max={6400} size="sm" value={4821} variant="warning" />
		</Card>
	{/if}
</section>

<section class="content-grid" id="usage">
	<Card distinguished>
		{#snippet header()}
			<div class="card-heading">
				<div>
					<p class="eyebrow">Traffic</p>
					<h2>Request volume</h2>
				</div>

				<ButtonGroup aria-label="Request volume range" variant="default">
					<Button aria-pressed={range === "24h"} onclick={() => (range = "24h")} size="sm">24h</Button>
					<Button aria-pressed={range === "7d"} onclick={() => (range = "7d")} size="sm">7d</Button>
					<Button aria-pressed={range === "30d"} onclick={() => (range = "30d")} size="sm">30d</Button>
				</ButtonGroup>
			</div>
		{/snippet}

		<div class="chart-summary">
			<strong>{chartRange.summary}</strong>
			<span>requests processed</span>
		</div>

		<div aria-label={chartRange.description} class="bar-chart" role="img">
			{#each chartRange.series as height, index}
				<div class:latest={index === chartRange.series.length - 1} style={`--height: ${height}%`}></div>
			{/each}
		</div>

		<div class="chart-axis">
			{#each chartRange.axis as label}
				<span>{label}</span>
			{/each}
		</div>
	</Card>

	<Card distinguished variant="primary">
		{#snippet header()}
			<div>
				<p class="eyebrow inverse">Capacity</p>
				<h2>Resource health</h2>
			</div>
		{/snippet}

		<div class="resource-list">
			<div>
				<span>Compute</span>
				<Progress label="Compute capacity" max={100} showValue value={68} />
			</div>

			<div>
				<span>Database</span>
				<Progress label="Database capacity" max={100} showValue value={81} variant="warning" />
			</div>

			<div>
				<span>Object storage</span>
				<Progress label="Storage capacity" max={100} showValue value={44} variant="success" />
			</div>
		</div>

		{#snippet footer()}
			<p class="capacity-note">Next plan review in 9 days</p>
		{/snippet}
	</Card>
</section>

<section id="deployments">
	<div class="section-heading">
		<div>
			<p class="eyebrow">Environments</p>
			<h2 id="deployments-heading">Recent deployments</h2>
		</div>

		<Tooltip content="Deployment history is retained for 90 days" position="left">
			{#snippet children(triggerProps)}
				<Button {...triggerProps} size="sm" variant="default">Retention info</Button>
			{/snippet}
		</Tooltip>
	</div>

	<Table
		aria-labelledby="deployments-heading"
		rowOptions={{
			environment: { label: "Environment" },
			service: { label: "Service" },
			updated: { label: "Last updated" },
		}}
		rows={visibleDeployments}
		striped
	>
		{#snippet children(row, key)}
			{#if key === "status"}
				<Badge size="sm" variant={statusVariant(row.status)}>{row.status}</Badge>
			{:else if key === "service"}
				<strong>{row.service}</strong>
			{:else}
				{row[key]}
			{/if}
		{/snippet}
	</Table>

	<div class="table-footer">
		<span>
			Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, deployments.length)} of {deployments.length}
		</span>

		<Pagination onchange={(page) => (currentPage = page)} page={currentPage} size="sm" {totalPages} type="outlined" />
	</div>
</section>

<section class="bottom-grid" id="settings">
	<Card distinguished>
		{#snippet header()}
			<div>
				<p class="eyebrow">Quick action</p>
				<h2>Create deployment</h2>
			</div>
		{/snippet}

		<Form onsubmit={submitDeployment}>
			<div class="form-control">
				<label for="project-name">Service name</label>
				<Input id="project-name" bind:value={projectName} name="project" placeholder="api-service" required />
			</div>

			<div class="form-columns">
				<div class="form-control">
					<label for="environment">Environment</label>
					<Select id="environment" bind:value={environment} name="environment">
						<option value="preview">Preview</option>
						<option value="staging">Staging</option>
						<option value="production">Production</option>
					</Select>
				</div>

				<div class="form-control">
					<label for="release-reference">Release reference</label>
					<Input
						id="release-reference"
						bind:value={releaseReference}
						name="reference"
						placeholder="main@latest"
						required
					/>
				</div>
			</div>

			<div class="form-control">
				<label for="release-notes">Release notes</label>

				<Textarea
					id="release-notes"
					bind:value={releaseNotes}
					name="notes"
					placeholder="What changed in this release?"
					rows={3}
				></Textarea>
			</div>

			<label class="checkbox-label" for="rollback">
				<Checkbox id="rollback" bind:checked={rollbackEnabled} name="rollback" />
				<span>Enable automatic rollback on failed health checks</span>
			</label>

			<div class="form-actions">
				<Button onclick={resetDeploymentForm} type="button" variant="default">Reset form</Button>
				<Button type="submit" variant="primary">Queue deployment</Button>
			</div>
		</Form>

		{#snippet footer()}
			<p class="form-footnote">Production deployments require a second approval.</p>
		{/snippet}
	</Card>

	<div class="activity-stack" id="team">
		<Card>
			<div class="card-heading">
				<div>
					<p class="eyebrow">Live activity</p>
					<h2>Release channel</h2>
				</div>
				<Badge variant="success">Connected</Badge>
			</div>

			<Message id="release-status" variant="info">
				<strong>Release synchronized</strong>
				<p>Version 2.18.0 promoted to staging by John Doe.</p>
			</Message>
		</Card>

		<Card>
			<p class="eyebrow">Background job</p>

			<div class="job-state">
				<Spinner label="Indexing audit events" size="lg" type="orbit" variant="secondary" />

				<div>
					<strong>Indexing audit events</strong>
					<p>Processing shard 7 of 12</p>
				</div>
			</div>

			<Progress label="Audit indexing progress" max={12} showValue value={7} variant="secondary" />
		</Card>
	</div>
</section>

<style>
	.section-heading,
	.card-heading,
	.metric-top,
	.table-footer,
	.form-actions,
	.job-state {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	h2 {
		letter-spacing: -0.015em;
	}

	.eyebrow {
		margin-top: 1.3rem;
		letter-spacing: 0.11em;
	}

	.metric-note,
	.capacity-note,
	.form-footnote,
	.job-state p {
		color: color-mix(in srgb, currentColor 60%, transparent);
		font-size: 0.82rem;
	}

	.metrics-grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
		margin: 1rem 0;
	}

	.metric-top {
		color: color-mix(in srgb, var(--color-foreground) 68%, transparent);
		font-size: 0.76rem;
	}

	.metric-value {
		display: block;
		margin-top: 0.75rem;
		font-size: 1.8rem;
		letter-spacing: -0.04em;
	}

	.metric-note {
		margin-top: 0.2rem;
	}

	.content-grid,
	.bottom-grid {
		grid-template-columns: minmax(0, 1.65fr) minmax(17rem, 0.85fr);
		margin: 1rem 0 2rem;
	}

	.chart-summary {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin-bottom: 1.2rem;
	}

	.chart-summary strong {
		font-size: 1.8rem;
	}

	.chart-summary span,
	.chart-axis,
	.table-footer {
		color: color-mix(in srgb, var(--color-foreground) 55%, transparent);
		font-size: 0.75rem;
	}

	.bar-chart {
		display: flex;
		align-items: end;
		gap: clamp(0.35rem, 1.2vw, 0.75rem);
		height: 11rem;
		padding-top: 1rem;
		border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 12%, transparent);
		background: repeating-linear-gradient(
			to bottom,
			transparent 0,
			transparent calc(33.33% - 1px),
			color-mix(in srgb, var(--color-foreground) 7%, transparent) 33.33%
		);
	}

	.bar-chart div {
		flex: 1;
		height: var(--height);
		border-radius: 0.35rem 0.35rem 0 0;
		background: color-mix(in srgb, var(--color-primary) 42%, transparent);
	}

	.bar-chart div.latest {
		background: var(--color-primary);
	}

	.chart-axis {
		display: flex;
		justify-content: space-between;
		padding-top: 0.55rem;
	}

	.resource-list {
		display: grid;
		gap: 1.35rem;
	}

	.resource-list > div > span {
		display: block;
		margin-bottom: 0.45rem;
		font-size: 0.8rem;
	}

	.section-heading {
		margin-bottom: 0.85rem;
	}

	.section-heading .eyebrow,
	.card-heading .eyebrow {
		margin-top: 0;
	}

	.table-footer {
		padding-top: 0.85rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		font-weight: 500;
	}

	.form-actions {
		justify-content: flex-end;
	}

	.activity-stack {
		display: grid;
		align-content: start;
		gap: 1rem;
	}

	.job-state {
		justify-content: flex-start;
		margin-bottom: 1rem;
	}

	@media (max-width: 1100px) {
		.metrics-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.section-heading,
		.table-footer {
			align-items: flex-start;
			flex-direction: column;
		}

		.metrics-grid,
		.form-columns {
			grid-template-columns: 1fr;
		}

		.table-footer {
			overflow-x: auto;
		}
	}
</style>
