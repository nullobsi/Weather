import WeatherData from "../defs/WeatherData.ts";
import Datafields from "../defs/Datafields.ts";
import Gradients from "../defs/Gradients.ts";
import DataOutput from "../defs/DataOutput.ts";
import textPad from "../util/textPad.ts";
import getDateString from "../util/getDateString.ts";

const output: DataOutput = async function output(data: WeatherData, opt, datafields: Datafields, gradients: Gradients) {
    let keys = Object.keys(data);
    let max = keys.reduce((p,v) => p < v.length ? v.length : p, 0);
    console.log("Weather Report for " + getDateString(new Date(data.date)));
    keys.forEach(v => {
        console.log(`${textPad(v,max)}: ${data[v] !== null && data[v] !== undefined ? data[v] : "No Data"}`);
    });
}

export default output;