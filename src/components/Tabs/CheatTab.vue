<script lang="ts" setup>
import InputBox from "@/components/objects/InputBox.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import { ref } from "vue";

let game = window.game;
let player = window.player;

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
  <div class="text-box">
    作弊页面

    <br>

    <button class="select-button" @click="show_speed = true">修改游戏速度</button>
    <UpgradeButton
        :buy="() => player.A.As = player.A.As.plus(1)">
      <template #text>白嫖一个 <span class="A-text">A<sub>*</sub></span></template>
    </UpgradeButton>
    <UpgradeButton
        :buy="() => player.A.Atu = player.A.Atu.plus(1)">
      <template #text>白嫖一个 <span class="A-text">A<sub>tu</sub></span></template>
    </UpgradeButton>

    <InputBox
        v-if="show_speed"
        placeholder="1"
        type="number"
        @close="show_speed = false"
        @done="(speed) => { upgradeSpeed(speed); show_speed = false }"
    >请输入游戏速度 (不会被校验, 后果自负).
    </InputBox>
  </div>
</template>

<style scoped>
.text-box {
  text-align: center;
}
</style>