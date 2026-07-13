<script lang="ts" module>
	import { cva } from "class-variance-authority";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Variant } from "./types.js";

	export type DividerOrientation = "horizontal" | "vertical";

	const dividerVariants = cva("m-0 shrink-0 border-0", {
		defaultVariants: {
			orientation: "horizontal",
			variant: "default",
		},
		variants: {
			orientation: {
				horizontal: "h-px w-full",
				vertical: "h-auto min-h-6 w-px self-stretch",
			},
			variant: {
				default: "bg-foreground/20",
				error: "bg-error",
				info: "bg-info",
				primary: "bg-primary",
				secondary: "bg-secondary",
				success: "bg-success",
				warning: "bg-warning",
			},
		},
	});

	type NativeDividerProps = Omit<HTMLAttributes<HTMLHRElement>, "aria-orientation" | "class">;

	export type DividerProps = NativeDividerProps & {
		class?: string;
		orientation?: DividerOrientation;
		variant?: Variant;
	};
</script>

<script lang="ts">
	let { class: className = "", orientation = "horizontal", variant = "default", ...restProps }: DividerProps = $props();

	const classes = $derived(dividerVariants({ class: className, orientation, variant }));
</script>

<hr {...restProps} aria-orientation={orientation} class={classes} />
