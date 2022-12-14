import WeatherData from "./WeatherData.ts";
import WeatherCtx from "./WeatherCtx.ts";
import { InputRegistry } from "../registry.ts";
import { Union } from "./Opts.ts";

type DataInput<T extends Union<InputRegistry>> = (
	this: WeatherCtx,
	opts: T,
) => Promise<WeatherData> | WeatherData;

export default DataInput;
