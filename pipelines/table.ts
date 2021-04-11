import Pipeline from "../defs/Pipeline.ts";
import getConfig from "../util/getConfig.ts";
import {TableOpts} from "../inputs/table.ts";
import {FileOutputOpts} from "../outputs/file.ts";
import {DiscordOpt} from "../outputs/discord.ts";
import {ImageOptions, ImagePerconf} from "../processors/image.ts";
import {ConvOpts} from "../intermediaries/conv.ts";
import {MultiConvOpts} from "../intermediaries/multiconv.ts";
import {FeelsLikeOpts} from "../intermediaries/feelslike.ts";
import {ImageInterOpts} from "../intermediaries/image.ts";
import {ImageUrlOpts} from "../inputs/imageUrl.ts";
import {DewPointOpts} from "../intermediaries/dewpoint.ts";

const config = await getConfig("pipelines", "table", {
    "url": "HERE",
    "archiveName": "HERE",
    "channelId": "HERE",
    "serverId": "HERE",
    "title": "HERE",
    "bgUrl": "HERE",
});

//image

// ALL THE PIXZELS
const imgH = 2160;
const imgW = 2160;
const titleSize = 140;
const margin = 105;

const squareSize = (imgW - margin*2)/3;
const dialMargin = 25;
const r = (squareSize - dialMargin * 2)/2

//angles for normal dials
const ns = Math.PI - Math.PI / 4;
const ne = Math.PI * 2 + Math.PI / 4;

//sensor numbers

let pipeline: Pipeline = {
    datafields: [
        {
            // generated field
            fieldName: "T_Avg_F",
            displayName: "Temp.",
            gradient: "wu_temp",
            unit: "°F",
            transform: undefined,
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r,
                    x: dialMargin + r,
                    y: dialMargin + r,
                    presc: 2,
                    transform: undefined
                },
            },
        },
        {
            // generated field
            fieldName: "windSpeedMph",
            gradient: "wind",
            displayName: "Wind",
            transform: undefined,
            unit: "mph",
            perConfig: {
                "image": <ImagePerconf>{
                    displayUnit: true,
                    displayName: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 0,
                    r,
                    x: dialMargin + r,
                    y: squareSize + dialMargin + r,
                    presc: 2,
                    transform: undefined
                },
            },
        },
        {
            fieldName: "RH_Avg",
            gradient: "humidity",
            displayName: "Hum.",
            transform: undefined,
            unit: "%",
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 100,
                    panel: 0,
                    r,
                    x: dialMargin + r,
                    y: squareSize*2 + dialMargin + r,
                    presc: 1,
                },
            },
        },
        {
            // generated field
            fieldName: "feelsLikeF",
            displayName: "Feels",
            gradient: "wu_temp",
            unit: "°F",
            transform: undefined,
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r,
                    x: squareSize + dialMargin + r,
                    y: dialMargin + r,
                    presc: 2,
                    transform: undefined
                },
            },
        },
        {
            // generated field
            fieldName: "windGustMph",
            gradient: "wind",
            displayName: "Gust",
            transform: undefined,
            unit: "mph",
            perConfig: {
                "image": <ImagePerconf>{
                    displayUnit: true,
                    displayName: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 0,
                    r,
                    x: squareSize + dialMargin + r,
                    y: squareSize + dialMargin + r,
                    presc: 1,
                    transform: undefined
                },
            },
        },
        {
            fieldName: "pressure_inHg",
            gradient: "pressure",
            unit: " inHg",
            transform: undefined,
            displayName: "BP",
            perConfig: {
                "image": <ImagePerconf>{
                    displayUnit: true,
                    displayName: true,
                    start: ns,
                    end: ne,
                    startV: 28.84,
                    endV: 31.00,
                    panel: 0,
                    r,
                    x: squareSize + dialMargin + r,
                    y: squareSize*2 + dialMargin + r,
                    presc: 2,
                    transform: undefined,
                },
            },
        },
        {
            // generated field
            fieldName: "dewPointF",
            displayName: "Dew",
            gradient: "wu_temp",
            unit: "°F",
            transform: undefined,
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r,
                    x: squareSize*2 + dialMargin + r,
                    y: dialMargin + r,
                    presc: 2,
                    transform: undefined
                },
            },
        },
        {
            fieldName: "WindDir_Avg",
            displayName: "Dir.",
            gradient: "winddir",
            transform: undefined,
            unit: "°",
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: -Math.PI / 2,
                    end: Math.PI * 2 - Math.PI / 2,
                    startV: 0,
                    endV: 360,
                    panel: 0,
                    r,
                    x: squareSize*2 + dialMargin + r,
                    y: squareSize + dialMargin + r,
                    transform: "wind",
                    presc: 0,
                },
            },
        },

    ],
    inputs: [
        {
            name: "table",
            opts: <TableOpts>{
                url: config.url,
            },
        },
        {
            name: "imageUrl",
            opts: <ImageUrlOpts>{
                url: config.bgUrl,
            }
        }
    ],
    outputs: [
        {
            name: "console",
            opts: {},
        },
        {
            name: "file",
            opts: <FileOutputOpts>{
                archive: true,
                name: config.archiveName,
                pretty: true,
                extraFiles: [{
                    ext: ".png",
                    fieldName: "image",
                }],
            },
        },
        {
            name: "discord",
            opts: <DiscordOpt>{
                server: config.serverId,
                channel: config.channelId,
                attachment: {
                    fieldName: "image",
                    fileName: "image.png",
                },
            },
        },

    ],
    intermediaries: [
        {
            name: "conv",
            opts: <ConvOpts>{
                func: v => (v * 1.8) + 32,
                fieldName: "T_Avg",
                nFieldName: "T_Avg_F",
            },
        },
        {
            name: "conv",
            opts: <ConvOpts>{
                func: v => v *0.0295299830714,
                nFieldName: "pressure_inHg",
                fieldName: "BP_Avg",
            },
        },
        {
            name: "multiconv",
            opts: <MultiConvOpts>{
                func: (v) => Math.max(...v) * 2.2369,
                fieldNames: ["WS3CupA_Avg", "WS3CupB_Avg"],
                nFieldName: "windSpeedMph",
            },
        },
        {
            name: "multiconv",
            opts: <MultiConvOpts>{
                func: (v) => Math.max(...v) * 2.2369,
                fieldNames: ["WS3CupA_Max", "WS3CupB_Max"],
                nFieldName: "windGustMph",
            },
        },
        {
            name: "feelslike",
            opts: <FeelsLikeOpts>{
                nFieldName: "feelsLikeF",
                humidity: "RH_Avg",
                windMph: "windSpeedMph",
                tempF: "T_Avg_F",
            },
        },
        {
            name: "dewpoint",
            opts: <DewPointOpts>{
                nFieldName: "dewPointF",
                humidity: "RH_Avg",
                tempF: "T_Avg_F",
            },
        },
    ],
    processors: [
        {
            name: "image",
            opts: <ImageOptions>{
                imageKey: "image",
                // the inside should still be a square
                height: imgH + titleSize,
                width: imgW,
                bgFit: "height",
                panels: [
                    {
                        title: config.title,
                        x: margin,
                        y: margin,
                        height: imgH - margin*2 + titleSize,
                        width: imgW - margin*2,
                        fontSize: titleSize,
                    },
                ],
            },
        },
    ],
    runInst: true,
    interval: 300000

}

export default pipeline;