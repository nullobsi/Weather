import * as path from "https://deno.land/std@0.76.0/path/mod.ts"
import Gradients from "./defs/Gradients.ts";
import Indexed from "./defs/Indexed.ts";
import WeatherData from "./defs/WeatherData.ts";

import {inputs} from "./inputs.ts";
import {intermediaries} from "./intermediaries.ts";
import {outputs} from "./outputs.ts";
import {transforms} from "./transforms.ts";
import {processors} from "./processors.ts";
import {pipelines} from "./pipelines.ts";

let gradients: Gradients = {};
let originalConsole = window.console;

let nConsole = {
    ...originalConsole,
    prefix: "",
    log: function (...v: unknown[]) {
        originalConsole.log(this.prefix, ...v);
    },
    error: function(...v: unknown[]) {
        originalConsole.error(this.prefix, ...v);
    },
    warn: function(...v: unknown[]) {
        originalConsole.warn(this.prefix, ...v);
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
        try {
            let fetched = await input.call(ctx, pipeline.inputs[i].opts);
            if (p.whitelist !== undefined) {
                let whitelist = p.whitelist;
                fetched = Object.fromEntries(Object.entries(fetched).filter(v => whitelist.includes(v[0])));
            } else if (p.blacklist !== undefined) {
                let blacklist = p.blacklist;
                fetched = Object.fromEntries(Object.entries(fetched).filter(v => !blacklist.includes(v[0])));
            }
            data = {...data, ...fetched};
        } catch (e) {
            c.log(`Failed to run!`, e);
            c.log("Ignoring...");
        }
        c.prefix = prefix;
    }

    c.log(`Running intermediaries...`);
    let tmpGrads = {...gradients};
    for (let i = 0; i < pipeline.intermediaries.length; i++) {
        let p = pipeline.intermediaries[i];
        c.log(`Running intermediate ${p.name}...`);
        let intermediate = intermediaries[p.name];
        c.prefix = prefix + ` > ${p.name}`;
        try {
            await intermediate.call(ctx, p.opts, data, tmpGrads, pipeline);
        } catch (e) {
            c.log(`Failed to run!`, e);
            c.log("Ignoring...");
        }
        c.prefix = prefix;
    }

    c.log(`Running processors...`);
    let produced: Indexed<any> = {};
    for (let i = 0; i < pipeline.processors.length; i++) {
        let p = pipeline.processors[i];
        c.log(`Running processor ${p.name}...`);
        let process = processors[p.name];
        c.prefix = prefix + ` > ${p.name}`;
        try {
            await process.call(ctx, p.opts, tmpGrads, pipeline.datafields, data, transforms, produced);
        } catch (e) {
            c.log(`Failed to run!`, e);
            c.log("Ignoring...");
        }
        c.prefix = prefix;
    }

    c.log(`Running outputs...`);
    for (let i = 0; i < pipeline.outputs.length; i++) {
        c.log(`Running output ${pipeline.outputs[i].name}...`);
        let output = outputs[pipeline.outputs[i].name];
        c.prefix = prefix + ` > ${pipeline.outputs[i].name}`;
        try {
            await output.call(ctx, data, pipeline.outputs[i].opts, pipeline.datafields, tmpGrads, produced);
        } catch (e) {
            c.log(`Failed to run!`, e);
            c.log("Ignoring...");
        }
        c.prefix = prefix;
    }

    c.log(`Complete!`);
}
