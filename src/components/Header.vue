<script lang="ts" setup>
import { generated_per_second, generated_per_sign } from "@/core/main/A.ts";
import { format } from "@/visual/format.ts";

let player = window.player;
</script>

<template>
  <div class="header">
    <div class="header-A-text">
      你有 <span class="A-text A-amount">{{ format(player.A.Ap) }}</span> 个 <span class="A-text">A</span>.
    </div>
    <div class="header-A-inc-text">
      <span v-if="player.A.At_unlocked">
        +{{ format(generated_per_second(1)) }}/s
      </span>
      <span v-else>
        +{{ format(generated_per_sign(1)) }}
      </span>
    </div>
    <div class="header-endgame-text">
      当前版本终局: 1.79e308 A
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-A-text {
  text-align: center;
  font-size: 25px;
  margin-top: 15px;
}

.A-amount {
  font-size: 30px;
}

.header-A-inc-text {
  text-align: center;
  font-size: 15px;
}
</style>