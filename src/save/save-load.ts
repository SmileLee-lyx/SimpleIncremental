import { migration } from "@/save/migration.js";
import { deserialize, serialize } from "@/save/serializer.js";
import { assign } from "lodash";
import { toRaw } from "vue";

const VERSION = 2;

export function deleteRaw(slot: string): void {
    localStorage.removeItem(window.location.pathname + slot);
}

export function saveRaw(slot: string, data: any): void {
    localStorage.setItem(window.location.pathname + slot, serialize(data));
}

export function loadRaw(slot: string): any {
    let item: string | null = localStorage.getItem(window.location.pathname + slot);
    if (item == null) return null;
    return deserialize(item);
}

const AUTO_SAVE_MAX: number = 3;
let current_auto_save_slot: number;

let manual_save_slots: string[];

export function get_manual_save_slots(): string[] {
    return manual_save_slots;
}

function auto_save_name(slot: number = current_auto_save_slot) {
    return `auto_save_${ slot }`;
}

function normalizeSlotIndex(saved: any): number {
    if (saved === null) return 0;
    let result = Number(saved);
    if (result < 0 || result >= AUTO_SAVE_MAX || !Number.isInteger(result)) return 0;
    return result;
}

export function init_saves() {
    if (current_auto_save_slot === undefined) {
        current_auto_save_slot = normalizeSlotIndex(loadRaw("current_auto_save_slot"));
    }
    if (manual_save_slots === undefined) {
        manual_save_slots = loadRaw("manual_save_slots");
        if (manual_save_slots == null) {
            manual_save_slots = [];
        }
    }
}

export function saved_data(): any {
    return {
        data: toRaw(window.player),
        timestamp: Date.now(),
        version: VERSION,
    };
}

export function auto_save() {
    current_auto_save_slot = (current_auto_save_slot + 1) % AUTO_SAVE_MAX;
    saveRaw(auto_save_name(), saved_data());
    saveRaw("current_auto_save_slot", current_auto_save_slot);
}

export function manual_save(name: string) {
    saveRaw(name, saved_data());
    if (!manual_save_slots.includes(name)) {
        manual_save_slots.push(name);
        saveRaw("manual_save_slots", manual_save_slots);
    }
}

export type LoadResult = {
    success: boolean;
    errors?: string[];
    warnings?: string[];
}

export function load_from_data(data: any): LoadResult {
    const result = migration(data);
    if (!result.success) return { success: false, errors: result.errors };
    assign(window.player, result.result);
    return { success: true, warnings: result.warnings };
}

export function load_current_auto_save(): LoadResult {
    return load_from_data(loadRaw(auto_save_name()));
}

export function manual_load(name: string): LoadResult {
    return load_from_data(loadRaw(name));
}

export function manual_delete(name: string): boolean {
    if (manual_save_slots.includes(name)) {
        deleteRaw(name);
        manual_save_slots.splice(manual_save_slots.indexOf(name), 1);
        saveRaw("manual_save_slots", manual_save_slots);
        return true;
    }
    return false;
}

export function create_empty_manual_save(name: string): boolean {
    if (!manual_save_slots.includes(name)) {
        manual_save_slots.push(name);
        saveRaw("manual_save_slots", manual_save_slots);
        return true;
    }
    return false;
}

declare global {
    interface Window {
        auto_save: typeof auto_save;
        manual_save: typeof manual_save;
        load_current_auto_save: typeof load_current_auto_save;
        manual_load: typeof manual_load;
        manual_delete: typeof manual_delete;
        create_empty_manual_save: typeof create_empty_manual_save;
    }
}

window.auto_save = auto_save;
window.manual_save = manual_save;
window.load_current_auto_save = load_current_auto_save;
window.manual_load = manual_load;
window.manual_delete = manual_delete;
window.create_empty_manual_save = create_empty_manual_save;