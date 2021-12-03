import Pipeline from "../defs/Pipeline.ts";
import {FileOutputOpts} from "../outputs/file.ts";
import {ImageOptions, ImagePerconf} from "../processors/image.ts";
import getConfig from "../util/getConfig.ts";
import {DiscordOpt, DiscordPerconf} from "../outputs/discord.ts";
import {wundergroundOpts} from "../inputs/wunderground.ts";
import {AqiOpts} from "../inputs/aqi.ts";
import {SoilOpts} from "../intermediaries/soil.ts";
import {ConsolePerconf} from "../outputs/console.ts";
import {RainrateOpts} from "../intermediaries/rainrate.ts";
import {CapOptions} from "../intermediaries/cap.ts";
import {FtpOutputOpts} from "../outputs/ftp.ts";
import {AmbientPerconf} from "../inputs/ambientweather.ts";
import {ImageInterOpts, ImagePickerPerConf, Thresholds} from "../intermediaries/image.ts";

const config = await getConfig("pipelines", "windyAir", {
    discordChannelId: "HERE",
    discordServerId: "HERE",
    wundergroundStationId: "HERE",
    wuStationId2: "HERE",
    aqiLat: 0,
    aqiLng: 0,

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
                    presc: 1
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
                    presc: 1
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
                }
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
                    presc: 1
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
                    endV: 450,
                    panel: 1,
                    r,
                    x: Math.floor(width / 2) + width*3 + smallSpacing*3,
                    y: r + spacing,
                    transform: undefined,
                    presc: 1
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
                    presc: 1
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
                    presc: 0
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
                    presc: 2
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

        {
            perConfig: {
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "console": <ConsolePerconf>{
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
                "discord": <DiscordPerconf>{
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
            opts: <wundergroundOpts>{
                stationId: config.wuStationId2
            }
        },
        {
            name: "wunderground",
            opts: <wundergroundOpts>{
                stationId: config.wundergroundStationId
            },
            blacklist: ["pressure"],
        },
        {
            name: "ambientweather",
            opts: <AmbientPerconf>{
                apiKey: config.ambientApiKey1,
                appKey: config.ambientAppKey1,
                device: config.ambientDevice1,
            },
            blacklist: [water, "humidity"],
        },
        {
            name: "ambientweather",
            opts: <AmbientPerconf>{
                apiKey: config.ambientApiKey2,
                appKey: config.ambientAppKey2,
                device: config.ambientDevice2,
            },
            blacklist: [
                "humidity"
            ]
        },
        {
            name: "aqi",
            opts: <AqiOpts>{
                lng: config.aqiLng,
                lat: config.aqiLat,
            }

        }
    ],
    intermediaries: [
        {
            name: "cardinal",
            opts: {}
        },
        {
            name: "rainrate",
            opts: <RainrateOpts>{
                highEnd: 37,
                lowEnd: 32,
                fieldName: "precipRate",
                tempFieldName: "temp"
            }
        },
        {
            name: "cap",
            opts: <CapOptions>{
                fieldName: "solarradiation",
                maxDigits: 4,
                maxPresc: 2,
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
        // {
        //     name: "ftp",
        //     opts: <FtpOutputOpts>{
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
