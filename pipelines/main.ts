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

const config = await getConfig("pipelines", "main", {
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
//image
const imgWidth = 1440
const imgHeight = 1080

const largeHeight = 510
const smallHeight = 333

const width = 335

const spacing = 20
const smallSpacing = 10

const titleFontSize = 520 / 12

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
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: true,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "temp"
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
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: -58,
                    endV: 122,
                    panel: 0,
                    r: 75,
                    x: Math.floor(width / 4),
                    y: 150 + 150 + 75,
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
            fieldName: "windChill",
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
                    r: 75,
                    x: Math.floor(width / 4) * 3,
                    y: 150 + 150 + 75,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
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
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 12,
                    panel: 1,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
                    transform: "rainrate",
                    presc: 2
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                imagePicker: <ImagePickerPerConf>{
                    useFor: "precip"
                }
            },
            gradient: "rainrate",
            displayName: "Rain Rate",
            fieldName: "precipRate",
            transform: undefined,
            unit: " in/hr"
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
                    panel: 1,
                    r: 75,
                    x: Math.floor(width / 4),
                    y: 150 + 150 + 75,
                    transform: undefined,
                    presc: 2
                }
            },
            gradient: "rainaccum",
            displayName: "Day",
            fieldName: "precipTotal",
            transform: undefined,
            unit: " in"
        },
        {
            perConfig: {
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "rainaccum",
            displayName: "Daily Rain",
            fieldName: "precipTotal",
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
                    endV: 4.68,
                    panel: 1,
                    r: 75,
                    x: Math.floor(width / 4) * 3,
                    y: 150 + 150 + 75,
                    transform: undefined,
                    presc: 2
                }
            },
            gradient: "rainaccum",
            displayName: "Week",
            fieldName: "weeklyrainin",
            transform: undefined,
            unit: " in"
        },

        // Wind
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 65,
                    panel: 2,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
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
            displayName: "Wind Speed",
            fieldName: "windSpeed",
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
                    panel: 2,
                    r: 75,
                    x: Math.floor(width / 4),
                    y: 150 + 150 + 75,
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
            fieldName: "windGust",
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
                    panel: 2,
                    r: 75,
                    x: Math.floor(width / 4) * 3,
                    y: 150 + 150 + 75,
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

        // Water & Soil
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 32,
                    endV: 77,
                    panel: 3,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "wu_temp",
            displayName: "Water Temp.",
            fieldName: water,
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
                    startV: 23,
                    endV: 86,
                    panel: 3,
                    r: 75,
                    x: Math.floor(width / 4),
                    y: 150 + 150 + 75,
                    transform: undefined,
                    presc: 1
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
                "image": <ImagePerconf>{
                    displayName: true,
                    displayUnit: false,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 100,
                    panel: 3,
                    r: 75,
                    x: Math.floor(width / 4) * 3,
                    y: 150 + 150 + 75,
                    transform: undefined,
                    presc: 0
                }
            },
            gradient: "humidity",
            displayName: "Hum.",
            fieldName: soilHumidity,
            transform: undefined,
            unit: ""
        },

        //Humidity
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 100,
                    panel: 4,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
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
            displayName: "Humidity",
            fieldName: "humidity",
            transform: undefined,
            unit: "%"
        },

        //UV
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 11,
                    panel: 5,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
                    transform: undefined,
                    presc: 1
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
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
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 300,
                    panel: 6,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
                    transform: undefined,
                    presc: 0
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
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 28.84,
                    endV: 31.00,
                    panel: 7,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
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
            displayName: "Pressure",
            fieldName: "pressure",
            transform: undefined,
            unit: " inHg"
        },

        //Solar Radiation
        {
            perConfig: {
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 962.5,
                    panel: 8,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
                    transform: undefined,
                    presc: 2
                },
                imagePicker: {
                    useFor: "solar"
                }
            },
            gradient: "solar",
            displayName: "Solar Radiation",
            fieldName: "solarradiation",
            transform: undefined,
            unit: " W/m²"
        },

        //PM2.5
        {
            perConfig: {
                "image": <ImagePerconf>{
                    displayName: false,
                    displayUnit: true,
                    start: ns,
                    end: ne,
                    startV: 0,
                    endV: 300,
                    panel: 9,
                    r: 150,
                    x: Math.floor(width / 2),
                    y: 150 + smallSpacing,
                    transform: "pm25",
                    presc: 0
                },
                "discord": <DiscordPerconf>{
                    updateRoleColor: false,
                    sendToDiscord: true
                },
            },
            gradient: "pm25",
            displayName: "PM2.5",
            fieldName: "pm25",
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
                bgFit: "width",
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
                        title: "Precipitation",
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
                        height: smallHeight + 1,
                        width: width,
                        fontSize: titleFontSize
                    },
                    {
                        title: "AQI",
                        x: spacing + width + spacing + width + spacing,
                        y: spacing + smallHeight + spacing + smallHeight + 1 + spacing,
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
                        y: spacing + smallHeight + spacing + smallHeight + 1 + spacing,
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
