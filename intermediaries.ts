import {Intermediaries} from "./registry.ts";

import cap from "./intermediaries/cap.ts";
import dewpoint from "./intermediaries/dewpoint.ts";
import conv from "./intermediaries/conv.ts";
import degT from "./intermediaries/degT.ts";
import hum from "./intermediaries/hum.ts";
import cardinal from "./intermediaries/cardinal.ts";
import image from "./intermediaries/image.ts";
import feelslike from "./intermediaries/feelslike.ts";
import fixdewpt from "./intermediaries/fixdewpt.ts";
import multiconv from "./intermediaries/multiconv.ts";
import rainrate from "./intermediaries/rainrate.ts";
import relpressure from "./intermediaries/relpressure.ts";
import soil from "./intermediaries/soil.ts";

export const intermediaries: Intermediaries = {
    cap,
    dewpoint,
    conv,
    degT,
    hum,
    cardinal,
    image,
    feelslike,
    fixdewpt,
    multiconv,
    rainrate,
    relpressure,
    soil,
};
