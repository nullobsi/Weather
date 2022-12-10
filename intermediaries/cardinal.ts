import Intermediary from "../defs/Intermediary.ts";

const dataTransform: Intermediary<CardinalIOpts> = function (
	o,
	data,
	_keypoints,
	pipeline,
) {
	// Find datafield where there is an imageconfig and field name matches
	const found = pipeline.datafields.find((v) =>
		v.perConfig?.image && v.fieldName == o.fieldName
	);
	if (found) {
		// Assign cardinal based on degrees
		const deg = data[found.fieldName] as number;
		let cardinal = "";
		if (deg < 11.25) cardinal = "N";
		else if (deg < 33.75) cardinal = "NNE";
		else if (deg < 56.25) cardinal = "NE";
		else if (deg < 78.75) cardinal = "ENE";
		else if (deg < 101.25) cardinal = "E";
		else if (deg < 123.75) cardinal = "ESE";
		else if (deg < 146.25) cardinal = "SE";
		else if (deg < 168.75) cardinal = "SSE";
		else if (deg < 191.25) cardinal = "S";
		else if (deg < 213.75) cardinal = "SSW";
		else if (deg < 236.25) cardinal = "SW";
		else if (deg < 258.75) cardinal = "WSW";
		else if (deg < 281.25) cardinal = "W";
		else if (deg < 303.75) cardinal = "WNW";
		else if (deg < 326.25) cardinal = "NW";
		else if (deg < 348.75) cardinal = "NNW";
		else if (deg < 360) cardinal = "N";
		// Assign into displayname
		found.displayName = cardinal;
	}
};

type CardinalIOpts = {
	fieldName: string;
};

export type { CardinalIOpts };
export default dataTransform;
