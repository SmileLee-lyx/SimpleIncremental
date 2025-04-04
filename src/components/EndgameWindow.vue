<script lang="ts" setup>
import { fullReset } from "@/core/main/full-reset.js";

import "@/assets/main.scss";
import { ref, type Ref, watch } from "vue";
import Progress from "../core/instances/Progress/Progress.js";

let player = window.player;

function continue_game() {
  show.value = false;
}

function restart_game() {
  fullReset();
  show.value = false;
}

function formatGameTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds);
  const days = Math.floor(totalSeconds / 86400);
  const remainingAfterDays = totalSeconds % 86400;
  const hours = Math.floor(remainingAfterDays / 3600);
  const remainingSeconds = remainingAfterDays % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${ days }天`);
  parts.push(
      `${ hours.toString().padStart(2, '0') }小时`,
      `${ minutes.toString().padStart(2, '0') }分钟`,
      `${ seconds.toString().padStart(2, '0') }秒`,
  );

  return parts.join('');
}

let show: Ref<boolean> = ref(false);

watch(() => window.player.progress.endgame, (value) => {
  if (value) show.value = true;
});
</script>

<template>
  <div v-if="show" class="message-window">
    <h3>恭喜你，游戏胜利！</h3>
    <div style="text-align: center">你的用时: {{ formatGameTime(Progress.Game.real_time) }}</div>
    <div v-if="player.progress.used_cheat">你使用了作弊功能.</div>
    <div>
      <button class="message-button" @click="continue_game()">继续玩</button>
      <button class="message-button" @click="restart_game()">重新开始</button>
    </div>
  </div>
</template>

<style scoped>

</style>