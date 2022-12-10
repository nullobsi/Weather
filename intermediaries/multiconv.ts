import Intermediary from "../defs/Intermediary.ts";

// Run one convert on multiple inputs.
const Conv: Intermediary<MultiConvIOpts> = function (o, data) {
	o.fieldNames.forEach((s) =>
		data[s.replace(o.from, o.to)] = o.func(data[s] as number)
	);
};

type MultiConvIOpts = {
	fieldNames: string[];
	from: string;
	to: string;
	func: (n: number) => number;
};

export type { MultiConvIOpts };
export default Conv;
