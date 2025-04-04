import { register } from "@/core/instances/instance-init.js";
import Records from "@/core/instances/Progress/Records.js";
import { B_text, type FormattedText } from "@/util/format.js";
import Decimal from "break_eternity.js";

const Bp = {
    get amount(): Decimal {
        return window.player.B.Bp;
    },
    set amount(value: Decimal) {
        window.player.B.Bp = value;

        Records.update_best_Bp(value);
    },
    spend(amount: Decimal) {
        Bp.amount = Bp.amount.sub(amount).round();
    },

    // formatted text

    formatted_name(): FormattedText {
        return B_text("B");
    },

    amount_message(): FormattedText {
        return ["你有 ", B_text(Bp.amount, 'large'), " 个 ", Bp.formatted_name(), "."];
    },
};

export default Bp;

declare global {
    interface Window {
        Bp: typeof Bp;
    }
}

register('Bp', {
    init() {
        window.Bp = Bp;
    },
});