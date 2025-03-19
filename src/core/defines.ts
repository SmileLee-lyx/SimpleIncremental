import Decimal, { type DecimalSource, dZero } from "@/break-eternity/break-eternity.ts";
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
    main: {
        points: {
            amount: dZero,
            bought: dZero,
        },
        generators: [],

        generator_layer_count: dZero,
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