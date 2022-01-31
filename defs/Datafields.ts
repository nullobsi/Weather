import Indexed from "./Indexed.ts";
import {PerconfRegistry} from "../registry.ts";
import {Opts} from "./Opts.ts";

type Datafields = {
    displayName: string,
    fieldName: string,
    gradient: string,
    unit: string,
    transform: string | undefined,
    perConfig: {
        [S in keyof PerconfRegistry]?: PerconfRegistry[S]
    },
}[]

export default Datafields;
