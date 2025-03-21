import Decimal, { type DecimalSource } from "break_eternity.js";

declare global {
    interface Window {
    }
}

export function format(num: DecimalSource): string {
    num = new Decimal(num);

    return num.toPrecision(4);
}