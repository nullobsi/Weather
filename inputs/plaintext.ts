import DataInput from "../defs/DataInput.ts";
import Indexed from "../defs/Indexed.ts";
import WeatherData from "../defs/WeatherData.ts";


const getData: DataInput = async function(options) {
    let opts = options as PlaintextPerconf;
    let response = await fetch(opts.url);
    let text = await response.text();

    let parsed = text
        .split("\n")
        .filter(s => !s.startsWith("#") && s.length != 0)
        .map(s => s.includes("\t") ? s.split("\t") : s.split(/ +/));
    if(opts.reverse) {
        parsed = parsed.reverse();
    }

    let data: WeatherData = {};
    opts.values.forEach(v => {
        let i = 0;
        while (i < parsed.length-1 && parsed[i][v.index] == "MM") i++;
        data[v.name] = parseFloat(parsed[i][v.index])
    });
    return data;
}

type PlaintextPerconf = {
    reverse: boolean,
    url: string,
    values: {name: string, index: number}[]
}


export type {PlaintextPerconf}
export default getData;
