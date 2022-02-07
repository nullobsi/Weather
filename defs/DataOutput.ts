import WeatherData from "./WeatherData.ts";
import Datafields from "./Datafields.ts";
import Gradients from "./Gradients.ts";
import Indexed from "./Indexed.ts";
import WeatherCtx from "./WeatherCtx.ts";
import {OutputRegistry} from "../registry.ts";
import {Union} from "./Opts.ts";

type DataOutput = (this: WeatherCtx, data: WeatherData, options: any, datafields: Datafields, gradients: Gradients, processed: Indexed<any>) => Promise<void>


export default DataOutput;
