import WeatherData from "./WeatherData.ts";
import Indexed from "./Indexed.ts";
import WeatherCtx from "./WeatherCtx.ts";

type DataInput = (this: WeatherCtx, opts: Indexed<any>) => Promise<WeatherData>
export default DataInput;