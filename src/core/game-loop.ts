declare global {
    interface Window {
        GLOBAL_SPEED: number
    }
}

if (window.GLOBAL_SPEED === undefined) {
    window.GLOBAL_SPEED = 1
}

// durationMs is in millisecond
export function gameLoop(durationMs: number) {
    let true_duration = durationMs * window.GLOBAL_SPEED;
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
    let player = window.player
    player.points = player.points.plus(player.generators.times(duration))

    if (player.points.gte(1000)) {
        player.endgame = true;
    }
}