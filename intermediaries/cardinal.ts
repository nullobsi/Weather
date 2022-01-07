import Intermediary from "../defs/Intermediary.ts";
type CardinalOpts = {
    fieldName: string;
};

let dataTransform: Intermediary = async function (opts, data, keypoints, pipeline) {
    let o = opts as CardinalOpts;
    let found = pipeline.datafields.find(v => {
        let thing = v.perConfig?.image
        return thing && v.fieldName == o.fieldName;
    })
    if (found) {
        let deg = data[found.fieldName];
        let cardinal = "";
        if (deg < 11.25) cardinal = "N"
        else if (deg < 33.75) cardinal = "NNE"
        else if (deg < 56.25) cardinal = "NE"
        else if (deg < 78.75) cardinal = "ENE"
        else if (deg < 101.25) cardinal = "E"
        else if (deg < 123.75) cardinal = "ESE"
        else if (deg < 146.25) cardinal = "SE"
        else if (deg < 168.75) cardinal = "SSE"
        else if (deg < 191.25) cardinal = "S"
        else if (deg < 213.75) cardinal = "SSW"
        else if (deg < 236.25) cardinal = "SW"
        else if (deg < 258.75) cardinal = "WSW"
        else if (deg < 281.25) cardinal = "W"
        else if (deg < 303.75) cardinal = "WNW"
        else if (deg < 326.25) cardinal = "NW"
        else if (deg < 348.75) cardinal = "NNW"
        else if (deg < 360) cardinal = "N"
        found.displayName = cardinal;
    }
}

export default dataTransform;
export type {CardinalOpts};
