import WeatherData from "../defs/WeatherData.ts";
import DataInput from "../defs/DataInput.ts";

type ImageInputOpts = {
    url: string,
}
export type {ImageInputOpts}
const getData: DataInput = async function(options): Promise<WeatherData> {
    let opts = options as ImageInputOpts;
    let response = await fetch(opts.url);
    let arr = await response.arrayBuffer();

	let data = {
		image: new Uint8Array(arr),
	}
    return data as WeatherData;
}

export default getData;
