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
    visible?: () => boolean;
}

export enum AlertId {
    UNLOCK_A_UPGRADE,
}

export interface Game {
    current_tab: TabId;
    group_tabs: {[_ in TabGroupId]?: TabId};
    ignored_alerts: AlertId[];

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

    endgame: boolean;
    endgame_continue: boolean;
}
