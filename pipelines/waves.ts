import Pipeline from "../defs/Pipeline.ts";
import getConfig from "../util/getConfig.ts";
import {Thresholds} from "../intermediaries/image.ts";


const config = await getConfig("pipelines", "waves", {
    discordChannelId: "HERE",
    discordServerId: "HERE",

    fivedayURL: "HERE",
    realtimeURL: "HERE",
    altSeaTmpURL: "HERE",

    imagesFolder: "HERE",

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
const s = 2;

//image
const imgWidth = 1080 * s
const imgHeight = 1080 * s

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

//sensor numbers
const indoor = "temp1f"
const water = "temp2f"
const soil = "temp8f"
const soilHumidity = "soilhum1"

let pipeline: Pipeline = {
    datafields: [
        //Temperature
        {
            perConfig: {
                "image": {
                    displayName: false,
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
                    presc: 1
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
            displayName: "Temperature",
            fieldName: "ATMP_degF",
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
                    r: sr,
                    x: Math.floor(width / 4),
                    y: r*2+ sr,
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
                    r: sr,
                    x: Math.floor(width / 4) * 3,
                    y: r*2 + sr,
                    transform: undefined,
                    presc: 1
                },
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wu_temp",
            displayName: "Dew",
            fieldName: "DEWP_degF",
            transform: undefined,
            unit: "°F"
        },


        // Waves
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 16,
                    panel: 1,
                    r: r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                }
            },
            gradient: "waves",
            displayName: "Waves",
            fieldName: "WVHT_ft",
            transform: undefined,
            unit: " ft"
        },
        {
            perConfig: {
                "image": {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 16,
                    panel: 1,
                    r: sr,
                    x: Math.floor(width / 4),
                    y: r*2 + sr,
                    transform: undefined,
                    presc: 1
                }
            },
            gradient: "period",
            displayName: "Per.",
            fieldName: "APD_sec",
            transform: undefined,
            unit: " s"
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
                    r: sr,
                    x: Math.floor(width / 4) * 3,
                    y: r*2 + sr,
                    transform: "wind",
                    presc: 0
                },
            },
            gradient: "winddir",
            displayName: "Waves Direction",
            fieldName: "MWD_degT",
            transform: undefined,
            unit: "°"
        },

        // Wind
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 2,
                    r: r,
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
            displayName: "Wind Speed",
            fieldName: "WSPD_mph",
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
                    panel: 2,
                    r: sr,
                    x: Math.floor(width / 4),
                    y: r*2 + sr,
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
            fieldName: "GST_mph",
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
                    panel: 2,
                    r: sr,
                    x: Math.floor(width / 4) * 3,
                    y: r*2 + sr,
                    transform: "wind",
                    presc: 0
                },
            },
            gradient: "winddir",
            displayName: "Wind Direction",
            fieldName: "WDIR_degT",
            transform: undefined,
            unit: "°"
        },

        // Swell
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 8,
                    panel: 3,
                    r: r,
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
            gradient: "waves",
            displayName: "Swell",
            fieldName: "SwH_ft",
            transform: undefined,
            unit: " ft"
        },
        {
            perConfig: {
                "image": {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 16,
                    panel: 3,
                    r: sr,
                    x: Math.floor(width / 4),
                    y: r*2 + sr,
                    transform: undefined,
                    presc: 1
                }
            },
            gradient: "period",
            displayName: "Per.",
            fieldName: "SwP_sec",
            transform: undefined,
            unit: " s"
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
                    panel: 3,
                    r: sr,
                    x: Math.floor(width / 4) * 3,
                    y: r*2 + sr,
                    transform: "wind",
                    presc: 0
                },
            },
            gradient: "winddir",
            displayName: "Swell Direction",
            fieldName: "SwD_degT",
            transform: undefined,
            unit: "°"
        },

        //Sea Temperature
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 32,
                    endV: 77,
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
                imagePicker: {
                    useFor: "temp"
                }
            },
            gradient: "wu_temp",
            displayName: "Temperature",
            fieldName: "WTMP_degF",
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
                    panel: 4,
                    r: sr,
                    x: Math.floor(width / 4),
                    y: r*2+ sr,
                    transform: undefined,
                    presc: 1
                },
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "humidity",
            displayName: "Hum.",
            fieldName: "humidity",
            transform: undefined,
            unit: "%"
        },
        {
            perConfig: {
                "image": {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 28.84,
                    endV: 31.00,
                    panel: 4,
                    r: sr,
                    x: Math.floor(width / 4) * 3,
                    y: r*2 + sr,
                    transform: undefined,
                    presc: 2
                },
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "pressure",
            displayName: "BP",
            fieldName: "PRES_inHg",
            transform: undefined,
            unit: " inHg"
        },

        //Wind Waves
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 16,
                    panel: 5,
                    r: r,
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
            gradient: "waves",
            displayName: "Wind Waves",
            fieldName: "WWH_ft",
            transform: undefined,
            unit: " ft"
        },
        {
            perConfig: {
                "image": {
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 16,
                    panel: 5,
                    r: sr,
                    x: Math.floor(width / 4),
                    y: r*2 + sr,
                    transform: undefined,
                    presc: 1
                }
            },
            gradient: "period",
            displayName: "Per.",
            fieldName: "WWP_sec",
            transform: undefined,
            unit: " s"
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
                    panel: 5,
                    r: sr,
                    x: Math.floor(width / 4) * 3,
                    y: r*2 + sr,
                    transform: "wind",
                    presc: 0
                },
            },
            gradient: "winddir",
            displayName: "Wind Wave Direction",
            fieldName: "WWD_degT",
            transform: undefined,
            unit: "°"
        },
    ],
    inputs: [
        {
            name: "plaintext",
            opts: {
                url: config.fivedayURL,
                values: [
                    {name: "ATMP_degC", index: 13},
                    {name: "DEWP_degC", index: 15},
                    {name: "WSPD_m/s", index: 6},
                    {name: "GST_m/s", index: 7},
                    {name: "WDIR_degT", index: 5},
                    {name: "PRES_hPa", index: 12},
                ],
                reverse: false,
                getDate: (parsed) => {
                    let r = parsed[0];
                    let yr = parseInt(r[0]);
                    let mo = parseInt(r[1]);
                    let dy = parseInt(r[2]);
                    let hr = parseInt(r[3]);
                    let mn = parseInt(r[4]);
                    console.log("THIS IS THE DATE THINGY!!!!!!!!!!!!", r, yr, mo, dy ,hr ,mn);
                    return new Date(yr, mo, dy, hr, mn);
                }
            },
        },
        {
            name: "plaintext",
            opts: {
                url: config.realtimeURL,
                values: [
                    {name: "WVHT_m", index: 5},
                    {name: "APD_sec", index: 13},
                    {name: "MWD_degT", index: 14},
                    {name: "SwH_m", index: 6},
                    {name: "SwP_sec", index: 7},
                    {name: "WWH_m", index: 8},
                    {name: "WWP_sec", index: 9},

                    {name: "SwD", index: 10},
                    {name: "WWD", index: 11},
                ],
                reverse: false,
                getDate: false,
            },
        },
        {
            name: "plaintext",
            opts: {
                url: config.altSeaTmpURL,
                values: [
                    {name: "WTMP_degC", index: 14},
                ],
                reverse: false,
                getDate: false,
            },
        },
    ],
    intermediaries: [
        {
            name: "multiconv",
            opts: {
                from: "degC",
                to: "degF",
                func: v => v * 9/5 + 32,
                fieldNames: ["WTMP_degC", "ATMP_degC", "DEWP_degC"],
            }
        },
        {
            name: "multiconv",
            opts: {
                from: "m/s",
                to: "mph",
                func: v => v * 2.2369362920544,
                fieldNames: ["WSPD_m/s", "GST_m/s"],
            }
        },
        {
            name: "multiconv",
            opts: {
                from: "m",
                to: "ft",
                func: v => v * 3.2808398950131,
                fieldNames: ["WVHT_m", "SwH_m", "WWH_m"],
            }
        },
        {
            name: "multiconv",
            opts: {
                from: "hPa",
                to: "inHg",
                func: v => v * 0.029529983071445,
                fieldNames: ["PRES_hPa"]
            },
        },
        {
            name: "degT",
            opts: {
                field: "SwD",
                nField: "SwD_degT"
            }
        },
        {
            name: "degT",
            opts: {
                field: "WWD",
                nField: "WWD_degT"
            }
        },
        {
            name: "cardinal",
            opts: {
                fieldName: "MWD_degT",
            },
        },
        {
            name: "cardinal",
            opts: {
                fieldName: "WDIR_degT",
            },
        },
        {
            name: "hum",
            opts: {
                humidityOut: "humidity",
                dewPt: "DEWP_degF",
                tempF: "ATMP_degF",
            },
        },
        {
            name: "feelslike",
            opts: {
                tempF: "ATMP_degF",
                humidity: "humidity",
                windMph: "WSPD_mph",
                nFieldName: "feelslike",
            },
        },
        {
            name: "image",
            opts: {
                folder: config.imagesFolder,
                thresholds: config.thresholds as Thresholds
            }
        }
    ],
    interval: 300000,
    outputs: [
        {
            name: "console",
            opts: undefined,
        },
        {
            name: "file",
            opts: {
                archive: true,
                name: "waves",
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
            opts: {
                channel: config.discordChannelId,
                server: config.discordServerId,
                attachment: {
                    fieldName: "image",
                    fileName: "weather.png"
                }
            }
        },
        // {
        //     name: "ftp",
        //     opts: {
        //         fieldName: "image",
        //         uploadName: "weather/temp.png",
        //         password: config.ftpPassword,
        //         username: config.ftpUsername,
        //         host: config.ftpHostname,
        //         port: config.ftpPort,
        //         tlsHostname: config.ftpAuthname,
        //     }
        // }
    ],
    runInst: true,
    processors: [
        {
            name: "image",
            opts: {
                height: imgHeight,
                width: imgWidth,
                imageKey: "image",
                outputKey: "image",
                bgFit: "height",
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
                        title: "Waves",
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
                        title: "Swell",
                        x: spacing + width + spacing,
                        y: spacing + largeHeight + spacing,
                        height: largeHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sea Temp.",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing,
                        height: largeHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Wind Waves",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing + largeHeight + spacing,
                        height: largeHeight,
                        width: width,
                        fontSize: titleFontSize
                    }
                ]
            }
        }
    ]
}

export default pipeline;
