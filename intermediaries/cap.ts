import Intermediary from "../defs/Intermediary.ts";

type CapOptions = {
    oldField: string,
    maxDigits: number,
    fieldName: string,
}

export type { CapOptions }
let regex = /.+\.(.+)/
let inter: Intermediary = async function (opts, data, gradients, pipeline) {
    let opt = opts as CapOptions;
    let d = data[opt.oldField] as number;
    if (d === undefined) return;
    let res = cap(d, opt.maxDigits);
    data[opt.fieldName] = res[0];

    pipeline.datafields.filter(v => v.fieldName == opt.fieldName).forEach(v => v.perConfig.image !== undefined ? v.perConfig.image.presc = res[1] : null)
}

function cap(d: number, max: number){
    let dstring = d.toString().replace(".","")
    let p = max
    if (dstring.length > max){
        while (dstring.length > max) {
            d = Math.round(d*Math.pow(10,p))/Math.pow(10,p);
            p--
            dstring = d.toString().replace(".","")
        }
    }
    let res = /.+\.(.+)/.exec(d.toString())
    let npresc = max - dstring.length + (res !== null ? res[1].length : 0)
    return [d, npresc];
}

export default inter;