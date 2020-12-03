import getConfig from "../util/getConfig.ts";
import DataInput from "../defs/DataInput.ts";
const config = await getConfig("inputs", "ambientweather", {
    "apiKey": "HERE",
    "appKey": "HERE"
});
const requestUrl = `https://api.ambientweather.net/v1/devices/?apiKey=${config.apiKey}&applicationKey=${config.appKey}`;

const getData: DataInput = async function() {
    let response = await fetch(requestUrl);
    let json = await response.text();
    let data:any;
    try {
        data = JSON.parse(json);
    } catch (e) {
        throw new Error("Ambient didn't return valid JSON!")
    }
    let dev = data[0];
    if (dev === undefined) {
        throw new Error("Could not get devices from Ambient!")
    }
    return data[0].lastData;
}

export default getData;