import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
import Bq from "@/core/instances/B/Bq.js";
import { register } from "@/core/instances/instance-init.js";
import Settings from "@/core/instances/Settings/Settings.js";
import { require_confirm } from "@/core/main/confirmation.js";
import Dec from "@/core/main/Dec.js";
import { add_global_message } from "@/core/main/global-messages.js";
import { B_text, br, type FormattedText, small } from "@/util/format.js";
import { assignWithProperty } from "@/util/merge.js";
import type Decimal from "break_eternity.js";

function _BC(label: number) {
    if (label <= 0 || label > 8 || !Number.isInteger(label)) throw new RangeError("invalid index");
    const index = label - 1;

    return {
        get completions(): Decimal {
            while (index >= window.player.B.BC_completions.length) {
                window.player.B.BC_completions.push(Dec.d0);
            }
            return window.player.B.BC_completions[index];
        },
        set completions(value: Decimal) {
            window.player.B.BC_completions[index] = value;
        },

        max_completions(): Decimal {
            switch (label) {
                case 1:
                case 2:
                case 3:
                case 4:
                    return Dec.d3;
                default:
                    return Dec.d0;
            }
        },

        gained_Bq(): Decimal {
            let completions = BC(label).completions;
            return completions.add(completions.div(3).floor());
        },

        effect(count: Decimal): Decimal {
            switch (label) {
                case 1:
                    return Dec.d10.pow(count.mul(60).add(280));
                case 4:
                    return Dec.d1_11.mul(Dec.d1_04.pow(count.neg()));
                default:
                    return Dec.d0;
            }
        },

        running(): boolean {
            return BC.running !== undefined && BC.running.label === label;
        },

        running_amount(): Decimal {
            if (BC.running === undefined || BC.running.label !== label) {
                return Dec.d0;
            } else {
                return BC.running.amount;
            }
        },

        running_effect(): Decimal {
            if (!BC(label).running()) throw new Error("not running");
            return BC(label).effect(BC.running!!.amount);
        },

        exit() {
            if (!BC(label).running()) return;
            BC.running = undefined;
            B.run_reset();
        },

        manual_exit(no_confirm: boolean = false) {
            require_confirm(
                !no_confirm && Settings.confirmation_setting.enter_BC,
                BC(label).exit_confirmation_message,
                BC(label).exit,
            );
        },

        start(completions: Decimal) {
            if (BC.running !== undefined) return;
            B.force_buy_or_reset();
            BC.running = {
                label,
                amount: completions,
            };
        },

        manual_start(completions: Decimal, no_confirm: boolean = false) {
            require_confirm(
                !no_confirm && Settings.confirmation_setting.enter_BC,
                () => BC(label).start_confirmation_message(completions),
                () => BC(label).start(completions),
            );
        },

        start_multi(completions: Decimal) {
            if (!BC(label).running()) return;
            if (!BC.allow_multi_completion()) return;
            BC.running = {
                label,
                amount: completions,
            };
            B.run_reset();
        },

        manual_start_multi(completions: Decimal, no_confirm: boolean = false) {
            require_confirm(
                !no_confirm && Settings.confirmation_setting.enter_BC,
                () => BC(label).start_multi_confirmation_message(completions),
                () => BC(label).start(completions),
            );
        },

        start_max() {
            if (BC.running !== undefined) return;
            BC.running = {
                label,
                amount: BC(label).max_completions(),
            };
            B.run_reset();
        },

        manual_start_max(no_confirm: boolean = false) {
            require_confirm(
                !no_confirm && Settings.confirmation_setting.enter_BC,
                () => BC(label).start_max_confirmation_message(),
                BC(label).start_max,
            );
        },

        start_button() {
            if (BC.running === undefined) {
                const completions = BC(label).completions;
                if (completions.eq(BC(label).max_completions())) {
                    BC(label).manual_start_max();
                } else {
                    BC(label).manual_start(completions.add(1));
                }
            } else if (BC.running.label === label) {
                if (!BC.allow_multi_completion()) {
                    add_global_message({
                        type: 'alert',
                        message_text: BC(label).cannot_start_multi_alert_message(),
                    });
                } else if (BC.running.amount.eq(BC(label).max_completions())) {
                    add_global_message({
                        type: 'alert',
                        message_text: BC(label).start_multi_max_alert_message(),
                    });
                } else {
                    BC(label).start_multi(BC.running.amount.add(1));
                }
            } else {
                add_global_message({
                    type: 'alert',
                    message_text: BC(label).in_another_challenge_alert_message(),
                });
            }
        },

        formatted_name(): FormattedText {
            return B_text(["BC", label]);
        },

        descriptions: {
            completion(): FormattedText {
                return [
                    "当前完成次数: ", B_text([BC(label).completions, "/", BC(label).max_completions()]),
                ];
            },
            next_effect(): FormattedText {
                return [
                    "下一级别效果: ", BC(label).effect(BC(label).completions.add(1)),
                ];
            },
            running_amount(): FormattedText {
                return [
                    "正在进行挑战, 挑战次数: ", B_text([BC.running!!.amount, "/", BC(label).max_completions()]),
                ];
            },
            running_effect(): FormattedText {
                return [
                    "当前效果: ", BC(label).running_effect(),
                ];
            },
            effect_and_amount(show_effect: boolean): FormattedText {
                if (BC(label).running()) {
                    return [
                        BC(label).descriptions.running_amount(),
                        show_effect ? [br(), BC(label).descriptions.running_effect()] : null,
                    ];
                } else {
                    return [
                        BC(label).descriptions.completion(),
                        show_effect ? [br(), BC(label).descriptions.next_effect()] : null,
                    ];
                }
            },
        },

        description(): FormattedText {
            switch (label) {
                case 1:
                    return [
                        "制作 ", B.formatted_name(), " 所需的 ", Ap.formatted_name(), " 提升.", br(),
                        BC(label).descriptions.effect_and_amount(true),
                    ];
                case 2: {
                    let effect_desc: FormattedText;
                    if (BC(label).running()) {
                        let amount = BC(label).running_amount().min(8).toNumber();

                        effect_desc = ["当前效果: ", Ai(9 - amount).formatted_name()];
                    } else {
                        let amount = BC(label).completions.add(1).min(8).toNumber();

                        effect_desc = ["下一级别效果: ", Ai(9 - amount).formatted_name()];
                    }
                    return [
                        "禁用最高的若干个层级的 ", Ai.formatted_name(), ".", br(),
                        Atu.formatted_name(), " 的价格相应调整.", br(),
                        BC(label).descriptions.effect_and_amount(false), br(),
                        effect_desc,
                    ];
                }
                case 3:
                    let effect_desc: FormattedText;
                    if (BC(label).running()) {
                        let amount = BC(label).running_amount().min(8).toNumber();

                        effect_desc = ["当前效果: ", Ai(amount).formatted_name()];
                    } else {
                        let amount = BC(label).completions.add(1).min(8).toNumber();

                        effect_desc = ["下一级别效果: ", Ai(amount).formatted_name()];
                    }
                    return [
                        "最低的若干个层级的", Ai.formatted_name(), " 的倍率始终为 1", br(),
                        BC(label).descriptions.effect_and_amount(false), br(),
                        effect_desc,
                    ];
                case 4:
                    return [
                        At.formatted_name(), " 的初始效果降低.", br(),
                        BC(label).descriptions.effect_and_amount(true),
                    ];
                default:
                    return null;
            }
        },

        exit_confirmation_message(): FormattedText {
            return [
                "确定要退出挑战 ", BC(label).formatted_name(), " 吗?", br(),
                "将进行一次 ", B.formatted_name(), " 级别重置.",
                small("可在设置中关闭确认信息."),
            ];
        },

        start_confirmation_message(completions: Decimal): FormattedText {
            return [
                "确定要开始挑战 ", BC(label).formatted_name(), " 吗?", br(),
                "完成次数: ", B_text([BC(label).completions, "->", completions]), br(),
                "将进行一次 ", B.formatted_name(), " 级别重置.",
                small("可在设置中关闭确认信息."),
            ];
        },

        start_multi_confirmation_message(completions: Decimal): FormattedText {
            return [
                "确定要开始更高级别的挑战 ", BC(label).formatted_name(), " 吗?", br(),
                "完成次数: ", B_text([BC(label).completions, "->", completions]), br(),
                "将进行一次 ", B.formatted_name(), " 级别重置.",
                small("可在设置中关闭确认信息."),
            ];
        },

        start_max_confirmation_message(): FormattedText {
            return [
                "挑战次数已达到上限, 确定要重新挑战 ", BC(label).formatted_name(), " 吗?", br(),
                "将进行一次 ", B.formatted_name(), " 级别重置.",
                small("可在设置中关闭确认信息."),
            ];
        },

        start_multi_max_alert_message(): FormattedText {
            return [
                "挑战次数已达到上限, 无法进行更高级别的挑战.",
            ];
        },

        cannot_start_multi_alert_message(): FormattedText {
            return [
                "无法重复进入同一个挑战!",
            ];
        },

        in_another_challenge_alert_message(): FormattedText {
            return [
                "你已在其他挑战中!",
            ];
        },
    };
}


const BC = assignWithProperty(_BC, {
    allow_multi_completion(): boolean {
        return false;
    },

    get running(): { label: number; amount: Decimal } | undefined {
        return window.player.B.running_BC;
    },

    set running(value: { label: number; amount: Decimal } | undefined) {
        window.player.B.running_BC = value;
    },

    total_completions(): Decimal {
        let result = Dec.d0;
        for (let label = 1; label <= 8; ++label) {
            result = result.add(BC(label).completions);
        }
        return result;
    },

    is_running(): boolean {
        return BC.running !== undefined;
    },

    exit() {
        if (BC.running === undefined) return;
        BC(BC.running.label).exit();
    },

    manual_exit(no_confirm: boolean = false) {
        if (BC.running === undefined) return;
        BC(BC.running.label).manual_exit(no_confirm);
    },

    description(): FormattedText {
        return [
            "在开启挑战的情况下制作 ", B.formatted_name(), " 以完成挑战.", br(),
            "前 4 个挑战中, ", Ap.formatted_name(), " 的数量无法超过完成所需数量.", br(),
            "挑战的难度并不随序号单调增加. 较难的挑战若在未购买足够的升级的情况下进行, 可能无法在合理的时间内完成.", br(),
            "完成挑战以获得 ", Bq.formatted_name(), ".",
        ];
    },

    current_challenge_description(): FormattedText {
        let current: FormattedText;
        if (BC.running === undefined) {
            current = "无";
        } else {
            current = BC(BC.running.label).formatted_name();
        }
        return ["当前正在进行挑战: ", current];
    },

    formatted_name(): FormattedText {
        return B_text("BC");
    },
});

export default BC;

declare global {
    interface Window {
        BC: typeof BC;
    }
}

register('BC', {
    init() {
        window.BC = BC;
    },
});