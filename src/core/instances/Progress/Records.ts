import { register } from "@/core/instances/instance-init.js";
import type Decimal from "break_eternity.js";

const Records = {
    Game: {
        get best_Ap(): Decimal {
            return window.player.stats.Game.best_Ap;
        },
        set best_Ap(value: Decimal) {
            window.player.stats.Game.best_Ap = value;
        },

        get best_Bp(): Decimal {
            return window.player.stats.Game.best_Bp;
        },
        set best_Bp(value: Decimal) {
            window.player.stats.Game.best_Bp = value;
        },
    },

    this_B: {
        get best_Ap(): Decimal {
            return window.player.stats.this_B.best_Ap;
        },
        set best_Ap(value: Decimal) {
            window.player.stats.this_B.best_Ap = value;
        },
    },

    update_best_Ap(value: Decimal): void {
        Records.Game.best_Ap = Records.Game.best_Ap.max(value);
        Records.this_B.best_Ap = Records.this_B.best_Ap.max(value);
    },

    update_best_Bp(value: Decimal): void {
        Records.Game.best_Bp = Records.Game.best_Bp.max(value);
    },
};

export default Records;

declare global {
    interface Window {
        Records: typeof Records;
    }
}

register('Records', {
    init() {
        window.Records = Records;
    },
});