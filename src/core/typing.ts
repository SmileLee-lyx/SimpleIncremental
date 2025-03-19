import Decimal from "@/break-eternity/break-eternity.ts";

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

export interface Game {
    current_tab: TabId;

    GLOBAL_SPEED: number;
    show_cheat: boolean;
}

export interface ResourceAmount {
    amount: Decimal;
    bought: Decimal;
}

export interface Player {
    main: {
        points: ResourceAmount;

        generators: ResourceAmount[];

        generator_layer_count: Decimal;
    };

    endgame: boolean;
    endgame_continue: boolean;
}

export interface ButtonProps {
    id: string,
    visible?: () => boolean,
    buyable: () => boolean,
    buy: () => void,
    fullyBought?: () => boolean,
    extraClasses?: string[],
}