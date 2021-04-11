import Intermediary from "../defs/Intermediary.ts";

type FeelsLikeOpts = {
    tempF: string,
    windMph: string,
    humidity: string,
    nFieldName: string,
}
const c = [
    0, //start at 1
    -42.389,
    2.04901523,
    10.14333127,
    -0.22475541,
    -6.83783E-3
    -5.481717E-2,
    1.22874E-3,
    8.5282E-4,
    -1.99E-6

]
const FeelsLike: Intermediary = async (opts, data) => {
    const o = opts as FeelsLikeOpts;
    let T = data[o.tempF];
    let W = data[o.windMph];
    let H = data[o.humidity];
    if (T !== undefined && T !== null && W !== undefined && W !== null && H !== undefined && H !== null) {
        if (T <= 50) {
            // wind chill
            data[o.nFieldName] =
                35.74
                + 0.6215*T
                - 35.75*Math.pow(W, 0.16)
                + 0.4275*T*Math.pow(W, 0.16);
        } else if (T >= 70) {
            // heat index
            data[o.nFieldName] =
                c[1]
                + c[2]*T
                + c[3]*H
                + c[4]*T*H
                + c[5]*Math.pow(T,2)
                + c[6]*Math.pow(H,2)
                + c[7]*Math.pow(T,2)*H
                + c[8]*T*Math.pow(H,2)
                + c[9]*Math.pow(T,2)*Math.pow(H,2);
        } else {
            data[o.nFieldName] = T;
        }
    }
}

export {FeelsLikeOpts}
export default FeelsLike;