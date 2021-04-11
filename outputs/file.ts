import DataOutput from "../defs/DataOutput.ts";
import getDateString from "../util/getDateString.ts";
import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.76.0/path/mod.ts"

const output: DataOutput = async (data, opt, datafields, gradients, processed) => {
    let options: FileOutputOpts = <FileOutputOpts>opt;
    let date = new Date(data.date);
    let archiveFolder = path.join(Deno.cwd(), "archive");

    let ndat = {...data};
    if (options.removeKeys !== undefined) {
        options.removeKeys.forEach(k => {
            delete ndat[k];
        })
    }
    if (!(await fs.exists(archiveFolder))) {
        await Deno.mkdir(archiveFolder);
    }
    for (let i = 0; i < options.extraFiles.length; i++) {
        let file = options.extraFiles[i];
        let toSave = processed[file.fieldName];
        let fileName = "";
        if (options.archive) {
            fileName = getDateString(date, true) + file.ext;
        } else {
            fileName = file.fieldName + file.ext;
        }

        fileName = path.join(archiveFolder, fileName);
        await Deno.writeFile(fileName, toSave);
    }



    let fileName = "";

    if (options.archive) {
        archiveFolder = path.join(archiveFolder, options.name);
        if (!(await fs.exists(archiveFolder))) {
            await Deno.mkdir(archiveFolder);
        }
        fileName = getDateString(date, true) + ".json";
    } else {
        fileName = options.name + ".json";
    }
    fileName = path.join(archiveFolder, fileName);
    let json = JSON.stringify(data, undefined, options.pretty ? 4 : undefined);
    await Deno.writeTextFile(fileName, json);


}

export default output;

export type FileOutputOpts = {
    pretty: boolean,
    archive: boolean,
    name: string,
    extraFiles: {fieldName: string, ext: string}[],
    removeKeys: string[] | undefined
}