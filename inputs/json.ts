import DataInput from "../defs/DataInput.ts";
import Indexed from "../defs/Indexed.ts";
import WeatherData from "../defs/WeatherData.ts";


const getData: DataInput = async function(opts) {
    let o = opts as JsonOpts;
    let res = await fetch(o.url);
    let data = await res.json();

    let finalData: WeatherData = {};
    for (let k in data) {
        if (data[k] instanceof Array) {
            (data[k] as number[]).forEach((v, i) => {
                finalData[k + i.toString()] = v;
            });
        } else {
            finalData[k] = data[k];
        }
    }
    if (o.getDate) {
        finalData.date = o.getDate(data);
    } else if (o.getDate !== false) {
        finalData.date = new Date();
    }
    return finalData;
}

type JsonOpts = {
    url: string,
    getDate?: ((data: any) => Date) | false,
}

export type {JsonOpts}
export default getData;
