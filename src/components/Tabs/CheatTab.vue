<script setup lang="ts">
import InputBox from "@/components/objects/InputBox.vue";
import { ref } from "vue";

let game = window.game;

let show_speed = ref(false);

function upgradeSpeed(speed: string) {
  let newSpeed = Number(speed);
  if (Number.isFinite(newSpeed)) {
    game.GLOBAL_SPEED = newSpeed;
  } else {
    game.GLOBAL_SPEED = 1;
  }
}

let console = window.console;
</script>

<template>
  <div class="main">
    作弊页面

    <br>

    <button @click="show_speed = true">修改游戏速度</button>

    <InputBox
        v-if="show_speed"
        type="number"
        placeholder="1"
        @done="(speed) => { upgradeSpeed(speed); show_speed = false }"
        @close="show_speed = false"
    >请输入游戏速度 (不会被校验, 后果自负).</InputBox>
  </div>
</template>

<style scoped>

</style>