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
export {TableOpts}
export default getData;