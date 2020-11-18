import Transform from "../defs/Transform.ts";

function rainRate(a: number) {
    if (a <= 0) return a;
    a = Math.log(a * 25.4);
    a *= 8
    a += 5 * Math.log(200);
    a *= 2;
    a /= Math.log(10);
    return a;
}

export default (((a:number) => a <= 0.0253 ? rainRate(a) / 4 : rainRate(a) - 15) as Transform)