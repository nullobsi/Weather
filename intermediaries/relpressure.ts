import Intermediary from "../defs/Intermediary.ts";

type RelPressureIOpts = {
    absPressure: string,
    elevationM: number,
    tempF: string,
    nFieldName: string,
}
const RelPressure: Intermediary = async (opts, data) => {
    const o = opts as RelPressureIOpts;
    let AP = data[o.absPressure];
    let E = o.elevationM; // in meters for now
    let T = data[o.tempF];
    if (AP !== undefined && AP !== null && E !== undefined && E !== null && T !== undefined && T !== null) {
        let relativePressure = (AP / 0.029529983071445) * Math.pow((1 - ((0.0065 * E) / (((T - 32) * (5.0/9)) + (0.0065 * E) + 273.15))), -5.257); // hPa
        data[o.nFieldName] = relativePressure * 0.029529983071445; // inHg
    }
}

export type {RelPressureIOpts}
export default RelPressure;
