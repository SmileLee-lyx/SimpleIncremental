<script setup lang="ts">
import { format } from "@/visual/format.ts";

let player = window.player
</script>

<template>
  <div class="header">
    <div class="header-A-text">
      你有 <span class="A-text A-amount">{{format(player.A.points.amount)}}</span> 个 <span class="A-text">A</span>.
    </div>
    <div class="header-endgame-text">
      当前胜利条件: 1e30 A
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-A-text {
  text-align: center;
  font-size: 25px;
  margin-top: 15px;
}

.A-amount {
  font-size: 30px;
}

.header-endgame-text {
  text-align: center;
  font-size: 15px;
}
</style>