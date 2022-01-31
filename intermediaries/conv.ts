import Intermediary from "../defs/Intermediary.ts";

type ConvIOpts = {
    fieldName: string,
    nFieldName: string,
    func: (n: number) => number
}

const Conv: Intermediary = async function(opts, data) {
    const o = opts as ConvIOpts;
    let v = data[o.fieldName];
    if (v !== undefined && v !== null) {
        data[o.nFieldName] = o.func(v);
    }
}

export type {ConvIOpts}
export default Conv;
