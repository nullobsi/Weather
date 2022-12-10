import { Inputs } from "./registry.ts";

import aqi from "./inputs/aqi.ts";
import ambientweather from "./inputs/ambientweather.ts";
import csv from "./inputs/csv.ts";
import imageUrl from "./inputs/imageUrl.ts";
import plaintext from "./inputs/plaintext.ts";
import table from "./inputs/table.ts";
import windy from "./inputs/windy.ts";
import wunderground from "./inputs/wunderground.ts";
import json from "./inputs/json.ts";

export const inputs: Inputs = {
	aqi,
	csv,
	windy,
	table,
	plaintext,
	imageUrl,
	wunderground,
	ambientweather,
	json,
};
