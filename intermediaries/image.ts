import Intermediary from "../defs/Intermediary.ts";
import * as path from "https://deno.land/std@0.76.0/path/mod.ts";
import image from "../processors/image.ts";
/*
   Bright
   Calm
   Cold
   Dry
   Fair
   Hot
   Humid
   Night
   Stormy
   Sunset
   Windy
 */
type Thresholds = {
    bright: [number,number,number,number,number,number,number,number,number,number,number,number]; // Bright threshold (solar >)
    cold: [number,number,number,number,number,number,number,number,number,number,number,number]; // cold threshold (temp <)
    hot: [number,number,number,number,number,number,number,number,number,number,number,number]; // Hot threshold (temp >)
    humid: number; // Humid threshold (humidity >)
    stormy: [number, number]; // Stormy threshold (pressure <, precip >)
    sunset: number; // Sunset threshold (solar <)
    windy: number; // windy threshold (wind >)
}
type ImageInterOpts = {
    folder: string;
    thresholds: Thresholds;


}
type ImagePickerPerConf = {
    useFor: "solar" | "temp" | "humidity" | "pressure" | "precip" | "wind";
}
export type {ImageInterOpts, ImagePickerPerConf, Thresholds};

let lastDate = new Date().getDay();


const getImg: Intermediary = async function(options, data, gradients, pipeline){
    let opts = options as ImageInterOpts;
    let t = opts.thresholds

    let month = new Date().getMonth();
    let folder = path.join(opts.folder, (month+1).toString());

    // this line written in the typescript zen - do not touch
    let values = Object
        .fromEntries(pipeline.datafields
            .filter(v => v.perConfig.imagePicker !== undefined)
            .map(v => [(v.perConfig.imagePicker as ImagePickerPerConf).useFor, data[v.fieldName]])) as
        {[K in ImagePickerPerConf["useFor"]]: number};

    if (values.solar == 0) {
        data.image = await pickImage(folder, "Night");
        return;
    }
    if (values.solar < t.sunset) {
        data.image = await pickImage(folder, "Sunset");
        return;
    }
    if (values.temp < t.cold[month]) {
        data.image = await pickImage(folder, "Cold");
        return;
    }
    if (values.temp > t.hot[month]) {
        data.image = await pickImage(folder, "Hot");
        return;
    }
    if (values.wind > t.windy) {
        data.image = await pickImage(folder, "Windy");
        return;
    }


    if (values.pressure < t.stormy[0] || values.precip > t.stormy[1]) {
        data.image = await pickImage(folder, "Stormy");
        return
    }

    if (values.humidity > t.humid) {
        data.image = await pickImage(folder, "Humid");
        return;
    }
    if (values.solar > t.bright[month]) {
        data.image = await pickImage(folder, "Bright");
        return
    }

    data.image = await pickImage(folder, "Calm");

}

let pickedImages: {[x:string]:string | undefined} = {};
let seenImages: {[x:string]: string | undefined} = {};

async function pickImage(folder: string, subdir: string): Promise<Uint8Array> {
    let currentDay = new Date().getDate();
    if (currentDay == lastDate) {
        let imageFn = pickedImages[subdir];
        if (imageFn) {
            return Deno.readFile(path.join(folder, subdir, imageFn));
        }
    } else {
        pickedImages = {};
        lastDate = currentDay;
    }
    let fileList = Deno.readDir(path.join(folder, subdir));
    let images: string[] = [];
    for await (let file of fileList) {
        images.push(file.name);
    }
    images = images.filter(v => !v.startsWith("."));
    let imageFn: string;
    if (images.length != 1) {
        images = images.filter(v => v != seenImages[subdir]);
        imageFn = images[Math.floor(Math.random() * images.length)];
    } else if (images.length == 1) {
        imageFn = images[0];
    } else {
        throw new Error("No image found.");
    }
    let imagePath = path.join(folder, subdir, imageFn);
    pickedImages[subdir] = imageFn;
    seenImages[subdir] = imageFn;
    return Deno.readFile(imagePath);
}

export default getImg;
