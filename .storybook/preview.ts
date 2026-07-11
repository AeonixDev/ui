import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/svelte";
import { createElement, type PropsWithChildren, useEffect, useState } from "react";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes } from "storybook/theming";
import "./styles.css";

const ThemedDocsContainer = ({ context, children }: PropsWithChildren<DocsContainerProps>) => {
	const [theme, setTheme] = useState(() => {
		const story = context.componentStories()[0];
		return story && context.getStoryContext(story).globals.theme === "light" ? themes.light : themes.dark;
	});

	useEffect(() => {
		const updateTheme = ({ globals }: { globals: Record<string, unknown> }) => {
			setTheme(globals.theme === "light" ? themes.light : themes.dark);
		};

		context.channel.on(GLOBALS_UPDATED, updateTheme);
		return () => context.channel.off(GLOBALS_UPDATED, updateTheme);
	}, [context.channel]);

	return createElement(DocsContainer, { context, theme }, children);
};

const preview: Preview = {
	decorators: [withThemeByClassName({ defaultTheme: "dark", themes: { dark: "dark", light: "" } })],
	parameters: {
		backgrounds: { disable: true },
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
		docs: { container: ThemedDocsContainer },
	},
};

export default preview;
