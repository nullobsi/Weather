import WeatherData from "./WeatherData.ts";
import Keypoints from "./Keypoints.ts";
import Indexed from "./Indexed.ts";
import Gradients from "./Gradients.ts";
import Pipeline from "./Pipeline.ts";
import WeatherCtx from "./WeatherCtx.ts";

type Intermediary = (this: WeatherCtx, opts: Indexed<any>, data: WeatherData, gradients: Gradients, pipeline: Pipeline) => Promise<void>
export default Intermediary;