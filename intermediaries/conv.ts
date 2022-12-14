import Intermediary from "../defs/Intermediary.ts";

// Simple conversion. Call function on field -> nfield
const Conv: Intermediary<ConvIOpts> = function (o, data) {
	const v = data[o.fieldName] as number;
	if (v !== undefined && v !== null) {
		data[o.nFieldName] = o.func(v);
	}
};

type ConvIOpts = {
	fieldName: string;
	nFieldName: string;
	func: (n: number) => number;
};

export type { ConvIOpts };
export default Conv;
