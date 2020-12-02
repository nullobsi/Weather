import Intermediary from "../defs/Intermediary.ts";

type CapOptions = {
    oldField: string,
    maxDigits: number,
    fieldName: string,
}

export type { CapOptions }

let inter: Intermediary = async function (opts, data, gradients, pipeline) {
    let opt = opts as CapOptions;
    let d = data[opt.oldField] as number;
    if (d === undefined) return;
    let dstring = d.toString().replace(".", "")
    let p = opt.maxDigits;
    if (dstring.length > opt.maxDigits) {
        while (dstring.length > opt.maxDigits) {
            d = Math.round(d*Math.pow(10,p))/Math.pow(10,p);
            p--;
            dstring = d.toString().replace(".","");
        }
    }
    data[opt.fieldName] = d;

    pipeline.datafields.filter(v => v.fieldName == opt.fieldName).forEach(v => v.perConfig.image !== undefined ? v.perConfig.image.presc = p : null)
}

export default inter;