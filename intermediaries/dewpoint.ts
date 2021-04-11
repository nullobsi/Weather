import Intermediary from "../defs/Intermediary.ts";

type DewPointOpts = {
    tempF: string,
    humidity: string,
    nFieldName: string,
}
const a = 6.1121 // mbar
const b = 18.678
const c = 257.14 // deg C
const d = 234.5 // deg C

function lm(T: number, RH: number): number {
    return Math.log((RH/100)* Math.pow(Math.E, (b-(T/d))*(T/(c+T))));
}

const DewPoint: Intermediary = async (opts, data) => {
    const o = opts as DewPointOpts;
    let Tf = data[o.tempF];
    let RH = data[o.humidity];
    if (Tf !== undefined && Tf !== null && RH !== undefined && RH !== null) {
        let T = (Tf-32)/1.8;
        let Tdp = (c * lm(T,RH))/(b- lm(T,RH));
        data[o.nFieldName] = (Tdp * 1.8) + 32;
    }
}

export type {DewPointOpts}
export default DewPoint;