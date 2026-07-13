import { cva } from "class-variance-authority";

export const formControlVariants = cva(
	[
		"box-border max-w-full rounded-lg",
		"border border-foreground/20 bg-surface shadow-sm",
		"text-sm text-surface-foreground transition-colors",
		"disabled:cursor-not-allowed disabled:opacity-50",
	],
	{
		defaultVariants: { fullWidth: true, readonly: false },
		variants: {
			fullWidth: { false: null, true: "w-full" },
			readonly: { false: "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30", true: null },
		},
	},
);
