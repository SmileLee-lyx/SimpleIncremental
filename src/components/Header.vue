<script lang="ts" setup>
import TextFormatter from "@/components/objects/TextFormatter.vue";
import Ap from "@/core/instances/A/Ap.ts";

let player = window.player;
</script>

<template>
  <div class="header">
    <div class="main-text header-A-text">
      <TextFormatter :text="Ap.amount_message()"></TextFormatter>
    </div>
    <div class="main-text header-A-inc-text">
      <TextFormatter :text="Ap.amount_inc_message()"></TextFormatter>
    </div>
    <div class="header-endgame-text">
      当前版本终局: 1.79e308 A
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-A-text {
  font-size: 25px;
  margin-top: 15px;
}

.header-A-inc-text {
  font-size: 15px;
}
</style>