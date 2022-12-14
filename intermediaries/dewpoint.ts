import Intermediary from "../defs/Intermediary.ts";

// Constants
// const a = 6.1121; // mbar
const b = 18.678;
const c = 257.14; // deg C
const d = 234.5; // deg C

// Helper function
function lm(T: number, RH: number): number {
	return Math.log(
		(RH / 100) * Math.pow(Math.E, (b - (T / d)) * (T / (c + T))),
	);
}

// Greetz To Wikipedia
const DewPoint: Intermediary<DewPointIOpts> = (o, data) => {
	const Tf = data[o.tempF] as number;
	const RH = data[o.humidity] as number;
	if (Tf !== undefined && Tf !== null && RH !== undefined && RH !== null) {
		const T = (Tf - 32) / 1.8;
		const Tdp = (c * lm(T, RH)) / (b - lm(T, RH));
		data[o.nFieldName] = (Tdp * 1.8) + 32;
	}
};

type DewPointIOpts = {
	tempF: string;
	humidity: string;
	nFieldName: string;
};

export type { DewPointIOpts };
export default DewPoint;
