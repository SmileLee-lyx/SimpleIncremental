<script lang="ts" setup>
import { defaultPlayer } from "@/core/defines.ts";
import { assign, cloneDeep } from "lodash";

import "@/assets/main.scss";

let player = window.player;

function continue_game() {
  player.progress.endgame_continue = true;
}

function restart_game() {
  let defaultCopy = cloneDeep(defaultPlayer);
  assign(player, defaultCopy);
}

function formatGameTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const remainingAfterDays = totalSeconds % 86400;
  const hours = Math.floor(remainingAfterDays / 3600);
  const remainingSeconds = remainingAfterDays % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}天`);
  parts.push(
      `${hours.toString().padStart(2, '0')}小时`,
      `${minutes.toString().padStart(2, '0')}分钟`,
      `${seconds.toString().padStart(2, '0')}秒`
  );

  return parts.join('');
}
</script>

<template>
  <div v-if="player.progress.endgame &&! player.progress.endgame_continue" class="message-window">
    <h3>恭喜你，游戏胜利！</h3>
    <span style="text-align: center">你的用时: {{formatGameTime(player.progress.end_time - player.progress.start_time)}}</span>
    <button class="message-button" @click="continue_game()">继续玩</button>
    <button class="message-button" @click="restart_game()">重新开始</button>
  </div>
</template>

<style scoped>

</style>