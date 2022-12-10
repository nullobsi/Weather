import DataInput from "../defs/DataInput.ts";
import WeatherData from "../defs/WeatherData.ts";

const getData: DataInput<CsvOpts> = async function (opts) {
	// Executable
	if (opts.runExecutable !== undefined) {
		// Run
		const process = Deno.run({
			cmd: opts.runExecutable,
			cwd: opts.workingDirectory,
			stdin: "null",
		});

		// Wait for finish
		const status = await process.status();
		if (status.code === 0) {
			this.console.log("Subprocess completed with code 0");
		} else {
			throw new Error("Subprocess failed with code " + status.code);
		}
	}

	// Read CSV file
	const text = await Deno.readTextFile(opts.filePath);
	const data: WeatherData = {};

	// Parse CSV
	for (const row of text.split("\n")) {
		const rowSplit = row.trim().split(",");
		const title = rowSplit.shift();
		for (let i = 0; i < rowSplit.length; i++) {
			data[`${title}${i}`] = parseFloat(rowSplit[i]);
		}
	}

	return data;
};

type CsvOpts = {
	runExecutable?: string[];
	filePath: string;
	workingDirectory?: string;
};

export type { CsvOpts };
export default getData;
