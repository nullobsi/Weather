import Intermediary from "../defs/Intermediary.ts";
import file from "../outputs/file.ts";

type HumIOpts = {
    dewPt: string,
    tempF: string,

    humidityOut: string,
}
let dataTransform: Intermediary = async function (opts, data, keypoints, pipeline) {
    let o = opts as HumIOpts;
    // Creds to NOAA
    var a=data[o.tempF];//Air Temperature
    var b=data[o.dewPt];//Dew Point
    var a_c = (5.0/9.0)*(a-32.0);
    var b_c = (5.0/9.0)*(b-32.0);
    var c=6.11*Math.pow(10,((7.5*a_c/(237.7+a_c))));//saturation vapor pressure
    var d=6.11*Math.pow(10,((7.5*b_c/(237.7+b_c))));//actual vapor pressure
    data[o.humidityOut]=(d/c)*100;//relative humidity
}

export default dataTransform;
export type {HumIOpts};
