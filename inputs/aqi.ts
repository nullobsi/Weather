import getConfig from "../util/getConfig.ts";
import DataInput from "../defs/DataInput.ts";
const config = await getConfig("inputs", "aqi", {
    "apiKey": "HERE"
});

type AqiOpts = {
    lat: number,
    lng: number,
}
export type {AqiOpts}
const getData: DataInput = async function(options) {
    let opt = options as AqiOpts;
    let response = await fetch(`https://api.waqi.info/feed/geo:${opt.lat.toFixed(1)};${opt.lng.toFixed(1)}/?token=${config.apiKey}`);
    let json = await response.text();
    let data = JSON.parse(json);
    if (data.status !== "ok") throw new Error("AQI Fetch returned not ok!");
    data = data.data
    return {aqi:data.aqi,/*pm25:data.iaqi.pm25.v*/};
}

export default getData;