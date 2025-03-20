import Decimal, { type DecimalSource, dOne, dZero, dTen } from "@/break-eternity/break-eternity.ts";
import { type Game, type Player, TabId } from "@/core/typing.ts";
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
            amount: dTen,
            bought: dZero,
        },
        generators: [],

        auto_sign: false,
        auto_sign_speed_bought: dZero,
    },

    endgame: false,
    endgame_continue: false,
};

export const defaultGame: Game = {
    current_tab: TabId.A,
    GLOBAL_SPEED: 1,
    show_cheat: false,
};

export function init_player() {
    window.player = reactive(cloneDeep(defaultPlayer));
}

export function init_game() {
    window.game = reactive(cloneDeep(defaultGame));
}