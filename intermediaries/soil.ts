import Intermediary from "../defs/Intermediary.ts";

type SoilIOpts = {fieldName: string}
export type {SoilIOpts}
let dataTransform: Intermediary = async function (opts, data, keypoints, pipeline) {
    let fieldName = (opts as SoilIOpts).fieldName;
    let point = data[fieldName]
    if (point === undefined) return;
    data[fieldName] = Math.round(point / (100 / 15));
}

export default dataTransform;
