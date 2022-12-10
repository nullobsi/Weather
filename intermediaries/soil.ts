import Intermediary from "../defs/Intermediary.ts";

const dataTransform: Intermediary<SoilIOpts> = function (
	opts,
	data,
) {
	const fieldName = opts.fieldName;
	const point = data[fieldName] as number;
	if (point === undefined) return;
	data[fieldName] = Math.round(point / (100 / 15));
};

type SoilIOpts = { fieldName: string };

export type { SoilIOpts };
export default dataTransform;
