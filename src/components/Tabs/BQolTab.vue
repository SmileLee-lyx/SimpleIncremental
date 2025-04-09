<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import BU from "@/core/instances/B/BU.js";
import BU_qol from "@/core/instances/B/BU_qol.js";
import { range } from "lodash";
</script>

<template>

  <div class="main-text">
    <TextFormatter :text="BU_qol.description()"></TextFormatter>

    <template v-for="i in range(0, 12)">
      <br v-if="i % 4 === 0">
      <UpgradeButton
          :unlocked="BU_qol(i).unlocked"
          :buyable="BU_qol(i).buyable"
          :fully_bought="BU_qol(i).bought"
          :buy="BU_qol(i).buy"
          :extra_classes="'B-button'"
      >
        <template #text>
          <TextFormatter :text="BU_qol(i).buy_button_message()"/>
        </template>
      </UpgradeButton>
    </template>
  </div>
</template>

<style scoped>

</style>