<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import A from "@/core/instances/A/A.js";
import Ai from "@/core/instances/A/Ai.js";
import At from "@/core/instances/A/At";
</script>

<template>
  <div class="text-box">
    <br>
    <UpgradeButton
        :buy="A.automation.auto_sign.buy"
        :buyable="A.automation.auto_sign.buyable"
        :extra_classes="'A-button'"
        :fully_bought="A.automation.auto_sign.unlocked"
    >
      <template #text>
        <TextFormatter :text="A.automation.auto_sign.unlock_message()"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buy="At.automation.buy_unlock"
        :buyable="At.automation.unlock_buyable"
        :extra_classes="'A-button'"
        :fully_bought="At.automation.unlocked"
    >
      <template #text>
        <TextFormatter :text="At.automation.unlock_text()"/>
      </template>
    </UpgradeButton>
    <br>
    <template v-for="layer in 8">
      <UpgradeButton
          :buy="Ai(layer).automation.buy_unlock"
          :buyable="Ai(layer).automation.unlock_buyable"
          :extra_classes="'A-button'"
          :fully_bought="Ai(layer).automation.unlocked"
      >
        <template #text>
          <TextFormatter :text="Ai(layer).automation.unlock_text()"/>
        </template>
      </UpgradeButton>
    </template>
  </div>
</template>

<style scoped>
.text-box {
  text-align: center;
}
</style>