import WeatherData from "./WeatherData.ts";
import Indexed from "./Indexed.ts";

type DataInput = (opts: Indexed<any>) => Promise<WeatherData>
export default DataInput;