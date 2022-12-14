import DataProcessor from "../defs/DataProcessor.ts";
import Go from "https://deno.land/x/godeno@v0.6.2/mod.ts";

const wasmFile = await Deno.readFile("util/Canvas/go_build_WeatherCanvas_js");

const process: DataProcessor<ImagePOpts> = async function (
	opt,
	gradients,
	datafields,
	data,
	_transforms,
	outputs,
) {
	// Options to be given to Canvas
	const finalOpt: renderOpt = {
		height: opt.height,
		width: opt.width,
		panels: [],
		bgFit: opt.bgFit,
	};

	// Fit all the panels
	opt.panels.forEach((panel) => {
		finalOpt.panels.push({
			width: panel.width,
			fontSize: panel.fontSize,
			height: panel.height,
			dials: [],
			title: panel.title,
			x: panel.x,
			y: panel.y,
		});
	});

	// Find all imagePerconf and populate panels
	datafields.forEach((field) => {
		const conf = <ImagePerconf> field.perConfig["image"];
		if (conf == undefined) return;

		// Panel #
		const i = conf.panel;

		// Add to panel
		finalOpt.panels[i].dials.push({
			unit: conf.displayUnit ? field.unit : "",
			displayName: conf.displayName ? field.displayName : "",
			gradient: field.gradient,

			smallFontSize: (conf.r * 2 / 12),
			bigFontSize: (conf.r * 2) / 6,

			r: conf.r,
			cx: conf.x,
			cy: conf.y,

			start: conf.start,
			end: conf.end,

			startV: conf.startV,
			endV: conf.endV,
			value: data[field.fieldName] !== undefined &&
					data[field.fieldName] !== null
				? data[field.fieldName] as number
				: null,

			presc: conf.presc,
			transform: conf.transform,
		});
	});

	// Load go program WASM
	const go = new Go();
	const wa = await WebAssembly.instantiate(wasmFile, go.importObject);
	const p = go.run(wa.instance);

	let bgImg = data[opt.imageKey] as Uint8Array | undefined;
	if (bgImg === undefined) {
		bgImg = new Uint8Array();
	}

	const size = await go.exports?.renderDials(
		finalOpt,
		gradients,
		bgImg.byteLength,
		bgImg,
	);
	const buffer = new Uint8Array(size);
	await go.exports?.copyDials(buffer);
	outputs[opt.outputKey] = buffer;
	await p;
};

interface renderOpt {
	panels: {
		dials: {
			displayName: string;
			gradient: string;
			start: number;
			bigFontSize: number;
			smallFontSize: number;
			r: number;
			unit: string;
			endV: number;
			cx: number;
			cy: number;
			startV: number;
			end: number;
			value: number | null;
			presc: number;
			transform: string | undefined;
		}[];
		x: number;
		width: number;
		y: number;
		fontSize: number;
		title: string;
		height: number;
	}[];
	width: number;
	height: number;
	// width: fit so the entire width of image fits
	// height: fit to entire height of image fits
	bgFit: "width" | "height";
}

interface ImagePOpts {
	width: number;
	height: number;
	panels: {
		title: string;
		x: number;
		y: number;
		height: number;
		width: number;
		fontSize: number;
	}[];
	imageKey: string;
	outputKey: string;
	bgFit: "width" | "height";
}

interface ImagePerconf {
	transform: string | undefined;
	panel: number;
	r: number;
	x: number;
	y: number;
	// angles
	start: number;
	end: number;
	presc: number;

	startV: number;
	endV: number;
	displayUnit: boolean;
	displayName: boolean;
}

export type { ImagePOpts };
export type { ImagePerconf };

export default process;
