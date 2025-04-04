<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import A from "@/core/instances/A/A.js";
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
        :buy="A.automation.At.buy_unlock"
        :buyable="A.automation.At.unlock_buyable"
        :extra_classes="'A-button'"
        :fully_bought="A.automation.At.unlocked"
    >
      <template #text>
        <TextFormatter :text="A.automation.At.unlock_text()"/>
      </template>
    </UpgradeButton>
    <br>
    <template v-for="layer in 8">
      <UpgradeButton
          :buy="A.automation.Ai(layer).buy_unlock"
          :buyable="A.automation.Ai(layer).unlock_buyable"
          :extra_classes="'A-button'"
          :fully_bought="A.automation.Ai(layer).unlocked"
      >
        <template #text>
          <TextFormatter :text="A.automation.Ai(layer).unlock_text()"/>
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