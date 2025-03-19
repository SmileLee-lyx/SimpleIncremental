import Decimal from "@/break-eternity/break-eternity.ts";
import { init_player, init_game } from "@/core/defines.ts";

declare global {
    interface Window {
        Decimal: typeof Decimal;
        enableCheat: () => void;
    }
}

export function init() {
    init_player();
    init_game();

    window.Decimal = Decimal;
    window.enableCheat = () => { window.game.show_cheat = true; }
}