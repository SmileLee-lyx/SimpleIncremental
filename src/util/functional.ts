import Dec from "@/core/main/Dec.js";
import type Decimal from "break_eternity.js";

export function takeIf<T>(value: T, prediction: (_: T) => boolean): T | null {
    if (prediction(value)) return value;
    return null;
}

export function takeUnless<T>(value: T, prediction: (_: T) => boolean): T | null {
    if (!prediction(value)) return value;
    return null;
}

export function run<T, R>(value: T, action: (this: T) => R): R {
    return action.call(value);
}

export function let_run<T, R>(value: T, action: (_: T) => R): R {
    return action(value);
}

export function or_default<T>(value: T | undefined, default_value: () => T): T {
    return value === undefined ? default_value() : value;
}

export function or_zero(value: Decimal | undefined): Decimal {
    return value === undefined ? Dec.d0 : value;
}

export function or_inf(value: Decimal | undefined): Decimal {
    return value === undefined ? Dec.dInf : value;
}