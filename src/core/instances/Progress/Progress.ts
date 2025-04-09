import { register } from "@/core/instances/instance-init.js";
import Dec from "@/core/main/Dec.js";
import type { TabId } from "@/core/main/defines.js";
import type Decimal from "break_eternity.js";

const Progress = {
    // cannot set
    get player_meta(): string {
        return window.player.progress.meta;
    },

    Game: {
        get real_time(): number {
            return window.player.stats.Game.real_time;
        },
        set real_time(value: number) {
            window.player.stats.Game.real_time = value;
        },

        get game_time(): Decimal {
            return window.player.stats.Game.game_time;
        },
        set game_time(value: Decimal) {
            window.player.stats.Game.game_time = value;
        },
    },

    this_B: {
        get real_time(): number {
            return window.player.stats.this_B.real_time;
        },
        set real_time(value: number) {
            window.player.stats.this_B.real_time = value;
        },

        get game_time(): Decimal {
            return window.player.stats.this_B.game_time;
        },
        set game_time(value: Decimal) {
            window.player.stats.this_B.game_time = value;
        },

        reset() {
            Progress.this_B.real_time = 0;
            Progress.this_B.game_time = Dec.d0;
        },
    },

    accumulate_real_time(period: number) {
        Progress.Game.real_time += period;
        Progress.this_B.real_time += period;
    },

    accumulate_game_time(period: Decimal) {
        Progress.Game.game_time = Progress.Game.game_time.add(period);
        Progress.this_B.game_time = Progress.this_B.game_time.add(period);
    },

    get endgame(): boolean {
        return window.player.progress.endgame;
    },
    set endgame(value: boolean) {
        window.player.progress.endgame = value;
    },
    get unlocked_tabs(): TabId[] {
        return window.player.progress.unlocked_tabs;
    },
    set unlocked_tabs(value: TabId[]) {
        window.player.progress.unlocked_tabs = value;
    },

    tab_unlocked(tab: TabId): boolean {
        return Progress.unlocked_tabs.includes(tab);
    },

    unlock_tab(...tabs: TabId[]) {
        for (let tab of tabs) {
            if (!Progress.unlocked_tabs.includes(tab)) {
                Progress.unlocked_tabs.push(tab);
            }
        }
    },
};

export default Progress;

declare global {
    interface Window {
        Progress: typeof Progress;
    }
}

register('Progress', {
    init() {
        window.Progress = Progress;
    },
});