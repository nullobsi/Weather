import {AmbientOpts} from "./inputs/ambientweather.ts";
import {AqiOpts} from "./inputs/aqi.ts";
import {CsvOpts} from "./inputs/csv.ts";
import {ImageUrlOpts} from "./inputs/imageUrl.ts";
import {PlaintextOpts} from "./inputs/plaintext.ts";
import {TableOpts} from "./inputs/table.ts";
import {WindyOpts} from "./inputs/windy.ts";
import {WundergroundOpts} from "./inputs/wunderground.ts";
import {CapIOpts} from "./intermediaries/cap.ts";
import {CardinalIOpts} from "./intermediaries/cardinal.ts";
import {ConvIOpts} from "./intermediaries/conv.ts";
import {DegTIOpts} from "./intermediaries/degT.ts";
import {DewPointIOpts} from "./intermediaries/dewpoint.ts";
import {FixDewPtIOpts} from "./intermediaries/fixdewpt.ts";
import {HumIOpts} from "./intermediaries/hum.ts";
import {ImageIOpts, ImagePickerPerConf} from "./intermediaries/image.ts";
import {MultiConvIOpts} from "./intermediaries/multiconv.ts";
import {RainRateIOpts} from "./intermediaries/rainrate.ts";
import {RelPressureIOpts} from "./intermediaries/relpressure.ts";
import {SoilIOpts} from "./intermediaries/soil.ts";
import {FeelsLikeIOpts} from "./intermediaries/feelslike.ts";
import Indexed from "./defs/Indexed.ts";
import {DiscordOOpts, DiscordPerconf} from "./outputs/discord.ts";
import {FileOOpts} from "./outputs/file.ts";
import {FtpOOpts} from "./outputs/ftp.ts";
import {ConsolePerconf} from "./outputs/console.ts";
import {ImagePerconf, ImagePOpts} from "./processors/image.ts";
import DataInput from "./defs/DataInput.ts";
import DataOutput from "./defs/DataOutput.ts";
import DataProcessor from "./defs/DataProcessor.ts";



// Intermediaries
import cap from "./intermediaries/cap.ts";
import cardinal from "./intermediaries/cardinal.ts";
import conv from "./intermediaries/conv.ts";
import degT from "./intermediaries/degT.ts";
import dewpoint from "./intermediaries/dewpoint.ts";
import feelslike from "./intermediaries/feelslike.ts";
import fixdewpt from "./intermediaries/fixdewpt.ts";
import hum from "./intermediaries/hum.ts";
import imageI from "./intermediaries/image.ts";
import multiconv from "./intermediaries/multiconv.ts";
import rainrate from "./intermediaries/rainrate.ts";
import relpressure from "./intermediaries/relpressure.ts";
import soil from "./intermediaries/soil.ts";

// Outputs
import console from "./outputs/console.ts";
import discord from "./outputs/discord.ts";
import file from "./outputs/file.ts";
import ftp from "./outputs/ftp.ts";

// Processors
import image from "./processors/image.ts";

// Pipelines
import main from "./pipelines/main.ts";
import waves from "./pipelines/waves.ts";
import windyPipeline from "./pipelines/windy.ts";
import windyAir from "./pipelines/windyAir.ts";
import Intermediary from "./defs/Intermediary.ts";


type InputRegistry = {
    ambientweather: AmbientOpts,
    aqi: AqiOpts,
    csv: CsvOpts,
    imageUrl: ImageUrlOpts,
    plaintext: PlaintextOpts,
    table: TableOpts,
    windy: WindyOpts,
    wunderground: WundergroundOpts,
};

type IntermediaryRegistry = {
    cap: CapIOpts,
    cardinal: CardinalIOpts,
    conv: ConvIOpts,
    degT: DegTIOpts,
    dewpoint: DewPointIOpts,
    fixdewpt: FixDewPtIOpts,
    hum: HumIOpts,
    image: ImageIOpts,
    multiconv: MultiConvIOpts,
    rainrate: RainRateIOpts,
    relpressure: RelPressureIOpts,
    soil: SoilIOpts,
    feelslike: FeelsLikeIOpts,
};

type OutputRegistry = {
    console: undefined,
    discord: DiscordOOpts,
    file: FileOOpts,
    ftp: FtpOOpts,
};

type PerconfRegistry = {
    console: ConsolePerconf,
    discord: DiscordPerconf,
    file: never,
    ftp: never,
    image: ImagePerconf,
    imagePicker: ImagePickerPerConf,
};

type ProcessorRegistry = {
    image: ImagePOpts,
};

type RegistryMapped<T, Y> = {
    [P in keyof T]: Y
}

type Inputs = RegistryMapped<InputRegistry, DataInput>;
type Intermediaries = RegistryMapped<IntermediaryRegistry, Intermediary>;
type Outputs = RegistryMapped<OutputRegistry, DataOutput>;
type Processors = RegistryMapped<ProcessorRegistry, DataProcessor>;


export type {InputRegistry, IntermediaryRegistry, OutputRegistry, PerconfRegistry, ProcessorRegistry, Inputs, Intermediaries, Processors, Outputs};