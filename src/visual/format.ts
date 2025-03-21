import Decimal, { type DecimalSource } from "break_eternity.js";

declare global {
    interface Window {
    }
}

function format_pow10(mag: number, precision: number = 6): string {
    let c = Math.floor(mag);
    let a = Math.pow(10, mag - c);
    return a.toPrecision(precision) + "e" + c
}

// assume (sign, mag, layer) is a normalized Decimal.
function format_raw(sign: number, mag: number, layer: number): string {
    // any NaN is fully NaN
    if (Number.isNaN(sign)) return "NaN";

    // any 0 is fully 0
    if (sign === 0) return "0";
    if (sign < 0) return "-" + format_raw(1, mag, layer);

    // any infinity is fully infinity
    if (layer === Infinity) return "Infinity";

    if (layer > 1e6) {
        if (mag > 0) {
            return `e^${ layer.toPrecision(6) }`;
        } else {
            return `e(-e^${ layer.toPrecision(6) }$)`;
        }
    }

    // in layer 0, 1/9e15 < mag < 9e15
    if (layer === 0) {
        if (mag >= 0.01 && mag < 1e6) return mag.toString();
        else return mag.toExponential(3);
    }

    let mag_sign: number = mag < 0 ? -1 : 1;
    mag = Math.abs(mag);
    if (mag >= 1e6) {
        mag = Math.log10(mag);
        layer++;
    }
    if (layer === 1) {
        return format_pow10(mag * mag_sign, 3);
    }
    if (layer <= 5) {
        let result = "e";
        if (mag_sign < 0) result += "-";
        for (let i = 1; i < layer-1; ++i) result += "e";
        result += format_pow10(mag);
        return result;
    } else {
        let result;
        if (mag_sign < 0) result = `e-(e^${layer-2})`;
        else result = `(e^${layer-1})`;
        result += format_pow10(mag);
        return result;
    }
}

/**
 *
 * @param num
 */
export function format(num: DecimalSource): string {
    num = new Decimal(num);
    return format_raw(num.sign, num.mag, num.layer);
}