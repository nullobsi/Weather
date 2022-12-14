import Intermediary from "../defs/Intermediary.ts";

// Calculate humidity from T and Dp
const dataTransform: Intermediary<HumIOpts> = function (
	o,
	data,
) {
	// Creds to NOAA
	const a = data[o.tempF] as number; //Air Temperature
	const b = data[o.dewPt] as number; //Dew Point
	const a_c = (5.0 / 9.0) * (a - 32.0);
	const b_c = (5.0 / 9.0) * (b - 32.0);
	const c = 6.11 * Math.pow(10, 7.5 * a_c / (237.7 + a_c)); //saturation vapor pressure
	const d = 6.11 * Math.pow(10, 7.5 * b_c / (237.7 + b_c)); //actual vapor pressure
	data[o.humidityOut] = (d / c) * 100; //relative humidity
};

type HumIOpts = {
	dewPt: string;
	tempF: string;

	humidityOut: string;
};

export type { HumIOpts };
export default dataTransform;
