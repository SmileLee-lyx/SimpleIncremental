import Ai from "@/core/instances/A/Ai.js";
import As from "@/core/instances/A/As.js";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
import Bp from "@/core/instances/B/Bp.js";
import Bq from "@/core/instances/B/Bq.js";
import BU from "@/core/instances/B/BU.js";
import { register } from "@/core/instances/instance-init.js";
import { BuyMode } from "@/core/main/settings.js";
import { get_bit, set_bit } from "@/util/bit-util.js";
import { B_text, br, type FormattedText, large, sub } from "@/util/format.js";
import { assignWithProperty } from "@/util/merge.js";
import Decimal from "break_eternity.js";

function _BU_qol(index: number) {
    if (index < 0 || index >= 16 || !Number.isInteger(index)) throw new RangeError("invalid index");
    return {
        get bought(): boolean {
            return get_bit(window.player.B.BU_qol_bits, index);
        },
        set bought(value: boolean) {
            set_bit(window.player.B.BU_qol_bits, index, value);
        },
        price() {
            return new Decimal(BU_qol._prices[index]);
        },

        unlocked(): boolean {
            return BU(7).bought;
        },
        buyable(): boolean {
            return BU_qol(index).unlocked() && Bq.usable_amount().gte(BU_qol(index).price());
        },

        buy() {
            if (!BU_qol(index).buyable()) return;
            BU_qol(index).bought = true;

            BU_qol(index).action_on_buy();
        },

        action_on_buy() {
            if (index < 8) {
                Ai(index + 1).automation.mode = BuyMode.BUY_MAX;
            }
            if (index === 8) {
                At.automation.mode = BuyMode.BUY_MAX;
            }
            if (index === 9) {
                As.automation.unlocked = true;
                As.automation.enabled = true;
            }
            if (index === 10) {
                Atu.automation.unlocked = true;
                Atu.automation.enabled = true;
            }
            if (index === 11) {
                B.automation.unlocked = true;
                B.automation.enabled = true;
            }
        },

        // formatted texts

        formatted_name(): FormattedText {
            return B_text(["B", sub("q"), "U(", index, ")"]);
        },

        buy_button_message(): FormattedText {
            let target: FormattedText = null;
            if (index < 8) {
                target = Ai(index + 1).formatted_name();
            } else if (index < 12) {
                let target_names: FormattedText[] = [
                    At.formatted_name(),
                    As.formatted_name(),
                    Atu.formatted_name(),
                    Bp.formatted_name(),
                ];
                target = target_names[index - 8];
            }
            if (index < 9) {
                return [
                    "升级 ", target, " 的自动购买器.", br(),
                    "价格: ", B_text(BU_qol(index).price()), " ", Bq.formatted_name(),
                ];
            } else {
                return [
                    "解锁 ", target, " 的自动购买器.", br(),
                    "价格: ", B_text(BU_qol(index).price()), " ", Bq.formatted_name(),
                ];
            }
        },
    };
}

const BU_qol = assignWithProperty(_BU_qol, {
    _prices: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],

    formatted_name(): FormattedText {
        return B_text(["B", sub("q"), "U"]);
    },

    description(): FormattedText {
        return [
            "花费 ", Bq.formatted_name(), " 以购买升级.", br(),
            "你有 ",
            large([B_text(Bq.usable_amount()), "/", B_text(Bq.total_amount())]),
            " ", Bq.formatted_name(), ".", br(),
            "建议优先购买最后 3 个升级.", br(),
        ];
    },
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