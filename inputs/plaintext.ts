import DataInput from "../defs/DataInput.ts";
import WeatherData from "../defs/WeatherData.ts";

const getData: DataInput<PlaintextOpts> = async function (opts) {
	const response = await fetch(opts.url);
	const text = await response.text();

	let parsed = text
		.split("\n")
		.filter((s) => !s.startsWith("#") && s.length != 0)
		.map((s) => s.includes("\t") ? s.split("\t") : s.split(/ +/));
	if (opts.reverse) {
		parsed = parsed.reverse();
	}

	const data: WeatherData = {};
	opts.values.forEach((v) => {
		let i = 0;
		while (i < parsed.length - 1 && parsed[i][v.index] == "MM") i++;
		const n = parseFloat(parsed[i][v.index]);
		data[v.name] = isNaN(n) ? parsed[i][v.index] : n;
	});

	if (opts.getDate) {
		data["date"] = opts.getDate(parsed, text);
	} else if (opts.getDate !== false) {
		data["date"] = new Date();
	}
	return data;
};

type PlaintextOpts = {
	reverse: boolean;
	url: string;
	values: { name: string; index: number }[];
	getDate?: ((parsed: string[][], raw: string) => Date) | false;
};

export type { PlaintextOpts };
export default getData;
