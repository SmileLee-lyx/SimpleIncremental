import Ai from "@/core/instances/A/Ai.ts";
import Ap from "@/core/instances/A/Ap.ts";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
import BU from "@/core/instances/B/BU.js";
import { register } from "@/core/instances/instance-init.js";
import Settings from "@/core/instances/Settings/Settings.js";
import { require_confirm } from "@/core/main/confirmation.js";
import Dec from "@/core/main/Dec.ts";
import type { AsBuySettings } from "@/core/main/defines.js";
import { add_global_message } from "@/core/main/global-messages.js";
import { A_text, br, type FormattedText, small, sub } from "@/util/format.ts";
import Decimal from "break_eternity.js";

const As = {
    get bought(): Decimal {
        return window.player.A.As;
    },
    set bought(amount: Decimal) {
        window.player.A.As = amount;
    },

    amount_after_reset(): Decimal {
        if (BU(11).bought) return Dec.d4;
        if (BU(10).bought) return Dec.d3;
        if (BU(9).bought) return Dec.d2;
        if (BU(8).bought) return Dec.d1;
        return Dec.d0;
    },

    // production

    mult_for_Ai_per_As(): Decimal {
        if (BU(4).bought) return Dec.d2_5;
        return Dec.d2;
    },
    mult_for_Ai_total(layer: number): Decimal {
        return As.mult_for_Ai_per_As().pow(As.bought.sub(layer - 1).max(0));
    },

    // buy

    unlocked(): boolean {
        return true;
    },

    visible(): boolean {
        if (B.unlocked) return true;
        return As.bought.gt(0) || Atu.bought.gt(0) || Ai(4).bought.gt(0);
    },

    allow_buy_max(): boolean {
        return BU(18).bought;
    },

    price(): { target: number; value: Decimal; } {
        if (As.bought.lt(4)) {
            return { target: As.bought.add(Dec.d4).toNumber(), value: Dec.d20 };
        }
        return { target: 8, value: Dec.d20.add(Dec.d20.mul(As.bought.sub(4))) };
    },

    buyable(): boolean {
        let { target: layer, value: price } = As.price();
        return Ai(layer).amount.gte(price);
    },

    manual_buy(no_confirm: boolean = false) {
        require_confirm(
            !no_confirm && Settings.confirmation_setting.buy_As,
            As.buy_confirmation_message,
            As.buy,
        );
    },

    buy() {
        if (As.allow_buy_max()) {
            As.buy_max();
        } else {
            As.buy_one();
        }
    },

    buy_one() {
        if (!As.buyable()) return;
        As.run_reset();
        As.bought = As.bought.add(1);
    },

    buyable_amount(): Decimal {
        if (As.bought.lt(4)) {
            let current = As.bought.round().toNumber();
            while (current < 4) {
                if (Ai(current + 4).amount.gte(20)) {
                    ++current;
                } else {
                    return new Decimal(current);
                }
            }
        }
        // 能买到至少 4 个
        return Ai(8).amount.div(20).floor().add(4);
    },

    buy_max() {
        if (!As.buyable()) return;
        const result = As.buyable_amount();
        As.run_reset();
        As.bought = result;
    },

    /**
     * All As reset eventually call As function.
     *
     * may contain actions not needed in reset for Atu, B and beyond.
     *
     */
    run_reset() {
        As.run_reset_impl();
    },

    run_reset_impl() {
        Ap.amount = Ap.amount_after_reset();
        for (let layer = 1; layer <= 8; layer++) {
            Ai(layer).amount = Ai(layer).bought = Dec.d0;
        }
        At.bought = Dec.d0;
    },

    // automation
    automation: {
        get unlocked(): boolean {
            return window.player.A.As_automation.unlocked;
        },
        set unlocked(value: boolean) {
            window.player.A.As_automation.unlocked = value;
        },
        get enabled(): boolean {
            return window.player.A.As_automation.enabled;
        },
        set enabled(value: boolean) {
            window.player.A.As_automation.enabled = value;
        },
        get settings(): AsBuySettings {
            return window.player.A.As_automation.buy_settings;
        },

        // formatted text

        setting_description(): FormattedText {
            return [As.formatted_name(), " 自动购买"];
        },

        enable_button_text(): FormattedText {
            if (As.automation.enabled) {
                return "开启";
            } else {
                return "关闭";
            }
        },

        limit_text(): FormattedText {
            return ["限制 ", As.formatted_name(), " 数量"];
        },

        limit_button_text(): FormattedText {
            return As.automation.settings.limit;
        },

        limit_button_change_value() {
            add_global_message({
                type: 'input_box',
                message_text: "请输入新值: ",
                done(text: string) {
                    As.automation.settings.limit = new Decimal(text).max(0);
                },
            });
        },

        no_limit_text(): FormattedText {
            return ["仅低于 (_) ", Atu.formatted_name(), " 时生效"];
        },

        no_limit_button_text(): FormattedText {
            return As.automation.settings.no_limit_above_Atu;
        },

        no_limit_button_change_value() {
            add_global_message({
                type: 'input_box',
                message_text: "请输入新值: ",
                done(text: string) {
                    As.automation.settings.no_limit_above_Atu = new Decimal(text).max(0);
                },
            });
        },
    },

    // formatted text
    formatted_name(): FormattedText {
        return A_text(["A", sub("*")]);
    },

    buy_button_message(): FormattedText {
        return [
            "购买一个 ", As.formatted_name(), ",", br(),
            "并重置 ", Ap.formatted_name(), " 与 ", At.formatted_name(), ".", br(),
            "需要 ", As.price().value, " 个 ", Ai(As.price().target).formatted_name(), ".",
        ];
    },

    buy_button_shift_message(): FormattedText {
        let unlock_Ai_text: FormattedText;
        if (As.bought.lt(4)) {
            unlock_Ai_text = ["解锁 ", Ai(As.bought.floor().toNumber() + 5).formatted_name(), ", 并"];
        } else {
            unlock_Ai_text = null;
        }
        let mult_target: FormattedText;
        if (As.bought.lt(1)) {
            mult_target = [" ", Ai(1).formatted_name(), " "];
        } else if (As.bought.lt(8)) {
            mult_target = [" ", Ai(1).formatted_name(), " 至 ",
                           Ai(As.bought.floor().toNumber() + 1).formatted_name(), " "];
        } else {
            mult_target = ["所有 ", Ai.formatted_name(), " "];
        }
        return [unlock_Ai_text, "将", mult_target, "的作用提高 ×", As.mult_for_Ai_per_As(), "."];
    },

    buy_button_tooltip_message(): FormattedText {
        return ["已购买: ", As.bought];
    },

    buy_confirmation_message(): FormattedText {
        return [
            "确认要购买 ", As.formatted_name(), " 吗?", br(),
            "将重置所有 ", Ap.formatted_name(), ", ", Ai.formatted_name(), " 与 ", At.formatted_name(),
            ". 按住 Shift 可以查看效果.", br(),
            small("可在设置中关闭确认信息."),
        ];
    },
};

export default As;

declare global {
    interface Window {
        As: typeof As;
    }
}

register('As', {
    init() {
        window.As = As;
    },
});