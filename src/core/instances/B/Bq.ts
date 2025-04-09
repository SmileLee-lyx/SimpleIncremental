import BC from "@/core/instances/B/BC.js";
import BU_qol from "@/core/instances/B/BU_qol.js";
import { register } from "@/core/instances/instance-init.js";
import { require_confirm } from "@/core/main/confirmation.js";
import Dec from "@/core/main/Dec.js";
import { B_text, type FormattedText, sub } from "@/util/format.js";
import Decimal from "break_eternity.js";

const Bq = {
    total_amount(): Decimal {
        let result = Dec.d0;
        for (let label = 1; label <= 8; label++) {
            result = result.add(BC(label).gained_Bq());
        }
        return result;
    },

    used_amount(): Decimal {
        let result = Dec.d0;
        for (let i = 0; i < 12; i++) {
            if (BU_qol(i).bought) {
                result = result.add(BU_qol(i).price());
            }
        }
        return result;
    },

    usable_amount(): Decimal {
        return Bq.total_amount().sub(Bq.used_amount());
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