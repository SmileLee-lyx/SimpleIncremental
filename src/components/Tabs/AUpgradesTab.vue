<script setup lang="ts">

import Decimal from "break_eternity.js";
import { global_now } from "@/components/misc/component-timer.ts";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import { auto_sign_speed, last_sign_duration, time_to_next_sign_ms } from "@/core/main/A.ts";
import { format } from "@/visual/format.ts";

let player = window.player

function auto_sign_buyable(): boolean {
  return player.A.points.amount.gte(1e5)
}

function auto_sign_buy() {
  player.A.auto_sign = true;
  player.A.points = { amount: Decimal.dTen, bought: Decimal.dZero };
  player.A.generators = [];
}

function auto_sign_speed_price(): Decimal {
  return Decimal.dTen.pow(player.A.auto_sign_speed_bought.plus(1));
}

function auto_sign_speed_buyable(): boolean {
  return player.A.points.amount.gte(auto_sign_speed_price())
}

function auto_sign_speed_buy() {
  player.A.auto_sign_speed_bought = player.A.auto_sign_speed_bought.plus(1);
  player.A.points = { amount: Decimal.dTen, bought: Decimal.dZero };
  player.A.generators = [];
}

</script>

<template>
  <div class="text-box">
    <template v-if="!player.A.auto_sign">
      自动签到已禁用.
    </template>
    <template v-else>
      正在自动签到, 当前速度: {{ format(auto_sign_speed()) }}, 下次签到还需 {{ time_to_next_sign_ms }}ms.
    </template>
    <br>
    <UpgradeButton
        :buyable="auto_sign_buyable"
        :fully_bought="() => player.A.auto_sign"
        :buy="auto_sign_buy">
      <template #text>
        购买自动签到, 但重置所有 A.
        <br>
        (需要 1e5 A)
      </template>
    </UpgradeButton>
    <UpgradeButton
      :visible="() => player.A.auto_sign"
      :buyable="auto_sign_speed_buyable"
      :buy="auto_sign_speed_buy">
      <template #text>
        加倍自动签到速度, 但重置所有 A.
        <br>
        (需要 {{format(auto_sign_speed_price())}} A)
      </template>
    </UpgradeButton>
  </div>
</template>

<style scoped>
  .text-box {
    text-align: center;
  }
</style>