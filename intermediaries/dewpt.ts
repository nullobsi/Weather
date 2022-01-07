import Intermediary from "../defs/Intermediary.ts";

type DewPtOpts = {
    tempF: string,
    dewpt: string,
    humidity: string,
}
const dewpt: Intermediary = async (opts, data) => {
    const o = opts as DewPtOpts;
    if (data[o.tempF] == data[o.dewpt]) data[o.humidity] = 100;
}

export type {DewPtOpts}
export default dewpt;
