import DataInput from "../defs/DataInput.ts";
import Indexed from "../defs/Indexed.ts";
import WeatherData from "../defs/WeatherData.ts";


const getData: DataInput = async function(options) {
    let opts = options as CsvPerconf;
    if (opts.runExecutable !== undefined) {
        let p = Deno.run({
            cmd: opts.runExecutable,
            cwd: opts.workingDirectory,
            stderr: "piped",
            stdin: "null",
            stdout: "piped"
        });
        let status = await p.status();
        if (status.code === 0) {
            this.console.log("Subprocess completed with code 0");
        } else {
            throw new Error("Subprocess failed with code " + status.code);
        }
    }
    let text = await Deno.readTextFile(opts.filePath);
    let data: WeatherData = {};

    for (let row of text.split("\n")) {
        let rowSplit = row.trim().split(",");
        let title = rowSplit.shift();
        for (let i = 0; i < rowSplit.length; i++) {
            data[`${title}${i}`] = parseFloat(rowSplit[i]);
        }
    }

    return data;
}

type CsvPerconf = {
    runExecutable?: string[],
    filePath: string,
    workingDirectory?: string
}

export type {CsvPerconf}
export default getData;