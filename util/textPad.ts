function textPad(str: string, len: number) {
    let padded = "";
    for (let i = 0; i < len; i++) {
        if (str[i] != undefined) padded += str[i];
        else if (i % 2 == 0) padded += " ";
        else padded += ".";
    }
    return padded;
}
export default textPad;