import Ai from "@/core/instances/A/Ai.js";
import As from "@/core/instances/A/As.js";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import Bp from "@/core/instances/B/Bp.js";
import Bq from "@/core/instances/B/Bq.js";
import { register } from "@/core/instances/instance-init.js";
import { get_bit, set_bit } from "@/util/bit-util.js";
import { B_text, br, type FormattedText } from "@/util/format.js";
import { assignWithProperty } from "@/util/merge.js";
import Decimal from "break_eternity.js";

function _BU_qol(index: number) {
    if (index < 0 || index >= 16 || !Number.isInteger(index)) throw new RangeError("invalid index");
    return {
        get unlocked(): boolean {
            return get_bit(window.player.B.BU_qol_bits, index);
        },
        set unlocked(value: boolean) {
            set_bit(window.player.B.BU_qol_bits, index, value);
        },
        price() {
            return new Decimal(BU_qol._prices[index]);
        },

        // formatted texts

        description(): FormattedText {
            if (index < 8) {
                return [
                    "解锁 ", Ai(index + 1).formatted_name(), " 的自动购买器的更多模式.", br(),
                    "价格: ", B_text(BU_qol(index).price()), " ", Bq.formatted_name(),
                ];
            }
            if (index < 12) {
                let target_names: FormattedText[] = [
                    At.formatted_name(),
                    As.formatted_name(),
                    Atu.formatted_name(),
                    Bp.formatted_name(),
                ];

                return [
                    "解锁 ", target_names[index - 8], " 的自动购买器.", br(),
                    "价格: ", B_text(BU_qol(index).price()), " ", Bq.formatted_name(),
                ];
            }
            return null;
        },
    };
}

const BU_qol = assignWithProperty(_BU_qol, {
    _prices: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
});

export default BU_qol;

declare global {
    interface Window {
        BU_qol: typeof BU_qol;
    }
}

register('BU_qol', {
    init() {
        window.BU_qol = BU_qol;
    },
});