import Pipeline from "../defs/Pipeline.ts";
import getConfig from "../util/getConfig.ts";

const config = await getConfig("pipelines", "indoors", {
    discordChannelId: "HERE",
    discordServerId: "HERE",
    discordRecordsChannelId: "HERE",
    wundergroundStationId: "HERE",
    wuStationId2: "HERE",
    aqiLat: 0,
    aqiLng: 0,

    tableUrl: "HERE",

    ftpPassword: "HERE",
    ftpUsername: "HERE",
    ftpHostname: "HERE",
    ftpAuthname: "HERE",
    ftpPort: 21,

    ambientApiKey1: "HERE",
    ambientAppKey1: "HERE",
    ambientDevice1: "HERE",

    ambientApiKey2: "HERE",
    ambientAppKey2: "HERE",
    ambientDevice2: "HERE",

    backgroundUrl: "HERE",
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
const water = "waterTemp"
const soil = "temp8f"
const soilHumidity = "soilhum1"

// @ts-ignore
// @ts-ignore
let pipeline: Pipeline = {
    datafields: [
        //Indoor
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 50,
                    endV: 86,
                    panel: 0,
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
                    useFor: "temp"
                },
                //records: {
                    //type: "both",
                //},
            },
            gradient: "wu_temp",
            displayName: "Indoor",
            fieldName: "temp",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 3
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 50,
                    endV: 86,
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
                },
                records: {
                    type: "high",
                },
            },
            gradient: "wu_temp",
            displayName: "Sensor 3",
            fieldName: "temp3f",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 6
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 41,
                    endV: 72.5,
                    panel: 2,
                    r: r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },

                records: {
                    type: "both",
                },
            },
            gradient: "wu_temp",
            displayName: "Sensor 6",
            fieldName: "temp6f",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 1
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 50,
                    endV: 86,
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
                imagePicker: {
                    useFor: "temp"
                },
                //records: {
                    //type: "both",
                //},
            },
            gradient: "wu_temp",
            displayName: "Sensor 1",
            fieldName: "temp1f",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 4
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 50,
                    endV: 86,
                    panel: 4,
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
                records: {
                    type: "high",
                },
            },
            gradient: "wu_temp",
            displayName: "Sensor 4",
            fieldName: "temp4f",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 7
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 14,
                    endV: 122,
                    panel: 5,
                    r: r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },

                records: {
                    type: "both",
                },
            },
            gradient: "wu_temp",
            displayName: "Sensor 7",
            fieldName: "temp7f",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 2
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 50,
                    endV: 86,
                    panel: 6,
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
                    useFor: "temp"
                },

                records: {
                    type: "both",
                },
            },
            gradient: "wu_temp",
            displayName: "Sensor 2",
            fieldName: "temp2f",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 5
        {
            perConfig: {
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 50,
                    endV: 86,
                    panel: 7,
                    r: r,
                    x: Math.floor(width / 2),
                    y: r + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                imagePicker: {
                    useFor: "temp"
                },
                records: {
                    type: "high",
                },
            },
            gradient: "wu_temp",
            displayName: "Sensor 5",
            fieldName: "temp5f",
            transform: undefined,
            unit: "°F"
        },

        // Sensor 8
        {
            perConfig: {
                "image": {
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 32,
                    endV: 77,
                    panel: 8,
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
                records: {
                    type: "both",
                },
            },
            gradient: "wu_temp",
            displayName: "Sensor 8",
            fieldName: "temp8f",
            transform: undefined,
            unit: "°F"
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wind",
            displayName: "Wind Speed (WU)",
            fieldName: "windSpeed",
            transform: undefined,
            unit: " mph",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wind",
            displayName: "Wind Gust (WU)",
            fieldName: "windGust",
            transform: undefined,
            unit: " mph",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wind",
            displayName: "Daily Gust (Ambient)",
            fieldName: "maxdailygust",
            transform: undefined,
            unit: " mph",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "winddir",
            displayName: "Wind Direction",
            fieldName: "winddir",
            transform: undefined,
            unit: "°",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wind",
            displayName: "Wind Speed (Ambient)",
            fieldName: "windspeedmph",
            transform: undefined,
            unit: " mph",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wind",
            displayName: "Wind Gust (Ambient)",
            fieldName: "windgustmph",
            transform: undefined,
            unit: " mph",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "rainrate",
            displayName: "Rain Rate (WU)",
            fieldName: "precipRate",
            transform: undefined,
            unit: " in/hr",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "rainaccum",
            displayName: "Daily Rain (WU)",
            fieldName: "precipTotal",
            transform: undefined,
            unit: " in",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "rainaccum",
            displayName: "Hourly Rain (Ambient)",
            fieldName: "hourlyrainin",
            transform: undefined,
            unit: " in",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "rainaccum",
            displayName: "Daily Rain (Ambient)",
            fieldName: "dailyrainin",
            transform: undefined,
            unit: " in",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "rainaccum",
            displayName: "Weekly Rain (Ambient)",
            fieldName: "weeklyrainin",
            transform: undefined,
            unit: " in",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "rainaccum",
            displayName: "Monthly Rain (Ambient)",
            fieldName: "monthlyrainin",
            transform: undefined,
            unit: " in",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "rainaccum",
            displayName: "Yearly Rain (Ambient)",
            fieldName: "yearlyrainin",
            transform: undefined,
            unit: " in",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Dew Point (WU)",
            fieldName: "dewpt",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Temperature (WU)",
            fieldName: "temp",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Heat Index (WU)",
            fieldName: "heatIndex",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Wind Chill (WU)",
            fieldName: "windChill",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Temperature (Ambient)",
            fieldName: "tempf",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Temperature (Indoor)",
            fieldName: "temp1f",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Temperature (Water)",
            fieldName: "temp2f",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Temperature (Soil)",
            fieldName: "soiltemp3",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Dew Point (Ambient)",
            fieldName: "dewPoint",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Dew Point (Indoor)",
            fieldName: "dewPoint1",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Dew Point (Soil)",
            fieldName: "dewPoint3",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Feels Like (Ambient)",
            fieldName: "feelsLike",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Feels Like (Indoor)",
            fieldName: "feelsLike1",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "wu_temp",
            displayName: "Feels Like (Soil)",
            fieldName: "feelsLike3",
            transform: undefined,
            unit: "°F",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "pressure",
            displayName: "Rel. Pressure (WU)",
            fieldName: "pressure",
            transform: undefined,
            unit: " inHg",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "pressure",
            displayName: "Rel. Pressure (Ambient)",
            fieldName: "baromrelin",
            transform: undefined,
            unit: " inHg",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "pressure",
            displayName: "Abs. Pressure (Ambient)",
            fieldName: "baromabsin",
            transform: undefined,
            unit: " inHg",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "solar",
            displayName: "Solar Radiation (WU)",
            fieldName: "solarRadiation",
            transform: undefined,
            unit: "  W/m²",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "solar",
            displayName: "Solar Radiation (Ambient)",
            fieldName: "solarradiation",
            transform: undefined,
            unit: " W/m²",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "uv",
            displayName: "UV Index",
            fieldName: "uv",
            transform: undefined,
            unit: "",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "humidity",
            displayName: "Humidity (WU)",
            fieldName: "humidity",
            transform: undefined,
            unit: "%",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "humidity",
            displayName: "Humidity (Indoor)",
            fieldName: "humidity1",
            transform: undefined,
            unit: "%",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "soil",
            displayName: "Humidity (Soil)",
            fieldName: "soilhum3",
            transform: undefined,
            unit: "",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "batt",
            displayName: "Battery (Station)",
            fieldName: "battout",
            transform: undefined,
            unit: "",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "batt",
            displayName: "Battery (Indoor)",
            fieldName: "batt1",
            transform: undefined,
            unit: "",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "batt",
            displayName: "Battery (Water)",
            fieldName: "batt2",
            transform: undefined,
            unit: "",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "batt",
            displayName: "Battery (Soil)",
            fieldName: "batt3",
            transform: undefined,
            unit: "",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "aqi",
            displayName: "AQI",
            fieldName: "aqi",
            transform: undefined,
            unit: "",
        },

        {
            perConfig: {
                "console": {
                    print: true
                }
            },
            gradient: "pm25",
            displayName: "PM2.5",
            fieldName: "pm25",
            transform: undefined,
            unit: " µg/m³",
        },

        {
            perConfig: {
                "discord": {
                    updateRoleColor: false,
                    sendToDiscord: false
                },
            },
            gradient: "windy_temp",
            displayName: "Temperature (Windy)",
            fieldName: "temp",
            transform: undefined,
            unit: "°F"
        },

    ],
    inputs: [
        {
            name: "wunderground",
            opts: {
                stationId: config.wuStationId2
            },
            blacklist: ["pressure"],
        },
        {
            name: "wunderground",
            opts: {
                stationId: config.wundergroundStationId
            },
            blacklist: ["pressure"],
        },
        {
            name: "ambientweather",
            opts: {
                apiKey: config.ambientApiKey1,
                appKey: config.ambientAppKey1,
                device: config.ambientDevice1,
            },
            blacklist: [water, "humidity"],
        },
        {
            name: "ambientweather",
            opts: {
                apiKey: config.ambientApiKey2,
                appKey: config.ambientAppKey2,
                device: config.ambientDevice2,
            },
            blacklist: [
                "humidity", "baromabsin", "tempf"
            ]
        },
        {
            name: "aqi",
            opts: {
                lng: config.aqiLng,
                lat: config.aqiLat,
            }

        },
        {
            name: "plaintext",
            opts: {
                reverse: true,
                url: config.tableUrl,
                values: [{index:4, name: "waterTemp"}],
                getDate: false,
            }
        }
    ],
    intermediaries: [
        {
            name: "cardinal",
            opts: {
                fieldName: "winddir",
            },
        },
        {
            name: "rainrate",
            opts: {
                highEnd: 37,
                lowEnd: 32,
                fieldName: "precipRate",
                tempFieldName: "temp"
            }
        },
        {
            name: "cap",
            opts: {
                fieldName: "solarradiation",
                maxDigits: 4,
                maxPresc: 2,
            }
        },
        {
            name: "relpressure",
            opts: {
                absPressure: "baromabsin",
                elevationM: 483,
                tempF: "tempf",
                nFieldName: "baromabsin",
            }
        },
        {
            name: "conv",
            opts: {
                fieldName: "waterTemp",
                func: t => t * 1.8 + 32,
                nFieldName: "waterTemp",
            }
        },
        {
            name: "feelslike",
            opts: {
                nFieldName: "feelsLike",
                humidity: "humidity",
                tempF: "temp",
                windMph: "windSpeed",
            }
        },
        {
            name: "fixdewpt",
            opts: {
                tempF: "temp",
                humidity: "humidity",
                dewpt: "dewPoint",
                presc: 1,
            }
        },
        {
            name: "image",
            opts: {
                folder: config.imagesFolder,
                // @ts-ignore
                thresholds: config.thresholds
            }
        },
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
                name: "main",
                pretty: true,
                extraFiles: [{
                    ext: ".png",
                    fieldName: "image"
                }],
                removeKeys: ["image"],
            }
        },
        {
            name: "records",
            opts: {
                name: "main",
            },
        },
        {
            name: "discord",
            opts: {
                channel: config.discordChannelId,
                server: config.discordServerId,
                attachment: {
                    fieldName: "image",
                    fileName: "weather.png"
                },
                recordsChannel: config.discordRecordsChannelId,
            },
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
                bgFit: "width",
                panels: [
                    {
                        title: "Indoor",
                        x: spacing,
                        y: spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 3",
                        x: spacing,
                        y: spacing + smallHeight + spacing,
                        height: smallHeight + 1*s,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 6",
                        x: spacing,
                        y: spacing + smallHeight + spacing + smallHeight + 1*s + spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 1",
                        x: spacing + width + spacing,
                        y: spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 4",
                        x: spacing + width + spacing,
                        y: spacing + smallHeight + spacing,
                        height: smallHeight + 1*s,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 7",
                        x: spacing + width + spacing,
                        y: spacing + smallHeight + spacing + smallHeight + 1*s + spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 2",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing,
                        height: smallHeight,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 5",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing + smallHeight + spacing,
                        height: smallHeight + 1*s,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "Sensor 8",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing + smallHeight + spacing + smallHeight + 1*s + spacing,
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
