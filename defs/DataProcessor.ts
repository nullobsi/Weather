import Indexed from "./Indexed.ts";
import Gradients from "./Gradients.ts";
import Datafields from "./Datafields.ts";
import WeatherData from "./WeatherData.ts";
import Transform from "./Transform.ts";
import WeatherCtx from "./WeatherCtx.ts";
import { ProcessorRegistry } from "../registry.ts";
import { Union } from "./Opts.ts";

type DataProcessor<T extends Union<ProcessorRegistry>> = (
	this: WeatherCtx,
	options: T,
	gradients: Gradients,
	datafields: Datafields,
	data: WeatherData,
	transforms: Indexed<Transform>,
	outputs: Indexed<unknown>,
) => void;

export default DataProcessor;
