import Decimal from "break_eternity.js";
import { cloneDeep } from "lodash";

export enum EffectTarget {
    Ai_mult = "Ai_mult",
}

export enum EffectType {
    ADDITIVE = 0,
    MULTIPLICATIVE = 1,
    POWER = 2,
    EXP_POWER = 3,
}

export class Effect {
    target: string;
    type: EffectType;
    value: Decimal;
    name?: string;

    constructor(target: string, type: EffectType, value: Decimal, name?: string) {
        this.target = target;
        this.type = type;
        this.value = value;
        this.name = name;
    }
}

export type EffectSpec = undefined | Effect | EffectSpec[] | { [_: string]: EffectSpec } | (() => EffectSpec);

export function parseEffects(effects: EffectSpec, path?: string): Effect[] {
    if (effects === undefined) return [];
    if (Array.isArray(effects)) {
        let results: Effect[] = [];
        for (let i = 0, len = effects.length; i < len; i++) {
            results.push(...parseEffects(effects[i], path));
        }
        return results;
    }
    if (typeof effects === 'function') {
        return parseEffects(effects(), path);
    }
    if (effects instanceof Effect) {
        let result: Effect = cloneDeep(effects);
        result.name = effects.name === undefined ? path :
            path === undefined ? effects.name : path + '.' + effects.name;
        return [result];
    }
    let results: Effect[] = [];
    for (let k in effects) {
        let new_path = path === undefined ? k : path + '.' + k;
        results.push(...parseEffects(effects[k], new_path));
    }
    return results;
}

export class Effects {
    effects: EffectSpec[];

    constructor(effects?: EffectSpec) {
        this.effects = [];
        this.add_effects(effects);
    }

    add_effects(effects: EffectSpec): Effects {
        this.effects.push(effects);
        return this;
    }

    calculate_effects(target: string): Effect[] {
        let results: Effect[] = [];
        for (let spec of this.effects) {
            results.push(...parseEffects(spec));
        }
        return results.filter((e) => e.target === target)
            .toSorted((e1, e2) => e1.type - e2.type);
    }
}

export default Effects;