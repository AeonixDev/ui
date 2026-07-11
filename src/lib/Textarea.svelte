<script lang="ts" module>
	import { getContext } from "svelte";
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import { formContextKey, type FormContext } from "./Form.js";
	import { formControlVariants } from "./FormControl.js";

	type NativeTextareaProps = Omit<HTMLTextareaAttributes, "class" | "value">;

	export type TextareaProps = NativeTextareaProps & {
		class?: string;
		fullWidth?: boolean;
		value?: HTMLTextareaAttributes["value"];
	};
</script>

<script lang="ts">
	const form = getContext<FormContext | undefined>(formContextKey);

	let {
		class: className = "",
		fullWidth,
		readonly: isReadonly = false,
		value = $bindable(),
		...restProps
	}: TextareaProps = $props();

	const effectiveReadonly = $derived(isReadonly || form?.isReadonly || false);
	const effectiveFullWidth = $derived(fullWidth ?? form?.fullWidth ?? true);
	const classes = $derived(
		formControlVariants({
			class: ["min-h-24 resize-y px-3 py-2 placeholder:text-foreground/50", className],
			fullWidth: effectiveFullWidth,
			readonly: effectiveReadonly,
		}),
	);
</script>

<textarea {...restProps} bind:value class={classes} readonly={effectiveReadonly}></textarea>
