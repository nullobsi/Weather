import Intermediary from "../defs/Intermediary.ts";
import * as path from "https://deno.land/std@0.76.0/path/mod.ts";
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
type ImageIOpts = {
    folder: string;
    thresholds: Thresholds;


}
type ImagePickerPerConf = {
    useFor: "solar" | "temp" | "humidity" | "pressure" | "precip" | "wind";
}
export type { ImageIOpts, ImagePickerPerConf, Thresholds };



const getImg: Intermediary = async function(options, data, gradients, pipeline){
    const opts = options as ImageIOpts;
    const t = opts.thresholds;

    const month = new Date().getMonth();
    const folder = path.join(opts.folder, (month+1).toString());

    // this line written in the typescript zen - do not touch
    // Find imagePicker confs for values and convert to a dictionary object
    const values = Object
        .fromEntries(pipeline.datafields
            .filter(v => v.perConfig.imagePicker !== undefined)
            .map(v => [v.perConfig.imagePicker?.useFor, data[v.fieldName]])) as
        {[K in ImagePickerPerConf["useFor"]]: number};

    // use thresholds n jazz to pickImage on the right folder
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
        return;
    }

    if (values.humidity > t.humid) {
        data.image = await pickImage(folder, "Humid");
        return;
    }
    if (values.solar > t.bright[month]) {
        data.image = await pickImage(folder, "Bright");
        return;
    }

    // Otherwise Calm
    data.image = await pickImage(folder, "Calm");
}

// Last seen date
let lastDate = new Date().getDate();

// Picked images is reset every day
// For the given folder and subfolder, store the selected image so it
// doesn't change throughout the day.
// It should only change if the conditions change, then another consistent
// image will be chosen.
let pickedImages: {[x:string]:string | undefined} = {};

// Seen images is never reset until it's full.
// For the given folder and subfolder, store the used images.
// This should encourage a shuffle, so that we use every image at least once; and
// after, reset the seenImages for that folder to reset the cycle.
let seenImages: {[x:string]: string[] | undefined} = {};

async function pickImage(folder: string, subdir: string): Promise<Uint8Array> {
    const imageFolder = path.normalize(path.join(folder, subdir));
    // Get day
    const currentDay = new Date().getDate();

    // If day has not changed, check if we already picked an image
    if (currentDay == lastDate) {
        // Read image and return
        const imageName = pickedImages[imageFolder];
        if (imageName) {
            return Deno.readFile(path.join(imageFolder, imageName));
        }
    } else {
        // Day has changed. Reset and update lastDate
        pickedImages = {};
        lastDate = currentDay;
    }

    // Get list of files
    const imageList = Deno.readDir(imageFolder);
    let images: string[] = [];
    for await (const file of imageList) {
        images.push(file.name);
    }

    // No dotfiles
    images = images.filter(v => !v.startsWith("."));

    const folderSeenImages = seenImages[imageFolder];
    // Choose random image, preferably ones we haven't used before. Almost like a shuffle.
    let imageName: string;
    if (images.length > 1) {
        // Filter images by those not already seen
        const filteredImages = images.filter(v => !folderSeenImages?.includes(v));
        // We've gone through all the images, reset
        if (filteredImages.length == 0) {
            imageName = images[Math.floor(Math.random() * images.length)];
            seenImages[imageFolder] = [imageName];
        } else {
            // Pick image
            imageName = filteredImages[Math.floor(Math.random() * filteredImages.length)];
        }
    } else if (images.length == 1) {
        // If there's only one...
        imageName = images[0];
    } else {
        throw new Error("No image found.");
    }
    // Indicate picked image
    pickedImages[imageFolder] = imageName;

    // Create entry in seenImages
    if (folderSeenImages === undefined) {
        seenImages[imageFolder] = [imageName];
    } else {
        folderSeenImages.push(imageName);
    }

    // Finally, read image file
    return Deno.readFile(path.join(imageFolder, imageName));
}

export default getImg;
