export type Paths<T, V> = {
    [K in keyof T]
    : T[K] extends V
        ? (K extends string ? K : never)
        : T[K] extends object
            ? Paths<T[K], V> extends infer R ?
                `${K & string}.${R & string}`
                : never : never;
}[keyof T];

export type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
    ? (K extends keyof T ? PathValue<T[K], Rest> : never)
    : (P extends keyof T ? T[P] : never);

export function getPath<T, P extends string>(obj: T, path: P): PathValue<T, P>;
export function getPath<T, V, P extends Paths<T, V>>(obj: T, path: P): V;

export function getPath(obj: any, path: string): any {
    let keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length; i++) { current = current[keys[i]]; }
    return current;
}

export function setPath<T, P extends string>(obj: T, path: P, value: PathValue<T, P>): void;
export function setPath<T, V, P extends Paths<T, V>>(obj: T, path: P, value: V): void;

export function setPath(obj: any, path: string, value: any): void {
    let keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length; i++) {
        if (i === keys.length - 1) {
            current[keys[i]] = value;
            break;
        }
        current = current[keys[i]];
    }
}
