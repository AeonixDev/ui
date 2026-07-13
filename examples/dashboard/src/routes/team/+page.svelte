<script lang="ts">
	import PageActions from "$lib/PageActions.svelte";
	import Avatar from "@aeonixdev/ui/Avatar.svelte";
	import Badge from "@aeonixdev/ui/Badge.svelte";
	import Button from "@aeonixdev/ui/Button.svelte";
	import Card from "@aeonixdev/ui/Card.svelte";
	import Checkbox from "@aeonixdev/ui/Checkbox.svelte";
	import Form from "@aeonixdev/ui/Form.svelte";
	import Input from "@aeonixdev/ui/Input.svelte";
	import Select from "@aeonixdev/ui/Select.svelte";
	import Table from "@aeonixdev/ui/Table.svelte";
	import { addToast } from "@aeonixdev/ui/toast";

	type Member = {
		access: "Admin" | "Member" | "Viewer";
		avatarStatus: "away" | "offline" | "online" | "unknown";
		avatarVariant: "default" | "info" | "primary" | "secondary" | "success";
		lastActive: string;
		member: string;
		role: string;
		team: string;
	};

	let members = $state<Member[]>([
		{
			access: "Admin",
			avatarStatus: "online",
			avatarVariant: "primary",
			lastActive: "Now",
			member: "Maya Chen",
			role: "Platform lead",
			team: "Platform",
		},
		{
			access: "Member",
			avatarStatus: "online",
			avatarVariant: "secondary",
			lastActive: "4 min ago",
			member: "Elias Romero",
			role: "Senior engineer",
			team: "Core",
		},
		{
			access: "Admin",
			avatarStatus: "away",
			avatarVariant: "info",
			lastActive: "21 min ago",
			member: "Priya Shah",
			role: "Security engineer",
			team: "Security",
		},
		{
			access: "Member",
			avatarStatus: "offline",
			avatarVariant: "success",
			lastActive: "1 hour ago",
			member: "Noah Williams",
			role: "Product engineer",
			team: "Commerce",
		},
		{
			access: "Viewer",
			avatarStatus: "offline",
			avatarVariant: "default",
			lastActive: "Yesterday",
			member: "Sofia Martins",
			role: "Data analyst",
			team: "Data",
		},
	]);

	let email = $state("");
	let role = $state<Member["access"]>("Member");
	let projectAccess = $state(true);
	const activeMemberCount = $derived(members.length);
	const featuredMembers = $derived(members.slice(0, 4));
	const directoryMembers = $derived(
		members.map(({ access, lastActive, member, role: memberRole, team }) => ({
			access,
			lastActive,
			member,
			role: memberRole,
			team,
		})),
	);

	function initials(name: string) {
		return name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	}

	function nameFromEmail(address: string) {
		return address
			.split("@")[0]
			.split(/[._-]+/)
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(" ");
	}

	function invite(event: SubmitEvent) {
		event.preventDefault();
		const invitedEmail = email.trim();
		const invitedMember: Member = {
			access: role,
			avatarStatus: "unknown",
			avatarVariant: "default",
			lastActive: "Invited just now",
			member: nameFromEmail(invitedEmail),
			role: "Pending invitation",
			team: projectAccess ? "Orbit Commerce" : "Workspace only",
		};

		members = [...members, invitedMember];

		addToast({
			message: `${invitedEmail} was invited as a ${role.toLowerCase()}${projectAccess ? " with Orbit Commerce access" : " with workspace-only access"}.`,
			title: "Invitation sent",
			variant: "success",
		});

		resetInvitationForm();
	}

	function resetInvitationForm() {
		email = "";
		role = "Member";
		projectAccess = true;
	}
</script>

<PageActions>
	<Badge variant="success">{activeMemberCount} active members</Badge>
</PageActions>

<section class="member-cards">
	{#each featuredMembers as member}
		<Card>
			<div class="member">
				<Avatar alt={member.member} status={member.avatarStatus} variant={member.avatarVariant}>
					{initials(member.member)}
				</Avatar>

				<div>
					<strong>{member.member}</strong>
					<span>{member.role}</span>
				</div>

				<Badge size="sm" variant={member.access === "Admin" ? "primary" : "default"}>{member.access}</Badge>
			</div>
		</Card>
	{/each}
</section>

<section class="content-grid">
	<Card distinguished>
		{#snippet header()}
			<div>
				<p class="eyebrow">Directory</p>
				<h2 id="members-heading">Workspace members</h2>
			</div>
		{/snippet}

		<Table aria-labelledby="members-heading" rows={directoryMembers} striped>
			{#snippet children(row, key)}
				{#if key === "access"}
					<Badge size="sm" variant={row.access === "Admin" ? "primary" : "default"}>{row.access}</Badge>
				{:else if key === "member"}
					<strong>{row.member}</strong>
				{:else}
					{row[key]}
				{/if}
			{/snippet}
		</Table>
	</Card>

	<Card distinguished>
		{#snippet header()}
			<div>
				<p class="eyebrow">New member</p>
				<h2>Invite teammate</h2>
			</div>
		{/snippet}

		<Form onsubmit={invite}>
			<div class="form-field">
				<label for="invite-email">Email address</label>
				<Input id="invite-email" bind:value={email} name="email" placeholder="name@company.com" required type="email" />
			</div>

			<div class="form-field">
				<label for="invite-role">Workspace role</label>

				<Select id="invite-role" bind:value={role} name="role">
					<option>Admin</option>
					<option>Member</option>
					<option>Viewer</option>
				</Select>
			</div>

			<label class="checkbox" for="project-access">
				<Checkbox id="project-access" bind:checked={projectAccess} name="projectAccess" />
				<span>Add to Orbit Commerce</span>
			</label>

			<div class="form-actions">
				<Button onclick={resetInvitationForm} type="button" variant="default">Reset invitation</Button>
				<Button type="submit" variant="primary">Send invitation</Button>
			</div>
		</Form>

		{#snippet footer()}
			<small>Invitations expire after seven days.</small>
		{/snippet}
	</Card>
</section>

<style>
	.member {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	small,
	.member span {
		color: color-mix(in srgb, var(--color-foreground) 58%, transparent);
	}
	.member-cards {
		grid-template-columns: repeat(4, 1fr);
	}
	.member {
		justify-content: flex-start;
	}
	.member > div {
		min-width: 0;
		flex: 1;
	}
	.member strong,
	.member span {
		display: block;
	}
	.member span {
		margin-top: 0.15rem;
		font-size: 0.72rem;
	}
	.content-grid {
		grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 0.7fr);
		margin-top: 1rem;
	}
	.checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
	}
	small {
		font-size: 0.75rem;
	}
	@media (max-width: 1100px) {
		.member-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 620px) {
		.member-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
