import * as Discord from "https://raw.githubusercontent.com/discordeno/discordeno/next/mod.ts";
import getConfig from "../util/getConfig.ts";
import tempToColor from "../util/tempToColor.ts";
import DiscordRole from "../defs/DiscordRole.ts";
import {getDateString} from "../util/getDateString.ts";
import DataOutput from "../defs/DataOutput.ts";

const config = await getConfig("outputs", "discord", {
    "token": "HERE"
});

await Discord.startBot({
    token: config.token,
    intents: []
});

type DiscordPerconf = {
    sendToDiscord: boolean,
    updateRoleColor: boolean,
};
type DiscordOpt = {channel: string, server: string, attachment: {fieldName: string, fileName: string} | undefined}
export type {DiscordPerconf,DiscordOpt}

const output: DataOutput = async function output(data, opt, datafields, gradients, processed) {
    let options = opt as DiscordOpt;
    let msg = "Weather report for " + getDateString(new Date(data.date)) + "\n";
    //let maxlen = datafields.reduce<number>((p, c) => c.displayName.length > p ? c.displayName.length : p, 0);
    console.log("[discord] Getting roles...")
    let roles: DiscordRole[] = [];
    let hasPerm = true;
    if (!Discord.botHasPermission(options.server, ["MANAGE_ROLES"])) {
        console.error("[discord] No permission for roles, skipping!");
        hasPerm = false;
    } else {
        roles = await Discord.getRoles(options.server) as DiscordRole[];
    }
    for (let field of datafields) {
        try{
        if (!field.perConfig["discord"]) continue;
        let gradient = gradients[field.gradient];
        let perconf = field.perConfig["discord"] as DiscordPerconf;
        let value = data[field.fieldName];
        if (perconf.sendToDiscord) {
            let str = value !== undefined && value !== null ? value : "No Data";
            msg += field.displayName + ": " + str + field.unit + "\n";
        }
        if (perconf.updateRoleColor && hasPerm) {

            let color = value ? hexToNumber(tempToColor(value, gradient)) : undefined;
            let role = roles.find(v => v.name == field.displayName);
            if (role) {
                console.log(`[discord] Editing role ${field.displayName}...`)
                await Discord.editRole(options.server, role.id, {
                    color: color,
                })
            } else {
                console.log(`[discord] Creating role ${field.displayName}...`)
                await Discord.createGuildRole(options.server, {
                    color: color,
                    name: field.displayName,
                    mentionable: false,
                    hoist: false,
                    permissions: undefined
                })
            }
        }} catch(e) {
            console.error("[discord] Error, continuing...");
            console.error(e);
        }
    }
    console.log("[discord] Sending message...")
    await Discord.sendMessage(options.channel,{
        content: msg,
        file: options.attachment ? {
            blob: new Blob([processed[options.attachment.fieldName]], {type: "image/png",}),
            name: options.attachment.fileName
        } : undefined
    })
    console.log(`[discord] Done!`)
}

function hexToNumber(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result == null) {
        throw new Error("Provided string was not a hex color!");
    }
    let RGB = [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];
    function componentToHex(c: number) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    let R = Math.abs(RGB[0]);
    let G = Math.abs(RGB[1]);
    let B = Math.abs(RGB[2]);
    return (R << 16) | (G << 8) | B;
}

export default output;