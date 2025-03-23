import { SignSetting } from "@/core/settings.ts";
import { BuyMode, type Game, type Player, TabId } from "@/core/typing.ts";
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
        Ap: Decimal.dTen,
        Ai: [],
        At_unlocked: false,
        At: Decimal.dZero,
        As: Decimal.dZero,
        Atu: Decimal.dZero,
        Ai_automation: [],
        At_automation: { unlocked: false, enabled: false, buy_mode: BuyMode.BUY_ONE },
    },
    settings: {
        sign_setting: SignSetting.DEFAULT,
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

for (let i = 0; i < 8; ++i) {
    defaultPlayer.A.Ai.push({ bought: Decimal.dZero, amount: Decimal.dZero });
    defaultPlayer.A.Ai_automation.push({ unlocked: false, enabled: false, buy_mode: BuyMode.BUY_TEN });
}

export const defaultGame: Game = {
    current_tab: TabId.A,
    group_tabs: {},
    alert_tabs: new Set(),
    GLOBAL_SPEED: 1,
    show_cheat: false,

    A: {
        buy_mode: BuyMode.BUY_TEN,
    },
};

export function init_player() {
    window.player = reactive(cloneDeep(defaultPlayer));
    window.player.progress.start_time = performance.now();
}

export function init_game() {
    window.game = reactive(cloneDeep(defaultGame));
}