import WeatherData from "./WeatherData.ts";
import Datafields from "./Datafields.ts";
import Gradients from "./Gradients.ts";
import Indexed from "./Indexed.ts";
import WeatherCtx from "./WeatherCtx.ts";

type DataOutput = (this: WeatherCtx, data: WeatherData, options: Indexed<any>, datafields: Datafields, gradients: Gradients, processed: Indexed<any>) => Promise<void>

export default DataOutput;