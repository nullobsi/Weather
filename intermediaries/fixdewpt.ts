import Intermediary from "../defs/Intermediary.ts";

type FixDewPtIOpts = {
    tempF: string,
    dewpt: string,
    humidity: string,
}
const fixdewpt: Intermediary = async (opts, data) => {
    const o = opts as FixDewPtIOpts;
    if (data[o.tempF] == data[o.dewpt]) data[o.humidity] = 100;
}

export type {FixDewPtIOpts}
export default fixdewpt;
