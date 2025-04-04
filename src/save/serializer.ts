import { DecimalSerializer } from "@/save/Decimal-serializer.js";

interface Serializer {
    init(): void;

    replacer: (that: any, value: any) => any;
    reviver: (that: any, value: any) => any;
}

class CombinedSerializer implements Serializer {
    combined: Serializer[];

    constructor(combined: Serializer[]) {
        this.combined = [];
        for (let s of combined) {
            if (s instanceof CombinedSerializer) {
                this.combined.push(...s.combined);
            } else {
                this.combined.push(s);
            }
        }
    }

    init(): void {
        for (let s of this.combined) {
            s.init();
        }
    }

    replacer(that: any, value: any) {
        for (let s of this.combined) {
            value = s.replacer(that, value);
        }
        return value;
    }

    reviver(that: any, value: any) {
        for (let s of this.combined) {
            value = s.reviver(that, value);
        }
        return value;
    }
}

export let GLOBAL_SERIALIZER: Serializer = DecimalSerializer;

export function register_serializer(s: Serializer) {
    GLOBAL_SERIALIZER = new CombinedSerializer([GLOBAL_SERIALIZER, s]);
}

export function serialize(data: any, s: Serializer = GLOBAL_SERIALIZER): string {
    s.init();
    return Buffer.from(JSON.stringify(data, s.replacer)).toString('base64');
}

export function deserialize(data: string, s: Serializer = GLOBAL_SERIALIZER): any {
    s.init();
    return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'), s.reviver);
}

declare global {
    interface Window {
        serialize: typeof serialize;
        deserialize: typeof deserialize;
    }
}

window.serialize = serialize;
window.deserialize = deserialize;