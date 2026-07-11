import type { Preview } from "@storybook/svelte";
import { themes } from "storybook/theming";
import "./preview.css";
import "./styles.css";

const preview: Preview = {
	decorators: [
		(Story, context) => {
			if (typeof document !== "undefined") {
				const isDark = context.globals.theme === "dark";
				const root = document.documentElement;
				const body = document.body;

				root.classList.toggle("dark", isDark);
				body.classList.toggle("dark", isDark);

				const styles = getComputedStyle(root);
				const background = styles.getPropertyValue("--color-background").trim();
				const foreground = styles.getPropertyValue("--color-foreground").trim();

				root.style.backgroundColor = background;
				body.style.backgroundColor = background;
				body.style.color = foreground;
			}

			return Story();
		},
	],
	globalTypes: {
		theme: {
			defaultValue: "dark",
			description: "Preview theme",
			name: "Theme",
			toolbar: {
				dynamicTitle: true,
				icon: "mirror",
				items: [
					{ title: "Light", value: "light" },
					{ title: "Dark", value: "dark" },
				],
			},
		},
	},
	initialGlobals: { theme: "dark" },
	parameters: {
		backgrounds: { disable: true },
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
		docs: { theme: themes.dark },
	},
};

export default preview;
