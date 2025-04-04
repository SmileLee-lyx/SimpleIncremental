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

    <template v-for="i in range(0, 8)">
      <br v-if="i % 4 === 0">
      <UpgradeButton
          :unlocked="BU(i).unlocked"
          :buyable="BU(i).buyable"
          :fully_bought="BU(i).bought"
          :buy="BU(i).buy"
          :extra_classes="'B-button'"
      >
        <template #text>
          <TextFormatter :text="BU(i).buy_button_text()"/>
        </template>
      </UpgradeButton>
    </template>
  </div>
</template>

<style scoped>

</style>