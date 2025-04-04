<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import A from "@/core/instances/A/A.js";
import Ap from "@/core/instances/A/Ap.js";
import At from "@/core/instances/A/At.js";
import { defaultPlayer } from "@/core/main/defines.ts";
import { format } from "@/util/format.ts";
import { cloneDeep } from "lodash";


</script>

<template>
  <div class="text-box">
    <br>
    <UpgradeButton
        :buyable="A.automation.auto_sign_buyable"
        :fully_bought="At.unlocked"
        :buy="A.automation.buy_auto_sign"
        :extra_classes="'A-button'"
    >
      <template #text>
        <TextFormatter :text="A.automation.unlock_auto_sign_message()"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buyable="A.automation.At.unlock_buyable"
        :fully_bought="A.automation.At.unlocked"
        :buy="A.automation.At.buy_unlock"
        :extra_classes="'A-button'"
    >
      <template #text>
        <TextFormatter :text="A.automation.At.unlock_text()"/>
      </template>
    </UpgradeButton>
    <br>
    <template v-for="layer in 8">
      <UpgradeButton
          :buyable="A.automation.Ai(layer).unlock_buyable"
          :fully_bought="A.automation.Ai(layer).unlocked"
          :buy="A.automation.Ai(layer).buy_unlock"
          :extra_classes="'A-button'"
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