import * as path from "https://deno.land/std@0.76.0/path/mod.ts"
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

let originalConsole = window.console;

let nConsole = {
    ...originalConsole,
    prefix: "",
    log: function (...v: unknown[]) {
        originalConsole.log(this.prefix, ...v);
    },
    error: function(...v: unknown[]) {
        originalConsole.error(this.prefix, ...v);
    }
}
window.console = nConsole;

nConsole.prefix = "[init]";
console.log("Beginning loading...");

nConsole.prefix = "[gradient]";
let dirEntries = Deno.readDir("./gradients");
for await (let gradient of dirEntries) {
    if (gradient.isFile && !gradient.name.startsWith(".")) {
        console.log("Loading " + gradient.name)
        let p = path.join("./gradients", gradient.name);
        let name = path.basename(gradient.name, ".json");
        let readJson = await Deno.readTextFile(p);
        gradients[name] = JSON.parse(readJson);
    }
}

nConsole.prefix = "[input]";
dirEntries = Deno.readDir("./inputs");
for await (let input of dirEntries) {
    if (input.isFile && !input.name.startsWith(".")) {
        console.log("Loading " + input.name)
        let p = path.join(".","inputs", input.name);
        p = path.resolve(p);
        let name = path.basename(input.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`${name} has no exports!`)
            Deno.exit(1);
        }
        inputs[name] = readModule.default;
    }
}

nConsole.prefix = "[intermediary]";
dirEntries = Deno.readDir("./intermediaries");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("Loading " + dirEntry.name)
        let p = path.join(".","intermediaries", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`${name} has no exports!`)
            Deno.exit(1);
        }
        intermediaries[name] = readModule.default;
    }
}

nConsole.prefix = "[output]";
dirEntries = Deno.readDir("./outputs");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("Loading " + dirEntry.name)
        let p = path.join(".","outputs", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`${name} has no exports!`)
            Deno.exit(1);
        }
        outputs[name] = readModule.default;
    }
}

nConsole.prefix = "[transform]";
dirEntries = Deno.readDir("./transforms");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("[transform] Loading " + dirEntry.name)
        let p = path.join(".","transforms", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`${name} has no exports!`)
            Deno.exit(1);
        }
        transforms[name] = readModule.default;
    }
}

nConsole.prefix = "[process]";
dirEntries = Deno.readDir("./processors");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("Loading " + dirEntry.name)
        let p = path.join(".","processors", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`${name} has no exports!`)
            Deno.exit(1);
        }
        processors[name] = readModule.default;
    }
}

nConsole.prefix = "[pipeline]";
dirEntries = Deno.readDir("./pipelines");
for await (let dirEntry of dirEntries) {
    if (dirEntry.isFile && !dirEntry.name.startsWith(".")) {
        console.log("Loading " + dirEntry.name)
        let p = path.join(".","pipelines", dirEntry.name);
        p = path.resolve(p);
        let name = path.basename(dirEntry.name, ".ts");
        let readModule = await import("file://"+p);
        if (readModule.default == undefined) {
            console.error(`${name} has no exports!`)
            Deno.exit(1);
        }
        pipelines[name] = readModule.default;
    }
}

let tabLog = (v:string) => console.log("\t" + v)

nConsole.prefix = "[init]";
console.log("Loaded Gradients:")
Object.keys(gradients).forEach(tabLog);

console.log("Loaded Inputs:")
Object.keys(inputs).forEach(tabLog)

console.log("Loaded Intermediaries:")
Object.keys(intermediaries).forEach(tabLog)

console.log("Loaded Outputs:")
Object.keys(outputs).forEach(tabLog);

console.log("Loaded Transforms:")
Object.keys(transforms).forEach(tabLog);

console.log("Loaded Processors:")
Object.keys(processors).forEach(tabLog);

console.log("Loaded Pipelines:")
Object.keys(pipelines).forEach(tabLog);

console.log("Initializing timers...");
let timers: Indexed<number> = {};

Object.keys(pipelines).forEach(async k => {
    let pipeline = pipelines[k];
    if (pipeline.runInst) {
        await runPipeline(k);
    }
    timers[k] = setInterval(() => runPipeline(k), pipeline.interval);
})

async function runPipeline(key: string) {
    let prefix = `[${key}]`;
    let c = {
        ...nConsole,
        prefix: prefix,
    };
    let ctx = {
        console: c,
        pipelineName: key,
    }
    c.log(`Running pipeline...`);
    let pipeline = pipelines[key];
    let data: WeatherData = {};
    c.log(`Getting data...`);
    for (let i = 0; i < pipeline.inputs.length; i ++) {
        let p = pipeline.inputs[i];
        c.log(`Fetching ${p.name}...`);
        c.prefix = prefix + ` > [${p.name}]`;
        let input = inputs[p.name];
        let fetched = await (input.call(ctx, pipeline.inputs[i].opts));
        c.prefix = prefix;
        if (p.whitelist !== undefined) {
            let whitelist = p.whitelist;
            fetched = Object.fromEntries(Object.entries(fetched).filter(v => whitelist.includes(v[0])));
        } else if (p.blacklist !== undefined) {
            let blacklist = p.blacklist;
            fetched = Object.fromEntries(Object.entries(fetched).filter(v => !blacklist.includes(v[0])));
        }
        data = {...data, ...fetched};
    }

    c.log(`Running intermediaries...`);
    let tmpGrads = {...gradients};
    for (let i = 0; i < pipeline.intermediaries.length; i++) {
        c.log(`Running intermediate ${pipeline.intermediaries[i].name}...`);
        let intermediate = intermediaries[pipeline.intermediaries[i].name];
        c.prefix = prefix + ` > ${pipeline.intermediaries[i].name}`;
        await intermediate.call(ctx, pipeline.intermediaries[i].opts, data, tmpGrads, pipeline);
        c.prefix = prefix;
    }

    c.log(`Running processors...`);
    let produced: Indexed<any> = {};
    for (let i = 0; i < pipeline.processors.length; i++) {
        c.log(`Running intermediate ${pipeline.processors[i].name}...`);
        let process = processors[pipeline.processors[i].name];
        c.prefix = prefix + ` > ${pipeline.processors[i].name}`;
        await process.call(ctx, pipeline.processors[i].opts, tmpGrads, pipeline.datafields, data, transforms, produced);
        c.prefix = prefix;
    }

    c.log(`Running outputs...`);
    for (let i = 0; i < pipeline.outputs.length; i++) {
        c.log(`Running output ${pipeline.outputs[i].name}...`);
        let output = outputs[pipeline.outputs[i].name];
        c.prefix = prefix + ` > ${pipeline.outputs[i].name}`;
        await output.call(ctx, data, pipeline.outputs[i].opts, pipeline.datafields, tmpGrads, produced);
        c.prefix = prefix;
    }

    c.log(`Complete!`);
}