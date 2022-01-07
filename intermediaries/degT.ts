import Intermediary from "../defs/Intermediary.ts";
import file from "../outputs/file.ts";

type DegTOpts = {
    field: string,
    nField: string,
}
const map: {[x: string]: number} = {
    "N": 0,
    "NNE": 22.5,
    "NE": 45,
    "ENE": 67.5,
    "E": 90,
    "ESE": 112.5,
    "SE": 135,
    "SSE": 157.5,
    "S": 180,
    "SSW": 202.5,
    "SW": 225,
    "WSW": 247.5,
    "W": 270,
    "WNW": 292.5,
    "NW": 315,
    "NNW": 337.5,
}
let dataTransform: Intermediary = async function (opts, data, keypoints, pipeline) {
    let o = opts as DegTOpts;
    data[o.nField] = map[data[o.field]];
    let found = pipeline.datafields.find(v => {
        let thing = v.perConfig?.image
        return thing && v.fieldName == o.field;
    })
    if (found) {
        found.displayName = data[o.field];
    }
}

export default dataTransform;
export type {DegTOpts};
