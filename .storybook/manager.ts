import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { addons } from "storybook/manager-api";
import { themes } from "storybook/theming";

addons.setConfig({ theme: themes.dark });

addons.register("theme-sync", (api) => {
	api.on(GLOBALS_UPDATED, ({ globals }) => {
		addons.setConfig({ theme: globals.theme === "light" ? themes.light : themes.dark });
	});
});
