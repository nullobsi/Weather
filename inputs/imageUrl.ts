import DataInput from "../defs/DataInput.ts";

const getData: DataInput<ImageUrlOpts> = async function (opt) {
	const response = await fetch(opt.url);
	const data = await response.arrayBuffer();
	return { image: new Uint8Array(data) };
};

type ImageUrlOpts = {
	url: string;
};

export type { ImageUrlOpts };
export default getData;
