import Pipeline from "./defs/Pipeline.ts";
import Indexed from "./defs/Indexed.ts";

import main from "./pipelines/main.ts";
import windy from "./pipelines/windy.ts";
import windyAir from "./pipelines/windyAir.ts";
import waves from "./pipelines/waves.ts";
import indoors from "./pipelines/indoors.ts";

export const pipelines: Indexed<Pipeline> = {
	main,
	windy,
	windyAir,
	waves,
	indoors,
};
