import WeatherData from "./WeatherData.ts";
import Gradients from "./Gradients.ts";
import Pipeline from "./Pipeline.ts";
import WeatherCtx from "./WeatherCtx.ts";
import { IntermediaryRegistry } from "../registry.ts";
import { Union } from "./Opts.ts";

type Intermediary<T extends Union<IntermediaryRegistry>> = (
	this: WeatherCtx,
	opts: T,
	data: WeatherData,
	gradients: Gradients,
	pipeline: Pipeline,
) => Promise<void> | void;

export default Intermediary;
