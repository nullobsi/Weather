import DataOutput from "../defs/DataOutput.ts";
import * as path from "https://deno.land/std@0.167.0/path/mod.ts";

const output: DataOutput<RecordsOOpts> = async function (
	data,
	options,
	datafields,
) {
	const highRecordsPath = path.join(
		Deno.cwd(),
		"records",
		options.name + "-high.json",
	);
	const lowRecordsPath = path.join(
		Deno.cwd(),
		"records",
		options.name + "-low.json",
	);

	await Deno.mkdir(path.join(Deno.cwd(), "records"), {
		recursive: true,
	});

	let highRecords: Records = {};
	let lowRecords: Records = {};

	const newRecords: NewRecord[] = [];

	// Helper function
	const newRecord = (fieldName: string, last: Record) => {
		newRecords.push({
			fieldName,
			last,
		});
		this.console.log(
			`New Record! ${fieldName} has reached ${data[fieldName]}!`,
		);
	};

	// Read previous records
	try {
		const fileContents = await Deno.readTextFile(highRecordsPath);
		highRecords = JSON.parse(fileContents);
	} catch (e) {
		if (!(e instanceof Deno.errors.NotFound)) {
			throw e;
		}
	}

	try {
		const fileContents = await Deno.readTextFile(lowRecordsPath);
		lowRecords = JSON.parse(fileContents);
	} catch (e) {
		if (!(e instanceof Deno.errors.NotFound)) {
			throw e;
		}
	}

	// Convert dates to date objects, just in case
	[highRecords, lowRecords].forEach((o) => {
		for (const k in o) {
			o[k].at = new Date(o[k].at);
		}
	});

	// Find all record perconf
	datafields.forEach((field) => {
		const o = field.perConfig["records"];
		if (o == undefined) return;

		const value = data[field.fieldName] as number;

		// Add records if they don't exist
		if (
			highRecords[field.fieldName] === undefined ||
			highRecords[field.fieldName].value === undefined
		) {
			highRecords[field.fieldName] = {
				value,
				at: new Date(),
			};
		}
		if (
			lowRecords[field.fieldName] === undefined ||
			lowRecords[field.fieldName].value === undefined
		) {
			lowRecords[field.fieldName] = {
				value,
				at: new Date(),
			};
		}

		if (
			(o.type == "low" || o.type == "both") &&
			lowRecords[field.fieldName].value > value
		) {
			newRecord(field.fieldName, lowRecords[field.fieldName]);
			lowRecords[field.fieldName] = {
				value,
				at: new Date(),
			};
		}

		if (
			(o.type == "high" || o.type == "both") &&
			highRecords[field.fieldName].value < value
		) {
			newRecord(field.fieldName, highRecords[field.fieldName]);
			highRecords[field.fieldName] = {
				value,
				at: new Date(),
			};
		}
	});

	// Update records in data, and write file with records
	data.highRecords = highRecords;
	data.lowRecords = lowRecords;
	data.newRecords = newRecords;

	await Deno.writeTextFile(
		highRecordsPath,
		JSON.stringify(highRecords, null, 4),
	);
	await Deno.writeTextFile(
		lowRecordsPath,
		JSON.stringify(lowRecords, null, 4),
	);
};

interface RecordsPerconf {
	type: "low" | "high" | "both";
}

interface RecordsOOpts {
	name: string;
}

type Record = { value: number; at: Date };

type Records = {
	[x: string]: Record;
};

type NewRecord = { fieldName: string; last: Record };

export type { NewRecord, Record, RecordsOOpts, RecordsPerconf };
export default output;
