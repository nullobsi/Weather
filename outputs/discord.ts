import * as Discord from "https://deno.land/x/discordeno@10.5.0/mod.ts";
import getConfig from "../util/getConfig.ts";
import tempToColor from "../util/tempToColor.ts";
import DiscordRole from "../defs/DiscordRole.ts";
import {getDateString} from "../util/getDateString.ts";
import DataOutput from "../defs/DataOutput.ts";

const config = await getConfig("outputs", "discord", {
    "token": "HERE"
});
let resolve: () => void;
let readyPromise = new Promise<void>(res => {
    resolve = res;
});
await Discord.startBot({
    token: config.token,
    intents: [Discord.Intents.GUILDS],
    eventHandlers: {
        ready() {
            resolve();
        }
    }
});

type DiscordPerconf = {
    sendToDiscord: boolean,
    updateRoleColor: boolean,
};
type DiscordOpt = {channel: string, server: string, attachment: {fieldName: string, fileName: string} | undefined}
export type {DiscordPerconf,DiscordOpt}

const output: DataOutput = async function output(data, opt, datafields, gradients, processed) {
    await readyPromise;
    let options = opt as DiscordOpt;
    let msg = "Weather report for " + getDateString(new Date(data.date)) + "\n";
    //let maxlen = datafields.reduce<number>((p, c) => c.displayName.length > p ? c.displayName.length : p, 0);
    this.console.log("Getting roles...")
    let roles: DiscordRole[] = [];
    let hasPerm = true;
    if (!(await Discord.botHasPermission(options.server, ["MANAGE_ROLES"]))) {
        this.console.error("No permission for roles, skipping!");
        hasPerm = false;
    } else {
        let server = Discord.cache.guilds.get(options.server);
        if (server) {
            roles = server.roles.array();
        } else {
            this.console.error("Server does not exist!");
            return;
        }
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
                this.console.log(`Editing role ${field.displayName}...`)
                await Discord.editRole(options.server, role.id, {
                    color: color,
                })
            } else {
                this.console.log(`Creating role ${field.displayName}...`)
                await Discord.createGuildRole(options.server, {
                    color: color,
                    name: field.displayName,
                    mentionable: false,
                    hoist: false,
                    permissions: undefined
                })
            }
        }} catch(e) {
            this.console.error("Error, continuing...");
            this.console.error(e);
        }
    }
    this.console.log("Sending message...")
    let attachment = undefined;
    if (options.attachment) {
        let blob = new Blob([processed[options.attachment.fieldName]], {type: "image/png",});
        if (blob.size >= (7500000)) {
            msg += "\n\n<image too large to upload>";
        } else {
            attachment = {
                blob: blob,
                name: options.attachment.fileName,
            };
        }
    }

    await Discord.sendMessage(options.channel,{
        content: msg,
        file: attachment,
    })
    this.console.log(`Done!`)
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