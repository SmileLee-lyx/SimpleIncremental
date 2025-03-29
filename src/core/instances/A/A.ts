import DC from "@/core/DC.js";
import { BuyMode } from "@/core/defines.js";
import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import At from "@/core/instances/A/At.js";
import { register } from "@/core/instances/instance-init.js";
import { SignSetting } from "@/core/settings.js";
import type { FormattedText } from "@/util/format.js";
import Decimal from "break_eternity.js";
import { ref } from "vue";

function _automation_Ai(layer: number) {
    if (layer <= 0 || layer > 8) throw RangeError("Invalid layer");

    return {
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
    };
}

const A = {
    automation: {
        Ai: _automation_Ai,
        At: {
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
        },
    },

    // sign

    sign() {
        A.run_sign();
    },

    run_sign(count: Decimal = DC.d1) {
        Ap.amount = Ap.amount.add(Ap.generated_per_sign().mul(count));
        for (let layer = 1; layer <= 8; layer++) {
            Ai(layer).amount = Ai(layer).amount.add(Ai(layer).generated_per_sign().mul(count));
        }
    },

    sign_visible(): boolean {
        switch (window.player.settings.sign_setting) {
            case SignSetting.DEFAULT: {
                if (At.unlocked && At.sign_speed().gte("5")) {
                    window.player.settings.sign_setting = SignSetting.NEVER;
                    // show_sign_setting_alert.value = true;
                    return false;
                }
                return true;
            }
            case SignSetting.WHEN_SLOW: {
                return !At.unlocked || At.sign_speed().lt(5);
            }
            case SignSetting.ALWAYS: {
                return true;
            }
            case SignSetting.NEVER: {
                return !At.unlocked;
            }
        }
    },

    // game loop

    last_sign_duration: ref(0),

    time_to_next_sign_ms(): number {
        if (!At.unlocked) return Infinity;
        if (At.sign_speed().gt(1000)) return 0;
        return Math.floor(1000 / At.sign_speed().toNumber() - A.last_sign_duration.value * 1000);
    },

    runGameLoop_sign(duration: number) {
        if (!At.unlocked) {
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
            if (A.automation.Ai(layer).unlocked && A.automation.Ai(layer).enabled) {
                Ai(layer).buy(BuyMode.BUY_TEN);
            }
        }
        if (A.automation.At.unlocked && A.automation.At.enabled) {
            At.buy(BuyMode.BUY_ONE);
        }
    },

    runGameLoop(duration: number) {
        A.runGameLoop_auto_buy(duration);
        A.runGameLoop_sign(duration);
    },

    // formatted text
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

export function init() {
    window.A = A;
}

register('A', { init: init });