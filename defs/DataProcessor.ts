import Indexed from "./Indexed.ts";
import Gradients from "./Gradients.ts";
import Datafields from "./Datafields.ts";
import WeatherData from "./WeatherData.ts";
import Transform from "./Transform.ts";
import WeatherCtx from "./WeatherCtx.ts";

type DataProcessor = (this: WeatherCtx, options: Indexed<any>, gradients: Gradients, datafields: Datafields, data: WeatherData, transforms: Indexed<Transform>, outputs: Indexed<any>) => void;

export default DataProcessor;