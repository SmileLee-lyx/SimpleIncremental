import { reactive } from "vue";

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