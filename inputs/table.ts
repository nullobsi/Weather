import DataInput from "../defs/DataInput.ts";
import WeatherData from "../defs/WeatherData.ts";

type TableOpts = {
    url: string
}
/*
 *
 * table
 *      tbody
 *          tr
 *              th Title
 *              td Value
 */



const getData: DataInput = async function(options) {
    let opt = options as TableOpts;
    let response = await fetch(opt.url);
    let txt = await response.text();
    let dat:WeatherData = {};
    let dateR = /<b>Record Date: <\/b>(?<datStr>[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{2})<br>/gim;
    let res = dateR.exec(txt);
    if (res && res.groups) {
        dat["date"] = new Date(res.groups.datStr);
    }

    let r = /<tr><th>(?<title>.+)<\/th><td>(?<value>.+)<\/td><\/tr>/gim;
    let m;
    do {
        m = r.exec(txt);
        if (m && m.groups) {
            dat[m.groups.title] = parseFloat(m.groups.value);
        }
    } while (m)

    return dat;
}
export type {TableOpts}
export default getData;