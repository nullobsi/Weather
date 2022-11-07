import Pipeline from "../defs/Pipeline.ts";
import getConfig from "../util/getConfig.ts";

const config = await getConfig("pipelines", "indoors", {
    discordChannelId: "HERE",
    discordServerId: "HERE",
    discordRecordsChannelId: "HERE",

    ambientApiKey1: "HERE",
    ambientAppKey1: "HERE",
    ambientDevice1: "HERE",

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

const smallHeight = 333 * s

const width = 335 * s

const spacing = 20 * s
const smallSpacing = 10 * s

const titleFontSize = 520 / 12 * s

const r = 150 * s

//angles for normal dials
const ns = Math.PI - Math.PI / 4;
const ne = Math.PI * 2 + Math.PI / 4;

//sensor numbers

const pipeline: Pipeline = {
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
            fieldName: "tempinf",
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
    ],
    inputs: [
        {
            name: "ambientweather",
            opts: {
                apiKey: config.ambientApiKey1,
                appKey: config.ambientAppKey1,
                device: config.ambientDevice1,
            },
        },
    ],
    intermediaries: [
        {
            name: "image",
            opts: {
                folder: config.imagesFolder,
                // @ts-ignore: tuples <=> array
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
                name: "indoors",
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
                name: "indoors",
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
