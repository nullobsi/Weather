import Intermediary from "../defs/Intermediary.ts";

type FeelsLikeIOpts = {
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
    const o = opts as FeelsLikeIOpts;
    let T = data[o.tempF];
    let W = data[o.windMph];
    let RH = data[o.humidity];
    if (T !== undefined && T !== null && W !== undefined && W !== null && RH !== undefined && RH !== null) {
        if (T < 70) {
            // wind chill
            let windChill = 35.74
                + 0.6215*T
                - 35.75*Math.pow(W, 0.16)
                + 0.4275*T*Math.pow(W, 0.16);
            if (windChill <= T)
                data[o.nFieldName] = windChill;
            else
                data[o.nFieldName] = T;

        } else if (T > 70) {
            // heat index
            let HI = 0.5 * (T + 61.0 + ((T-68.0)*1.2) + (RH*0.094));
            HI = (HI + T) / 2;

            if (HI >= 80) {
                HI = -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - .00683783*T*T - .05481717*RH*RH + .00122874*T*T*RH + .00085282*T*RH*RH - .00000199*T*T*RH*RH;

                if (RH < 13 && 80 < T && T < 112) {
                    HI -= ((13-RH)/4)*Math.sqrt((17-Math.abs(T-95))/17);
                } else if (RH > 85 && 80 < T && T < 87) {
                    HI += ((RH-85)/10) * ((87-T)/5);
                }
            }

            if (HI < T) data[o.nFieldName] = T
            else data[o.nFieldName] = HI;
        } else {
            data[o.nFieldName] = T;
        }
    }
}

export type {FeelsLikeIOpts}
export default FeelsLike;
