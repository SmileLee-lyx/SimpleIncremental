<script lang="ts" setup>
import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import As from "@/core/instances/A/As.js";
import Atu from "@/core/instances/A/Atu.js";
import { add_global_message } from "@/core/main/global-messages.js";

let game = window.game;
let player = window.player;

function modify_game_speed() {
  add_global_message({
    type: 'input_box',
    message_text: "请输入游戏速度. 该数值会被解释为 number 类型且不会被校验.",
    done: upgradeSpeed,
  });
}

function upgradeSpeed(speed: string) {
  let newSpeed = Number(speed);
  if (Number.isFinite(newSpeed)) {
    game.GLOBAL_SPEED = newSpeed;
  } else {
    game.GLOBAL_SPEED = 1;
  }
}

</script>

<template>
  <div class="text-box">
    作弊页面

    <br>

    <button class="select-button" @click="modify_game_speed">修改游戏速度</button>
    <UpgradeButton
        :buy="() => player.A.As = player.A.As.plus(1)">
      <template #text>
        <TextFormatter :text="['白嫖一个 ', As.formatted_name()]"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buy="() => player.A.Atu = player.A.Atu.plus(1)">
      <template #text>
        <TextFormatter :text="['白嫖一个 ', Atu.formatted_name()]"/>
      </template>
    </UpgradeButton>
  </div>
</template>

<style scoped>
.text-box {
  text-align: center;
}
</style>