import Indexed from "./Indexed.ts";

type Datafields = {
    displayName: string,
    fieldName: string,
    gradient: string,
    unit: string,
    transform: string | undefined,
    perConfig: Indexed<Indexed<any> | undefined>
}[]

export default Datafields;
