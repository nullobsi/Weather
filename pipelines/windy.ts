import Pipeline from "../defs/Pipeline.ts";
import getConfig from "../util/getConfig.ts";
import {Thresholds} from "../intermediaries/image.ts";

const config = await getConfig("pipelines", "windy", {
    discordChannelId: "HERE",
    discordServerId: "HERE",

    imagesFolder: "HERE",

    jsonUrl: "HERE",

    thresholds: {
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
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: {
                    useFor: "temp"
                }
            },
            gradient: "wu_temp",
            displayName: "Temp.",
            fieldName: "Temperature",
            transform: undefined,
            unit: "°F"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wu_temp",
            displayName: "Feels",
            fieldName: "feelslike",
            transform: undefined,
            unit: "°F"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wu_temp",
            displayName: "Dew",
            fieldName: "DewPoint",
            transform: undefined,
            unit: "°F"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: {
                    useFor: "humidity"
                }
            },
            gradient: "humidity",
            displayName: "RH",
            fieldName: "Humidity",
            transform: undefined,
            unit: "%"
        },

        // Wind
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: {
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
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wind",
            displayName: "Gust",
            fieldName: "WindGusts",
            transform: undefined,
            unit: " mph"
        },
        {
            perConfig: {
                "image": {
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
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wind",
            displayName: "Accu.",
            fieldName: "WindAccumulation",
            transform: undefined,
            unit: " mph"
        },

        // Air
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: {
                    useFor: "pressure"
                }
            },
            gradient: "pressure",
            displayName: "BP",
            fieldName: "Pressure",
            transform: undefined,
            unit: " inHg"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "visibility",
            displayName: "Visi.",
            fieldName: "Visibility",
            transform: undefined,
            unit: " mi²"
        },

        // Rain
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "radar",
            displayName: "Radar",
            fieldName: "WeatherRadar",
            transform: undefined,
            unit: " dBZ"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "rainaccum",
            displayName: "3d",
            fieldName: "RainAccumulation3D",
            transform: undefined,
            unit: " in"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "cape",
            displayName: "CAPE",
            fieldName: "CAPEIndex",
            transform: undefined,
            unit: " j/kg"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "thunder",
            displayName: "Storm",
            fieldName: "Thunderstorms",
            transform: undefined,
            unit: " L/km²"
        },

        // Snow
        {
            perConfig: {
                "image": {
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
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "snowaccum",
            displayName: "12h",
            fieldName: "NewSnow",
            transform: undefined,
            unit: " in"
        },
        {
            perConfig: {
                "image": {
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
                "discord": {
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
            name: "json",
            opts: {
                url: config.jsonUrl,
                getDate: data => new Date((data.Time as number) * 1000),
            },
        },
    ],
    intermediaries: [
        {
            name: "multiconv",
            opts: {
                fieldNames: ["Wind1", "WindAccumulation", "WindGusts"],
                from: "", to: "",
                func: v => v* 1.1507794480235,
            },
        },
        {
            name: "cardinal",
            opts: {
                fieldName: "Wind0",
            }
        },
        {
            name: "feelslike",
            opts: {
                nFieldName: "feelslike",
                windMph: "Wind1",
                humidity: "Humidity",
                tempF: "Temperature",
            }
        },
        {
            name: "image",
            opts: {
                folder: config.imagesFolder,
                thresholds: config.thresholds as Thresholds,
            }
        }
    ],
    interval: 3600000,
    outputs: [
        {
            name: "file",
            opts: {
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
            opts: {
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
            opts: {
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
