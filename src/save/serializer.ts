import Decimal from "break_eternity.js";

Decimal.prototype.toJSON = undefined as any;

class DecimalSerializer {
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

export function serialize(data: any): string {
    return JSON.stringify(data, DecimalSerializer.replacer);
}

export function deserialize(data: string): any {
    return JSON.parse(data, DecimalSerializer.reviver);
}