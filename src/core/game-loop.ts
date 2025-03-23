import { runGameLoop as A_runGameLoop } from "@/core/main/A.ts";
import Decimal from "break_eternity.js";

// durationMs is in millisecond
export function gameLoop(durationMs: number) {
    let true_duration = durationMs * window.game.GLOBAL_SPEED;
    if (true_duration < 0) {
        return;
    }
    let ticks;
    if (true_duration < 5) {
        ticks = Math.ceil(true_duration);
    } else {
        ticks = 5;
    }
    for (let i = 0; i < ticks; i++) {
        runGameLoop(true_duration / ticks / 1000);
    }
}

function runGameLoop(duration: number) {
    A_runGameLoop(duration);

    if (window.player.A.Ap.gte(Decimal.dNumberMax)) {
        if (!window.player.progress.endgame) {
            window.player.progress.endgame = true;
            window.player.progress.end_time = performance.now();
        }
    }
}