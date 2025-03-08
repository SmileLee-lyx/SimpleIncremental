import Decimal from "@/break-eternity/break-eternity.ts";
import {reactive} from "vue";
import {cloneDeep, merge} from "lodash";

export interface Player {
    points: Decimal;
    points_bought: Decimal;
    generators: Decimal;
    generators_bought: Decimal;

    endgame: boolean;
    endgame_continue: boolean
}

declare global {
    interface Window {
        player: Player;
    }
}

export const defaultPlayer: Readonly<Player> = {
    points: new Decimal(0),
    points_bought: new Decimal(0),
    generators: new Decimal(0),
    generators_bought: new Decimal(0),

    endgame: false,
    endgame_continue: false,
};

export function init_player() {
    window.player = reactive(cloneDeep(defaultPlayer));
}