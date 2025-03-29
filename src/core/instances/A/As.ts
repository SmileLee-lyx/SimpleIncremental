import DC from "@/core/DC.ts";
import Ai from "@/core/instances/A/Ai.ts";
import Ap from "@/core/instances/A/Ap.ts";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import { register } from "@/core/instances/instance-init.js";
import { A_text, br, type FormattedText, sub } from "@/util/format.ts";
import Decimal from "break_eternity.js";

const As = {
    get bought(): Decimal {
        return window.player.A.As;
    },
    set bought(amount: Decimal) {
        window.player.A.As = amount;
    },

    // production

    mult_for_Ai_per_As(): Decimal {
        return DC.d2;
    },
    mult_for_Ai_total(layer: number): Decimal {
        return As.mult_for_Ai_per_As().pow(As.bought.sub(layer - 1).max(0));
    },

    // buy

    unlocked(): boolean {
        return At.unlocked;
    },

    visible(): boolean {
        return As.bought.gt(0) || Atu.bought.gt(0) || Ai(4).bought.gt(0);
    },

    price(): { target: number; value: Decimal; } {
        if (As.bought.lt(4)) {
            return { target: As.bought.add(DC.d4).toNumber(), value: DC.d20 };
        }
        return { target: 8, value: DC.d20.add(DC.d20.mul(As.bought.sub(4))) };
    },

    buyable(): boolean {
        let { target: layer, value: price } = As.price();
        return Ai(layer).amount.gte(price);
    },

    buy() {
        if (!As.buyable()) return;
        As.run_reset();
        As.bought = As.bought.add(1);
    },

    /**
     * All As reset eventually call As function.
     */
    run_reset() {
        Ap.amount = Ap.amount_after_reset();
        for (let layer = 1; layer <= 8; layer++) {
            Ai(layer).amount = Ai(layer).bought = DC.d0;
        }
        At.bought = DC.d0;
    },

    // formatted text
    formatted_name(): FormattedText {
        return A_text(["A", sub("*")]);
    },

    buy_button_message(): FormattedText {
        return [
            "购买一个 ", As.formatted_name(), ",", br(),
            "并重置 ", Ap.formatted_name(), " 与 ", At.formatted_name(), ".", br(),
            "需要 ", As.price().value, " 个 ", Ai(As.price().target).formatted_name(), ".",
        ];
    },

    buy_button_shift_message(): FormattedText {
        let unlock_Ai_text: FormattedText;
        if (As.bought.lt(4)) {
            unlock_Ai_text = ["解锁 ", Ai(As.bought.floor().toNumber() + 5).formatted_name(), ", 并"];
        } else {
            unlock_Ai_text = undefined;
        }
        let mult_target: FormattedText;
        if (As.bought.lt(1)) {
            mult_target = [" ", Ai(1).formatted_name(), " "];
        } else if (As.bought.lt(8)) {
            mult_target = [" ", Ai(1).formatted_name(), " 至 ",
                           Ai(As.bought.floor().toNumber() + 1).formatted_name(), " "];
        } else {
            mult_target = ["所有 ", Ai.formatted_name(), " "];
        }
        return [unlock_Ai_text, "将", mult_target, "的作用提高 ×", As.mult_for_Ai_per_As(), "."];
    },

    buy_button_tooltip_message(): FormattedText {
        return ["已购买: ", As.bought];
    },
};

export default As;

declare global {
    interface Window {
        As: typeof As;
    }
}

register('As', {
    init() {
        window.As = As;
    },
});