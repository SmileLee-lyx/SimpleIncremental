import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import As from "@/core/instances/A/As.js";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
import BC from "@/core/instances/B/BC.js";
import Bp from "@/core/instances/B/Bp.js";
import { register } from "@/core/instances/instance-init.js";
import Progress from "@/core/instances/Progress/Progress.js";
import Records from "@/core/instances/Progress/Records.js";
import Dec from "@/core/main/Dec.js";
import { get_bit, set_bit } from "@/util/bit-util.js";
import { A_text, B_text, br, type FormattedText, sub } from "@/util/format.js";
import { or_zero, takeIf } from "@/util/functional.js";
import { assignWithProperty } from "@/util/merge.js";
import Decimal from "break_eternity.js";
import { range } from "lodash";

const COUNT_INDEX: number[] = []; // count[i] is bought count of BU(COUNT_INDEX[i])

function _BU(index: number) {
    if (index < 0 || !Number.isInteger(index)) throw new RangeError("invalid index");

    const count_index = takeIf(COUNT_INDEX.indexOf(index), (x) => x >= 0);

    return {
        get bought(): boolean {
            return get_bit(window.player.B.BU_bits, index);
        },
        set bought(value: boolean) {
            set_bit(window.player.B.BU_bits, index, value);
        },
        get bought_count(): Decimal {
            if (count_index !== null) {
                if (count_index >= window.player.B.BU_count.length) return Dec.d0;
                return window.player.B.BU_count[count_index];
            } else {
                return BU(index).bought ? Dec.d1 : Dec.d0;
            }
        },
        set bought_count(value: Decimal) {
            BU(index).bought = (value.gt(0));
            if (count_index !== null) {
                while (count_index >= window.player.B.BU_count.length) {
                    window.player.B.BU_count.push(Dec.d0);
                }
                window.player.B.BU_count[count_index] = value;
            }
        },

        /**
         * 使用此函数时必须明确其作用.
         * 只有某些 `index` 对应的 BU 有 effect 属性, 且必须在符合相应描述的地方使用.
         *
         * 下一次重构时再引入 Effects.
         */
        effect(...param: any): Decimal {
            switch (index) {
                case 1:
                    return new Decimal(arguments[0] as number);

                case 2:
                    // formula: max(1, log_10(`time`))
                    // 早期游戏中这个数约为 3 到 5.

                    return Progress.Game.game_time.max(1).log10().max(1);
                case 3:
                    // formula: 1 + 0.5 * `B.count`

                    return B.count.div(2).add(1);
                case 14:
                    // formula: `best_Bp_speed` * 0.5
                    // 之后, Game 应改为 thisC

                    return Records.Game.best_Bp_speed.mul(0.5);
                case 15:
                    // formula: 0.5/`best_B_time`

                    return Records.Game.best_B_time.recip().mul(0.5);
                case 16:
                    return Ap.amount.max(1).log10().max(1);
                case 17:
                    return Bp.amount.max(1).log10().max(1).pow(5);
                default:
                    throw Error("invalid index");
            }
        },

        // buy

        price(): Decimal {
            switch (index) {
                default:
                    return new Decimal(BU._prices[index]);
            }
        },

        unlocked(): boolean {
            if (index < 12 && index % 4 !== 0) {
                if (!BU(index - 1).bought) return false;
            }
            if (index >= BU.visible_amount()) return false;
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
                    if (Ap.amount.lt(Dec.d1e10)) {
                        Ap.amount = Dec.d1e10;
                    }
                    break;
                default:
                    break;
            }
        },

        fully_bought(): boolean {
            if (count_index === null) return BU(index).bought;
            switch (index) {
                default:
                    return false;
            }
        },

        // formatted text

        formatted_name(): FormattedText {
            return B_text(["BU(", index, ")"]);
        },

        buy_button_message(): FormattedText {
            const price_description: () => FormattedText
                = () => ["价格: ", B_text(BU(index).price()), " ", Bp.formatted_name(), "."];
            const effect_description: () => FormattedText
                = () => ["当前效果: ", BU(index).effect()];

            switch (index) {
                case 0:
                    return [
                        "在所有重置后, 初始拥有 ", A_text(Dec.d1e10), " ", Ap.formatted_name(), ".", br(),
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
                case 8:
                    return [
                        "每次重置时保留 ", A_text(1), " 个 ", As.formatted_name(), br(),
                        price_description(),
                    ];
                case 9:
                    return [
                        "每次重置时保留 ", A_text(2), " 个 ", As.formatted_name(), br(),
                        price_description(),
                    ];
                case 10:
                    return [
                        "每次重置时保留 ", A_text(3), " 个 ", As.formatted_name(), br(),
                        price_description(),
                    ];
                case 11:
                    return [
                        "每次重置时保留 ", A_text(4), " 个 ", As.formatted_name(), ",", br(),
                        "并初始拥有 ", A_text(Dec.d1e25), " ", Ap.formatted_name(), br(),
                        price_description(),
                    ];
                case 12:
                    return [
                        "将 ", Ai.formatted_name(), " 在 ", A_text(Dec.dNm), " ", Ap.formatted_name(),
                        " 处的硬上限变为软上限.", br(),
                        price_description(),
                    ];
                case 13:
                    return [
                        "将 ", At.formatted_name(), " 在 ", A_text(Dec.dNm), " ", Ap.formatted_name(),
                        " 处的硬上限变为软上限.", br(),
                        price_description(),
                    ];
                case 14:
                    return [
                        "根据最佳的 ", Bp.formatted_name(), " 获得速度的 50% 自动获得 ",
                        Bp.formatted_name(), ".", br(),
                        price_description(), br(),
                        "当前速度: ", B_text(BU(14).effect()), " ", Bp.formatted_name(), "/s",
                    ];
                case 15:
                    return [
                        "根据最佳的 ", B.formatted_name(), " 制作速度的 50% 自动获得 ",
                        B.formatted_name(), " 制作次数.", br(),
                        price_description(), br(),
                        "当前速度: ", B_text(BU(15).effect()), " ", B.formatted_name(), "次数/s",
                    ];
                case 16:
                    return [
                        "基于当前的 ", Ap.formatted_name(), " 数量, 所有 ", Ai.formatted_name(), " 获得倍率加成.", br(),
                        price_description(), br(),
                        effect_description(),
                    ];
                case 17:
                    return [
                        "基于未使用的 ", Bp.formatted_name(), " 数量, 所有 ", Ai.formatted_name(), " 获得倍率加成.", br(),
                        price_description(), br(),
                        effect_description(),
                    ];
                case 18:
                    return [
                        "解锁购买最大数量的 ", As.formatted_name(), ", 并同时应用于自动购买器.", br(),
                        price_description(), br(),
                    ];
                case 19:
                    return [
                        "解锁 ", B_text(["B", sub("i")]), "(TODO)",
                        price_description(),
                    ];
            }
            return null;
        },
    };
}


const BU = assignWithProperty(_BU, {
    _prices: [0, 1, 1, 2, 5, 5, 5, 1, 20, 40, 60, 100, 200, 400, 600, 1000, 1e4, 1e5, 2e5, 1e6],

    visible_amount(): number {
        if (BC.total_completions().lt(9)) return 8;
        if (range(0, 16).some((index) => !BU(index).bought)) return 16;
        return 20;
    },

    Bp_mult: {
        get bought(): Decimal {
            return or_zero(window.player.B.Bp_mult_bought);
        },
        set bought(value: Decimal) {
            window.player.B.Bp_mult_bought = value;
        },
        unlocked(): boolean {
            return BU.visible_amount() > 16;
        },

        price(): Decimal {
            return Dec.d10.pow(BU.Bp_mult.bought);
        },
        buyable(): boolean {
            if (!BU.Bp_mult.unlocked()) return false;
            return Bp.amount.gte(BU.Bp_mult.price());
        },
        buy() {
            if (!BU.Bp_mult.buyable()) return false;
            const price = BU.Bp_mult.price();
            Bp.amount = Bp.amount.sub(price);
            BU.Bp_mult.bought = BU.Bp_mult.bought.add(1);
        },
        effect(): Decimal {
            return Dec.d2.pow(BU.Bp_mult.bought);
        },

        buy_button_message(): FormattedText {
            return [
                "加倍 ", Bp.formatted_name(), " 的获得量.", br(),
                "当前价格: ", B_text(BU.Bp_mult.price()), " ", Bp.formatted_name(), br(),
                "当前效果: ", BU.Bp_mult.effect(),
            ];
        },
        tooltip_text(): FormattedText {
            return [
                "已购买: ", BU.Bp_mult.bought,
            ];
        },
    },

    description(): FormattedText {
        return [
            "花费 ", Bp.formatted_name(), " 以购买升级.", br(),
            "前三行的 4 个升级必须按从左到右的顺序解锁.",
        ];
    },

    next_unlock_description(): FormattedText {
        switch (BU.visible_amount()) {
            case 8:
                return [
                    BC.formatted_name(), " 的完成数量达到 9 以解锁更多升级.",
                ];
            case 16:
                return [
                    BU.formatted_name(), " 的购买数量达到 16 以解锁更多升级.",
                ];
            default:
                return null;
        }
    },

    Ai_mult_upgrades: [1, 2, 3, 16, 17],

    mult_for_Ai_total(layer: number): Decimal {
        let mult: Decimal = Dec.d1;
        for (let i of BU.Ai_mult_upgrades) {
            if (BU(i).bought) mult = mult.mul(BU(i).effect(layer));
        }
        return mult;
    },

    formatted_name(): FormattedText {
        return B_text("BU");
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