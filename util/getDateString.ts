function zeroPad(s: string) {
    if (s.length == 1) return "0" + s;
    return s;
}

export function getDateString(d: Date, fileCompat=false) {
    return `${d.getFullYear()}-${zeroPad((d.getMonth()).toString())}-${zeroPad(String(d.getDate()))}${fileCompat ? "-" : " "}${zeroPad(String(d.getHours()))}${fileCompat ? "-" : ":"}${zeroPad(d.getMinutes().toString())}${fileCompat ? "-" : ":"}${zeroPad(d.getSeconds().toString())}`;
}
export default getDateString;