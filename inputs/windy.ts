import DataInput from "../defs/DataInput.ts";
import getConfig from "../util/getConfig.ts";
import WeatherData from "../defs/WeatherData.ts";

const conf = await getConfig<{ apiKey: string }>("inputs", "windy", {
	apiKey: "HERE",
});

const getData: DataInput<WindyOpts> = async function (opt) {
	// Fetch
	const res = await fetch("https://api.windy.com/api/point-forecast/v2", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...opt,
			key: conf.apiKey,
		}),
	});
	const resp = await res.json();

	// Delete unneeded
	delete resp.ts;
	delete resp.units;

	// Some parsing
	const out: WeatherData = {};
	Object.keys(resp).forEach((k) => {
		out[k] = resp[k][0];
	});
	return out;
};

type SharedParams =
	| "temp"
	| "dewpoint"
	| "precip"
	| "convPrecip"
	| "wind"
	| "windGust"
	| "cape"
	| "ptype"
	| "lclouds"
	| "mclouds"
	| "hclouds"
	| "rh";
type UncommonP = "snowPrecip" | "pressure";
type Model = {
	model: "arome";
	parameters: Array<SharedParams>;
} | {
	model: "iconEu";
	parameters: Array<SharedParams | UncommonP | "gh">;
} | {
	model: "gfs";
	parameters: Array<SharedParams | UncommonP | "gh">;
} | {
	model: "namConus" | "namHawaii" | "namAlaska";
	parameters: Array<SharedParams | UncommonP>;
} | {
	model: "wavewatch";
	parameters: Array<"waves" | "windWaves" | "swell1" | "swell2">;
} | {
	model: "geos5";
	parameters: Array<"so2sm" | "dustsm" | "cosc">;
};
type WindyOpts = {
	lat: number;
	lon: number;
	levels: Array<
		| "surface"
		| "1000h"
		| "950h"
		| "925h"
		| "900h"
		| "850h"
		| "800h"
		| "700h"
		| "600h"
		| "500h"
		| "400h"
		| "300h"
		| "200h"
		| "150h"
	>;
} & Model;

export default getData;
export type { WindyOpts };
