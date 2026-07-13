<script lang="ts" module>
	import type { Snippet } from "svelte";
	import { setContext } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { buttonGroupContextKey, type ButtonGroupContext } from "./ButtonGroup.js";
	import type { Variant } from "./types.js";

	type NativeButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "class">;

	export type ButtonGroupProps = NativeButtonGroupProps & {
		children?: Snippet;
		class?: string;
		disabled?: boolean;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let { children, class: className = "", disabled, role = "group", variant, ...restProps }: ButtonGroupProps = $props();

	const context: ButtonGroupContext = {
		get disabled() {
			return disabled;
		},
		get variant() {
			return variant;
		},
	};

	setContext(buttonGroupContextKey, context);
</script>

<div
	{...restProps}
	class={[
		"inline-flex items-center [&>:not(:first-child)]:rounded-l-none [&>:not(:last-child)]:rounded-r-none [&>*+*]:ml-px",
		className,
	]}
	{role}
>
	{#if children}
		{@render children()}
	{/if}
</div>
