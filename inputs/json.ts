import DataInput from "../defs/DataInput.ts";
import WeatherData from "../defs/WeatherData.ts";

const getData: DataInput<JsonOpts> = async function (o) {
	const res = await fetch(o.url);
	const data = await res.json();

	const finalData: WeatherData = {};
	for (const k in data) {
		// Flatten arrays into name${i}
		if (data[k] instanceof Array) {
			(data[k] as number[]).forEach((v, i) => {
				finalData[k + i.toString()] = v;
			});
		} else {
			finalData[k] = data[k];
		}
	}

	// Use supplied getDate function if needed
	if (o.getDate) {
		finalData.date = o.getDate(data);
	} else if (o.getDate !== false) {
		// Otherwise just use today
		finalData.date = new Date();
	}
	return finalData;
};

type JsonOpts = {
	url: string;
	getDate?: ((data: WeatherData) => Date) | false;
};

export type { JsonOpts };
export default getData;
