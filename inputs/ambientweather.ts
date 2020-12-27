import DataInput from "../defs/DataInput.ts";


const getData: DataInput = async function(options) {
    let opts = options as AmbientPerconf;
    const requestUrl = `https://api.ambientweather.net/v1/devices/${opts.device}?apiKey=${opts.apiKey}&applicationKey=${opts.appKey}`;
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
        console.log(data);
        throw new Error("Could not get devices from Ambient!")
    }
    return data[0];
}

type AmbientPerconf = {
    apiKey: string,
    appKey: string,
    device: string,
}

export type {AmbientPerconf}
export default getData;