import Intermediary from "../defs/Intermediary.ts";

type SoilOpts = {fieldName: string}
export type {SoilOpts}
let dataTransform: Intermediary = async function (opts, data, keypoints, pipeline) {
    let fieldName = (opts as SoilOpts).fieldName;
    let point = data[fieldName]
    if (point === undefined) return;
    data[fieldName] = Math.round(point / (100 / 15));
}

export default dataTransform;