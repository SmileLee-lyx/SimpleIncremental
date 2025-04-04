import { register } from "@/core/instances/instance-init.js";
import { B_text, type FormattedText, sub } from "@/util/format.js";
import Decimal from "break_eternity.js";

const Bq = {
    get amount(): Decimal {
        return window.player.B.Bq;
    },
    set amount(value: Decimal) {
        window.player.B.Bq = value;
    },

    // formatted text

    formatted_name(): FormattedText {
        return B_text(["B", sub("q")]);
    },
};

export default Bq;

declare global {
    interface Window {
        Bq: typeof Bq;
    }
}

register('Bq', {
    init() {
        window.Bq = Bq;
    },
});