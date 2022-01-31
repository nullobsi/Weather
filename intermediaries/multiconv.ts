import Intermediary from "../defs/Intermediary.ts";

type MultiConvIOpts = {
    fieldNames: string[],
    from: string,
    to: string,
    func: (n: number) => number
}

const Conv: Intermediary = async function(opts, data) {
    const o = opts as MultiConvIOpts;
    o.fieldNames.forEach(s => data[s.replace(o.from, o.to)] = o.func(data[s]));
}

export type {MultiConvIOpts}
export default Conv;
