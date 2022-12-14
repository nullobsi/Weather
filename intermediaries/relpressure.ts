import Intermediary from "../defs/Intermediary.ts";

// Calculate relative pressure from absolute pressure
const RelPressure: Intermediary<RelPressureIOpts> = (o, data) => {
	const AP = data[o.absPressure] as number;
	const E = o.elevationM as number; // in meters for now
	const T = data[o.tempF] as number;
	if (
		AP !== undefined && AP !== null && E !== undefined && E !== null &&
		T !== undefined && T !== null
	) {
		const relativePressure = (AP / 0.029529983071445) *
			Math.pow(
				1 -
					((0.0065 * E) /
						(((T - 32) * (5.0 / 9)) + (0.0065 * E) + 273.15)),
				-5.257,
			); // hPa
		data[o.nFieldName] = relativePressure * 0.029529983071445; // inHg
	}
};

type RelPressureIOpts = {
	absPressure: string;
	elevationM: number;
	tempF: string;
	nFieldName: string;
};

export type { RelPressureIOpts };
export default RelPressure;
