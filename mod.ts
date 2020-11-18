//import getConfig from "./util/getConfig.ts";
import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.76.0/path/mod.ts"
import Keypoints from "./defs/Keypoints.ts";
import Gradients from "./defs/Gradients.ts";
import DataInput from "./defs/DataInput.ts";
import Indexed from "./defs/Indexed.ts";
import Intermediary from "./defs/Intermediary.ts";
import DataOutput from "./defs/DataOutput.ts";
import Transform from "./defs/Transform.ts";
import DataProcessor from "./defs/DataProcessor.ts";
import Pipeline from "./defs/Pipeline.ts";
import WeatherData from "./defs/WeatherData.ts";

let gradients: Gradients = {};
let inputs: Indexed<DataInput> = {};
let intermediaries: Indexed<Intermediary> = {};
let outputs: Indexed<DataOutput> = {};
let transforms : Indexed<Transform> = {};
let processors: Indexed<DataProcessor> = {};
let pipelines: Indexed<Pipeline> = {};

console.log("[init] Beginning loading...");

let dirEntries = Deno.readDir("./gradients");
for await (let gradient of dirEntries) {
    if (gradient.isFile && !gradient.name.startsWith(".")) {
        console.log("[gradient] Loading " + gradient.name)
        let p = path.join("./gradients", gradient.name);
        let name = path.basename(gradient.name, ".json");
        let readJson = await Deno.readTextFile(p);
        gradients[name] = JSON.parse(readJson);
    }
}

dirEntries = Deno.readDir("./inputs");
for await (let input of dirEntries) {
    if (input.isFile && !input.name.startsWith(".")) {
        console.log("[input] Loading " + input.name)
        let p = path.join(".","inputs", input.name);
        p = path.resolve(p);
        let name = path.basename(input.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`[input] ${name} has no exports!`)
            Deno.exit(1);
        }
        inputs[name] = readModule.default;
    }
}

dirEntries = Deno.readDir("./intermediaries");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("[intermediary] Loading " + dirEntry.name)
        let p = path.join(".","intermediaries", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`[intermediary] {name} has no exports!`)
            Deno.exit(1);
        }
        intermediaries[name] = readModule.default;
    }
}

dirEntries = Deno.readDir("./outputs");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("[output] Loading " + dirEntry.name)
        let p = path.join(".","outputs", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`[output] {name} has no exports!`)
            Deno.exit(1);
        }
        outputs[name] = readModule.default;
    }
}

dirEntries = Deno.readDir("./transforms");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("[transform] Loading " + dirEntry.name)
        let p = path.join(".","transforms", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`[transform] {name} has no exports!`)
            Deno.exit(1);
        }
        transforms[name] = readModule.default;
    }
}

dirEntries = Deno.readDir("./processors");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("[process] Loading " + dirEntry.name)
        let p = path.join(".","processors", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`[process] {name} has no exports!`)
            Deno.exit(1);
        }
        processors[name] = readModule.default;
    }
}

dirEntries = Deno.readDir("./pipelines");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("[pipeline] Loading " + dirEntry.name)
        let p = path.join(".","pipelines", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`[pipeline] {name} has no exports!`)
            Deno.exit(1);
        }
        pipelines[name] = readModule.default;
    }
}

let tabLog = (v:string) => console.log("\t" + v)

console.log("[init] Loaded Gradients:")
Object.keys(gradients).forEach(tabLog);
/*let res = renderDials({
    width: 1440,
    height: 1080,
    panels: [
        {
            title: "Rain",
            dials: [
                {
                    gradient: "rainrate",
                    r: 150,
                    cx: 335/2,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 0,
                    startV: 0, //25
                    endV: 12, //250
                    displayName: "",
                    unit: "in/hr",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 20,
            y: 550,
            height: 510,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "Temperature",
            dials: [
                {
                    gradient: "wu_temp",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 20,
            y: 20,
            height: 510,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "Wind",
            dials: [
                {
                    gradient: "wu_temp",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 375,
            y: 20,
            height: 510,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "Water Temp",
            dials: [
                {
                    gradient: "wu_temp",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 375,
            y: 550,
            height: 510,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "Humidity",
            dials: [
                {
                    gradient: "humidity",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 730,
            y: 20,
            height: 333,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "Pressure",
            dials: [
                {
                    gradient: "pressure",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 1085,
            y: 20,
            height: 333,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "UV",
            dials: [
                {
                    gradient: "uv",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 730,
            y: 373,
            height: 334,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "AQI",
            dials: [
                {
                    gradient: "aqi",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 730,
            y: 727,
            height: 333,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "Solar",
            dials: [
                {
                    gradient: "solar",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 1085,
            y: 373,
            height: 334,
            width: 335,
            fontSize: 520/12
        },
        {
            title: "PM2.5",
            dials: [
                {
                    gradient: "pm25",
                    r: 150,
                    cx: 160,
                    cy: 160,
                    start: Math.PI- Math.PI/4,
                    end: Math.PI*2 + Math.PI/4,
                    value: 25,
                    startV: -32, //25
                    endV: 100, //250
                    displayName: "",
                    unit: "deg",
                    bigFontSize: 300/6,
                    smallFontSize: 300/32,
                },
                // {
                //     gradient: "winddir",
                //     r: 300,
                //     cx: 1300,
                //     cy: 600,
                //     start: 0-Math.PI/2,
                //     end: Math.PI*2-Math.PI/2,
                //     value: 0,
                //     startV: 0,
                //     endV: 360,
                //     displayName: "Wind Direction",
                //     unit: "deg",
                //     bigFontSize: 300/8,
                //     smallFontSize: 300/16
                // },
            ],
            x: 1085,
            y: 727,
            height: 333,
            width: 335,
            fontSize: 520/12
        },
    ]
},gradients);
console.log(res + " bytes array");
let buf = new Uint8Array(res);
res = copyDials(buf);
console.log(res + " bytes written");
await Deno.writeFile("./" + "ozone" + ".png",buf);*/

console.log("[init] Loaded Inputs:")
Object.keys(inputs).forEach(tabLog)

console.log("[init] Loaded Intermediaries:")
Object.keys(intermediaries).forEach(tabLog)

console.log("[init] Loaded Outputs:")
Object.keys(outputs).forEach(tabLog);

console.log("[init] Loaded Transforms:")
Object.keys(transforms).forEach(tabLog);

console.log("[init] Loaded Processors:")
Object.keys(processors).forEach(tabLog);

console.log("[init] Loaded Pipelines:")
Object.keys(pipelines).forEach(tabLog);

console.log("[init] Initializing timers...");
let timers: Indexed<number> = {};

Object.keys(pipelines).forEach(async k => {
    let pipeline = pipelines[k];
    if (pipeline.runInst) {
        await runPipeline(k);
    }
    timers[k] = setInterval(() => runPipeline(k), pipeline.interval);
})

async function runPipeline(key: string) {
    console.log(`[${key}] Running pipeline...`);
    let pipeline = pipelines[key];
    let data: WeatherData = {};
    console.log(`[${key}] Getting data...`);
    for (let i = 0; i < pipeline.inputs.length; i ++) {
        console.log(`[${key}] Fetching ${pipeline.inputs[i].name}...`);
        let input = inputs[pipeline.inputs[i].name];
        let fetched = await input(pipeline.inputs[i].opts);
        data = {...data, ...fetched};
    }

    console.log(`[${key}] Running intermediaries...`);
    let tmpGrads = {...gradients};
    for (let i = 0; i < pipeline.intermediaries.length; i++) {
        console.log(`[${key}] Running intermediate ${pipeline.intermediaries[i].name}...`);
        let intermediate = intermediaries[pipeline.intermediaries[i].name];
        await intermediate(pipeline.intermediaries[i].opts, data, tmpGrads, pipeline);
    }

    console.log(`[${key}] Running processors...`);
    let produced: Indexed<any> = {};
    for (let i = 0; i < pipeline.processors.length; i++) {
        console.log(`[${key}] Running intermediate ${pipeline.processors[i].name}...`);
        let process = processors[pipeline.processors[i].name];
        await process(pipeline.processors[i].opts, tmpGrads, pipeline.datafields, data, transforms, produced);
    }

    console.log(`[${key}] Running outputs...`);
    for (let i = 0; i < pipeline.outputs.length; i++) {
        console.log(`[${key}] Running output ${pipeline.outputs[i].name}...`);
        let output = outputs[pipeline.outputs[i].name];
        await output(data, pipeline.outputs[i].opts, pipeline.datafields, tmpGrads, produced);
    }

    console.log(`[${key}] Complete!`);
}