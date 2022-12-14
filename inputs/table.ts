import DataInput from "../defs/DataInput.ts";
import WeatherData from "../defs/WeatherData.ts";

/*
 *
 * table
 *      tbody
 *          tr
 *              th Title
 *              td Value
 */

const getData: DataInput<TableOpts> = async function (opt) {
	// Fetch
	const response = await fetch(opt.url);
	const txt = await response.text();
	// Parse
	const data: WeatherData = {};
	// Find date, store if found
	const dateRecordString =
		/<b>Record Date: <\/b>(?<datStr>[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2})<br>/gim;
	const res = dateRecordString.exec(txt);
	if (res && res.groups) {
		data["date"] = new Date(res.groups.datStr);
	}

	// Loop on regex until no more matches
	const regex = /<tr><th>(?<title>.+)<\/th><td>(?<value>.+)<\/td><\/tr>/gim;
	let match;
	do {
		match = regex.exec(txt);
		// Use title & value
		if (match && match.groups) {
			data[match.groups.title] = parseFloat(match.groups.value);
		}
	} while (match);

	return data;
};

type TableOpts = {
	url: string;
};

export type { TableOpts };
export default getData;
