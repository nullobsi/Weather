import Intermediary from "../defs/Intermediary.ts";

type MultiConvOpts = {
    fieldNames: string[],
    nFieldName: string,
    func: (n: number[]) => number
}

const Conv: Intermediary = async (opts, data) => {
    const o = opts as MultiConvOpts;
    let v = o.fieldNames.map(k => {
        return data[k] !== undefined && data[k] !== null ? data[k] : undefined
    });
    if (v !== undefined && v !== null) {
        data[o.nFieldName] = o.func(v);
    }
}

export {MultiConvOpts}
export default Conv;