<script setup lang="ts">
import { defaultPlayer } from "@/core/defines.ts";
import type { Player } from "@/core/typing.ts";
import { assign, cloneDeep, merge } from "lodash";

import "@/assets/main.scss";

let player = window.player

function continue_game() {
  player.progress.endgame_continue = true;
}

function restart_game() {
  let defaultCopy = cloneDeep(defaultPlayer);
  assign(player, defaultCopy);
}
</script>

<template>
  <div v-if="player.progress.endgame &&! player.progress.endgame_continue" class="message-window">
    <h3>恭喜你，游戏胜利！</h3>
    <button class="message-button" @click="continue_game()">继续玩</button>
    <button class="message-button" @click="restart_game()">重新开始</button>
  </div>
</template>

<style scoped>

</style>