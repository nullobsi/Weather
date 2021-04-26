import DataInput from "../defs/DataInput.ts";
import Indexed from "../defs/Indexed.ts";


const getData: DataInput = async function(options) {
    let opts = options as AmbientPerconf;
    const requestUrl = `https://api.ambientweather.net/v1/devices?apiKey=${opts.apiKey}&applicationKey=${opts.appKey}`;
    let response = await fetch(requestUrl);
    let json = await response.text();
    let data: AmbientData;
    try {
        data = JSON.parse(json);
    } catch (e) {
        throw new Error("Ambient didn't return valid JSON!")
    }
    let device = data.find(v => v.macAddress == opts.device);
    if (device === undefined) {
        this.console.log(data);
        throw new Error("Could not get devices from Ambient!")
    }
    return device.lastData;
}

type AmbientPerconf = {
    apiKey: string,
    appKey: string,
    device: string,
}

type AmbientData = {
    macAddress: string,
    info: Indexed<string>,
    lastData: Indexed<any>,
}[];

export type {AmbientPerconf}
export default getData;