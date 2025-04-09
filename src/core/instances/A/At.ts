import A from "@/core/instances/A/A.js";
import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import Atu from "@/core/instances/A/Atu.ts";
import B from "@/core/instances/B/B.js";
import BU from "@/core/instances/B/BU.js";
import BU_qol from "@/core/instances/B/BU_qol.js";
import { register } from "@/core/instances/instance-init.js";
import Progress from "@/core/instances/Progress/Progress.js";
import Dec from "@/core/main/Dec.ts";
import { TabId } from "@/core/main/defines.js";
import { BuyMode } from "@/core/main/settings.ts";
import { ExpCapScaling, ExpLinearScaling, ExpQuadScaling, type Scaling } from "@/core/math/scaling.js";
import { A_text, br, type FormattedText, sub } from "@/util/format.ts";
import Decimal from "break_eternity.js";

const At = {
    get bought(): Decimal {
        return window.player.A.At;
    },
    set bought(value: Decimal) {
        window.player.A.At = value;
    },

    // production

    sign_speed_per_At(): Decimal {
        return Atu.sign_speed_per_At();
    },

    sign_speed(): Decimal {
        if (!A.automation.auto_sign.unlocked) return Dec.d0;
        return At.sign_speed_per_At().pow(At.bought);
    },

    // buy modes

    get buy_mode(): BuyMode {
        return window.game.A.At_buy_mode;
    },
    set buy_mode(value: BuyMode) {
        window.game.A.At_buy_mode = value;
    },

    get buy_modes(): BuyMode[] {
        return [BuyMode.BUY_ONE, BuyMode.BUY_MAX];
    },

    // buy

    price_scaling(): Scaling {
        let linearScaling: ExpLinearScaling = new ExpLinearScaling(10, 10, 1, false);
        if (!BU(13).bought) return new ExpCapScaling(linearScaling, { price: Dec.dNm });
        return new ExpQuadScaling(linearScaling, { price: Dec.dNm }, Dec.d10);
    },

    price(): Decimal {
        return At.price_scaling().price(At.bought);
    },

    visible(): boolean {
        if (B.unlocked) return true;
        return A.automation.auto_sign.unlocked;
    },

    unlocked_Ai(): boolean {
        if (!A.automation.auto_sign.unlocked) return false;
        return Ai(1).amount.gt(0);
    },

    buyable(): boolean {
        return At.unlocked_Ai() && Ap.amount.gte(At.price());
    },

    buy_max_result(): Decimal {
        return At.price_scaling().buy_max(At.bought, Ap.amount);
    },

    buy(mode?: BuyMode) {
        if (mode === undefined) mode = At.buy_mode;

        if (!At.buyable()) return;

        switch (mode) {
            case BuyMode.BUY_ONE:
                if (At.buyable()) {
                    let cost = At.price();
                    At.bought = At.bought.add(1);
                    Ap.spend(cost);
                }
                return;
            case BuyMode.BUY_MAX:
                if (At.buyable()) {
                    let result = At.buy_max_result();
                    let cost = At.price_scaling().price_amount(At.bought, result);
                    At.bought = result;
                    Ap.spend(cost);
                }
                return;
            default:
                return;
        }
    },

    //automation

    automation: {
        get unlocked(): boolean {
            return window.player.A.At_automation.unlocked;
        },
        set unlocked(value: boolean) {
            window.player.A.At_automation.unlocked = value;
        },
        get enabled(): boolean {
            return window.player.A.At_automation.enabled;
        },
        set enabled(value: boolean) {
            window.player.A.At_automation.enabled = value;
        },
        get mode(): BuyMode {
            return window.player.A.At_automation.buy_mode;
        },
        set mode(value: BuyMode) {
            window.player.A.At_automation.buy_mode = value;
        },

        requirement_for_unlock(): Decimal {
            return Dec.d10.pow(100);
        },

        unlock_buyable(): boolean {
            return Ap.amount.gte(At.automation.requirement_for_unlock());
        },

        buy_unlock() {
            if (!At.automation.unlock_buyable()) return;
            At.automation.unlocked = true;
            At.automation.enabled = true;
            Progress.unlock_tab(TabId.AUTOMATION);
        },

        allowed_modes(): BuyMode[] {
            if (BU_qol(8).bought) return [BuyMode.BUY_ONE, BuyMode.BUY_MAX];
            return [BuyMode.BUY_ONE];
        },
        // formatted text

        unlock_text(): FormattedText {
            return [
                "解锁自动购买 ", At.formatted_name(), br(),
                "需要 ", A_text(At.automation.requirement_for_unlock()), " ", Ap.formatted_name(),
            ];
        },

        setting_description(): FormattedText {
            return [At.formatted_name(), " 自动购买"];
        },

        enable_button_text(): FormattedText {
            if (At.automation.enabled) {
                return "开启";
            } else {
                return "关闭";
            }
        },

        mode_button_text(): FormattedText {
            switch (At.automation.mode) {
                case BuyMode.BUY_ONE:
                    return "购买 1 个";
                case BuyMode.BUY_MAX:
                    return "购买最大";
                default:
                    return null;
            }
        },
    },

    // formatted text

    formatted_name(): FormattedText {
        return A_text(["A", sub("t")]);
    },

    buy_mode_description(): FormattedText {
        switch (At.buy_mode) {
            case BuyMode.BUY_ONE:
                return ["购买 1 个 ", At.formatted_name()];
            case BuyMode.BUY_MAX:
                return ["购买最大 ", At.formatted_name()];
            default:
                return null;
        }
    },

    buy_button_message(mode?: BuyMode): FormattedText {
        if (mode === undefined) mode = At.buy_mode;

        if (!At.unlocked_Ai()) {
            return [
                "购买 1 个 ", At.formatted_name(), ".", br(),
                "需要至少一个 ", Ai(1).formatted_name(), " 以解锁.",
            ];
        }

        switch (mode) {
            case BuyMode.BUY_ONE:
                return [
                    "购买 1 个 ", At.formatted_name(), ".", br(),
                    "价格: ", A_text(At.price()), " ", Ap.formatted_name(), ".",
                ];
            case BuyMode.BUY_MAX:
                return [
                    "购买至 ", At.buy_max_result(), " 个 ", At.formatted_name(), ".", br(),
                    "当前价格: ", A_text(At.price()), " ", Ap.formatted_name(), ".",
                ];
            default:
                return [];
        }
    },

    buy_button_tooltip_message(): FormattedText {
        return ["已购买: ", At.bought];
    },

};

export default At;

declare global {
    interface Window {
        At: typeof At;
    }
}

register('At', {
    init() {
        window.At = At;
    },
});