import Pipeline from "../defs/Pipeline.ts";
import {FileOutputOpts} from "../outputs/file.ts";
import {ImageOptions, ImagePerconf} from "../processors/image.ts";
import getConfig from "../util/getConfig.ts";
import {DiscordOpt, DiscordPerconf} from "../outputs/discord.ts";
import {wundergroundOpts} from "../inputs/wunderground.ts";

const config = await getConfig("outputs","main", {
    discordChannelId: "HERE",
    discordServerId: "HERE",
    wundergroundStationId: "HERE",
})
//image
const imgWidth = 1440
const imgHeight = 1080

const largeHeight = 510
const smallHeight = 333

const width = 335

const spacing = 20
const smallSpacing = 10

const titleFontSize = 520/12

//angles for normal dials
const ns = Math.PI- Math.PI/4;
const ne = Math.PI*2 + Math.PI/4;

//sensor numbers
const indoor = "temp1f"
const water = "temp2f"
const soil = "temp3f"
const soilHumidity = "humidity3"

//discord conf
const channelId = "HERE"
const serverId = "HERE"

let pipeline: Pipeline = {
    datafields: [
        //Temperature
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "wu_temp",
            displayName: "Temperature",
            fieldName: "temp",
            transform: undefined,
            unit: "°F"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r: 75,
                    x: Math.floor(width/4),
                    y: 150+150+75,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "wu_temp",
            displayName: "Feels",
            fieldName: "windChill",
            transform: undefined,
            unit: "°F"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r: 75,
                    x: Math.floor(width/4)*3,
                    y: 150+150+75,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "wu_temp",
            displayName: "Dew",
            fieldName: "dewpt",
            transform: undefined,
            unit: "°F"
        },



        // Rain
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 12,
                    panel: 1,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "rainrate",
            displayName: "Rain Rate",
            fieldName: "precipRate",
            transform: undefined,
            unit: "in/hr"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 1.82,
                    panel: 1,
                    r: 75,
                    x: Math.floor(width/4),
                    y: 150+150+75,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "rainaccum",
            displayName: "Day",
            fieldName: "precipTotal",
            transform: undefined,
            unit: "in"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 4.68,
                    panel: 1,
                    r: 75,
                    x: Math.floor(width/4)*3,
                    y: 150+150+75,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "rainaccum",
            displayName: "Week",
            fieldName: "weeklyrainin",
            transform: undefined,
            unit: "in"
        },

        // Wind
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 2,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "wind",
            displayName: "Wind Speed",
            fieldName: "windSpeed",
            transform: undefined,
            unit: "mph"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 2,
                    r: 75,
                    x: Math.floor(width/4),
                    y: 150+150+75,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "wind",
            displayName: "Gust",
            fieldName: "windGust",
            transform: undefined,
            unit: "mph"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: -Math.PI/2,
                    end: Math.PI*2-Math.PI/2,
                    startV: 0,
                    endV: 360,
                    panel: 2,
                    r: 75,
                    x: Math.floor(width/4)*3,
                    y: 150+150+75,
                    transform: "wind",
                    presc: 0
                },
            },
            gradient: "winddir",
            displayName: "Wind Direction",
            fieldName: "winddir",
            transform: undefined,
            unit: "°"
        },


        {
            perConfig: {
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "winddir",
            displayName: "Wind Direction",
            fieldName: "winddir",
            transform: undefined,
            unit: "°"
        },


        // Water & Soil
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 32,
                    endV: 77,
                    panel: 3,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "wu_temp",
            displayName: "Water Temp.",
            fieldName: water,
            transform: undefined,
            unit: "°F"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 23,
                    endV: 86,
                    panel: 3,
                    r: 75,
                    x: Math.floor(width/4),
                    y: 150+150+75,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "wu_temp",
            displayName: "Soil",
            fieldName: soil,
            transform: undefined,
            unit: "°F"
        },
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: true,
                    displayUnit: false,
                    start: ns,
                    end: ne,
                    startV: 1,
                    endV: 16,
                    panel: 3,
                    r: 75,
                    x: Math.floor(width/4)*3,
                    y: 150+150+75,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "soil",
            displayName: "Hum.",
            fieldName: soilHumidity,
            transform: undefined,
            unit: ""
        },

        //Humidity
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 100,
                    panel: 4,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "humidity",
            displayName: "Humidity",
            fieldName: "humidity",
            transform: undefined,
            unit: "%"
        },

        //UV
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 15,
                    panel: 5,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "uv",
            displayName: "UV Index",
            fieldName: "uv",
            transform: undefined,
            unit: ""
        },

        //AQI
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 300,
                    panel: 6,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "aqi",
            displayName: "AQI",
            fieldName: "aqi",
            transform: undefined,
            unit: ""
        },

        //Pressure
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 28.84,
                    endV: 31.00,
                    panel: 7,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "pressure",
            displayName: "Pressure",
            fieldName: "pressure",
            transform: undefined,
            unit: "inHg"
        },

        //Solar Radiation
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 1361,
                    panel: 8,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "solar",
            displayName: "Solar Radiation",
            fieldName: "solarradiation",
            transform: undefined,
            unit: "W/m²"
        },

        //PM2.5
        {
            perConfig: {
                "image": <ImagePerconf> {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 1300,
                    panel: 9,
                    r: 150,
                    x: Math.floor(width/2),
                    y: 150+smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "pm25",
            displayName: "PM2.5",
            fieldName: "pm25",
            transform: undefined,
            unit: "µg/m³"
        },
    ],
    inputs: [
        {
            name: "wunderground",
            opts: <wundergroundOpts>{
                stationId: config.wundergroundStationId
            }
        },
        {
            name: "ambientweather",
            opts: {
            }
        }
        ],
    intermediaries: [
        {
            name: "cardinal",
            opts:{}
        }
    ],
    interval: 120000,
    outputs: [
        {
            name: "console",
            opts: {}
        },
        {
            name: "file",
            opts: <FileOutputOpts>{
                archive: true,
                name: "main",
                pretty: true,
                extraFiles: [{
                    ext: ".png",
                    fieldName: "image"
                }]
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
        }
        ],
    runInst: true,
    processors: [
        {
            name: "image",
            opts: <ImageOptions>{
                height: imgHeight,
                width: imgWidth,
                panels: [
                    {
                        title: "Temperature",
                        x: spacing,
                        y: spacing,
                        height: largeHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Rain",
                        x: spacing,
                        y: spacing + largeHeight + spacing,
                        height: largeHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Wind",
                        x: spacing + width + spacing,
                        y: spacing,
                        height: largeHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Water Temp.",
                        x: spacing + width + spacing,
                        y: spacing + largeHeight + spacing,
                        height: largeHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Humidity",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "UV Index",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing + smallHeight + spacing,
                        height: smallHeight+1,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "AQI",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing + smallHeight + spacing + smallHeight+1 + spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Pressure",
                        x: spacing + width + spacing + width + spacing + width + spacing,
                        y: spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Solar Radiation",
                        x: spacing + width + spacing + width + spacing + width + spacing,
                        y: spacing + smallHeight + spacing,
                        height: smallHeight + 1,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "PM2.5",
                        x: spacing + width + spacing + width + spacing + width + spacing,
                        y: spacing + smallHeight + spacing + smallHeight+1 + spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                ]
            }
        }
    ]
}

export default pipeline;