import DataOutput from "../defs/DataOutput.ts";
import {FTPClient} from "https://deno.land/x/ftpc@v1.3.0/mod.ts";

const output: DataOutput = async function(data, opt, datafields, gradients, processed) {
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
    try {

        await c.connect();
        await c.upload(opts.uploadName, processed[opts.fieldName]);
        await c.close();
    } catch (e) {
        this.console.error("Error!");
        this.console.error(e);
        await c.close();
    }

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
