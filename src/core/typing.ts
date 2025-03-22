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
    UNLOCK_A_UPGRADE,
}

export interface Game {
    current_tab: TabId;
    group_tabs: {[_ in TabGroupId]?: TabId};
    alert_tabs: Set<TabId>;

    GLOBAL_SPEED: number;
    show_cheat: boolean;
}

export interface ResourceAmount {
    amount: Decimal;
    bought: Decimal;
}

export interface Player {
    A: {
        points: ResourceAmount;
        generators: ResourceAmount[];

        auto_sign: boolean;
        auto_sign_speed_bought: Decimal;
    };
    settings: {
        force_show_sign: boolean;
    }
    progress: {
        unlocked_tabs: TabId[];
        ignored_alerts: AlertId[];
        endgame: boolean;
        endgame_continue: boolean;
    }
}
