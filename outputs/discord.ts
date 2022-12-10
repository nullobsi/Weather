import * as Discord from "https://deno.land/x/discordeno@17.0.1/mod.ts";
import enableCachePlugin from "https://deno.land/x/discordeno@17.0.1/plugins/cache/mod.ts";
import enablePermissionsPlugin, * as DiscordPerms from "https://deno.land/x/discordeno@17.0.1/plugins/permissions/mod.ts";
import getConfig from "../util/getConfig.ts";
import tempToColor from "../util/tempToColor.ts";
import { getDateString } from "../util/getDateString.ts";
import DataOutput from "../defs/DataOutput.ts";
import { NewRecord } from "./records.ts";
import Datafields from "../defs/Datafields.ts";
import { enableCacheSweepers } from "https://deno.land/x/discordeno@17.0.1/plugins/cache/mod.ts";

const config = await getConfig("outputs", "discord", {
	"token": "HERE",
});

// Use this resolve and promise to make sure bot is ready before doing anything.
let resolve: () => void;
const readyPromise = new Promise<void>((res) => {
	resolve = res;
});

const bot = enablePermissionsPlugin(enableCachePlugin(Discord.createBot({
	token: config.token,
	intents: Discord.Intents.Guilds,
	events: {
		ready: () => {
			resolve();
		},
	},
})));

enableCacheSweepers(bot);

await Discord.startBot(bot);

const output: DataOutput<DiscordOOpts> = async function output(
	data,
	options,
	datafields,
	gradients,
	processed,
) {
	// Wait until ready
	await readyPromise;

	// Begin message
	let msg = "Weather report for " +
		getDateString(new Date(data.date as string), false, false) + "\n";

	// Get roles
	this.console.log("Getting roles...");
	let roles: Discord.Role[] = [];
	let hasPerm = true;
	if (
		!(DiscordPerms.botHasGuildPermissions(bot, BigInt(options.server), [
			"MANAGE_ROLES",
		]))
	) {
		this.console.error("No permission for roles, skipping!");
		hasPerm = false;
	} else {
		const server = bot.guilds.get(BigInt(options.server));
		if (server) {
			roles = server.roles.array();
		} else {
			this.console.error("Server does not exist!");
			return;
		}
	}

	// Construct message, update roles
	for (const field of datafields) {
		try {
			// Only deal with discord configured fields
			if (!field.perConfig["discord"]) continue;
			const fieldConfig = field.perConfig["discord"] as DiscordPerconf;

			// Append to message
			const value = data[field.fieldName] as number;
			if (fieldConfig.sendToDiscord) {
				msg += field.displayName + ": " + makeString(value, field) +
					field.unit + "\n";
			}

			// Update role color
			if (fieldConfig.updateRoleColor && hasPerm) {
				// Get color
				const gradient = gradients[field.gradient];
				const color = value
					? hexToNumber(tempToColor(value, gradient))
					: undefined;

				// Find role
				const role = roles.find((v) => v.name == field.displayName);
				if (role) {
					// Update role
					this.console.log(`Editing role ${field.displayName}...`);
					await Discord.editRole(
						bot,
						BigInt(options.server),
						role.id,
						{
							color: color,
						},
					);
				} else {
					// Otherwise create role
					this.console.log(`Creating role ${field.displayName}...`);
					await Discord.createRole(bot, BigInt(options.server), {
						color: color,
						name: field.displayName,
						mentionable: false,
						hoist: false,
						permissions: undefined,
					});
				}
			}
		} catch (e) {
			this.console.error("Error, continuing...");
			this.console.error(e);
		}
	}

	this.console.log("Sending message...");

	// Construct attachments
	let attachment = undefined;
	if (options.attachment) {
		// Find buffer, ensure that it exists
		const buffer = processed[options.attachment.fieldName];
		if (buffer instanceof Uint8Array) {
			// Make blob, ensure it's not too big
			const blob = new Blob([buffer], { type: "image/png" });
			if (blob.size >= (7500000)) {
				msg += "\n\n<image too large to upload>";
			} else {
				// Create attachment object
				attachment = {
					blob: blob,
					name: options.attachment.fileName,
				};
			}
		} else {
			this.console.warn("Attachment was not a Uint8Array");
		}
	}

	// Off it goes!
	await Discord.sendMessage(bot, BigInt(options.channel), {
		content: msg,
		file: attachment,
	});

	// If there are records...
	if (options.recordsChannel) {
		this.console.log("Sending records message...");
		// Ensure records exist
		const newRecords = data.newRecords as NewRecord[] | undefined;
		if (newRecords && newRecords.length > 0) {
			let msg = "New Records!\n";
			newRecords.forEach(
				(record) => {
					// Find field
					const field = datafields.find((f) =>
						f.fieldName == record.fieldName
					);

					// Ensure it exists, otherwise do not continue
					if (field === undefined) {
						return this.console.log(
							"Could not find any definition for " +
								record.fieldName + "!",
						);
					}

					// Get values
					const value = makeString(
						data[record.fieldName] as number,
						field,
					);
					const lastValue = makeString(record.last.value, field);

					// Add to message
					msg +=
						`**${field.displayName}** has reached **${value}${field.unit}** from ${lastValue}${field.unit} on ${
							getDateString(record.last.at, false, false)
						}!\n`;
				},
			);

			await Discord.sendMessage(bot, BigInt(options.recordsChannel), {
				content: msg,
			});
		}
	}
	this.console.log(`Done!`);
};

function hexToNumber(hex: string) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result == null) {
		throw new Error("Provided string was not a hex color!");
	}

	const RGB = [
		parseInt(result[1], 16),
		parseInt(result[2], 16),
		parseInt(result[3], 16),
	];

	const R = Math.abs(RGB[0]);
	const G = Math.abs(RGB[1]);
	const B = Math.abs(RGB[2]);
	return (R << 16) | (G << 8) | B;
}

function makeString(value: number, field: Datafields[0]) {
	// Format according to image specifications
	let str: string;
	if (value !== undefined && value !== null) {
		const imagePerconf = field.perConfig["image"];
		if (imagePerconf) {
			str = value.toFixed(imagePerconf.presc);
		} else {
			str = value.toString();
		}
	} else {
		str = "No Data";
	}
	return str;
}

type DiscordPerconf = {
	sendToDiscord: boolean;
	updateRoleColor: boolean;
};

type DiscordOOpts = {
	channel: string;
	server: string;
	attachment?: { fieldName: string; fileName: string };
	recordsChannel?: string;
};

export type { DiscordOOpts, DiscordPerconf };
export default output;
