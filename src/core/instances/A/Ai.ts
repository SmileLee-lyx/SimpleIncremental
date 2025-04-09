import A from "@/core/instances/A/A.js";
import Ap from "@/core/instances/A/Ap.ts";
import As from "@/core/instances/A/As.ts";
import At from "@/core/instances/A/At.ts";
import BC from "@/core/instances/B/BC.js";
import BU from "@/core/instances/B/BU.js";
import BU_qol from "@/core/instances/B/BU_qol.js";
import { register } from "@/core/instances/instance-init.js";
import Progress from "@/core/instances/Progress/Progress.js";
import Dec from "@/core/main/Dec.ts";
import { TabId } from "@/core/main/defines.js";
import { BuyMode } from "@/core/main/settings.ts";
import { ExpCapScaling, ExpLinearScaling, ExpQuadScaling, type Scaling } from "@/core/math/scaling.ts";
import { A_text, br, type FormattedText, sub } from "@/util/format.ts";
import { assignWithProperty } from "@/util/merge.ts";
import Decimal from "break_eternity.js";


function _Ai(layer: number) {
    if (layer <= 0 || layer > 8 || !Number.isInteger(layer)) throw new RangeError("invalid layer");

    return {
        get amount(): Decimal {
            return window.player.A.Ai[layer - 1].amount;
        },
        set amount(value: Decimal) {
            window.player.A.Ai[layer - 1].amount = value;
        },
        get bought(): Decimal {
            return window.player.A.Ai[layer - 1].bought;
        },
        set bought(value: Decimal) {
            window.player.A.Ai[layer - 1].bought = value;
        },

        // production

        mult_buy10_total(): Decimal {
            return Ai.mult_per_buy10().pow(Ai(layer).bought.div(Dec.d10).floor());
        },

        mult_total(): Decimal {
            if (BC(3).running()) {
                let amount = BC(3).running_amount().min(8).toNumber();
                if (layer <= amount) return Dec.d1;
            }

            return Ai(layer).mult_buy10_total().mul(As.mult_for_Ai_total(layer)).mul(BU.mult_for_Ai_total(layer));
        },

        production_per_sign(): Decimal {
            return Ai(layer).amount.mul(Ai(layer).mult_total());
        },

        production_per_second(): Decimal {
            return Ai(layer).production_per_sign().mul(At.sign_speed());
        },

        generated_per_sign(): Decimal {
            if (layer < 8) {
                return Ai(layer + 1).production_per_sign();
            } else {
                return Dec.d0;
            }
        },

        generated_per_second(): Decimal {
            if (layer < 8) {
                return Ai(layer + 1).production_per_second();
            } else {
                return Dec.d0;
            }
        },

        // buy

        price_scaling(): Scaling {
            const linearScaling: ExpLinearScaling[] = [
                new ExpLinearScaling(10, 1e2, 10),
                new ExpLinearScaling(100, 1e3, 10),
                new ExpLinearScaling(1e3, 1e4, 10),
                new ExpLinearScaling(1e5, 1e6, 10),
                new ExpLinearScaling(1e7, 1e8, 10),
                new ExpLinearScaling(1e10, 1e10, 10),
                new ExpLinearScaling(1e15, 1e15, 10),
                new ExpLinearScaling(1e21, 1e20, 10),
            ];
            if (!BU(12).bought) {
                return new ExpCapScaling(linearScaling[layer - 1], { price: Dec.dNm });
            }
            return new ExpQuadScaling(linearScaling[layer - 1], { price: Dec.dNm }, Dec.d10);
        },

        price(): Decimal {
            return Ai(layer).price_scaling().price(Ai(layer).bought);
        },
        visible(): boolean {
            return true;
        },
        unlocked(): boolean {
            if (BC(2).running()) {
                let amount = BC(2).running_amount().min(8).toNumber();
                if (layer > 8 - amount) return false;
            }

            return As.bought.gte(layer - 4);
        },


        buyable(): boolean {
            if (!Ai(layer).unlocked()) return false;
            return Ap.amount.gte(Ai(layer).price());
        },
        bought_mod_10(): number {
            // avoid precision issues
            if (Ai(layer).bought.gte(1e10)) return 0;
            return Ai(layer).bought.mod(Dec.d10).floor().toNumber();
        },
        buyable_amount_to10(): number {
            if (!Ai(layer).unlocked()) return 0;
            // avoid precision issues
            if (Ai(layer).bought.gte(1e10)) {
                if (Ai(layer).buyable()) return 10;
                return 0;
            }
            return Ap.amount.div(Ai(layer).price()).floor().min(10 - Ai(layer).bought_mod_10()).toNumber();
        },
        buy_max_result(): Decimal {
            return Ai(layer).price_scaling().buy_max(Ai(layer).bought, Ap.amount);
        },

        buy(mode?: BuyMode) {
            if (mode === undefined) mode = Ai.buy_mode;

            if (!Ai(layer).buyable()) return;

            switch (mode) {
                case BuyMode.BUY_ONE:
                    if (Ai(layer).buyable()) {
                        let cost = Ai(layer).price();
                        Ai(layer).bought = Ai(layer).bought.add(1);
                        Ai(layer).amount = Ai(layer).amount.add(1);
                        Ap.spend(cost);
                    }
                    return;
                case BuyMode.BUY_TEN:
                    if (Ai(layer).buyable()) {
                        let amount = Ai(layer).buyable_amount_to10();
                        let cost = Ai(layer).price().mul(amount);
                        Ai(layer).amount = Ai(layer).amount.add(amount);
                        Ai(layer).bought = Ai(layer).bought.add(amount);
                        Ap.spend(cost);
                    }
                    return;
                case BuyMode.BUY_MAX:
                    if (Ai(layer).buyable()) {
                        let result = Ai(layer).buy_max_result();
                        let cost = Ai(layer).price_scaling().price_amount(Ai(layer).bought, result);
                        if (Ai(layer).amount.eq(Ai(layer).bought)) {
                            Ai(layer).amount = result;
                        } else {
                            Ai(layer).amount = Ai(layer).amount.add(result.sub(Ai(layer).bought));
                        }
                        Ai(layer).bought = result;
                        Ap.spend(cost);
                    }
                    return;
            }
        },

        // automation
        automation: {
            get unlocked(): boolean {
                return window.player.A.Ai_automation[layer - 1].unlocked;
            },
            set unlocked(value: boolean) {
                window.player.A.Ai_automation[layer - 1].unlocked = value;
            },
            get enabled(): boolean {
                return window.player.A.Ai_automation[layer - 1].enabled;
            },
            set enabled(value: boolean) {
                window.player.A.Ai_automation[layer - 1].enabled = value;
            },
            get mode(): BuyMode {
                return window.player.A.Ai_automation[layer - 1].buy_mode;
            },
            set mode(value: BuyMode) {
                window.player.A.Ai_automation[layer - 1].buy_mode = value;
            },

            requirement_for_unlock(): Decimal {
                return Dec.d10.pow(10 * layer);
            },

            unlock_buyable(): boolean {
                return Ap.amount.gte(Ai(layer).automation.requirement_for_unlock());
            },

            buy_unlock() {
                if (!Ai(layer).automation.unlock_buyable()) return;
                Ai(layer).automation.unlocked = true;
                Ai(layer).automation.enabled = true;
                Progress.unlock_tab(TabId.AUTOMATION);
            },

            allowed_modes(): BuyMode[] {
                if (BU_qol(layer - 1).bought) return [BuyMode.BUY_ONE, BuyMode.BUY_TEN, BuyMode.BUY_MAX];
                return [BuyMode.BUY_ONE, BuyMode.BUY_TEN];
            },

            // formatted text

            unlock_text(): FormattedText {
                return [
                    "解锁自动购买 ", Ai(layer).formatted_name(), br(),
                    "需要 ", A_text(Ai(layer).automation.requirement_for_unlock()), " ", Ap.formatted_name(),
                ];
            },

            setting_description(): FormattedText {
                return [Ai(layer).formatted_name(), " 自动购买"];
            },

            enable_button_text(): FormattedText {
                if (Ai(layer).automation.enabled) {
                    return "开启";
                } else {
                    return "关闭";
                }
            },

            mode_button_text(): FormattedText {
                switch (Ai(layer).automation.mode) {
                    case BuyMode.BUY_ONE:
                        return "购买 1 个";
                    case BuyMode.BUY_TEN:
                        return "购买 10 个";
                    case BuyMode.BUY_MAX:
                        return "购买最大";
                    default:
                        return null;
                }
            },
        },

        // formatted text

        formatted_name(): FormattedText {
            return A_text(["A", sub(layer)]);
        },

        amount_message(): FormattedText {
            return A_text(Ai(layer).amount);
        },

        mult_message(): FormattedText {
            return ["×", Ai(layer).mult_total()];
        },

        amount_inc_message(): FormattedText {
            if (!A.automation.auto_sign.unlocked || !A.automation.auto_sign.enabled) {
                return ["+", Ai(layer).generated_per_sign(), "/签到"];
            } else {
                return ["+", Ai(layer).generated_per_second(), "/秒"];
            }
        },

        buy_button_message(mode?: BuyMode): FormattedText {
            if (mode === undefined) mode = Ai.buy_mode;

            if (!Ai(layer).unlocked()) {
                if (BC(2).running()) {
                    let amount = BC(2).running_amount().min(8).toNumber();
                    if (layer > 8 - amount) return ["因为 ", BC(2).formatted_name(), " 被禁用."];
                }

                return ["需要至少 ", layer - 4, " 个 ", As.formatted_name(), "."];
            }

            switch (mode) {
                case BuyMode.BUY_ONE:
                    return [
                        "购买 1 个 ", Ai(layer).formatted_name(), ".", br(),
                        "价格: ", A_text(Ai(layer).price()), " ", Ap.formatted_name(), ".",
                    ];
                case BuyMode.BUY_TEN:
                    return [
                        "购买 ", Ai(layer).buyable_amount_to10(), " 个 ", Ai(layer).formatted_name(), ".", br(),
                        "单个价格: ", A_text(Ai(layer).price()), " ", Ap.formatted_name(), ".",
                    ];
                case BuyMode.BUY_MAX:
                    return [
                        "购买至 ", Ai(layer).buy_max_result(), " 个 ", Ai(layer).formatted_name(), ".", br(),
                        "当前价格: ", A_text(Ai(layer).price()), " ", Ap.formatted_name(), ".",
                    ];
            }
        },

        buy_button_shift_message(): FormattedText {
            return [
                "每购买 ", A_text(10), " 个 ,", br(),
                "所有 ", Ai(layer).formatted_name(), " 的效果翻倍.",
            ];
        },

        buy_button_tooltip_message(): FormattedText {
            return ["已购买: ", Ai(layer).bought];
        },
    };
}

const Ai = assignWithProperty(_Ai, {
    mult_per_buy10(): Decimal {
        if (BU(5).bought) return Dec.d2_5;
        return Dec.d2;
    },

    get buy_mode(): BuyMode {
        return window.game.A.Ai_buy_mode;
    },
    set buy_mode(value: BuyMode) {
        window.game.A.Ai_buy_mode = value;
    },

    get buy_modes(): BuyMode[] {
        return [BuyMode.BUY_ONE, BuyMode.BUY_TEN, BuyMode.BUY_MAX];
    },

    // formatted texts

    formatted_name(): FormattedText {
        return A_text(["A", sub("i")]);
    },

    buy_mode_description(): FormattedText {
        switch (Ai.buy_mode) {
            case BuyMode.BUY_ONE:
                return ["购买 1 个 ", Ai.formatted_name()];
            case BuyMode.BUY_TEN:
                return ["购买 10 个 ", Ai.formatted_name()];
            case BuyMode.BUY_MAX:
                return ["购买最大 ", Ai.formatted_name()];
            default:
                return null;
        }
    },
});

export default Ai;

declare global {
    interface Window {
        Ai: typeof Ai;
    }
}

register('Ai', {
    init() {
        window.Ai = Ai;
    },
});