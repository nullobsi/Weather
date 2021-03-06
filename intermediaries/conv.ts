import Intermediary from "../defs/Intermediary.ts";

type ConvOpts = {
    fieldName: string,
    nFieldName: string,
    func: (n: number) => number
}

const Conv: Intermediary = async function(opts, data) {
    const o = opts as ConvOpts;
    let v = data[o.fieldName];
    if (v !== undefined && v !== null) {
        data[o.nFieldName] = o.func(v);
    }
}

export type {ConvOpts}
export default Conv;