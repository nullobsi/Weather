import { AmbientOpts } from "./inputs/ambientweather.ts";
import { AqiOpts } from "./inputs/aqi.ts";
import { CsvOpts } from "./inputs/csv.ts";
import { ImageUrlOpts } from "./inputs/imageUrl.ts";
import { PlaintextOpts } from "./inputs/plaintext.ts";
import { JsonOpts } from "./inputs/json.ts";
import { TableOpts } from "./inputs/table.ts";
import { WindyOpts } from "./inputs/windy.ts";
import { WundergroundOpts } from "./inputs/wunderground.ts";
import { CapIOpts } from "./intermediaries/cap.ts";
import { CardinalIOpts } from "./intermediaries/cardinal.ts";
import { ConvIOpts } from "./intermediaries/conv.ts";
import { DegTIOpts } from "./intermediaries/degT.ts";
import { DewPointIOpts } from "./intermediaries/dewpoint.ts";
import { FixDewPtIOpts } from "./intermediaries/fixdewpt.ts";
import { HumIOpts } from "./intermediaries/hum.ts";
import { ImageIOpts, ImagePickerPerConf } from "./intermediaries/image.ts";
import { MultiConvIOpts } from "./intermediaries/multiconv.ts";
import { RainRateIOpts } from "./intermediaries/rainrate.ts";
import { RelPressureIOpts } from "./intermediaries/relpressure.ts";
import { SoilIOpts } from "./intermediaries/soil.ts";
import { FeelsLikeIOpts } from "./intermediaries/feelslike.ts";
import { DiscordOOpts, DiscordPerconf } from "./outputs/discord.ts";
import { FileOOpts } from "./outputs/file.ts";
import { FtpOOpts } from "./outputs/ftp.ts";
import { ConsolePerconf } from "./outputs/console.ts";
import { ImagePerconf, ImagePOpts } from "./processors/image.ts";
import DataInput from "./defs/DataInput.ts";
import DataOutput from "./defs/DataOutput.ts";
import DataProcessor from "./defs/DataProcessor.ts";
import Intermediary from "./defs/Intermediary.ts";
import { RecordsOOpts, RecordsPerconf } from "./outputs/records.ts";

type InputRegistry = {
	ambientweather: AmbientOpts;
	aqi: AqiOpts;
	csv: CsvOpts;
	imageUrl: ImageUrlOpts;
	plaintext: PlaintextOpts;
	table: TableOpts;
	windy: WindyOpts;
	wunderground: WundergroundOpts;
	json: JsonOpts;
};

type IntermediaryRegistry = {
	cap: CapIOpts;
	cardinal: CardinalIOpts;
	conv: ConvIOpts;
	degT: DegTIOpts;
	dewpoint: DewPointIOpts;
	fixdewpt: FixDewPtIOpts;
	hum: HumIOpts;
	image: ImageIOpts;
	multiconv: MultiConvIOpts;
	rainrate: RainRateIOpts;
	relpressure: RelPressureIOpts;
	soil: SoilIOpts;
	feelslike: FeelsLikeIOpts;
};

type OutputRegistry = {
	console: undefined;
	discord: DiscordOOpts;
	file: FileOOpts;
	ftp: FtpOOpts;
	records: RecordsOOpts;
};

type PerconfRegistry = {
	console: ConsolePerconf;
	discord: DiscordPerconf;
	file: never;
	ftp: never;
	image: ImagePerconf;
	imagePicker: ImagePickerPerConf;
	records: RecordsPerconf;
};

type ProcessorRegistry = {
	image: ImagePOpts;
};

type Inputs = {
	[P in keyof InputRegistry]: DataInput<InputRegistry[P]>;
};
type Intermediaries = {
	[P in keyof IntermediaryRegistry]: Intermediary<IntermediaryRegistry[P]>;
};
type Outputs = {
	[P in keyof OutputRegistry]: DataOutput<OutputRegistry[P]>;
};
type Processors = {
	[P in keyof ProcessorRegistry]: DataProcessor<ProcessorRegistry[P]>;
};

export type {
	InputRegistry,
	Inputs,
	Intermediaries,
	IntermediaryRegistry,
	OutputRegistry,
	Outputs,
	PerconfRegistry,
	ProcessorRegistry,
	Processors,
};
