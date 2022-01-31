import Indexed from "./Indexed.ts";
import Datafields from "./Datafields.ts";
import {Opts} from "./Opts.ts";
import {InputRegistry, IntermediaryRegistry, OutputRegistry, ProcessorRegistry} from "../registry.ts";

interface Pipeline {
    inputs: Array<{whitelist?: string[], blacklist?: string[] } & Opts<InputRegistry>>,
    intermediaries: Opts<IntermediaryRegistry>[],
    processors: Opts<ProcessorRegistry>[],
    outputs: Opts<OutputRegistry>[],
    datafields: Datafields,
    interval: number,
    runInst: boolean

}

export default Pipeline;
