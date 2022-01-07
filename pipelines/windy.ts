import Pipeline from "../defs/Pipeline.ts";
import {FileOutputOpts} from "../outputs/file.ts";
import {ImageOptions, ImagePerconf} from "../processors/image.ts";
import getConfig from "../util/getConfig.ts";
import {DiscordOpt, DiscordPerconf} from "../outputs/discord.ts";
import {RainrateOpts} from "../intermediaries/rainrate.ts";
import {CapOptions} from "../intermediaries/cap.ts";
import {ImageInterOpts, ImagePickerPerConf, Thresholds} from "../intermediaries/image.ts";
import {CsvPerconf} from "../inputs/csv.ts";
import {CardinalOpts} from "../intermediaries/cardinal.ts";

const config = await getConfig("pipelines", "windy", {
    discordChannelId: "HERE",
    discordServerId: "HERE",

    imagesFolder: "HERE",

    execFile: ["HERE"],
    execWorkingDir: "HERE",
    execResultFile: "HERE",

    thresholds: <Thresholds>{
        stormy: [0,0],
        bright: [0,0,0,0,0,0,0,0,0,0,0,0],
        humid: 0,
        windy: 0,
        hot: [0,0,0,0,0,0,0,0,0,0,0,0],
        cold: [0,0,0,0,0,0,0,0,0,0,0,0],
        sunset: 0,
    }
})
// scale factor
const s = 1.5;

//image
const imgWidth = 1440 * s
const imgHeight = 1440 * s

const width = 320 * s

const spacing = 20 * s
const smallSpacing = 10 * s

const titleFontSize = 520 / 12 * s

const r = 150 * s

//angles for normal dials
const ns = Math.PI - Math.PI / 4;
const ne = Math.PI * 2 + Math.PI / 4;

let pipeline: Pipeline = {
    datafields: [
        //Temperature & Humidity
        {
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
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "temp"
                }
            },
            gradient: "wu_temp",
            displayName: "Temp.",
            fieldName: "Temperature0",
            transform: undefined,
            unit: "°F"
        },
        {
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
                    x: Math.floor(width / 2) + width + spacing*2,
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wu_temp",
            displayName: "Feels",
            fieldName: "windChill", // TODO: calc
            transform: undefined,
            unit: "°F"
        },
        {
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
                    x: Math.floor(width / 2),
                    y: r*3 + smallSpacing * 2,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wu_temp",
            displayName: "Dew",
            fieldName: "DewPoint0",
            transform: undefined,
            unit: "°F"
        },
        {
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
                    x: Math.floor(width / 2) + width + spacing*2,
                    y: r*3 + smallSpacing * 2,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "humidity"
                }
            },
            gradient: "humidity",
            displayName: "RH",
            fieldName: "Humidity0",
            transform: undefined,
            unit: "%"
        },

        // Wind
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "wind"
                }
            },
            gradient: "wind",
            displayName: "Wind",
            fieldName: "Wind1",
            transform: undefined,
            unit: " mph"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width + spacing*2,
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wind",
            displayName: "Gust",
            fieldName: "WindGusts0",
            transform: undefined,
            unit: " mph"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: -Math.PI / 2,
                    end: Math.PI * 2 - Math.PI / 2,
                    startV: 0,
                    endV: 360,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2),
                    y: r*3 + smallSpacing * 2,
                    transform: "wind",
                    presc: 0
                },
            },
            gradient: "winddir",
            displayName: "Wind Direction",
            fieldName: "Wind0",
            transform: undefined,
            unit: "°"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width + spacing*2,
                    y: r*3 + smallSpacing * 2,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wind",
            displayName: "Accu.",
            fieldName: "WindAccumulation0",
            transform: undefined,
            unit: " mph"
        },

        // Air
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 28.84,
                    endV: 31.00,
                    panel: 2,
                    r: r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "pressure"
                }
            },
            gradient: "pressure",
            displayName: "BP",
            fieldName: "Pressure0",
            transform: undefined,
            unit: " inHg"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 12.4,
                    panel: 2,
                    r: r,
                    x: Math.floor(width / 2),
                    y: r*3 + smallSpacing * 2,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "visibility",
            displayName: "Visi.",
            fieldName: "Visibility0",
            transform: undefined,
            unit: " mi²"
        },

        // Rain
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 68,
                    panel: 3,
                    r: r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "radar",
            displayName: "Radar",
            fieldName: "WeatherRadar0",
            transform: undefined,
            unit: " dBZ"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 1.82,
                    panel: 3,
                    r,
                    x: Math.floor(width / 2) + width + spacing*2,
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "rainaccum",
            displayName: "3d",
            fieldName: "RainAccumulation3D0",
            transform: undefined,
            unit: " in"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 2500,
                    panel: 3,
                    r,
                    x: Math.floor(width / 2),
                    y: r*3 + smallSpacing*2,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "cape",
            displayName: "CAPE",
            fieldName: "CAPEIndex0",
            transform: undefined,
            unit: " j/kg"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 15,
                    panel: 3,
                    r,
                    x: Math.floor(width / 2) + width + spacing*2,
                    y: r*3 + smallSpacing*2,
                    transform: "rainrate",
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "thunder",
            displayName: "Storm",
            fieldName: "Thunderstorms0",
            transform: undefined,
            unit: " L/km²"
        },

        // Snow
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 12,
                    panel: 4,
                    r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "snowaccum",
            displayName: "12h",
            fieldName: "NewSnow0",
            transform: undefined,
            unit: " in"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 36,
                    panel: 4,
                    r,
                    x: Math.floor(width / 2),
                    y: r*3 + smallSpacing*2,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "snowaccum",
            displayName: "Depth",
            fieldName: "SnowDepth0",
            transform: undefined,
            unit: " in"
        },
    ],
    inputs: [
        {
            name: "csv",
            opts: <CsvPerconf>{
                workingDirectory: config.execWorkingDir,
                runExecutable: config.execFile,
                filePath: config.execResultFile,
            }
        }
    ],
    intermediaries: [
        {
            name: "cardinal",
            opts: <CardinalOpts>{
                fieldName: "Wind0",
            }
        },
        {
            name: "image",
            opts: <ImageInterOpts>{
                folder: config.imagesFolder,
                thresholds: config.thresholds
            }
        }
    ],
    interval: 3600000,
    outputs: [
        {
            name: "file",
            opts: <FileOutputOpts>{
                archive: true,
                name: "windy",
                pretty: true,
                extraFiles: [{
                    ext: ".png",
                    fieldName: "windyImg"
                }],
                removeKeys: ["image", "windyImg"],
            }
        },
        {
            name: "discord",
            opts: <DiscordOpt>{
                channel: config.discordChannelId,
                server: config.discordServerId,
                attachment: {
                    fieldName: "windyImg",
                    fileName: "weather.png"
                }
            }
        },
    ],
    runInst: true,
    processors: [
        {
            name: "image",
            opts: <ImageOptions>{
                height: imgHeight,
                width: imgWidth,
                imageKey: "image",
                bgFit: "height",
                outputKey: "windyImg",
                panels: [
                    {
                        title: "Temp. & Humidity",
                        x: spacing,
                        y: spacing,
                        height: width * 2 + spacing * 2,
                        width: width * 2 + spacing * 2,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Wind",
                        x: width * 2 + spacing * 5,
                        y: spacing,
                        height: width * 2 + spacing * 2,
                        width: width * 2 + spacing * 2,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Air",
                        x: spacing,
                        y: width * 2 + spacing * 5,
                        height: width * 2 + spacing * 2,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Rain",
                        x: width + spacing * 3,
                        y: width * 2 + spacing * 5,
                        height: width * 2 + spacing * 2,
                        width: width * 2 + spacing * 2,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Snow",
                        x: width * 3 + spacing * 7,
                        y: width * 2 + spacing * 5,
                        height: width * 2 + spacing * 2,
                        width: width,
                        fontSize: titleFontSize
                    },
                ]
            }
        }
    ]
}

export default pipeline;
