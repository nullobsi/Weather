import Intermediary from "../defs/Intermediary.ts";

type CapIOpts = {
    maxDigits: number,
    maxPresc: number
    fieldName: string,
}

export type { CapIOpts }
let regex = /.+\.(.+)/
let inter: Intermediary = async function (opts, data, gradients, pipeline) {
    let opt = opts as CapIOpts;
    let d = data[opt.fieldName] as number;
    if (d === undefined) return;
    let res = cap(d, opt.maxDigits, opt.maxPresc);

    pipeline.datafields.filter(v => v.fieldName == opt.fieldName).forEach(v => v.perConfig.image !== undefined ? v.perConfig.image.presc = res : null)
}

function cap(d: number, max: number, maxPresc: number){
    function retn(n: number){return n < maxPresc ? (n >= 0 ? n : 0) : maxPresc}
    let dstring = d.toString()
    let decimalAt = dstring.indexOf(".")
    if (decimalAt == -1) {
        return retn(max-dstring.length)
    }
    let integer = dstring.substring(0, decimalAt);
    let decMax = max - integer.length;
    return retn(decMax);
}

export default inter;
