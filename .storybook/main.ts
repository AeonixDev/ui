import type { StorybookConfig } from "@storybook/svelte-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
	addons: ["@storybook/addon-svelte-csf", "@storybook/addon-docs"],
	framework: { name: "@storybook/svelte-vite", options: {} },
	stories: ["../src/**/*.stories.@(js|mjs|ts|svelte)"],
	viteFinal: async (config) => ({ ...config, clearScreen: false, plugins: [...(config.plugins ?? []), tailwindcss()] }),
};

export default config;
