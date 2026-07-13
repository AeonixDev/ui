import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	kit: {
		adapter: adapter(),
		// biome-ignore assist/source/useSortedKeys: The exact export must precede the wildcard alias.
		alias: { "@aeonixdev/ui/toast": "../../dist/Toast", "@aeonixdev/ui/*": "../../dist/*" },
	},
	preprocess: vitePreprocess(),
};

export default config;
