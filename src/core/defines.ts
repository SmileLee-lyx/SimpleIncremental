import { type Game, type Player, TabId } from "@/core/typing.ts";
import Decimal from "break_eternity.js";
import { cloneDeep } from "lodash";
import { reactive } from "vue";

declare global {
    interface Window {
        game: Game;
        player: Player;
    }
}

export const defaultPlayer: Readonly<Player> = {
    A: {
        points: {
            amount: Decimal.dTen,
            bought: Decimal.dZero,
        },
        generators: [],

        auto_sign: false,
        auto_sign_speed_bought: Decimal.dZero,
    },
    settings: {
        force_show_sign: false,
    },
    progress: {
        unlocked_tabs: [TabId.A, TabId.SETTINGS],
        ignored_alerts: [],
        endgame: false,
        endgame_continue: false,
    }
};

export const defaultGame: Game = {
    current_tab: TabId.A,
    group_tabs: {},
    alert_tabs: new Set(),
    GLOBAL_SPEED: 1,
    show_cheat: false,
};

export function init_player() {
    window.player = reactive(cloneDeep(defaultPlayer));
}

export function init_game() {
    window.game = reactive(cloneDeep(defaultGame));
}