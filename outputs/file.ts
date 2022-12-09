import DataOutput from "../defs/DataOutput.ts";
import getDateString from "../util/getDateString.ts";
import * as path from "https://deno.land/std@0.167.0/path/mod.ts"

const output: DataOutput = async function(data, options: FileOOpts, datafields, gradients, processed) {
    const date = new Date(data.date);
    // Create archive folder
    const archiveFolder = path.join(Deno.cwd(), "archive", options.name);
    await Deno.mkdir(archiveFolder, {
        recursive: true,
    });

    // Shallow copy data to remove unneeded data
    const filteredData = {...data};
    if (options.removeKeys !== undefined) {
        options.removeKeys.forEach(k => {
            delete filteredData[k];
        })
    }

    // Loop through extraFiles, write files to archive
    for (let i = 0; i < options.extraFiles.length; i++) {
        const fileDef = options.extraFiles[i];

        const saveData = processed[fileDef.fieldName];
        const filePath = await getFileName(fileDef.fieldName, fileDef.ext);

        if (saveData === undefined) {
            this.console.warn("File " + fileDef.fieldName + " was undefined.");
            continue;
        }
        await Deno.writeFile(filePath, saveData);
    }

    // Write JSON file
    const filePath = await getFileName(options.name, ".json");
    const jsonString = JSON.stringify(filteredData, undefined, options.pretty ? 4 : undefined);
    await Deno.writeTextFile(filePath, jsonString);

    // Helper function
    async function getFileName(file: string, ext: string) {
        if (options.archive) {
            const folder = path.join(archiveFolder, date.getFullYear().toString(), (date.getMonth()+1).toString(), date.getDate().toString());
            await Deno.mkdir(folder, {
                recursive: true,
            });
            return path.join(folder, `${file}-${getDateString(date, true)}${ext}`);
        } else {
            return path.join(archiveFolder, `${file}${ext}`);
        }
    }
}

export default output;

export type FileOOpts = {
    pretty: boolean,
    archive: boolean,
    name: string,
    extraFiles: {fieldName: string, ext: string}[],
    removeKeys: string[] | undefined,
}
