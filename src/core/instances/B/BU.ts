import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import As from "@/core/instances/A/As.js";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
import Bp from "@/core/instances/B/Bp.js";
import { register } from "@/core/instances/instance-init.js";
import Progress from "@/core/instances/Progress/Progress.js";
import DC from "@/core/main/DC.js";
import { get_bit, set_bit } from "@/util/bit-util.js";
import { A_text, B_text, br, type FormattedText } from "@/util/format.js";
import { assignWithProperty } from "@/util/merge.js";
import Decimal from "break_eternity.js";

function _BU(index: number) {
    if (index < 0 || index >= 16 || !Number.isInteger(index)) throw new RangeError("invalid index");
    return {
        get bought(): boolean {
            return get_bit(window.player.B.BU_bits, index);
        },
        set bought(value: boolean) {
            set_bit(window.player.B.BU_bits, index, value);
        },

        /**
         * 使用此函数时必须明确其作用.
         * 只有某些 `index` 对应的 BU 有 effect 属性, 且必须在符合相应描述的地方使用.
         *
         * 下一次重构时再引入 Effects.
         */
        effect(): Decimal {
            switch (index) {
                case 2:
                    // formula: max(1, log_10(`time`))
                    // 早期游戏中这个数约为 3 到 5.

                    return Progress.Game.game_time.max(1).log10().max(1);
                case 3:
                    // formula: 1 + 0.5 * `B.count`

                    // 4 次左右 B 后效果超过 BU1

                    return B.count.div(2).add(1);
                default:
                    throw Error("invalid index");
            }
        },

        // buy

        price(): Decimal {
            return new Decimal(BU._prices[index]);
        },

        unlocked(): boolean {
            if (index < 8 && index % 4 !== 0) {
                return BU(index - 1).bought;
            }
            return true;
        },

        buyable(): boolean {
            if (!BU(index).unlocked()) return false;
            return Bp.amount.gte(BU(index).price());
        },

        manual_buy() {
            BU(index).buy();
        },

        buy() {
            if (!BU(index).buyable()) return;

            BU(index).bought = true;
            Bp.spend(BU(index).price());

            BU(index).effect_on_buy();
        },

        effect_on_buy() {
            switch (index) {
                case 0:
                    if (Ap.amount.lt(DC.d1e10)) {
                        Ap.amount = DC.d1e10;
                    }
                    break;
                default:
                    break;
            }
        },

        // formatted text

        buy_button_text(): FormattedText {
            const price_description: () => FormattedText
                = () => ["价格: ", B_text(BU(index).price()), " ", Bp.formatted_name(), "."];
            const effect_description: () => FormattedText
                = () => ["当前效果: ", BU(index).effect()];

            switch (index) {
                case 0:
                    return [
                        "在所有重置时, 从 ", A_text(DC.d1e10), " ", Ap.formatted_name(), " 开始.", br(),
                        "价格: 免费",
                    ];
                case 1:
                    return [
                        "每个 ", Ai.formatted_name(), " 获得等于其序号的倍数加成", br(),
                        price_description(), br(),
                    ];
                case 2:
                    return [
                        "基于当前总游戏时长, 所有 ", Ai.formatted_name(), " 获得倍数加成", br(),
                        price_description(), br(),
                        effect_description(),
                    ];
                case 3:
                    return [
                        "基于制作 ", B.formatted_name(), " 的次数, 所有 ", Ai.formatted_name(), " 获得倍数加成", br(),
                        price_description(), br(),
                        effect_description(),
                    ];
                case 4:
                    return [
                        As.formatted_name(), " 的加成提升至 2.5", br(),
                        price_description(),
                    ];
                case 5:
                    return [
                        "购买 10 个 ", Ai.formatted_name(), " 的加成提升至 2.5", br(),
                        price_description(),
                    ];
                case 6:
                    return [
                        Atu.formatted_name(), " 的效果提高", br(),
                        price_description(),
                    ];
                case 7:
                    return [
                        "解锁自动购买器的更多升级", br(),
                        price_description(),
                    ];
            }
            return null;
        },
    };
}


const BU = assignWithProperty(_BU, {
    _prices: [0, 1, 1, 2, 5, 5, 5, 1],

    description(): FormattedText {
        return [
            "每一行的 4 个升级必须按从左到右的顺序解锁.",
        ];
    },

    mult_for_Ai_total(layer: number): Decimal {
        let mult: Decimal = DC.d1;
        if (BU(1).bought) mult = mult.mul(layer);
        if (BU(2).bought) mult = mult.mul(BU(2).effect());
        if (BU(3).bought) mult = mult.mul(BU(3).effect());
        return mult;
    },
});

export default BU;

declare global {
    interface Window {
        BU: typeof BU;
    }
}

register('BU', {
    init() {
        window.BU = BU;
    },
});