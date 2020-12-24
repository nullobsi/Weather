import DataOutput from "../defs/DataOutput.ts";
import getDateString from "../util/getDateString.ts";
import FTPClient from "https://deno.land/x/ftpc@v1.0.0/mod.ts";

const output: DataOutput = async (data, opt, datafields, gradients, processed) => {
    let opts = opt as FtpOutputOpts;
    if (processed[opts.fieldName] === undefined) return;
    let c = new FTPClient(opts.host, {
        port: opts.port,
        mode: "passive",
        pass: opts.password,
        user: opts.username,
        tlsOpts: {
            hostname: opts.tlsHostname,
            implicit: false,
        }
    });
    await c.connect();
    try {
        await c.upload(opts.uploadName, processed[opts.fieldName]);
    } catch (e) {
        console.error("Error occured, file may not be uploaded!")
        console.error(e);
    }
    await c.close();
}

export default output;

export type FtpOutputOpts = {
    uploadName: string,
    fieldName: string,

    username: string,
    password: string,
    tlsHostname: string,
    host: string,
    port: number
}