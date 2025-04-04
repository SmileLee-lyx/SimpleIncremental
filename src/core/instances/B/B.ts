import { start_make_B_animation } from "@/animation/make-B-animation.js";
import Ap from "@/core/instances/A/Ap.js";
import Atu from "@/core/instances/A/Atu.js";
import Bp from "@/core/instances/B/Bp.js";
import { register } from "@/core/instances/instance-init.js";
import Progress from "@/core/instances/Progress/Progress.js";
import Records from "@/core/instances/Progress/Records.js";
import DC from "@/core/main/DC.js";
import { A_text, B_text, br, type FormattedText, small } from "@/util/format.js";
import Decimal from "break_eternity.js";

const B = {
    get unlocked() {
        return window.player.B.unlocked;
    },
    set unlocked(value: boolean) {
        window.player.B.unlocked = value;
    },
    get count(): Decimal {
        return window.player.B.B_count;
    },
    set count(value: Decimal) {
        window.player.B.B_count = value;
    },

    // reset

    B_count_gain_on_reset(): Decimal {
        return DC.d1;
    },

    Bp_gain_on_reset(): Decimal {
        return Decimal.pow10(Records.this_B.best_Ap.log10().div(308).sub(0.8)).floor();
    },

    // buy

    buy_threshold(): Decimal {
        return DC.dNm;
    },

    buyable(): boolean {
        return Ap.amount.gt(B.buy_threshold());
    },

    manual_buy() {
        B.buy();
    },

    buy() {
        if (!B.buyable()) return;

        start_make_B_animation();

        const B_time_gain = B.B_count_gain_on_reset();
        const Bp_gain = B.Bp_gain_on_reset();

        B.run_reset();

        B.count = B.count.add(B_time_gain);
        Bp.amount = Bp.amount.add(Bp_gain);
        B.unlocked = true;
    },

    /**
     * buy B if buyable, and reset otherwise.
     */
    force_buy_or_reset() {
        if (B.buyable()) {
            B.buy();
        } else {
            B.run_reset();
        }
    },

    /**
     * All B reset eventually call this function.
     */
    run_reset() {
        B.run_reset_impl();
    },

    run_reset_impl() {
        Progress.this_B.real_time = 0;
        Progress.this_B.game_time = DC.d0;

        Records.this_B.best_Ap = DC.d0;

        Atu.run_reset_impl();
        Atu.bought = DC.d0;
    },

    // formatted text

    formatted_name(): FormattedText {
        return B_text("B");
    },

    buy_button_message(): FormattedText {
        if (!B.buyable()) {
            return ["需要 ", A_text(B.buy_threshold()), " ", Ap.formatted_name()];
        }

        return small([
            "用所有 ", Ap.formatted_name(), " 制作 ", Bp.formatted_name(), ".", br(),
            "获得 ", B.Bp_gain_on_reset(), " ", Bp.formatted_name(),
        ]);
    },
};

export default B;

declare global {
    interface Window {
        B: typeof B;
    }
}

register('B', {
    init() {
        window.B = B;
    },
});