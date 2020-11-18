import Indexed from "./Indexed.ts";
import Datafields from "./Datafields.ts";

interface Pipeline {
    inputs: {name: string, opts: Indexed<any>}[],
    intermediaries: {name: string, opts: Indexed<any>}[],
    processors: {name: string, opts: Indexed<any>}[],
    outputs: {name: string, opts: Indexed<any>}[],
    datafields: Datafields,
    interval: number,
    runInst: boolean

}

export default Pipeline;