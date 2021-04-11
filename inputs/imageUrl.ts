import DataInput from "../defs/DataInput.ts";

type ImageUrlOpts = {
    url: string
}
export type {ImageUrlOpts}

const getData: DataInput = async function(options) {
    let opt = options as ImageUrlOpts;
    let response = await fetch(opt.url);
    let data = await response.arrayBuffer();
    return {image: new Uint8Array(data)};
}

export default getData;