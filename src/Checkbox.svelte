<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import { getContext } from "svelte";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { formContextKey, type FormContext } from "./Form.js";

	const checkboxVariants = cva(
		[
			"size-4 shrink-0 cursor-pointer rounded",
			"border border-foreground/20 accent-primary",
			"disabled:cursor-not-allowed disabled:opacity-50",
		],
		{
			defaultVariants: {
				readonly: false,
			},
			variants: {
				readonly: {
					false: "focus:outline-none focus:ring-2 focus:ring-primary/30",
					true: null,
				},
			},
		},
	);

	type NativeCheckboxProps = Omit<HTMLInputAttributes, "checked" | "class" | "onclick" | "onkeydown" | "type">;

	export type CheckboxProps = NativeCheckboxProps & {
		checked?: boolean;
		class?: string;
		onclick?: HTMLInputAttributes["onclick"];
		onkeydown?: HTMLInputAttributes["onkeydown"];
		readonly?: boolean;
	};
</script>

<script lang="ts">
	const form = getContext<FormContext | undefined>(formContextKey);

	let {
		checked = $bindable(false),
		class: className = "",
		onclick,
		onkeydown,
		readonly: isReadonly = false,
		...restProps
	}: CheckboxProps = $props();

	const effectiveReadonly = $derived(isReadonly || form?.isReadonly || false);
	const classes = $derived(checkboxVariants({ class: className, readonly: effectiveReadonly }));
</script>

<input
	{...restProps}
	aria-readonly={effectiveReadonly}
	type="checkbox"
	bind:checked
	class={classes}
	onclick={(event) => {
		if (effectiveReadonly) {
			event.preventDefault();
		}
		onclick?.(event);
	}}
	onkeydown={(event) => {
		if (effectiveReadonly && event.key !== "Tab") {
			event.preventDefault();
		}
		onkeydown?.(event);
	}}
/>
