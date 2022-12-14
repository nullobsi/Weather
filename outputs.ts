import { Outputs } from "./registry.ts";

import console from "./outputs/console.ts";
import ftp from "./outputs/ftp.ts";
import file from "./outputs/file.ts";
import discord from "./outputs/discord.ts";
import records from "./outputs/records.ts";

export const outputs: Outputs = {
	console,
	ftp,
	file,
	discord,
	records,
};
