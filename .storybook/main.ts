import type { StorybookConfig } from "@storybook/svelte-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
	addons: ["@storybook/addon-svelte-csf", "@storybook/addon-docs", "@storybook/addon-themes"],
	framework: { name: "@storybook/svelte-vite", options: {} },
	stories: ["../src/**/*.stories.svelte"],
	viteFinal: async (config) => ({ ...config, clearScreen: false, plugins: [...(config.plugins ?? []), tailwindcss()] }),
};

export default config;
