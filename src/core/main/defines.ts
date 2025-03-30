import DC from "@/core/main/DC.ts";
import { AutoSaveSetting, SignSetting } from "@/core/main/settings.ts";
import Decimal from "break_eternity.js";
import { cloneDeep } from "lodash";
import { reactive } from "vue";

export enum TabGroupId {
    A,
    SETTINGS,
    CHEAT,
}

export enum TabId {
    A,
    A_UPGRADES,
    SETTINGS,
    CHEAT,
}

export interface TabGroupConfig {
    sideBarName: string;
}

export interface TabConfig {
    sideBarName: string;
    groupId: TabGroupId;
}

export enum AlertId {
    HIDE_SIGN,
    SHIFT,
}

export enum BuyMode {
    BUY_ONE,
    BUY_TEN,
    BUY_MAX,
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
        At_unlocked: boolean;
        At: Decimal;
        As: Decimal;
        Atu: Decimal;

        Ai_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode }[];
        At_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode };
    };
    settings: {
        sign_setting: SignSetting;
        auto_save_setting: AutoSaveSetting;
    };
    progress: {
        unlocked_tabs: TabId[];
        ignored_alerts: AlertId[];
        start_time: number;
        end_time: number;
        endgame: boolean;
        endgame_continue: boolean;
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
        At_unlocked: false,
        At: DC.d0,
        As: DC.d0,
        Atu: DC.d0,
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
    settings: {
        sign_setting: SignSetting.DEFAULT,
        auto_save_setting: AutoSaveSetting.EVERY_30_SEC,
    },
    progress: {
        unlocked_tabs: [TabId.A, TabId.SETTINGS],
        ignored_alerts: [],
        start_time: -Infinity,
        end_time: Infinity,
        endgame: false,
        endgame_continue: false,
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
    window.player.progress.start_time = performance.now();
}

export function init_game() {
    window.game = reactive(cloneDeep(defaultGame));
}