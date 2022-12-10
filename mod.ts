import * as path from "https://deno.land/std@0.167.0/path/mod.ts";
import Gradients from "./defs/Gradients.ts";
import Indexed from "./defs/Indexed.ts";
import WeatherData from "./defs/WeatherData.ts";

import { inputs } from "./inputs.ts";
import { intermediaries } from "./intermediaries.ts";
import { outputs } from "./outputs.ts";
import { transforms } from "./transforms.ts";
import { processors } from "./processors.ts";
import { pipelines } from "./pipelines.ts";
import WeatherCtx from "./defs/WeatherCtx.ts";

const gradients: Gradients = {};
const originalConsole = self.console;

const nConsole = {
	...originalConsole,
	prefix: "",
	log: function (...v: unknown[]) {
		originalConsole.log(this.prefix, ...v);
	},
	error: function (...v: unknown[]) {
		originalConsole.error(this.prefix, ...v);
	},
	warn: function (...v: unknown[]) {
		originalConsole.warn(this.prefix, ...v);
	},
};
globalThis.console = nConsole;

nConsole.prefix = "[init]";
console.log("Beginning loading...");

nConsole.prefix = "[gradient]";
const dirEntries = Deno.readDir("./gradients");
for await (const gradient of dirEntries) {
	if (gradient.isFile && !gradient.name.startsWith(".")) {
		console.log("Loading " + gradient.name);
		const p = path.join("./gradients", gradient.name);
		const name = path.basename(gradient.name, ".json");
		const readJson = await Deno.readTextFile(p);
		gradients[name] = JSON.parse(readJson);
	}
}

const tabLog = (v: string) => console.log("\t" + v);

nConsole.prefix = "[init]";
console.log("Loaded Gradients:");
Object.keys(gradients).forEach(tabLog);

console.log("Loaded Inputs:");
Object.keys(inputs).forEach(tabLog);

console.log("Loaded Intermediaries:");
Object.keys(intermediaries).forEach(tabLog);

console.log("Loaded Outputs:");
Object.keys(outputs).forEach(tabLog);

console.log("Loaded Transforms:");
Object.keys(transforms).forEach(tabLog);

console.log("Loaded Processors:");
Object.keys(processors).forEach(tabLog);

console.log("Loaded Pipelines:");
Object.keys(pipelines).forEach(tabLog);

console.log("Initializing timers...");
const timers: Indexed<number> = {};

Object.keys(pipelines).forEach(async (k) => {
	const pipeline = pipelines[k];
	if (pipeline.runInst) {
		await runPipeline(k);
	}
	timers[k] = setInterval(() => runPipeline(k), pipeline.interval);
});

async function runPipeline(key: string) {
	const prefix = `[${key}]`;
	// Update console prefix
	const c = {
		...nConsole,
		prefix: prefix,
	};
	// Get `this` object ready
	const newThis: WeatherCtx = {
		console: c,
		pipelineName: key,
	};
	// Log
	c.log(`Running pipeline...`);
	const pipeline = pipelines[key];
	// Data object
	let data: WeatherData = {};
	c.log(`Getting data...`);

	for (let i = 0; i < pipeline.inputs.length; i++) {
		const input = pipeline.inputs[i];
		c.log(`Fetching ${input.name}...`);
		c.prefix = prefix + ` > [${input.name}]`;
		const inputFn = inputs[input.name];
		try {
			// @ts-ignore TypeScript doesn't know what it's doing.
			let fetched = await inputFn.call(newThis, input.opts);
			if (input.whitelist !== undefined) {
				const whitelist = input.whitelist;
				fetched = Object.fromEntries(
					Object.entries(fetched).filter((v) =>
						whitelist.includes(v[0])
					),
				);
			} else if (input.blacklist !== undefined) {
				const blacklist = input.blacklist;
				fetched = Object.fromEntries(
					Object.entries(fetched).filter((v) =>
						!blacklist.includes(v[0])
					),
				);
			}
			data = { ...data, ...fetched };
		} catch (e) {
			c.log(`Failed to run!`, e);
			c.log("Ignoring...");
		}
		c.prefix = prefix;
	}

	c.log(`Running intermediaries...`);
	const tmpGrads = { ...gradients };
	for (let i = 0; i < pipeline.intermediaries.length; i++) {
		const p = pipeline.intermediaries[i];
		c.log(`Running intermediate ${p.name}...`);
		const intermediate = intermediaries[p.name];
		c.prefix = prefix + ` > ${p.name}`;
		try {
			// @ts-ignore TypeScript doesn't know what it's doing.
			await intermediate.call(newThis, p.opts, data, tmpGrads, pipeline);
		} catch (e) {
			c.log(`Failed to run!`, e);
			c.log("Ignoring...");
		}
		c.prefix = prefix;
	}

	c.log(`Running processors...`);
	const produced: Indexed<unknown> = {};
	for (let i = 0; i < pipeline.processors.length; i++) {
		const p = pipeline.processors[i];
		c.log(`Running processor ${p.name}...`);
		const process = processors[p.name];
		c.prefix = prefix + ` > ${p.name}`;
		try {
			await process.call(
				newThis,
				p.opts,
				tmpGrads,
				pipeline.datafields,
				data,
				transforms,
				produced,
			);
		} catch (e) {
			c.log(`Failed to run!`, e);
			c.log("Ignoring...");
		}
		c.prefix = prefix;
	}

	c.log(`Running outputs...`);
	for (let i = 0; i < pipeline.outputs.length; i++) {
		c.log(`Running output ${pipeline.outputs[i].name}...`);
		const output = outputs[pipeline.outputs[i].name];
		c.prefix = prefix + ` > ${pipeline.outputs[i].name}`;
		try {
			// @ts-ignore TypeScript doesn't know what it's doing.
			await output.call(
				newThis,
				data,
				pipeline.outputs[i].opts,
				pipeline.datafields,
				tmpGrads,
				produced,
			);
		} catch (e) {
			c.log(`Failed to run!`, e);
			c.log("Ignoring...");
		}
		c.prefix = prefix;
	}

	c.log(`Complete!`);
}
