import { init_game, init_player } from "@/core/main/defines.ts";
import { initialize_instances } from "@/core/instances/instance-init.js";
import { init_saves, load_current_auto_save } from "@/save/save-load.js";
import Decimal from "break_eternity.js";
import { reactive } from "vue";

declare global {
    interface Window {
        Decimal: typeof Decimal;
    }
}

export function init_features() {
    import.meta.glob('./instances/**/*.ts', { eager: true });
    initialize_instances();
}

interface Debug_Settings {
    DEBUG_SHOW_ALL: boolean;
}

declare global {
    interface Window {
        DEBUG: Debug_Settings;
    }
}

export function init_debug() {
    window.DEBUG = reactive({
        DEBUG_SHOW_ALL: false,
    });
}

export function init() {
    init_player();
    init_game();
    init_features();
    init_debug();
    init_saves();

    load_current_auto_save();

    window.Decimal = Decimal;
}