import getConfig from "../util/getConfig.ts";
import WeatherData from "../defs/WeatherData.ts";
import DataInput from "../defs/DataInput.ts";

const config = await getConfig("inputs", "wunderground", {
	"apiKey": "HERE",
});

// Constants
const requestUrl =
	`https://api.weather.com/v2/pws/observations/current?apiKey=${config.apiKey}&numericPrecision=decimal`;

const getData: DataInput<WundergroundOpts> = async function (
	opts,
): Promise<WeatherData> {
	// Fetch
	const response = await fetch(
		`${requestUrl}&stationId=${opts.stationId}&format=json&units=e`,
	);
	let data = await response.json();

	// Parse
	data = data.observations[0];
	data.date = data.obsTimeUtc;
	data = { ...data, ...data.imperial };
	delete data.imperial;
	return data;
};

type WundergroundOpts = {
	stationId: string;
};

export type { WundergroundOpts };
export default getData;
