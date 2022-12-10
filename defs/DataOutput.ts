import WeatherData from "./WeatherData.ts";
import Datafields from "./Datafields.ts";
import Gradients from "./Gradients.ts";
import Indexed from "./Indexed.ts";
import WeatherCtx from "./WeatherCtx.ts";
import { Union } from "./Opts.ts";
import { OutputRegistry } from "../registry.ts";

type DataOutput<T extends Union<OutputRegistry>> = (
	this: WeatherCtx,
	data: WeatherData,
	options: T,
	datafields: Datafields,
	gradients: Gradients,
	processed: Indexed<unknown>,
) => Promise<void> | void;

export default DataOutput;
