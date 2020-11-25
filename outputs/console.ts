import WeatherData from "../defs/WeatherData.ts";
import Datafields from "../defs/Datafields.ts";
import Gradients from "../defs/Gradients.ts";
import DataOutput from "../defs/DataOutput.ts";
import textPad from "../util/textPad.ts";
import getDateString from "../util/getDateString.ts";
import tempToColor, {hexToRGB} from "../util/tempToColor.ts";
import * as Colors from "https://deno.land/std@0.76.0/fmt/colors.ts"

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
        let exists = data[v.fieldName] !== null && data[v.fieldName] !== undefined
        let str = exists ? data[v.fieldName] : "No Data";
        if (exists) {
            let temp = data[v.fieldName];
            let grad = gradients[v.gradient];
            let color = hexToRGB(tempToColor(temp, grad));
            str = Colors.rgb24(str.toString(), {
                r: color[0],
                g: color[1],
                b: color[2]
            });
        }
        console.log(`${textPad(v.displayName,max)}: ${str}${Colors.reset(exists ? v.unit : "")}`);
    });

}

export default output;