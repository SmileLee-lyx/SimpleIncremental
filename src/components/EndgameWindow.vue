<script setup lang="ts">
import {merge} from "lodash";
import {defaultPlayer} from "@/core/player.ts";

import "@/assets/endgame.scss"

function continue_game() {
  window.player.endgame_continue = true
}

function restart_game() {
  merge(window.player, defaultPlayer);
}
</script>

<template>
  <div class="endgame-window">
    <h3>恭喜你，游戏胜利！</h3>
    <button class="endgame-button" @click="continue_game()">继续玩</button>
    <button class="endgame-button" @click="restart_game()">重新开始</button>
  </div>
</template>

<style scoped>

</style>