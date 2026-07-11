import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";

async function removeStoryFiles(directory) {
	let entries;

	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error?.code === "ENOENT") {
			return;
		}

		throw error;
	}

	await Promise.all(
		entries.map(async (entry) => {
			const filePath = join(directory, entry.name);

			if (entry.isDirectory()) {
				await removeStoryFiles(filePath);
				return;
			}

			if (entry.isFile() && entry.name.includes(".stories.")) {
				await rm(filePath, { force: true });
			}
		}),
	);
}

await removeStoryFiles("dist");
