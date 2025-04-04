import A from "@/core/instances/A/A.js";
import Ai from "@/core/instances/A/Ai.ts";
import BU from "@/core/instances/B/BU.js";
import { register } from "@/core/instances/instance-init.js";
import Records from "@/core/instances/Progress/Records.js";
import DC from "@/core/main/DC.js";
import { A_text, type FormattedText } from "@/util/format.ts";
import type Decimal from "break_eternity.js";

const Ap = {
    get amount(): Decimal {
        return window.player.A.Ap;
    },
    set amount(value: Decimal) {
        window.player.A.Ap = value;

        Records.update_best_Ap(value);
    },

    spend(amount: Decimal): void {
        Ap.amount = Ap.amount.sub(amount);
    },

    amount_after_reset(): Decimal {
        if (BU(0).bought) return DC.d1e10;
        return DC.d10;
    },

    // production

    generated_per_sign(): Decimal {
        return Ai(1).production_per_sign();
    },

    generated_per_second(): Decimal {
        return Ai(1).production_per_second();
    },

    // formatted texts


    formatted_name(): FormattedText {
        return A_text("A");
    },

    amount_message(): FormattedText {
        return ["你有 ", A_text(Ap.amount, 'large'), " 个 ", Ap.formatted_name(), "."];
    },

    amount_inc_message(): FormattedText {
        if (!A.automation.auto_sign.unlocked || !A.automation.auto_sign.enabled) {
            return ["+", Ap.generated_per_sign(), "/签到"];
        } else {
            return ["+", Ap.generated_per_second(), "/秒"];
        }
    },
};

export default Ap;

declare global {
    interface Window {
        Ap: typeof Ap;
    }
}

register('Ap', {
    init() {
        window.Ap = Ap;
    },
});