import WeatherData from "../defs/WeatherData.ts";
import Datafields from "../defs/Datafields.ts";
import Gradients from "../defs/Gradients.ts";
import DataOutput from "../defs/DataOutput.ts";
import textPad from "../util/textPad.ts";
import getDateString from "../util/getDateString.ts";

type ConsolePerconf = {
    print: true
}
export type {ConsolePerconf};

const output: DataOutput = async function output(data: WeatherData, opt, datafields: Datafields, gradients: Gradients) {
    let max = datafields
        .filter(v => v.perConfig.console !== undefined)
        .reduce((p,v) => v.displayName.length > p ? v.displayName.length : p,0)
    console.log("Weather Report for " + getDateString(new Date(data.date)));
    datafields.filter(v => v.perConfig.console !== undefined).forEach(v => {
        console.log(`${textPad(v.displayName,max)}: ${data[v.fieldName] !== null && data[v.fieldName] !== undefined ? data[v.fieldName] : "No Data"} ${v.unit}`);
    });

}

export default output;