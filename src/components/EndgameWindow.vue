<script setup lang="ts">
import { defaultPlayer } from "@/core/defines.ts";
import { merge } from "lodash";

import "@/assets/main.scss";

function continue_game() {
  window.player.endgame_continue = true;
}

function restart_game() {
  merge(window.player, defaultPlayer);
}
</script>

<template>
  <div class="message-window">
    <h3>恭喜你，游戏胜利！</h3>
    <button class="message-button" @click="continue_game()">继续玩</button>
    <button class="message-button" @click="restart_game()">重新开始</button>
  </div>
</template>

<style scoped>

</style>