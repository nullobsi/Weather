function zeroPad(s: string) {
	if (s.length == 1) return "0" + s;
	return s;
}

export function getDateString(d: Date, fileCompat = false, seconds = true) {
	let str = `${d.getFullYear()}-${zeroPad((d.getMonth() + 1).toString())}-${
		zeroPad(String(d.getDate()))
	}${fileCompat ? "-" : " "}${zeroPad(String(d.getHours()))}${
		fileCompat ? "-" : ":"
	}${zeroPad(d.getMinutes().toString())}`;
	if (seconds) {
		str += `${fileCompat ? "-" : ":"}${zeroPad(d.getSeconds().toString())}`;
	}
	return str;
}
export default getDateString;
