import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import As from "@/core/instances/A/As.js";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
import BC from "@/core/instances/B/BC.js";
import BU_qol from "@/core/instances/B/BU_qol.js";
import { register } from "@/core/instances/instance-init.js";
import Progress from "@/core/instances/Progress/Progress.js";
import Dec from "@/core/main/Dec.js";
import { type Player, TabId } from "@/core/main/defines.js";
import { add_global_message } from "@/core/main/global-messages.js";
import { BuyMode, SignSetting } from "@/core/main/settings.js";
import { A_text, br, fixed_width, type FormattedText } from "@/util/format.js";
import Decimal from "break_eternity.js";
import { range } from "lodash";
import { ref } from "vue";

const A = {
    automation: {
        auto_sign: {
            get unlocked(): boolean {
                return window.player.A.auto_sign.unlocked;
            },
            set unlocked(value: boolean) {
                window.player.A.auto_sign.unlocked = value;
            },
            get enabled(): boolean {
                return window.player.A.auto_sign.enabled;
            },
            set enabled(value: boolean) {
                window.player.A.auto_sign.enabled = value;
            },

            buyable(): boolean {
                return Ap.amount.gte(1e4);
            },

            buy() {
                if (!A.automation.auto_sign.buyable()) return;

                A.automation.auto_sign.unlocked = true;
                A.automation.auto_sign.enabled = true;
                Progress.unlock_tab(TabId.AUTOMATION);
            },

            unlock_message(): FormattedText {
                return ["解锁自动签到", br(), "需要 ", A_text(Dec.d1e4), " ", Ap.formatted_name()];
            },

            auto_sign_description(): FormattedText {
                if (!A.automation.auto_sign.unlocked) {
                    return "自动签到未解锁.";
                }
                if (!A.automation.auto_sign.enabled) {
                    return "自动签到已禁用.";
                }
                let next_sign_message: FormattedText;
                if (At.sign_speed().gt(10)) {
                    next_sign_message = null;
                } else {
                    next_sign_message = [" 下次自动签到时间: ", fixed_width(A.time_to_next_sign_ms(), 'width-30'), "毫秒."];
                }
                return [
                    "正在自动签到, 当前速度: ", At.sign_speed(), "/秒.", next_sign_message, br(),
                    "每个 ", At.formatted_name(), " 将签到速度提升 ×", Atu.sign_speed_per_At(), ".",
                ];
            },

            setting_description(): FormattedText {
                return "自动签到";
            },

            enable_button_text(): FormattedText {
                if (A.automation.auto_sign.enabled) {
                    return "开启";
                } else {
                    return "关闭";
                }
            },
        },
    },

    // sign

    manual_sign() {
        if (!range(1, 9).some((layer) => Ai(layer).bought.gt(0))) {
            add_global_message({
                type: 'alert',
                message_text: ["请先购买 ", Ai(1).formatted_name(), " 再签到!"],
            });
            return;
        }
        A.run_sign();
    },

    run_sign(count: Decimal = Dec.d1) {
        let result = Ap.amount.add(Ap.generated_per_sign().mul(count));

        if (BC.running !== undefined && BC.running.label <= 8) {
            result = result.min(B.buy_threshold());
        }

        Ap.amount = result;

        for (let layer = 1; layer <= 8; layer++) {
            Ai(layer).amount = Ai(layer).amount.add(Ai(layer).generated_per_sign().mul(count));
        }
    },

    sign_visible(): boolean {
        switch (window.player.settings.sign_setting) {
            case SignSetting.DEFAULT: {
                return !(A.automation.auto_sign.unlocked && At.sign_speed().gt(10));
            }
            case SignSetting.ALWAYS: {
                return true;
            }
            case SignSetting.NEVER: {
                return !A.automation.auto_sign.unlocked;
            }
        }
    },

    // game loop

    last_sign_duration: ref(0),

    time_to_next_sign_ms(): number {
        if (!A.automation.auto_sign.unlocked) return Infinity;
        if (At.sign_speed().gt(1000)) return 0;
        return Math.floor(1000 / At.sign_speed().toNumber() - A.last_sign_duration.value * 1000);
    },

    runGameLoop_sign(duration: number) {
        if (!A.automation.auto_sign.unlocked || !A.automation.auto_sign.enabled) {
            A.last_sign_duration.value = 0;
            return;
        }
        A.last_sign_duration.value += duration;
        let count = At.sign_speed().times(A.last_sign_duration.value);
        if (count.lt(20)) {
            count = count.floor();
            A.last_sign_duration.value -= count.div(At.sign_speed()).toNumber();
        } else {
            A.last_sign_duration.value = 0;
        }
        A.run_sign(count);
    },

    runGameLoop_auto_buy(duration: number) {
        for (let layer = 1; layer <= 8; ++layer) {
            if (Ai(layer).automation.unlocked && Ai(layer).automation.enabled) {
                Ai(layer).buy(Ai(layer).automation.mode);
            }
        }
        if (At.automation.unlocked && At.automation.enabled) {
            At.buy(At.automation.mode);
        }
        if (Atu.automation.unlocked && Atu.automation.enabled) {
            function Atu_enabled_buy_setting(): boolean {
                if (!Atu.automation.settings.use_limit) return true;
                return Atu.bought.lt(Atu.automation.settings.limit);
            }

            if (Atu_enabled_buy_setting()) {
                Atu.buy();
            }
        }
        if (As.automation.unlocked && As.automation.enabled) {
            function As_enabled_buy_setting(): boolean {
                if (!As.automation.settings.use_limit) return true;
                if (As.automation.settings.use_no_limit_above_Atu &&
                    Atu.bought.gte(As.automation.settings.no_limit_above_Atu)) return true;
                return As.bought.lt(As.automation.settings.limit);
            }

            if (As_enabled_buy_setting()) {
                As.buy();
            }
        }
    },

    runGameLoop(duration: number) {
        A.runGameLoop_auto_buy(duration);
        A.runGameLoop_sign(duration);
    },

    // formatted text

    formatted_name(): FormattedText {
        return A_text("A");
    },

    sign_message(): FormattedText {
        return "签到";
    },
};

export default A;

declare global {
    interface Window {
        A: typeof A;
    }
}

register('A', {
    init() {
        window.A = A;
    },
});