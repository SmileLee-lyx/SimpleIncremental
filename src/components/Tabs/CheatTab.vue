<script lang="ts" setup>
import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import Ap from "@/core/instances/A/Ap.js";
import As from "@/core/instances/A/As.js";
import Atu from "@/core/instances/A/Atu.js";
import { add_global_message, add_header_message } from "@/core/main/global-messages.js";
import { A_text } from "@/util/format.js";
import Decimal from "break_eternity.js";

let game = window.game;
let player = window.player;

function modify_game_speed() {
  add_global_message({
    type: 'input_box',
    message_text: "请输入游戏速度. 该数值会被解释为 number 类型且不会被校验.",
    done: upgrade_speed,
  });
}

function upgrade_speed(speed: string) {
  let newSpeed = Number(speed);
  if (Number.isFinite(newSpeed)) {
    game.GLOBAL_SPEED = newSpeed;
  } else {
    game.GLOBAL_SPEED = 1;
  }
  player.progress.used_cheat = true;
}

function modify_Ap() {
  add_global_message({
    type: 'input_box',
    message_text: ["请输入 ", Ap.formatted_name(), " 的数量. 该数值会被解释为 Decimal 类型且不会被校验."],
    done: upgrade_Ap
  })
}

function upgrade_Ap(amount: string) {
  Ap.amount = new Decimal(amount);
  add_header_message(["已修改 ", Ap.formatted_name(), " 的数量为 ", A_text(Ap.amount)]);
  player.progress.used_cheat = true;
}

function get_free_As() {
  As.bought = As.bought.add(1);
  add_header_message(["你获得了一个 ", As.formatted_name()]);
  player.progress.used_cheat = true;
}

function get_free_Atu() {
  Atu.bought = Atu.bought.add(1);
  add_header_message(["你获得了一个 ", Atu.formatted_name()]);
  player.progress.used_cheat = true;
}

function remove_used_cheat() {
  add_header_message(["你已经移除当前存档的作弊标记."]);
  player.progress.used_cheat = false;
}

</script>

<template>
  <div class="text-box">
    <h2>作弊页面</h2>

    <div>
      使用当前页面的功能会使得存档获得作弊标记. 但你愿意的话, 也可以用本页面的按钮取消该标记.
    </div>

    <br>

    <button class="select-button" @click="modify_game_speed">修改游戏速度</button>
    <UpgradeButton
        :buy="modify_Ap">
      <template #text>
        <TextFormatter :text="['修改 ', Ap.formatted_name(), ' 的数量']"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buy="get_free_As">
      <template #text>
        <TextFormatter :text="['白嫖一个 ', As.formatted_name()]"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buy="get_free_Atu">
      <template #text>
        <TextFormatter :text="['白嫖一个 ', Atu.formatted_name()]"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buyable="() => player.progress.used_cheat"
        :buy="remove_used_cheat"
    >
      <template #text>
        去除存档作弊标记
      </template>
    </UpgradeButton>
  </div>
</template>

<style scoped>
.text-box {
  text-align: center;
}
</style>