import Intermediary from "../defs/Intermediary.ts";

// Cardinal -> Deg
const map: { [x: string]: number } = {
	"N": 0,
	"NNE": 22.5,
	"NE": 45,
	"ENE": 67.5,
	"E": 90,
	"ESE": 112.5,
	"SE": 135,
	"SSE": 157.5,
	"S": 180,
	"SSW": 202.5,
	"SW": 225,
	"WSW": 247.5,
	"W": 270,
	"WNW": 292.5,
	"NW": 315,
	"NNW": 337.5,
};

const dataTransform: Intermediary<DegTIOpts> = function (
	o,
	data,
	_keypoints,
	pipeline,
) {
	// Map function
	data[o.nField] = map[data[o.field] as string];

	// Also update display for image perconf
	const found = pipeline.datafields.find((v) =>
		v.perConfig?.image && v.fieldName == o.nField
	);
	if (found !== undefined) {
		found.displayName = data[o.field] as string;
	}
};

type DegTIOpts = {
	field: string;
	nField: string;
};

export type { DegTIOpts };
export default dataTransform;
