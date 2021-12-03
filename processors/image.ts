import DataProcessor from "../defs/DataProcessor.ts";

import Go from "https://deno.land/x/godeno@v0.6.0/mod.ts"

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
            value: number;
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


let wasmFile = await Deno.readFile("util/Canvas/go_build_WeatherCanvas_js");

let process: DataProcessor = async function(options, gradients, datafields, data, transforms, outputs) {

    let opt = <ImageOptions>options;
    let finalOpt: renderOpt = {
        height: opt.height,
        width: opt.width,
        panels: [],
        bgFit: opt.bgFit,
    };
    opt.panels.forEach(panel => {
        finalOpt.panels.push({
            width: panel.width,
            fontSize: panel.fontSize,
            height: panel.height,
            dials: [],
            title: panel.title,
            x: panel.x,
            y: panel.y
        });
    });

    datafields.forEach(field => {
        let conf = <ImagePerconf>field.perConfig["image"];
        if (conf == undefined) return;

        let i = conf.panel;

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
            value: data[field.fieldName] !== undefined && data[field.fieldName] !== null ? data[field.fieldName] : null,

            presc: conf.presc,
            transform: conf.transform
        })
    })

    let go = new Go()
    let wa = await WebAssembly.instantiate(wasmFile, go.importObject);
    let p = go.run(wa.instance);

    let bgImg: Uint8Array = data[opt.imageKey];

    let size = await go.exports?.renderDials(finalOpt, gradients, bgImg.byteLength, bgImg);
    let buffer = new Uint8Array(size);
    await go.exports?.copyDials(buffer);
    outputs[opt.outputKey] = buffer;
    await p;
}

interface ImageOptions {
    width: number
    height: number
    panels: {
        title: string,
        x: number,
        y: number,
        height: number,
        width: number,
        fontSize: number
    }[]
    imageKey: string
    outputKey: string
    bgFit: "width" | "height";
}

export type {ImageOptions};

interface ImagePerconf {
    transform: string | undefined
    panel: number
    r: number
    x: number
    y: number
    // angles
    start: number
    end: number
    presc: number

    startV: number
    endV: number
    displayUnit: boolean
    displayName: boolean
}

export type {ImagePerconf};

export default process;
