import Intermediary from "../defs/Intermediary.ts";

let lastRain: number | undefined = undefined;
let lastRainDate: Date | undefined = undefined

let dataTransform: Intermediary = function (opts, data, keypoints, pipeline): void {
    if (lastRain != undefined && lastRainDate != undefined) {
        let date = new Date(data.date);
        let rDiff = data.totalrainin - lastRain;
        let dDiff = date.getTime() - lastRainDate.getTime();
        data.instrain = rDiff / (dDiff / 3600000);
        lastRain = data.totalrainin;
        lastRainDate = date;
        return;
    }
    else {
        lastRain = data.totalrainin;
        lastRainDate = new Date(data.date);
        data.totalrainin = undefined;
        return;
    }
}

export default dataTransform;