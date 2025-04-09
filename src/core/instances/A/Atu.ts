import Ai from "@/core/instances/A/Ai.ts";
import Ap from "@/core/instances/A/Ap.ts";
import As from "@/core/instances/A/As.ts";
import At from "@/core/instances/A/At.js";
import B from "@/core/instances/B/B.js";
import BC from "@/core/instances/B/BC.js";
import BU from "@/core/instances/B/BU.js";
import { register } from "@/core/instances/instance-init.js";
import Settings from "@/core/instances/Settings/Settings.js";
import { require_confirm } from "@/core/main/confirmation.js";
import Dec from "@/core/main/Dec.ts";
import type { AtuBuySettings, Player } from "@/core/main/defines.js";
import { add_global_message } from "@/core/main/global-messages.js";
import { BuyMode } from "@/core/main/settings.js";
import { A_text, br, type FormattedText, small, sub } from "@/util/format.ts";
import Decimal from "break_eternity.js";

const Atu = {
    get bought(): Decimal {
        return window.player.A.Atu;
    },
    set bought(amount: Decimal) {
        window.player.A.Atu = amount;
    },

    // production

    At_effect_start(): Decimal {
        if (BC(4).running()) return BC(4).running_effect();

        return Dec.d1_11;
    },

    At_effect_per_Atu(): Decimal {
        if (BU(6).bought) return Dec.d1_04;
        return Dec.d1_02;
    },

    sign_speed_per_At(): Decimal {
        return Atu.At_effect_start().mul(Atu.At_effect_per_Atu().pow(Atu.bought));
    },

    // buy

    visible(): boolean {
        if (B.unlocked) return true;
        return As.bought.gt(4) || Atu.bought.gt(0) || Ai(8).bought.gt(0);
    },

    price(): { target: number; value: Decimal; } {
        if (BC(2).running()) {
            let amount = BC(2).running_amount().min(8).toNumber();
            if (amount === 8) return { target: 1, value: Dec.d1 };
            return {
                target: 8 - amount,
                value: Dec.d40.add(Dec.d40.mul(Atu.bought)).add(Dec.d10.mul(amount)),
            };
        }

        return { target: 8, value: Dec.d40.add(Dec.d40.mul(Atu.bought)) };
    },

    buyable(): boolean {
        let { target: layer, value: price } = Atu.price();
        return Ai(layer).amount.gte(price);
    },

    manual_buy(no_confirm: boolean = false) {
        require_confirm(
            !no_confirm && Settings.confirmation_setting.buy_Atu,
            Atu.buy_container_message,
            Atu.buy,
        );
    },

    buy() {
        if (!Atu.buyable()) return;
        Atu.run_reset();
        Atu.bought = Atu.bought.add(1);
    },

    // reset

    /**
     * All Atu reset eventually call this function.
     */
    run_reset() {
        Atu.run_reset_impl();
    },

    run_reset_impl() {
        As.run_reset_impl();
        As.bought = As.amount_after_reset();
    },

    // automation
    automation: {
        get unlocked(): boolean {
            return window.player.A.Atu_automation.unlocked;
        },
        set unlocked(value: boolean) {
            window.player.A.Atu_automation.unlocked = value;
        },
        get enabled(): boolean {
            return window.player.A.Atu_automation.enabled;
        },
        set enabled(value: boolean) {
            window.player.A.Atu_automation.enabled = value;
        },
        get settings(): AtuBuySettings {
            return window.player.A.Atu_automation.buy_settings;
        },

        allowed_modes(): BuyMode[] {
            return [BuyMode.BUY_ONE];
        },
        // formatted text

        setting_description(): FormattedText {
            return [Atu.formatted_name(), " 自动购买"];
        },

        enable_button_text(): FormattedText {
            if (Atu.automation.enabled) {
                return "开启";
            } else {
                return "关闭";
            }
        },

        limit_text(): FormattedText {
            return ["限制 ", Atu.formatted_name(), " 数量"];
        },

        limit_button_text(): FormattedText {
            return Atu.automation.settings.limit;
        },

        limit_button_change_value() {
            add_global_message({
                type: 'input_box',
                message_text: "请输入新值: ",
                done(text: string) {
                    Atu.automation.settings.limit = new Decimal(text).max(0);
                },
            });
        },
    },

    // formatted text

    formatted_name(): FormattedText {
        return A_text(["A", sub("tu")]);
    },

    buy_button_message(): FormattedText {
        return [
            "购买一个 ", Atu.formatted_name(), ",", br(),
            "并重置 ", Ap.formatted_name(), ", ", At.formatted_name(), ", ", As.formatted_name(), ".", br(),
            "需要 ", Atu.price().value, " 个 ", Ai(Atu.price().target).formatted_name(), ".",
        ];
    },

    buy_button_shift_message(): FormattedText {
        return ["将每个 ", At.formatted_name(), " 的作用提高 ×", Atu.At_effect_per_Atu(), "."];
    },

    buy_button_tooltip_message(): FormattedText {
        return ["已购买: ", Atu.bought];
    },

    buy_container_message(): FormattedText {
        return [
            "确认要购买 ", Atu.formatted_name(), " 吗?", br(),
            "将重置所有 ", Ap.formatted_name(), ", ", Ai.formatted_name(), ", ", At.formatted_name(),
            " 与 ", As.formatted_name(), ". 按住 Shift 可以查看效果.", br(),
            small("可在设置中关闭确认信息."),
        ];
    },
};

export default Atu;

declare global {
    interface Window {
        Atu: typeof Atu;
    }
}

register('Atu', {
    init() {
        window.Atu = Atu;
    },
});