import Intermediary from "../defs/Intermediary.ts";

// Sometimes, even though T = Dp, humidity is not 100.
const fixdewpt: Intermediary<FixDewPtIOpts> = (o, data) => {
	const T = data[o.tempF] as number;
	const Dp = data[o.dewpt] as number;

	if (T.toFixed(o.presc) == Dp.toFixed(o.presc)) {
		data[o.humidity] = 100;
	}
};

type FixDewPtIOpts = {
	tempF: string;
	dewpt: string;
	humidity: string;
	presc: number;
};

export type { FixDewPtIOpts };
export default fixdewpt;
