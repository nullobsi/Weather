import getConfig from "../util/getConfig.ts";
import WeatherData from "../defs/WeatherData.ts";
import DataInput from "../defs/DataInput.ts";
const config = await getConfig("inputs", "wunderground", {
    "apiKey": "HERE"
});
const requestUrl = `https://api.weather.com/v2/pws/observations/current?apiKey=${config.apiKey}&numericPrecision=decimal`;
type WundergroundOpts = {
    stationId: string
}
export type {WundergroundOpts}
const getData: DataInput = async function(options): Promise<WeatherData> {
    let opts = options as WundergroundOpts;
    let response = await fetch(`${requestUrl}&stationId=${opts.stationId}&format=json&units=e`);
    let json = await response.text();
    let data = JSON.parse(json);
    //await Deno.writeTextFile("./test.json", JSON.stringify(data, undefined, 4));
    data = data.observations[0];
    data.date = data.obsTimeUtc;
    data = {...data,...data.imperial};
    delete data.imperial;
    return data as WeatherData;
}

export default getData;
