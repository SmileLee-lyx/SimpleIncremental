import DC from "@/core/main/DC.ts";
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

export interface Player {
    A: {
        Ap: Decimal;
        Ai: { amount: Decimal, bought: Decimal }[];
        At: Decimal;
        As: Decimal;
        Atu: Decimal;

        auto_sign: { unlocked: boolean, enabled: boolean };
        Ai_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode }[];
        At_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode };
    };
    B: {
        unlocked: boolean;
        B_count: Decimal;
        Bp: Decimal;
        Bq: Decimal;
        BU_bits: number[];
        BU_qol_bits: number[];
        BC_completions: (Decimal | null)[];
    };
    settings: {
        sign_setting: SignSetting;
        auto_save_setting: AutoSaveSetting;
    };
    stats: {
        Game: {
            real_time: number;
            game_time: Decimal;

            best_Ap: Decimal;
            best_Bp: Decimal;
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
        Ap: DC.d10,
        Ai: [
            { bought: DC.d0, amount: DC.d0 },
            { bought: DC.d0, amount: DC.d0 },
            { bought: DC.d0, amount: DC.d0 },
            { bought: DC.d0, amount: DC.d0 },
            { bought: DC.d0, amount: DC.d0 },
            { bought: DC.d0, amount: DC.d0 },
            { bought: DC.d0, amount: DC.d0 },
            { bought: DC.d0, amount: DC.d0 },
        ],
        At: DC.d0,
        As: DC.d0,
        Atu: DC.d0,
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
    },
    B: {
        unlocked: false,
        B_count: DC.d0,
        Bp: DC.d0,
        Bq: DC.d0,
        BU_bits: [0, 0],
        BU_qol_bits: [0, 0],
        BC_completions: [null, null, null, null, null, null, null, null],
    },
    settings: {
        sign_setting: SignSetting.DEFAULT,
        auto_save_setting: AutoSaveSetting.EVERY_30_SEC,
    },
    stats: {
        Game: {
            real_time: 0,
            game_time: DC.d0,

            best_Ap: DC.d0,
            best_Bp: DC.d0,
        },
        this_B: {
            real_time: 0,
            game_time: DC.d0,

            best_Ap: DC.d0,
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