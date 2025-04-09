import { register } from "@/core/instances/instance-init.js";
import Dec from "@/core/main/Dec.js";
import { or_inf, or_zero } from "@/util/functional.js";
import type Decimal from "break_eternity.js";

const Records = {
    Game: {
        get best_Ap(): Decimal {
            return or_zero(window.player.stats.Game.best_Ap);
        },
        set best_Ap(value: Decimal) {
            window.player.stats.Game.best_Ap = value;
        },

        get best_Bp(): Decimal {
            return or_zero(window.player.stats.Game.best_Bp);
        },
        set best_Bp(value: Decimal) {
            window.player.stats.Game.best_Bp = value;
        },

        get best_B_time(): Decimal {
            return or_inf(window.player.stats.Game.best_B_time);
        },
        set best_B_time(value: Decimal) {
            window.player.stats.Game.best_B_time = value;
        },
        get best_Bp_speed(): Decimal {
            return or_zero(window.player.stats.Game.best_Bp_speed);
        },
        set best_Bp_speed(value: Decimal) {
            window.player.stats.Game.best_Bp_speed = value;
        },
    },

    this_B: {
        get best_Ap(): Decimal {
            return or_zero(window.player.stats.this_B.best_Ap);
        },
        set best_Ap(value: Decimal) {
            window.player.stats.this_B.best_Ap = value;
        },

        reset() {
            Records.this_B.best_Ap = Dec.d0;
        },
    },

    update_best_Ap(value: Decimal): void {
        Records.Game.best_Ap = Records.Game.best_Ap.max(value);
        Records.this_B.best_Ap = Records.this_B.best_Ap.max(value);
    },

    update_best_Bp(value: Decimal): void {
        Records.Game.best_Bp = Records.Game.best_Bp.max(value);
    },

    update_best_B_time(value: Decimal): void {
        Records.Game.best_B_time = Records.Game.best_B_time.min(value);
    },

    update_best_Bp_speed(value: Decimal): void {
        Records.Game.best_Bp_speed = Records.Game.best_Bp_speed.max(value);
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