import Intermediary from "../defs/Intermediary.ts";

type MultiConvOpts = {
    fieldNames: string[],
    from: string,
    to: string,
    func: (n: number) => number
}

const Conv: Intermediary = async function(opts, data) {
    const o = opts as MultiConvOpts;
    o.fieldNames.forEach(s => data[s.replace(o.from, o.to)] = o.func(data[s]));
}

export type {MultiConvOpts}
export default Conv;
