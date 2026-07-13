<script lang="ts">
	import { page } from "$app/state";
	import Button from "@aeonixdev/ui/Button.svelte";
	import Card from "@aeonixdev/ui/Card.svelte";
	import Checkbox from "@aeonixdev/ui/Checkbox.svelte";
	import Divider from "@aeonixdev/ui/Divider.svelte";
	import Form from "@aeonixdev/ui/Form.svelte";
	import Input from "@aeonixdev/ui/Input.svelte";
	import Message from "@aeonixdev/ui/Message.svelte";
	import Select from "@aeonixdev/ui/Select.svelte";
	import Textarea from "@aeonixdev/ui/Textarea.svelte";
	import { addToast } from "@aeonixdev/ui/toast";

	const initialGeneral = {
		description: "Production infrastructure for Acme products and internal services.",
		region: "us-east-1",
		slug: "acme-cloud",
		workspaceName: "Acme Cloud",
	};
	let savedGeneral = $state({ ...initialGeneral });
	let workspaceName = $state(initialGeneral.workspaceName);
	let slug = $state(initialGeneral.slug);
	let region = $state(initialGeneral.region);
	let description = $state(initialGeneral.description);
	let deploymentAlerts = $state(true);
	let weeklyDigest = $state(true);
	let incidentAlerts = $state(true);
	let savedNotifications = $state({ deploymentAlerts: true, incidentAlerts: true, weeklyDigest: true });
	let confirmingDelete = $state(false);
	let workspaceDeleted = $state(false);

	const generalDirty = $derived(
		workspaceName !== savedGeneral.workspaceName ||
			slug !== savedGeneral.slug ||
			region !== savedGeneral.region ||
			description !== savedGeneral.description,
	);
	const notificationsDirty = $derived(
		deploymentAlerts !== savedNotifications.deploymentAlerts ||
			incidentAlerts !== savedNotifications.incidentAlerts ||
			weeklyDigest !== savedNotifications.weeklyDigest,
	);

	function save(event: SubmitEvent) {
		event.preventDefault();
		savedGeneral = { description, region, slug, workspaceName };

		addToast({
			message: "Workspace configuration has been updated.",
			title: "Settings saved",
			variant: "success",
		});
	}

	function reset(event: Event) {
		event.preventDefault();
		workspaceName = savedGeneral.workspaceName;
		slug = savedGeneral.slug;
		region = savedGeneral.region;
		description = savedGeneral.description;
	}

	function saveNotifications() {
		savedNotifications = { deploymentAlerts, incidentAlerts, weeklyDigest };
		addToast({ message: "Notification preferences saved.", variant: "success" });
	}

	function deleteWorkspace() {
		confirmingDelete = false;
		workspaceDeleted = true;
		addToast({
			message: "Acme Cloud was deleted from this demo session.",
			title: "Workspace deleted",
			variant: "success",
		});
	}
</script>

<div class="settings-grid">
	<nav aria-label="Settings sections" class="settings-nav">
		<a aria-current={!page.url.hash || page.url.hash === "#general" ? "location" : undefined} href="#general">General</a
		>
		<a aria-current={page.url.hash === "#notifications" ? "location" : undefined} href="#notifications">Notifications</a
		>
		<a aria-current={page.url.hash === "#danger" ? "location" : undefined} href="#danger">Danger zone</a>
	</nav>

	<div class="settings-content">
		<Card class="settings-section" distinguished id="general">
			{#snippet header()}
				<div>
					<p class="eyebrow">Workspace</p>
					<h2>General settings</h2>
				</div>
			{/snippet}

			<Form onreset={reset} onsubmit={save}>
				<div class="form-columns">
					<div class="form-field">
						<label for="workspace-name">Workspace name</label>
						<Input id="workspace-name" bind:value={workspaceName} required />
					</div>

					<div class="form-field">
						<label for="workspace-slug">Workspace slug</label>
						<Input id="workspace-slug" bind:value={slug} required />
					</div>
				</div>

				<div class="form-field">
					<label for="default-region">Default region</label>

					<Select id="default-region" bind:value={region}>
						<option value="us-east-1">US East (Virginia)</option>
						<option value="us-west-2">US West (Oregon)</option>
						<option value="eu-west-1">EU West (Ireland)</option>
					</Select>
				</div>

				<div class="form-field">
					<label for="workspace-description">Description</label>
					<Textarea id="workspace-description" bind:value={description} rows={4}></Textarea>
				</div>

				<div class="actions">
					<Button disabled={!generalDirty} type="reset">Reset</Button>
					<Button disabled={!generalDirty} type="submit" variant="primary">Save changes</Button>
				</div>
			</Form>
		</Card>

		<Card class="settings-section" distinguished id="notifications">
			{#snippet header()}
				<div>
					<p class="eyebrow">Communication</p>
					<h2>Notifications</h2>
				</div>
			{/snippet}

			<div class="checks">
				<label for="deployment-alerts">
					<Checkbox id="deployment-alerts" bind:checked={deploymentAlerts} />
					<span>Deployment status changes</span>
				</label>

				<label for="incident-alerts">
					<Checkbox id="incident-alerts" bind:checked={incidentAlerts} />
					<span>Incident and SLO alerts</span>
				</label>

				<label for="weekly-digest">
					<Checkbox id="weekly-digest" bind:checked={weeklyDigest} />
					<span>Weekly usage digest</span>
				</label>
			</div>

			{#snippet footer()}
				<Button disabled={!notificationsDirty} onclick={saveNotifications} size="sm" variant="primary">
					Update preferences
				</Button>
			{/snippet}
		</Card>

		<Card class="settings-section" distinguished id="danger" variant="error">
			{#snippet header()}
				<div>
					<p class="eyebrow inverse">Restricted</p>
					<h2>Danger zone</h2>
				</div>
			{/snippet}

			{#if workspaceDeleted}
				<Message variant="error">Acme Cloud has been deleted from this demo session.</Message>
			{:else}
				<Message variant="warning">Export any audit or billing records you need before deleting this workspace.</Message
				>
			{/if}

			<Divider variant="error" />

			<p class="danger-copy">
				Deleting Acme Cloud permanently removes projects, deployments, members, and API credentials.
			</p>

			{#snippet footer()}
				{#if workspaceDeleted}
					<span role="status">Workspace deleted</span>
				{:else if confirmingDelete}
					<div aria-live="polite" class="delete-confirmation">
						<p id="delete-confirmation">Delete Acme Cloud? This action cannot be undone.</p>
						<div class="actions">
							<Button onclick={() => (confirmingDelete = false)}>Cancel</Button>
							<Button aria-describedby="delete-confirmation" onclick={deleteWorkspace} variant="error">
								Confirm deletion
							</Button>
						</div>
					</div>
				{:else}
					<Button onclick={() => (confirmingDelete = true)} variant="error">Delete workspace</Button>
				{/if}
			{/snippet}
		</Card>
	</div>
</div>

<style>
	.danger-copy {
		color: color-mix(in srgb, currentColor 60%, transparent);
	}
	.settings-grid {
		display: grid;
		grid-template-columns: 12rem minmax(0, 1fr);
		gap: 1.5rem;
	}
	.settings-nav {
		position: sticky;
		top: 6rem;
		display: grid;
		align-content: start;
		gap: 0.25rem;
		height: max-content;
	}
	.settings-nav a {
		padding: 0.65rem 0.8rem;
		border-radius: 0.5rem;
		color: inherit;
		font-size: 0.82rem;
		text-decoration: none;
	}
	.settings-nav a:hover,
	.settings-nav a[aria-current="location"] {
		background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
	}
	.settings-content {
		display: grid;
		gap: 1rem;
	}
	:global(.settings-section) {
		scroll-margin-top: 6rem;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.6rem;
	}
	.checks {
		display: grid;
		gap: 1rem;
	}
	.checks label {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-weight: 500;
	}
	.delete-confirmation {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.delete-confirmation p {
		margin: 0;
	}
	.danger-copy {
		font-size: 0.82rem;
	}
	@media (max-width: 720px) {
		.settings-grid {
			grid-template-columns: 1fr;
		}
		.settings-nav {
			position: static;
			grid-template-columns: repeat(3, 1fr);
			overflow-x: auto;
		}
		.form-columns {
			grid-template-columns: 1fr;
		}
		.delete-confirmation {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
