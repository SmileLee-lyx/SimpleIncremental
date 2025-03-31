import { defaultPlayer, TabId } from "@/core/main/defines.js";
import { cloneDeep } from "lodash";

export function fullReset() {
    Object.assign(window.player, cloneDeep(defaultPlayer));

    if (window.game.show_cheat) {
        window.player.progress.unlocked_tabs.push(TabId.CHEAT);
    }
}