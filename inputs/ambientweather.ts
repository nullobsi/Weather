import DataInput from "../defs/DataInput.ts";
import Indexed from "../defs/Indexed.ts";

const getData: DataInput<AmbientOpts> = async function (opts) {
	// Format URL
	const requestUrl =
		`https://api.ambientweather.net/v1/devices?apiKey=${opts.apiKey}&applicationKey=${opts.appKey}`;
	// Response -> JSON
	const response = await fetch(requestUrl);
	const data: AmbientData = await response.json();

	// Find device
	const device = data.find((v) => v.macAddress == opts.device);
	if (device === undefined) {
		this.console.log(data);
		throw new Error("Could not get devices from Ambient!");
	}

	// Use date
	if (device.lastData.date) {
		device.lastData.date = new Date(device.lastData.date as string);
	}

	// Return
	return device.lastData;
};

type AmbientOpts = {
	apiKey: string;
	appKey: string;
	device: string;
};

type AmbientData = {
	macAddress: string;
	info: Indexed<string>;
	lastData: Indexed<unknown>;
}[];

export type { AmbientOpts };
export default getData;
