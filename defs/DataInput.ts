import WeatherData from "./WeatherData.ts";
import Indexed from "./Indexed.ts";
import WeatherCtx from "./WeatherCtx.ts";
import {InputRegistry} from "../registry.ts";
import {Union} from "./Opts.ts";

type DataInput = (this: WeatherCtx, opts: Union<InputRegistry>) => Promise<WeatherData>
export default DataInput;
