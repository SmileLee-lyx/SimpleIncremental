import { init_debug } from "@/core/debug.ts";
import { init_game, init_player } from "@/core/defines.ts";
import Decimal from "break_eternity.js";

declare global {
    interface Window {
        Decimal: typeof Decimal;
        enableCheat: () => void;
    }
}

export function init() {
    init_player();
    init_game();
    init_debug();

    window.Decimal = Decimal;
    window.enableCheat = () => { window.game.show_cheat = true; };
}