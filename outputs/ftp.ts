import DataOutput from "../defs/DataOutput.ts";
import { FTPClient } from "https://deno.land/x/ftpc@v2.0.0/mod.ts";

const output: DataOutput<FtpOOpts> = async function (
	_data,
	opts,
	_datafields,
	_gradients,
	processed,
) {
	if (processed[opts.fieldName] === undefined) return;
	const c = new FTPClient(opts.host, {
		port: opts.port,
		mode: "passive",
		pass: opts.password,
		user: opts.username,
		tlsOpts: {
			hostname: opts.tlsHostname,
			implicit: false,
		},
	});
	try {
		await c.connect();
		await c.upload(
			opts.uploadName,
			processed[opts.fieldName] as Uint8Array,
		);
		await c.close();
	} catch (e) {
		this.console.error("Error!");
		this.console.error(e);
		await c.close();
	}
};

export type FtpOOpts = {
	uploadName: string;
	fieldName: string;

	username: string;
	password: string;
	tlsHostname: string;
	host: string;
	port: number;
};

export default output;
