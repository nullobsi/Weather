
import DataOutput from "../defs/DataOutput.ts";
import getDateString from "../util/getDateString.ts";
import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.76.0/path/mod.ts"

const output: DataOutput = async function(data, options: RecordsOOpts, datafields, gradients, processed) {
    let recordsFile = path.join(Deno.cwd(), "records", options.name + ".json");

    await Deno.mkdir(path.join(Deno.cwd(), "records"), {
        recursive: true,
    });

    let records: any = {
    };

    let newRecords: string[] = [];

    try {
        let fileContents = await Deno.readTextFile(recordsFile);
        records = JSON.stringify(fileContents);
    } catch (e) {
        if (!(e instanceof Deno.errors.NotFound)) {
            throw e;
        }
    }

    datafields.forEach(field => {
        let o = field.perConfig["records"];
        if (o == undefined) return;

        if (records[field.fieldName] === undefined) {
            records[field.fieldName] = data[field.fieldName];
        }

        let nrecord = false;

        if ((o.type == "low" || o.type == "both") && records[field.fieldName + "Lowest"] > data[field.fieldName]) {
            records[field.fieldName + "Lowest"] = data[field.fieldName];
            nrecord = true;
        }

        if ((o.type == "high" || o.type == "both") && records[field.fieldName + "Highest"] < data[field.fieldName]) {
            records[field.fieldName + "Highest"] = data[field.fieldName];
            nrecord = true;
        }

        if (nrecord) {
            newRecords.push(field.fieldName);
            this.console.log(`New Record! ${field.fieldName} has reached ${data[field.fieldName]}!`);
        }
    });

    data.records = records;
    data.newRecords = newRecords;

    await Deno.writeTextFile(recordsFile, JSON.stringify(records, null, 4));
}

interface RecordsPerconf {
    type: "low" | "high" | "both",
}

interface RecordsOOpts {
    name: string,
}

export type {RecordsPerconf, RecordsOOpts};

export default output;
