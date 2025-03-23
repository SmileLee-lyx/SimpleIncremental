import type { SignSetting } from "@/core/settings.ts";
import Decimal from "break_eternity.js";

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
        buy_mode: BuyMode;
    };
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