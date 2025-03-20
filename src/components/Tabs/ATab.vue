<script setup lang="ts">
import Decimal, { dTen, dZero } from "@/break-eternity/break-eternity.ts";
import PurchaseButton from "@/components/objects/PurchaseButton.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import { sign, generator_price as A_price } from "@/core/main/A.ts";
import type { ResourceAmount } from "@/core/typing.ts";
import { format } from "@/visual/format.ts";

let player = window.player;

function check_A() {
  while (player.A.generators.length < 8) {
    player.A.generators.push({ amount: dZero, bought: dZero });
  }
}

function generator(layer: number): ResourceAmount {
  check_A();
  return player.A.generators[layer-1];
}

function A_bought(layer: number): () => number {
  return function() {
    return 0;
    // return player.A.generators[layer-1].bought.mod(10).floor().toNumber();
  }
}

function A_buyable(layer: number): () => number {
  return function() {
    let bought = A_bought(layer)();
    let price = A_price(layer);
    return player.A.points.amount.div(price).floor().min(10).toNumber();
  }
}

function A_buy(layer: number): () => void {
  return function () {
    check_A();
    let buyable = A_buyable(layer)();
    generator(layer).bought = generator(layer).bought.plus(buyable);
    generator(layer).amount = generator(layer).amount.plus(buyable);
    player.A.points.amount = player.A.points.amount.sub(A_price(layer).mul(buyable));
  }
}

</script>

<template>
  <div class="text-box">
    <UpgradeButton
      :buy="sign">
      <template #text> 签到 (%sign) </template>
    </UpgradeButton>
  </div>
  <div v-for="i in 8" class="text-box">
    <PurchaseButton
        :total_amount="10" :already_bought="() => 0" :buyable_amount="A_buyable(i)" :buy="A_buy(i)"
        :has_tooltip="true">
      <template #text> 购买 A{{i}} (%buy A{{i}}) </template>
      <template #tooltip> 已购买: {{format(generator(i).bought)}} </template>
    </PurchaseButton>
    你有 <span class="A-text">{{format(generator(i).amount)}}</span> 个 <span class="A-text">A{{i}}</span>.
  </div>
</template>

<style scoped>
.text-box {
  text-align: center;
}
</style>