import getConfig from "../util/getConfig.ts";
import DataInput from "../defs/DataInput.ts";

const config = await getConfig("inputs", "aqi", {
	"apiKey": "HERE",
});

const getData: DataInput<AqiOpts> = async function (opt) {
	// Format string
	const response = await fetch(
		`https://api.waqi.info/feed/geo:${opt.lat.toFixed(1)};${
			opt.lng.toFixed(1)
		}/?token=${config.apiKey}`,
	);
	let data = await response.json();

	// Check OK
	if (data.status !== "ok") throw new Error("AQI Fetch returned not ok!");

	// Return
	data = data.data;
	return { aqi: data.aqi /*pm25:data.iaqi.pm25.v*/ };
};

type AqiOpts = {
	lat: number;
	lng: number;
};

export type { AqiOpts };
export default getData;
