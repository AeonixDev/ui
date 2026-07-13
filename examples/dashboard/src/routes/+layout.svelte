<script lang="ts">
	import { page } from "$app/state";
	import { pageHeaderContextKey, type PageHeaderContext } from "$lib/PageHeader.js";
	import Avatar from "@aeonixdev/ui/Avatar.svelte";
	import Breadcrumb from "@aeonixdev/ui/Breadcrumb.svelte";
	import BreadcrumbItem from "@aeonixdev/ui/BreadcrumbItem.svelte";
	import Button from "@aeonixdev/ui/Button.svelte";
	import Divider from "@aeonixdev/ui/Divider.svelte";
	import Input from "@aeonixdev/ui/Input.svelte";
	import Kbd from "@aeonixdev/ui/Kbd.svelte";
	import Nav from "@aeonixdev/ui/Nav.svelte";
	import NavGroup from "@aeonixdev/ui/NavGroup.svelte";
	import NavItem from "@aeonixdev/ui/NavItem.svelte";
	import ToastContainer from "@aeonixdev/ui/ToastContainer.svelte";
	import Tooltip from "@aeonixdev/ui/Tooltip.svelte";
	import { onMount, setContext, type Snippet } from "svelte";
	import "../app.css";

	type RouteDefinition = {
		breadcrumbs: { href: string; label: string }[];
		description: string;
		navGroup: "workspace" | "account";
		navLabel: string;
		section: string;
		title: string;
	};

	const routeRegistry = {
		"/": {
			breadcrumbs: [{ href: "/", label: "Acme Cloud" }],
			description: "Here is what is happening across your production systems.",
			navGroup: "workspace",
			navLabel: "Overview",
			section: "Saturday, July 11",
			title: "Good morning, Jane.",
		},
		"/deployments": {
			breadcrumbs: [
				{ href: "/", label: "Acme Cloud" },
				{ href: "/projects", label: "Orbit Commerce" },
			],
			description: "Follow releases from commit to production.",
			navGroup: "workspace",
			navLabel: "Deployments",
			section: "Delivery",
			title: "Deployments",
		},
		"/projects": {
			breadcrumbs: [{ href: "/", label: "Acme Cloud" }],
			description: "Organize services, environments, and access around products.",
			navGroup: "workspace",
			navLabel: "Projects",
			section: "Workspace",
			title: "Projects",
		},
		"/settings": {
			breadcrumbs: [{ href: "/", label: "Acme Cloud" }],
			description: "Control workspace defaults, notifications, and account behavior.",
			navGroup: "account",
			navLabel: "Settings",
			section: "Configuration",
			title: "Settings",
		},
		"/team": {
			breadcrumbs: [{ href: "/", label: "Acme Cloud" }],
			description: "Manage workspace membership, roles, and project access.",
			navGroup: "workspace",
			navLabel: "Team",
			section: "People",
			title: "Team",
		},
		"/usage": {
			breadcrumbs: [{ href: "/", label: "Acme Cloud" }],
			description: "Monitor consumption, budgets, and projected monthly spend.",
			navGroup: "account",
			navLabel: "Usage & billing",
			section: "Account",
			title: "Usage & billing",
		},
	} satisfies Record<string, RouteDefinition>;
	type RoutePath = keyof typeof routeRegistry;
	const routes = Object.entries(routeRegistry) as [RoutePath, RouteDefinition][];
	const unknownMetadata: Omit<RouteDefinition, "navGroup" | "navLabel"> = {
		breadcrumbs: [{ href: "/", label: "Acme Cloud" }],
		description: "The requested dashboard page could not be found.",
		section: "Unknown route",
		title: "Page not found",
	};
	const themeStorageKey = "orbit-control-theme";

	let { children }: { children: Snippet } = $props();
	let darkMode = $state(true);
	let pageActions = $state<Snippet>();
	let searchQuery = $state("");
	let searchContainer: HTMLDivElement;
	const metadata = $derived(routeRegistry[page.url.pathname as RoutePath] ?? unknownMetadata);
	const searchResults = $derived(
		searchQuery.trim()
			? routes.filter(([, route]) =>
					[route.navLabel, route.title, route.description].some((value) =>
						value.toLowerCase().includes(searchQuery.trim().toLowerCase()),
					),
				)
			: [],
	);

	setContext<PageHeaderContext>(pageHeaderContextKey, {
		clearActions(actions) {
			if (pageActions === actions) {
				pageActions = undefined;
			}
		},
		setActions(actions) {
			pageActions = actions;
		},
	});

	onMount(() => {
		darkMode = document.documentElement.classList.contains("dark");
	});

	function toggleTheme() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle("dark", darkMode);
		document.documentElement.style.colorScheme = darkMode ? "dark" : "light";

		try {
			localStorage.setItem(themeStorageKey, darkMode ? "dark" : "light");
		} catch {
			// The theme still applies when storage is unavailable.
		}
	}

	function current(pathname: string) {
		return page.url.pathname === pathname ? "page" : undefined;
	}

	function focusSearch(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
			event.preventDefault();
			searchContainer.querySelector("input")?.focus();
		}
	}
</script>

<svelte:window onkeydown={focusSearch} />

<svelte:head>
	<title>{metadata.title} | Orbit Control</title>
	<meta name="description" content={metadata.description} />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to main content</a>

<div class="dashboard-shell">
	<aside class="sidebar">
		<div class="brand">
			<span class="brand-mark">AX</span>
			<span>Orbit Control</span>
		</div>

		<p class="sidebar-label">Workspace</p>

		<Nav aria-label="Desktop navigation" mode="vertical">
			<NavGroup>
				{#each routes.filter(([, route]) => route.navGroup === "workspace") as [pathname, route]}
					<NavItem aria-current={current(pathname)} href={pathname} type="link">{route.navLabel}</NavItem>
				{/each}
			</NavGroup>

			<NavItem type="divider" />

			<NavGroup>
				{#each routes.filter(([, route]) => route.navGroup === "account") as [pathname, route]}
					<NavItem aria-current={current(pathname)} href={pathname} type="link">{route.navLabel}</NavItem>
				{/each}
				<NavItem href="mailto:support@aeonix.dev" type="link">Contact support</NavItem>
			</NavGroup>
		</Nav>

		<div class="sidebar-footer">
			<Divider />

			<div class="user-summary">
				<Avatar alt="Jane Doe" status="online" variant="primary">JD</Avatar>

				<div class="user-copy">
					<strong>Jane Doe</strong>
					<span>Platform admin</span>
				</div>
			</div>
		</div>
	</aside>

	<div class="workspace">
		<header class="topbar">
			<div class="brand topbar-brand">
				<span class="brand-mark">AX</span>
				<span>Acme Cloud</span>
			</div>

			<div class="command-search" bind:this={searchContainer}>
				<Input
					aria-label="Search services, logs, or members"
					aria-controls="dashboard-search-results"
					aria-expanded={searchQuery.trim().length > 0}
					bind:value={searchQuery}
					class="command-search-input"
					id="dashboard-search"
					placeholder="Search services, logs, or members"
					type="search"
				/>

				<span aria-hidden="true" class="command-shortcut">
					<Kbd size="sm">⌘</Kbd>
					<Kbd size="sm">K</Kbd>
				</span>

				{#if searchQuery.trim()}
					<div class="command-results" id="dashboard-search-results">
						{#if searchResults.length > 0}
							{#each searchResults as [pathname, route]}
								<a href={pathname} onclick={() => (searchQuery = "")}>
									<strong>{route.navLabel}</strong>
									<span>{route.description}</span>
								</a>
							{/each}
						{:else}
							<p role="status">No dashboard pages match “{searchQuery.trim()}”.</p>
						{/if}
					</div>
				{/if}
			</div>

			<div class="topbar-actions">
				<Tooltip content={darkMode ? "Use light theme" : "Use dark theme"} position="bottom">
					{#snippet children(triggerProps)}
						<Button
							{...triggerProps}
							aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
							onclick={toggleTheme}
							size="sm"
							variant="default"
						>
							{darkMode ? "Light" : "Dark"}
						</Button>
					{/snippet}
				</Tooltip>

				<Avatar alt="Jane Doe" size="sm" status="online" variant="primary">JD</Avatar>
			</div>
		</header>

		<div class="mobile-nav">
			<Nav aria-label="Mobile navigation" mode="horizontal">
				{#each routes as [pathname, route]}
					<NavItem aria-current={current(pathname)} href={pathname} type="link">{route.navLabel}</NavItem>
				{/each}
				<NavItem href="mailto:support@aeonix.dev" type="link">Contact support</NavItem>
			</Nav>
		</div>

		<main class="dashboard-main" id="main-content" tabindex="-1">
			<Breadcrumb size="sm" type="pills">
				{#each metadata.breadcrumbs as breadcrumb}
					<BreadcrumbItem href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbItem>
				{/each}

				<BreadcrumbItem current>{metadata.title}</BreadcrumbItem>
			</Breadcrumb>

			<header class="page-header">
				<div>
					<p class="eyebrow">{metadata.section}</p>
					<h1>{metadata.title}</h1>
					<p>{metadata.description}</p>
				</div>

				{#if pageActions}
					<div class="page-actions">
						{@render pageActions()}
					</div>
				{/if}
			</header>

			{@render children()}
		</main>
	</div>
</div>

<ToastContainer duration={4500} maxToasts={3} />
