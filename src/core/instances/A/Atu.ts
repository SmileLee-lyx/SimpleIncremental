import DC from "@/core/DC.ts";
import Ai from "@/core/instances/A/Ai.ts";
import Ap from "@/core/instances/A/Ap.ts";
import As from "@/core/instances/A/As.ts";
import At from "@/core/instances/A/At.js";
import { register } from "@/core/instances/instance-init.js";
import { A_text, br, type FormattedText, sub } from "@/util/format.ts";
import Decimal from "break_eternity.js";

const Atu = {
    get bought(): Decimal {
        return window.player.A.Atu;
    },
    set bought(amount: Decimal) {
        window.player.A.Atu = amount;
    },

    // production

    At_effect_per_Atu(): Decimal {
        return DC.d1_02;
    },

    sign_speed_per_At(): Decimal {
        return DC.d1_11.mul(Atu.At_effect_per_Atu().pow(Atu.bought));
    },

    // buy

    visible(): boolean {
        return As.bought.gt(4) || Atu.bought.gt(0) || Ai(8).bought.gt(0);
    },

    price(): { target: number; value: Decimal; } {
        return { target: 8, value: DC.d40.add(DC.d40.mul(Atu.bought)) };
    },

    buyable(): boolean {
        let { target: layer, value: price } = Atu.price();
        return Ai(layer).amount.gte(price);
    },

    buy() {
        if (!Atu.buyable()) return;
        Atu.run_reset();
        Atu.bought = Atu.bought.add(1);
    },

    // reset

    /**
     * All Atu reset eventually call this function.
     */
    run_reset() {
        Ap.amount = Ap.amount_after_reset();
        for (let layer = 1; layer <= 8; layer++) {
            Ai(layer).amount = Ai(layer).bought = DC.d0;
        }
        At.bought = DC.d0;
        As.bought = DC.d0;
    },

    // formatted text

    formatted_name(): FormattedText {
        return A_text(["A", sub("tu")]);
    },

    buy_button_message(): FormattedText {
        return [
            "购买一个 ", Atu.formatted_name(), ",", br(),
            "并重置 ", Ap.formatted_name(), ", ", At.formatted_name(), ", ", As.formatted_name(), ".", br(),
            "需要 ", Atu.price().value, " 个 ", Ai(Atu.price().target).formatted_name(), ".",
        ];
    },

    buy_button_shift_message(): FormattedText {
        return ["将每个 ", At.formatted_name(), " 的作用提高 ×", Atu.At_effect_per_Atu(), "."];
    },

    buy_button_tooltip_message(): FormattedText {
        return ["已购买: ", Atu.bought];
    },
};

export default Atu;

declare global {
    interface Window {
        Atu: typeof Atu;
    }
}

register('Atu', {
    init() {
        window.Atu = Atu;
    },
});