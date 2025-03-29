export function assignWithProperty<T, S extends object>(target: T, source: S): T & S {
    let sourceProperties = Object.getOwnPropertyDescriptors(source);
    for (const key in sourceProperties) {
        Object.defineProperty(target, key, sourceProperties[key]);
    }

    return target as T & S;
}