import Pipeline from "../defs/Pipeline.ts";
import {FileOutputOpts} from "../outputs/file.ts";
import {ImageOptions, ImagePerconf} from "../processors/image.ts";
import getConfig from "../util/getConfig.ts";
import {DiscordOpt, DiscordPerconf} from "../outputs/discord.ts";
import {ImageInterOpts, ImagePickerPerConf, Thresholds} from "../intermediaries/image.ts";
import {CsvPerconf} from "../inputs/csv.ts";

const config = await getConfig("pipelines", "windyAir", {
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

const largeHeight = 510 * s
const smallHeight = 333 * s

const width = 335 * s

const spacing = 20 * s
const smallSpacing = 10 * s

const titleFontSize = 520 / 12 * s

const r = 150 * s
const sr = 75 * s

//angles for normal dials
const ns = Math.PI - Math.PI / 4;
const ne = Math.PI * 2 + Math.PI / 4;

let pipeline: Pipeline = {
    datafields: [
        //Temperature
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
                    x: Math.floor(width / 2) + smallSpacing*3,
                    y: r + spacing,
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
            gradient: "clouds",
            displayName: "Cover",
            fieldName: "Clouds0",
            transform: undefined,
            unit: "%"
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
                    x: Math.floor(width / 2) + width + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "lclouds",
            displayName: "Low",
            fieldName: "LowClouds0",
            transform: undefined,
            unit: "%"
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
                    x: Math.floor(width / 2) + width*2 + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "wind"
                }
            },
            gradient: "mclouds",
            displayName: "Med",
            fieldName: "MediumClouds0",
            transform: undefined,
            unit: "%"
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
                    x: Math.floor(width / 2) + width*3 + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "hclouds",
            displayName: "High",
            fieldName: "HighClouds0",
            transform: undefined,
            unit: "%"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 3000,
                    panel: 0,
                    r,
                    x: Math.floor(width / 2) + smallSpacing*3,
                    y: r*3 + smallSpacing * 3,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "cbase",
            displayName: "Base",
            fieldName: "CloudBase0",
            transform: undefined,
            unit: " ft"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 49200,
                    panel: 0,
                    r,
                    x: Math.floor(width / 2) + width + smallSpacing*3,
                    y: r*3 + smallSpacing * 3,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "humidity"
                },
            },
            gradient: "cloudtop",
            displayName: "Tops",
            fieldName: "CloudTops0",
            transform: undefined,
            unit: " ft"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 16400,
                    panel: 0,
                    r,
                    x: Math.floor(width / 2) + width*2 + smallSpacing*3,
                    y: r*3 + smallSpacing * 3,
                    transform: undefined,
                    presc: 0
                },
            },
            gradient: "freezing",
            displayName: "0°C",
            fieldName: "FreezingAltitude0",
            transform: undefined,
            unit: " ft"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 26200,
                    panel: 0,
                    r,
                    x: Math.floor(width / 2) + width*3 + smallSpacing*3,
                    y: r*3 + smallSpacing * 3,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "thermals",
            displayName: "Thermals",
            fieldName: "Thermals0",
            transform: undefined,
            unit: " ft"
        },

        // Air Quality
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 250,
                    panel: 1,
                    r: r,
                    x: Math.floor(width / 2) + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "pressure"
                }
            },
            gradient: "pm25",
            displayName: "PM2.5",
            fieldName: "PM2.50",
            transform: undefined,
            unit: " µg/m³"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 80,
                    panel: 1,
                    r: r,
                    x: Math.floor(width / 2) + width + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "so2",
            displayName: "SO₂",
            fieldName: "SO20",
            transform: undefined,
            unit: " mg/m²"
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
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width*2 + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "no2",
            displayName: "NO₂",
            fieldName: "NO20",
            transform: undefined,
            unit: " µg/m³"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 1200,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width*3 + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "co",
            displayName: "CO",
            fieldName: "COConcentration0",
            transform: undefined,
            unit: " ppbv"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 180,
                    endV: 500,
                    panel: 1,
                    r: r,
                    x: Math.floor(width / 2) + smallSpacing*3,
                    y: r*3 + smallSpacing * 3,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "ozonelayer",
            displayName: "O₃",
            fieldName: "OzoneLayer0",
            transform: undefined,
            unit: " DU"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 250,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width + smallSpacing*3,
                    y: r*3 + smallSpacing*3,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "ozone",
            displayName: "Ozone",
            fieldName: "SurfaceOzone0",
            transform: undefined,
            unit: " µg/m³"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 4,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width*2 + smallSpacing*3,
                    y: r*3 + smallSpacing*3,
                    transform: "rainrate",
                    presc: 3
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "aerosol",
            displayName: "Aerosol",
            fieldName: "Aerosol0",
            transform: undefined,
            unit: " AOD"
        },
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 80,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width*3 + smallSpacing*3,
                    y: r*3 + smallSpacing*3,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "dust",
            displayName: "Dust",
            fieldName: "DustMass0",
            transform: undefined,
            unit: " µg/m³"
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
        },
    ],
    intermediaries: [
        {
            name: "image",
            opts: <ImageInterOpts>{
                folder: config.imagesFolder,
                thresholds: config.thresholds
            }
        }
    ],
    interval: 300000,
    outputs: [
        {
            name: "console",
            opts: {}
        },
        {
            name: "file",
            opts: <FileOutputOpts>{
                archive: true,
                name: "windyAir",
                pretty: true,
                extraFiles: [{
                    ext: ".png",
                    fieldName: "image"
                }],
                removeKeys: ["image"],
            }
        },
        {
            name: "discord",
            opts: <DiscordOpt>{
                channel: config.discordChannelId,
                server: config.discordServerId,
                attachment: {
                    fieldName: "image",
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
                outputKey: "image",
                bgFit: "height",
                panels: [
                    {
                        title: "Clouds",
                        x: spacing,
                        y: spacing,
                        height: width * 2 + spacing,
                        width: width * 4 + spacing * 3,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Air Quality",
                        x: spacing,
                        y: width * 2 + spacing * 3,
                        height: width * 2 + spacing,
                        width: width * 4 + spacing * 3,
                        fontSize: titleFontSize
                    }
                ]
            }
        }
    ]
}

export default pipeline;
