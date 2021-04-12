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
    console.log(t);

    let month = new Date().getMonth();
    let folder = path.join(opts.folder, (month+1).toString());

    // this line written in the typescript zen - do not touch
    let values = Object
        .fromEntries(pipeline.datafields
            .filter(v => v.perConfig.imagePicker !== undefined)
            .map(v => [(v.perConfig.imagePicker as ImagePickerPerConf).useFor, data[v.fieldName]])) as
        {[K in ImagePickerPerConf["useFor"]]: number};
    console.log(values);

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
    console.log("Picked images and seen images are:");
    console.log(pickedImages);
    console.log(seenImages);
    console.log(`Searching in folder ${folder} subdir ${subdir}`);
    let currentDay = new Date().getDate();
    console.log(`It is currently the ${currentDay}st/nd/rd/th of the month`);
    if (currentDay == lastDate) {
        let imageFn = pickedImages[subdir];
        if (imageFn) {
            console.log(`The day has not changed. Choosing previous image: ${imageFn}`);
            return Deno.readFile(path.join(folder, subdir, imageFn));
        }
        console.log(`The day has not changed. However, a cached image for this subdir does not exist.`);
    } else {
        console.log(`The day has changed. Resetting image cache...`);
        pickedImages = {};
        lastDate = currentDay;
    }
    let fileList = Deno.readDir(path.join(folder, subdir));
    let images: string[] = [];
    for await (let file of fileList) {
        images.push(file.name);
    }
    console.log(`Found files:`);
    console.log(images);
    images = images.filter(v => !v.startsWith("."));
    console.log("Filtered hidden files...");
    let imageFn: string;
    if (images.length != 1) {
        images = images.filter(v => v != seenImages[subdir]);
        imageFn = images[Math.floor(Math.random() * images.length)];
    } else if (images.length == 1) {
        console.log("Only one image found.");
        imageFn = images[0];
    } else {
        console.log("No image found!");
        console.log(images);
        Deno.exit(1);
    }

    console.log(images);
    console.log(`Picked random image: ${imageFn}`);
    let imagePath = path.join(folder, subdir, imageFn);
    pickedImages[subdir] = imageFn;
    seenImages[subdir] = imageFn;
    console.log(imagePath)
    return Deno.readFile(imagePath);
}

export default getImg;
