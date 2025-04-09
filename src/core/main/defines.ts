import Dec from "@/core/main/Dec.ts";
import { AlertId, AutoSaveSetting, BuyMode, SignSetting } from "@/core/main/settings.ts";
import type { FormattedText } from "@/util/format.js";
import Decimal from "break_eternity.js";
import { cloneDeep } from "lodash";
import { reactive } from "vue";

export enum TabGroupId {
    AUTOMATION = 0,

    A = 1000,
    B,

    ACHIEVEMENTS = 2000,
    SETTINGS,
    CHEAT,
    STATS,
}

export enum TabId {
    AUTOMATION = 0,

    A = 1000,
    A_UPGRADES,
    B,
    B_UPGRADES,
    B_QOL,
    B_CHALLENGES,

    ACHIEVEMENTS = 2000,
    SETTINGS,
    CHEAT,
    STATS,
}

export interface TabGroupConfig {
    sideBarName: FormattedText;
}

export interface TabConfig {
    sideBarName: FormattedText;
    groupId: TabGroupId;
}

export interface Game {
    current_tab: TabId;
    group_tabs: { [_ in TabGroupId]?: TabId };
    alert_tabs: Set<TabId>;

    GLOBAL_SPEED: number;
    show_cheat: boolean;

    A: {
        Ai_buy_mode: BuyMode;
        At_buy_mode: BuyMode;
    };

    last_auto_save: number | null;
}

export interface ConfirmationSettings {
    buy_As: boolean;
    buy_Atu: boolean;
    buy_B: boolean;
    enter_BC: boolean;
}

export interface AnimationSettings {
    buy_B: boolean;
}

export interface AsBuySettings {
    use_limit: boolean;
    limit: Decimal;
    use_no_limit_above_Atu: boolean;
    no_limit_above_Atu: Decimal;
}

export interface AtuBuySettings {
    use_limit: boolean;
    limit: Decimal;
}

export interface BBuySettings {
    threshold_B: Decimal;
}

export interface Player {
    A: {
        Ap: Decimal;
        Ai: { amount: Decimal, bought: Decimal }[];
        At: Decimal;
        As: Decimal;
        Atu: Decimal;

        auto_sign: { unlocked: boolean; enabled: boolean; };
        Ai_automation: { unlocked: boolean; enabled: boolean; buy_mode: BuyMode; }[];
        At_automation: { unlocked: boolean; enabled: boolean; buy_mode: BuyMode; };
        As_automation: {
            unlocked: boolean; enabled: boolean;
            buy_settings: AsBuySettings;
        };
        Atu_automation: {
            unlocked: boolean; enabled: boolean;
            buy_settings: AtuBuySettings;
        };
    };
    B: {
        unlocked: boolean;
        B_count: Decimal;
        Bp: Decimal;
        Bp_mult_bought: Decimal;
        BU_bits: number[];
        BU_count: Decimal[];
        BU_qol_bits: number[];
        BC_completions: Decimal[];
        running_BC?: { label: number; amount: Decimal; };

        B_automation: {
            unlocked: boolean; enabled: boolean;
            buy_settings: BBuySettings
        };
    };
    settings: {
        sign_setting: SignSetting;
        auto_save_setting: AutoSaveSetting;
        confirmation_setting: ConfirmationSettings;
        animation_setting: AnimationSettings;
    };
    stats: {
        Game: {
            real_time: number;
            game_time: Decimal;

            best_Ap: Decimal;
            best_Bp: Decimal;
            best_B_time: Decimal;
            best_Bp_speed: Decimal;
        }
        this_B: {
            real_time: number;
            game_time: Decimal;

            best_Ap: Decimal;
        }
    };
    progress: {
        meta: string;
        unlocked_tabs: TabId[];
        ignored_alerts: AlertId[];
        used_cheat: boolean;
        endgame: boolean;
    };
}

declare global {
    interface Window {
        game: Game;
        defaultGame: Game;
        player: Player;
        defaultPlayer: Player;
    }
}

export const defaultPlayer: Readonly<Player> = {
    A: {
        Ap: Dec.d10,
        Ai: [
            { bought: Dec.d0, amount: Dec.d0 },
            { bought: Dec.d0, amount: Dec.d0 },
            { bought: Dec.d0, amount: Dec.d0 },
            { bought: Dec.d0, amount: Dec.d0 },
            { bought: Dec.d0, amount: Dec.d0 },
            { bought: Dec.d0, amount: Dec.d0 },
            { bought: Dec.d0, amount: Dec.d0 },
            { bought: Dec.d0, amount: Dec.d0 },
        ],
        At: Dec.d0,
        As: Dec.d0,
        Atu: Dec.d0,
        auto_sign: { unlocked: false, enabled: false },
        Ai_automation: [
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
            { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN },
        ],
        At_automation: { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_ONE },
        As_automation: {
            unlocked: false, enabled: false,
            buy_settings: {
                use_limit: false,
                limit: Dec.d0,
                use_no_limit_above_Atu: false,
                no_limit_above_Atu: Dec.d0,
            },
        },
        Atu_automation: {
            unlocked: false, enabled: false,
            buy_settings: {
                use_limit: false,
                limit: Dec.d0,
            },
        },
    },
    B: {
        unlocked: false,
        B_count: Dec.d0,
        Bp: Dec.d0,
        Bp_mult_bought: Dec.d0,
        BU_bits: [],
        BU_count: [],
        BU_qol_bits: [],
        BC_completions: [],

        B_automation: {
            unlocked: false, enabled: false,
            buy_settings: {
                threshold_B: Dec.d0,
            },
        },
    },
    settings: {
        sign_setting: SignSetting.DEFAULT,
        auto_save_setting: AutoSaveSetting.EVERY_30_SEC,
        confirmation_setting: {
            buy_As: true,
            buy_Atu: true,
            buy_B: true,
            enter_BC: true,
        },
        animation_setting: {
            buy_B: true,
        },
    },
    stats: {
        Game: {
            real_time: 0,
            game_time: Dec.d0,

            best_Ap: Dec.d0,
            best_Bp: Dec.d0,
            best_B_time: Dec.dInf,
            best_Bp_speed: Dec.d0,
        },
        this_B: {
            real_time: 0,
            game_time: Dec.d0,

            best_Ap: Dec.d0,
        },
    },
    progress: {
        meta: '',
        unlocked_tabs: [TabId.A, TabId.SETTINGS, TabId.ACHIEVEMENTS],
        ignored_alerts: [],
        used_cheat: false,
        endgame: false,
    },
};

export const defaultGame: Game = {
    current_tab: TabId.A,
    group_tabs: {},
    alert_tabs: new Set(),
    GLOBAL_SPEED: 1,
    show_cheat: false,

    A: {
        Ai_buy_mode: BuyMode.BUY_TEN,
        At_buy_mode: BuyMode.BUY_ONE,
    },

    last_auto_save: null,
};

window.defaultGame = defaultGame;
window.defaultPlayer = defaultPlayer;

export function init_player() {
    window.player = reactive(cloneDeep(defaultPlayer));
}

export function init_game() {
    window.game = reactive(cloneDeep(defaultGame));
}