import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	clearScreen: false,
	plugins: [tailwindcss(), sveltekit()],
	server: { host: "0.0.0.0", port: 21001 },
});
