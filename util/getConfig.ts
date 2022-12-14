import * as fs from "https://deno.land/std@0.167.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
import * as Colors from "https://deno.land/std@0.167.0/fmt/colors.ts";

// Make sure only one can be checked at a time
let locked = false;
function lock() {
	return new Promise<void>((res) => {
		const check = setInterval(() => {
			if (locked) return;
			clearInterval(check);
			locked = true;
			res();
		}, 100);
	});
}

async function getConfig<T extends Record<string, unknown>>(
	subdir: string,
	moduleName: string,
	def: T,
): Promise<T> {
	// Lock
	await lock();

	// Create config path
	const configPath = path.join(
		Deno.cwd(),
		subdir,
		"config",
		moduleName + ".json",
	);
	const configFolder = path.join(Deno.cwd(), subdir, "config");
	const pathExists = await fs.exists(configFolder);
	if (!pathExists) {
		await Deno.mkdir(configFolder);
	}

	// Use existing config if avaialable
	const configExists = await fs.exists(configPath);
	if (configExists) {
		try {
			const readConfig = await Deno.readTextFile(configPath);
			const parsed = JSON.parse(readConfig) as T;

			// Find if default has changed
			// Get keys of default object
			const keys: (keyof T)[] = Object.keys(def);
			for (let i = 0; i < keys.length; i++) {
				// Get key
				const key = keys[i];
				// If key is missing...
				if (parsed[key] === undefined) {
					// Combine default with parsed
					const combo = { ...def, ...parsed };
					// Write to file, complain & exit.
					const stringed = JSON.stringify(combo, undefined, 4);
					await Deno.writeTextFile(configPath, stringed);
					console.error(
						Colors.red(
							Colors.bold(
								`Config for module ${subdir}/${moduleName} is missing parameters, check file written to disk!`,
							),
						),
					);
					Deno.exit(1);
				}
			}
			// Unlock
			locked = false;
			return parsed;
		} catch (e) {
			console.error("Could not read config for " + moduleName + "!");
			throw (e);
		}
	} else {
		// Write default config
		try {
			const stringed = JSON.stringify(def, undefined, 4);
			await Deno.writeTextFile(configPath, stringed);
		} catch (e) {
			console.error(
				"Could not write default config for " + moduleName + "!",
			);
			throw (e);
		}
		// Error and exit
		console.error(
			Colors.red(
				Colors.bold(
					`No config for module ${subdir}/${moduleName}, please check the default config written to disk!`,
				),
			),
		);
		Deno.exit(1);
	}
	locked = false;
}

export default getConfig;
