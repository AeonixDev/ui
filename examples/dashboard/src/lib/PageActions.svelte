<script lang="ts">
	import { getContext } from "svelte";
	import type { Snippet } from "svelte";
	import { pageHeaderContextKey, type PageHeaderContext } from "./PageHeader.js";

	let { children }: { children: Snippet } = $props();

	const pageHeader = getContext<PageHeaderContext>(pageHeaderContextKey);

	$effect(() => {
		pageHeader.setActions(children);

		return () => pageHeader.clearActions(children);
	});
</script>
