import Intermediary from "../defs/Intermediary.ts";

const dataTransform: Intermediary<RainRateIOpts> = function (
	opt,
	data,
	_keypoints,
	pipeline,
) {
	const rainrate = pipeline.datafields.filter((val) =>
		val.fieldName == opt.fieldName
	);
	rainrate.forEach((val) => {
		const dat = data[opt.tempFieldName] as number;
		if (dat === undefined) return;
		if (dat <= opt.lowEnd) val.gradient = "snow";
		else if (opt.lowEnd < dat && dat <= opt.highEnd) val.gradient = "mixed";
		else if (dat > opt.highEnd) val.gradient = "rainrate";
	});
};

type RainRateIOpts = {
	fieldName: string;
	tempFieldName: string;
	lowEnd: number;
	highEnd: number;
};

export type { RainRateIOpts };
export default dataTransform;
