import DataOutput from "../defs/DataOutput.ts";
import textPad from "../util/textPad.ts";
import getDateString from "../util/getDateString.ts";
import tempToColor, { hexToRGB } from "../util/tempToColor.ts";
import * as Colors from "https://deno.land/std@0.167.0/fmt/colors.ts";

const output: DataOutput<undefined> = function output(
	data,
	_opt,
	datafields,
	gradients,
) {
	// Get max display name length
	const max = datafields
		.filter((v) => v.perConfig.console !== undefined)
		.reduce(
			(p, v) => v.displayName.length > p ? v.displayName.length : p,
			0,
		);

	// Begin!
	this.console.log(
		"Weather Report for " + getDateString(new Date(data.date as string)),
	);

	// For every datafield with a console perconfig
	datafields.filter((v) => v.perConfig.console !== undefined).forEach((v) => {
		// Ensure there's actually data
		const exists = data[v.fieldName] !== null &&
			data[v.fieldName] !== undefined;

		const value = data[v.fieldName] as number;

		// Value string
		let str = exists ? value.toString() : "No Data";
		if (exists) {
			const gradient = gradients[v.gradient];
			try {
				const colorHex = tempToColor(value, gradient);
				const color = hexToRGB(colorHex);
				str = Colors.rgb24(str.toString(), {
					r: color[0],
					g: color[1],
					b: color[2],
				});
			} catch (e) {
				this.console.log("Strange error!\n" + e);
			}
		}
		// Log value
		this.console.log(
			`${textPad(v.displayName, max)}: ${str}${
				Colors.reset(exists ? v.unit : "")
			}`,
		);
	});
};

type ConsolePerconf = {
	print: true;
};

export type { ConsolePerconf };
export default output;
