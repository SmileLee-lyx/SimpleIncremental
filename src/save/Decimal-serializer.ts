import Decimal from "break_eternity.js";

export class DecimalSerializer {
    static init(): void {
        Decimal.prototype.toJSON = undefined as any;
    }

    static replacer(_: any, value: any) {
        if (value instanceof Decimal) {
            return { __type: 'Decimal', value: value.toString() };
        }
        return value;
    }

    static reviver(_: any, value: any) {
        if (value !== null && typeof value === 'object' && value.__type === 'Decimal') {
            return new Decimal(value.value);
        }
        return value;
    }
}