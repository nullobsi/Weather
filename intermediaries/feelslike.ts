import Intermediary from "../defs/Intermediary.ts";

// Greetz to Wikipedia
const FeelsLike: Intermediary<FeelsLikeIOpts> = (o, data) => {
	const T = data[o.tempF] as number;
	const W = data[o.windMph] as number;
	const RH = data[o.humidity] as number;
	if (
		T !== undefined && T !== null && W !== undefined && W !== null &&
		RH !== undefined && RH !== null
	) {
		if (T < 70) {
			// wind chill
			const windChill = 35.74 +
				0.6215 * T -
				35.75 * Math.pow(W, 0.16) +
				0.4275 * T * Math.pow(W, 0.16);
			if (windChill <= T) {
				data[o.nFieldName] = windChill;
			} else {
				data[o.nFieldName] = T;
			}
		} else if (T > 70) {
			// heat index
			let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094));
			HI = (HI + T) / 2;

			if (HI >= 80) {
				HI = -42.379 + 2.04901523 * T + 10.14333127 * RH -
					.22475541 * T * RH - .00683783 * T * T -
					.05481717 * RH * RH + .00122874 * T * T * RH +
					.00085282 * T * RH * RH - .00000199 * T * T * RH * RH;

				if (RH < 13 && 80 < T && T < 112) {
					HI -= ((13 - RH) / 4) *
						Math.sqrt((17 - Math.abs(T - 95)) / 17);
				} else if (RH > 85 && 80 < T && T < 87) {
					HI += ((RH - 85) / 10) * ((87 - T) / 5);
				}
			}

			if (HI < T) data[o.nFieldName] = T;
			else data[o.nFieldName] = HI;
		} else {
			data[o.nFieldName] = T;
		}
	}
};

type FeelsLikeIOpts = {
	tempF: string;
	windMph: string;
	humidity: string;
	nFieldName: string;
};

export type { FeelsLikeIOpts };
export default FeelsLike;
