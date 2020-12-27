import DataInput from "../defs/DataInput.ts";


const getData: DataInput = async function(options) {
    let opts = options as AmbientPerconf;
    const requestUrl = `https://api.ambientweather.net/v1/devices/?apiKey=${opts.apiKey}&applicationKey=${opts.appKey}`;
    let response = await fetch(requestUrl);
    let json = await response.text();
    let data:any;
    try {
        data = JSON.parse(json);
    } catch (e) {
        throw new Error("Ambient didn't return valid JSON!")
    }
    let dev = data[opts.device];
    if (dev === undefined) {
        console.log(data);
        throw new Error("Could not get devices from Ambient!")
    }
    return data[opts.device].lastData;
}

type AmbientPerconf = {
    apiKey: string,
    appKey: string,
    device: number
}

export type {AmbientPerconf}
export default getData;