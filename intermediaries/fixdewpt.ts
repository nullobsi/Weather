import Intermediary from "../defs/Intermediary.ts";

type FixDewPtIOpts = {
    tempF: string,
    dewpt: string,
    humidity: string,
    presc: number,
}
const fixdewpt: Intermediary = async (opts, data) => {
    const o = opts as FixDewPtIOpts;
    if (data[o.tempF].toFixed(o.presc) == data[o.dewpt].toFixed(o.presc)) data[o.humidity] = 100;
}

export type {FixDewPtIOpts}
export default fixdewpt;
