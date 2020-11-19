import Intermediary from "../defs/Intermediary.ts";

type SoilOpts = {fieldName: string}
export type {SoilOpts}
let dataTransform: Intermediary = async function (opts, data, keypoints, pipeline) {
    let fieldName = (opts as SoilOpts).fieldName;
    let point = data[fieldName]
    let nd = Math.round(point / (100/15))
    data[fieldName] = nd;
}

export default dataTransform;