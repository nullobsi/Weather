import getConfig from "../util/getConfig.ts";
import WeatherData from "../defs/WeatherData.ts";
import DataInput from "../defs/DataInput.ts";
const config = await getConfig("inputs", "ambientweather", {
    "apiKey": "HERE",
    "appKey": "HERE"
});
const requestUrl = `https://api.ambientweather.net/v1/devices/?apiKey=${config.apiKey}&applicationKey=${config.appKey}`;

const getData: DataInput = async function(): Promise<WeatherData> {
    let response = await fetch(requestUrl);
    let json = await response.text();
    console.log(json);
    let data = JSON.parse(json);
    return data[0].lastData as WeatherData;
}

export default getData;