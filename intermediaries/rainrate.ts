import Intermediary from "../defs/Intermediary.ts";

type RainRateIOpts = {
    fieldName: string,
    tempFieldName: string,
    lowEnd: number,
    highEnd: number
}

export type {RainRateIOpts}

let dataTransform: Intermediary = async function (opts, data, keypoints, pipeline) {
    let opt = opts as RainRateIOpts
    let rainrate = pipeline.datafields.filter(val => val.fieldName == opt.fieldName)
    rainrate.forEach(val => {
        let dat = data[opt.tempFieldName];
        if (dat === undefined) return;
        if (dat <= opt.lowEnd) val.gradient = "snow";
        else if (opt.lowEnd < dat && dat <= opt.highEnd) val.gradient = "mixed";
        else if (dat > opt.highEnd) val.gradient = "rainrate";
    });
}

export default dataTransform;
