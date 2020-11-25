function tempToColor(temp: number, key: [number, string][]) {
    //assert(len(key) > 0)

    if (temp <= key[0][0]) //extreme low
        return key[0][1];
    if (temp >= key[key.length - 1][0]) //extreme high
        return key[key.length - 1][1];

    //somewhere in the middle
    let high_end_idx;
    for (high_end_idx = 0; high_end_idx < key.length; high_end_idx++) {
        if (key[high_end_idx][0] >= temp) break;
    }
    //console.log(high_end_idx);
    //high_end_idx is now the index of the first point higher than the given temp
    //console.log("Index: "+ high_end_idx+"\nLength: " + key.length   );
    if (high_end_idx >= key.length) high_end_idx = key.length - 1;
    let low_end = key[high_end_idx - 1][0];
    let low_end_col = key[high_end_idx - 1][1];
    let high_end = key[high_end_idx][0];
    let high_end_col = key[high_end_idx][1];

    //assert(low_end < temp <= high_end)

    let p = (temp - low_end) / (high_end - low_end)
    p = 1 - p;
    //console.log(p);

    return interpolate(low_end_col, high_end_col, p);
}

function interpolate(color1: string, color2: string, weight: number) {
    let rgb1 = hexToRGB(color1);
    let rgb2 = hexToRGB(color2);
    let w1 = weight;
    let w2 = 1 - w1;
    return RGBToHex([Math.round(rgb1[0] * w1 + rgb2[0] * w2),
        Math.round(rgb1[1] * w1 + rgb2[1] * w2),
        Math.round(rgb1[2] * w1 + rgb2[2] * w2)
    ]);
}

export function hexToRGB(hex: string) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result == null) {
        throw new Error("Provided string was not a hex color!");
    }
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];
}


function RGBToHex(RGB: [number, number, number]) {
    function componentToHex(c: number) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    let R = Math.abs(RGB[0]);
    let G = Math.abs(RGB[1]);
    let B = Math.abs(RGB[2]);
    return "#" + componentToHex(R) + componentToHex(G) + componentToHex(B);
}

export default tempToColor;