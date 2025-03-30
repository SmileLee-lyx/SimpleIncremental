import DC from "@/core/main/DC.js";
import Ai from "@/core/instances/A/Ai.ts";
import At from "@/core/instances/A/At.ts";
import { register } from "@/core/instances/instance-init.js";
import { A_text, type FormattedText } from "@/util/format.ts";
import type Decimal from "break_eternity.js";

const Ap = {
    get amount(): Decimal {
        return window.player.A.Ap;
    },
    set amount(value: Decimal) {
        window.player.A.Ap = value;
    },

    spend(amount: Decimal): void {
        Ap.amount = Ap.amount.sub(amount);
    },

    amount_after_reset(): Decimal {
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
        return [
            "你有 ",
            A_text(Ap.amount, 'large'),
            " 个 ",
            Ap.formatted_name(),
            "."];
    },

    amount_inc_message(): FormattedText {
        if (!At.unlocked) {
            return [
                "+",
                Ap.generated_per_sign(),
                "/签到",
            ];
        } else {
            return [
                "+",
                Ap.generated_per_second(),
                "/秒",
            ];
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