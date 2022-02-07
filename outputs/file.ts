import DataOutput from "../defs/DataOutput.ts";
import getDateString from "../util/getDateString.ts";
import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.76.0/path/mod.ts"

const output: DataOutput = async function(data, options: FileOOpts, datafields, gradients, processed) {
    let date = new Date(data.date);
    let archiveFolder = path.join(Deno.cwd(), "archive", options.name);
    await Deno.mkdir(archiveFolder, {
        recursive: true,
    });

    let ndat = {...data};
    if (options.removeKeys !== undefined) {
        options.removeKeys.forEach(k => {
            delete ndat[k];
        })
    }

    for (let i = 0; i < options.extraFiles.length; i++) {
        let file = options.extraFiles[i];
        let toSave = processed[file.fieldName];
        let fileName = path.join(archiveFolder, getFileName(file.fieldName, file.ext));
        await Deno.writeFile(fileName, toSave);
    }



    let fileName = path.join(archiveFolder, getFileName(options.name, ".json"));
    let json = JSON.stringify(ndat, undefined, options.pretty ? 4 : undefined);
    await Deno.writeTextFile(fileName, json);



    function getFileName(file: string, ext: string) {
        if (options.archive) {
            return `${file}-${getDateString(date, true)}${ext}`;
        } else {
            return `${file}${ext}`;
        }
    }
}

export default output;

export type FileOOpts = {
    pretty: boolean,
    archive: boolean,
    name: string,
    extraFiles: {fieldName: string, ext: string}[],
    removeKeys: string[] | undefined
}
