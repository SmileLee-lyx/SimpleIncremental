import DC from "@/core/DC.ts";
import { BuyMode } from "@/core/defines.ts";
import A from "@/core/instances/A/A.js";
import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import Atu from "@/core/instances/A/Atu.ts";
import { register } from "@/core/instances/instance-init.js";
import { ExpLinearScaling, type Scaling } from "@/core/math/scaling.js";
import { A_text, br, fixed_width, type FormattedText, sub } from "@/util/format.ts";
import Decimal from "break_eternity.js";
import { range } from "lodash";

const At = {
    get unlocked(): boolean {
        return window.player.A.At_unlocked;
    },
    set unlocked(value: boolean) {
        window.player.A.At_unlocked = value;
    },
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
        if (!At.unlocked) return DC.d0;
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
        return new ExpLinearScaling(10, 10, 1, false);
    },

    price(): Decimal {
        return At.price_scaling().price(At.bought);
    },

    visible(): boolean {
        return At.unlocked;
    },

    unlocked_Ai(): boolean {
        if (!At.unlocked) return false;
        return range(1, 9).some((layer) => Ai(layer).bought.gt(0));
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

    // formatted text

    formatted_name(): FormattedText {
        return A_text(["A", sub("t")]);
    },

    buy_mode_description(): FormattedText {
        switch (At.buy_mode) {
            case BuyMode.BUY_ONE:
                return ["购买 1 个 ", At.formatted_name()];
            case BuyMode.BUY_MAX:
                return ["购买最大", At.formatted_name()];
            default:
                return undefined;
        }
    },

    auto_sign_description(): FormattedText {
        if (!At.unlocked) {
            return "自动签到已禁用.";
        }
        let next_sign_message: FormattedText;
        if (At.sign_speed().gt(10)) {
            next_sign_message = undefined;
        } else {
            next_sign_message = [" 下次自动签到时间: ", fixed_width(A.time_to_next_sign_ms(), 'width-30'), "毫秒."];
        }
        return [
            "正在自动签到, 当前速度: ", At.sign_speed(), "/秒.", next_sign_message, br(),
            "每个 ", At.formatted_name(), " 将签到速度提升 ×", Atu.sign_speed_per_At(), ".",
        ];
    },

    buy_button_message(mode?: BuyMode): FormattedText {
        if (mode === undefined) mode = At.buy_mode;

        if (!At.unlocked_Ai()) {
            return [
                "购买 1 个 ", At.formatted_name(), ".", br(),
                "需要至少一个 ", Ai.formatted_name(), " 以解锁.",
            ];
        }

        switch (mode) {
            case BuyMode.BUY_ONE:
                return [
                    "购买 1 个 ", At.formatted_name(), ".", br(),
                    "价格: ", A_text(At.price()), Ap.formatted_name(), ".",
                ];
            case BuyMode.BUY_MAX:
                return [
                    "购买至 ", At.buy_max_result(), " 个 ", At.formatted_name(), ".", br(),
                    "价格: ", A_text(At.price()), Ap.formatted_name(), ".",
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