<script lang="ts" setup>
import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
import {gameLoop} from "@/core/game-loop.ts"
import {format} from "../visual/visual-settings.ts";
import BuyButton from "@/components/PurchaseButton.vue";
import type {ButtonProps} from "@/components/button-typing.ts";

import "@/assets/main.scss"
import Decimal from "@/break-eternity/break-eternity.ts";
import EndgameWindow from "@/components/EndgameWindow.vue";

onMounted(() => {
  let previous_time = Date.now();

  function run() {
    let current_time = Date.now();
    let duration = current_time - previous_time;
    previous_time = current_time;
    gameLoop(duration);

    requestAnimationFrame(run);
  }

  run();
})

let player = window.player;


let buttons: ButtonProps[] = [{
  id: "buy-point",
  text: () => "获得一个点数",
  visible: () => true,
  buyable: () => true,
  buy() {
    player.points = player.points.add(1);
    player.points_bought = player.points_bought.add(1);
  },
  tooltipText:() =>
    `已购买: ${format(player.points_bought)}`
},
  {
    id: "buy-generator",
    text: () => "购买一个生成器 (10 点数)",
    visible: () => true,
    buyable: () => player.points.gte(10),
    buy() {
      player.points = player.points.sub(10)
      player.generators = player.generators.add(1);
      player.generators_bought = player.generators_bought.add(1);
    },
    tooltipText: () => `当前生成器数量: ${format(player.generators)} <br> 已购买: ${format(player.generators_bought)}`
  },]
</script>

<template>
  <div class="main">
    当前点数为 {{ format(player.points) }}.
    <br>
    <br>
    <br>
    <BuyButton v-for="b in buttons" v-bind="b"/>
  </div>
  胜利条件: 获得 1000 点数
  <EndgameWindow v-if="player.endgame &&! player.endgame_continue"></EndgameWindow>
</template>

<style scoped>
</style>
