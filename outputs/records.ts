
import DataOutput from "../defs/DataOutput.ts";
import getDateString from "../util/getDateString.ts";
import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts"
import * as path from "https://deno.land/std@0.76.0/path/mod.ts"

type Record = {value: number, at: Date};
type Records = {
    [x: string]: Record,
};
export type {Record}

const output: DataOutput = async function(data, options: RecordsOOpts, datafields, gradients, processed) {
    let highRecordsPath = path.join(Deno.cwd(), "records", options.name + "-high.json");
    let lowRecordsPath = path.join(Deno.cwd(), "records", options.name + "-low.json");

    await Deno.mkdir(path.join(Deno.cwd(), "records"), {
        recursive: true,
    });

    let highRecords: Records = {};
    let lowRecords: Records = {};

    let newRecords: {fieldName: string, last: Record}[] = [];
    const newRecord = (fieldName: string, last: Record) => {
        newRecords.push({
            fieldName,
            last,
        });
        this.console.log(`New Record! ${fieldName} has reached ${data[fieldName]}!`);
    };

    try {
        let fileContents = await Deno.readTextFile(highRecordsPath);
        highRecords = JSON.parse(fileContents);
    } catch (e) {
        if (!(e instanceof Deno.errors.NotFound)) {
            throw e;
        }
    }

    try {
        let fileContents = await Deno.readTextFile(lowRecordsPath);
        lowRecords = JSON.parse(fileContents);
    } catch (e) {
        if (!(e instanceof Deno.errors.NotFound)) {
            throw e;
        }
    }

    datafields.forEach(field => {
        let o = field.perConfig["records"];
        if (o == undefined) return;

        if (highRecords[field.fieldName] === undefined) {
            highRecords[field.fieldName] = {
                value: data[field.fieldName],
                at: new Date(),
            };
        }
        if (lowRecords[field.fieldName] === undefined) {
            lowRecords[field.fieldName] = {
                value: data[field.fieldName],
                at: new Date(),
            };
        }

        if ((o.type == "low" || o.type == "both") && lowRecords[field.fieldName].value > data[field.fieldName]) {
            newRecord(field.fieldName, lowRecords[field.fieldName]);
            lowRecords[field.fieldName] = {
                value: data[field.fieldName],
                at: new Date(),
            };
        }

        if ((o.type == "high" || o.type == "both") && highRecords[field.fieldName].value < data[field.fieldName]) {
            newRecord(field.fieldName, highRecords[field.fieldName]);
            highRecords[field.fieldName] = {
                value: data[field.fieldName],
                at: new Date(),
            };
        }
    });

    data.highRecords = highRecords;
    data.lowRecords = lowRecords;
    data.newRecords = newRecords;

    await Deno.writeTextFile(highRecordsPath, JSON.stringify(highRecords, null, 4));
    await Deno.writeTextFile(lowRecordsPath, JSON.stringify(lowRecords, null, 4));


}

interface RecordsPerconf {
    type: "low" | "high" | "both",
}

interface RecordsOOpts {
    name: string,
}

export type {RecordsPerconf, RecordsOOpts};

export default output;
