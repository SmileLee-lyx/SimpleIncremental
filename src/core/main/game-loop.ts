import A from "@/core/instances/A/A.js";
import Progress from "@/core/instances/Progress/Progress.js";
import { AutoSaveSetting } from "@/core/main/settings.js";
import { auto_save } from "@/save/save-load.js";
import Decimal from "break_eternity.js";

export function check_auto_save() {
    let required_time: number;
    switch (window.player.settings.auto_save_setting) {
        case AutoSaveSetting.NEVER:
            return;
        case AutoSaveSetting.EVERY_5_MIN:
            required_time = 300000;
            break;
        case AutoSaveSetting.EVERY_30_SEC:
            required_time = 30000;
            break;
    }

    if (window.game.last_auto_save === null || performance.now() - window.game.last_auto_save >= required_time) {
        auto_save();
        window.game.last_auto_save = performance.now();
    }
}

// durationMs is in millisecond
export function gameLoop(durationMs: number) {
    let true_durationMs = durationMs * window.game.GLOBAL_SPEED;
    runGameLoop(true_durationMs / 1000);

    check_auto_save();
}

function runGameLoop(duration: number) {
    Progress.accumulate_real_time(duration);
    Progress.accumulate_game_time(new Decimal(duration)); // game speed is 1

    A.runGameLoop(duration);

    // if (Ap.amount.gte(Decimal.dNumberMax)) {
    //     if (!window.player.progress.endgame) {
    //         window.player.progress.endgame = true;
    //     }
    // }
}