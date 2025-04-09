<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import B from "@/core/instances/B/B.js";
import BU from "@/core/instances/B/BU.js";
import { range } from "lodash";
</script>

<template>
  <div class="main-text">
    <TextFormatter :text="BU.description()"/>

    <template v-if="BU.Bp_mult.unlocked()">
      <br>
      <UpgradeButton
          :unlocked="BU.Bp_mult.unlocked"
          :buyable="BU.Bp_mult.buyable"
          :buy="BU.Bp_mult.buy"
          :has_tooltip="true"
          :extra_classes="'B-button'"
      >
        <template #text>
          <TextFormatter :text="BU.Bp_mult.buy_button_message()"/>
        </template>
        <template #tooltip>
          <TextFormatter :text="BU.Bp_mult.tooltip_text()"/>
        </template>
      </UpgradeButton>
    </template>

    <template v-for="i in range(0, BU.visible_amount())">
      <br v-if="i % 4 === 0">
      <UpgradeButton
          :unlocked="BU(i).unlocked"
          :buyable="BU(i).buyable"
          :fully_bought="BU(i).bought"
          :buy="BU(i).buy"
          :extra_classes="'B-button'"
      >
        <template #text>
          <TextFormatter :text="BU(i).buy_button_message()"/>
        </template>
      </UpgradeButton>
    </template>
    <br>
    <TextFormatter :text="BU.next_unlock_description()"/>
  </div>
</template>

<style scoped>

</style>