import { start_make_B_animation } from "@/animation/make-B-animation.js";
import A from "@/core/instances/A/A.js";
import Ap from "@/core/instances/A/Ap.js";
import Atu from "@/core/instances/A/Atu.js";
import BC from "@/core/instances/B/BC.js";
import Bp from "@/core/instances/B/Bp.js";
import BU from "@/core/instances/B/BU.js";
import { register } from "@/core/instances/instance-init.js";
import Progress from "@/core/instances/Progress/Progress.js";
import Records from "@/core/instances/Progress/Records.js";
import Settings from "@/core/instances/Settings/Settings.js";
import { require_confirm } from "@/core/main/confirmation.js";
import Dec from "@/core/main/Dec.js";
import type { BBuySettings } from "@/core/main/defines.js";
import { add_global_message } from "@/core/main/global-messages.js";
import { A_text, B_text, br, type FormattedText, small } from "@/util/format.js";
import Decimal from "break_eternity.js";

const B = {
    get unlocked() {
        return window.player.B.unlocked;
    },
    set unlocked(value: boolean) {
        window.player.B.unlocked = value;
    },
    get count(): Decimal {
        return window.player.B.B_count;
    },
    set count(value: Decimal) {
        window.player.B.B_count = value;
    },

    automation: {
        get unlocked(): boolean {
            return window.player.B.B_automation.unlocked;
        },
        set unlocked(value: boolean) {
            window.player.B.B_automation.unlocked = value;
        },
        get enabled(): boolean {
            return window.player.B.B_automation.enabled;
        },
        set enabled(value: boolean) {
            window.player.B.B_automation.enabled = value;
        },
        get settings(): BBuySettings {
            return window.player.B.B_automation.buy_settings;
        },

        // formatted text

        setting_description(): FormattedText {
            return [B.formatted_name(), " 自动购买"];
        },

        enable_button_text(): FormattedText {
            if (B.automation.enabled) {
                return "开启";
            } else {
                return "关闭";
            }
        },

        setting_text(): FormattedText {
            return ["到达 (_) ", B.formatted_name(), " 时购买"];
        },

        setting_button_text(): FormattedText {
            return B.automation.settings.threshold_B;
        },

        setting_button_change_value() {
            add_global_message({
                type: 'input_box',
                message_text: "请输入新值: ",
                done(text: string) {
                    B.automation.settings.threshold_B = new Decimal(text).max(0);
                },
            });
        },
    },

    // reset

    B_count_gain_on_reset(): Decimal {
        return Dec.d1;
    },

    Bp_gain_on_reset(): Decimal {
        let result = Decimal.pow10(Records.this_B.best_Ap.log10().div(308).sub(0.8));
        result = result.mul(BU.Bp_mult.effect());
        return result.floor();
    },

    // buy

    buy_threshold(): Decimal {
        if (BC(1).running()) {
            return BC(1).running_effect();
        }
        return Dec.dNm;
    },

    buyable(): boolean {
        return Ap.amount.gte(B.buy_threshold());
    },

    manual_buy(no_confirm: boolean = false) {
        require_confirm(
            !no_confirm && Settings.confirmation_setting.buy_B,
            B.buy_confirmation_message,
            B.buy,
        );
    },

    buy(show_animation: boolean = true) {
        if (!B.buyable()) return;

        if (show_animation && Settings.animation_setting.buy_B) start_make_B_animation();

        const B_time_gain = B.B_count_gain_on_reset();
        const Bp_gain = B.Bp_gain_on_reset();

        const B_time = Progress.this_B.game_time;
        const Bp_speed = Bp_gain.div(B_time);
        Records.update_best_Bp_speed(Bp_speed);
        Records.update_best_B_time(B_time);

        B.run_reset();

        B.count = B.count.add(B_time_gain);
        Bp.amount = Bp.amount.add(Bp_gain);
        B.unlocked = true;

        if (BC.running !== undefined) {
            let { label, amount } = BC.running;
            BC.running = undefined;
            BC(label).completions = BC(label).completions.max(amount);
        }
    },

    /**
     * buy B if buyable, and reset otherwise.
     */
    force_buy_or_reset() {
        if (B.buyable()) {
            B.buy();
        } else {
            B.run_reset();
        }
    },

    /**
     * All B reset eventually call this function.
     */
    run_reset() {
        B.run_reset_impl();
    },

    run_reset_impl() {
        Progress.this_B.reset();
        Records.this_B.reset();

        Atu.run_reset_impl();
        Atu.bought = Dec.d0;
    },

    runGameLoop_auto_buy(duration: number) {
        if (B.automation.unlocked && B.automation.enabled) {
            if (BC.running !== undefined) {
                B.buy(false);
            } else if (B.Bp_gain_on_reset().gte(B.automation.settings.threshold_B)) {
                B.buy(false);
            }
        }
    },

    runGameLoop_resource_gain(duration: number) {
        if (BU(14).bought) {
            Bp.amount = Bp.amount.add(BU(14).effect().mul(duration));
        }
        if (BU(15).bought) {
            B.count = B.count.add(BU(15).effect().mul(duration));
        }
    },

    runGameLoop(duration: number) {
        B.runGameLoop_auto_buy(duration);
        B.runGameLoop_resource_gain(duration);
    },

    // formatted text

    formatted_name(): FormattedText {
        return B_text("B");
    },

    buy_button_message(): FormattedText {
        if (!B.buyable()) {
            let result = ["需要 ", A_text(B.buy_threshold()), " ", Ap.formatted_name()];
            if (BC(1).running()) {
                result = [result, br(), "(", BC(1).formatted_name(), ")"];
            }
            return result;
        }

        return small([
            "用所有 ", Ap.formatted_name(), " 制作 ", Bp.formatted_name(), ".", br(),
            "获得 ", B_text(B.Bp_gain_on_reset()), " ", Bp.formatted_name(),
        ]);
    },

    buy_confirmation_message(): FormattedText {
        let BC_message: FormattedText = null;
        if (BC.running !== undefined) {
            BC_message = [
                "同时, 将完成 ", B_text(BC.running.amount), " 次 ", BC(BC.running.label).formatted_name(), ".", br(),
            ];
        }
        return [
            "确认要制作 ", B.formatted_name(), " 吗?", br(),
            "将重置所有 ", A.formatted_name(), " 级别的资源, 并获得 ",
            B_text(B.Bp_gain_on_reset()), " ", Bp.formatted_name(), ".", br(),
            BC_message,
            small("可在设置中关闭确认信息."),
        ];
    },
};

export default B;

declare global {
    interface Window {
        B: typeof B;
    }
}

register('B', {
    init() {
        window.B = B;
    },
});