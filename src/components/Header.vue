<script lang="ts" setup>
import TextFormatter from "@/components/objects/TextFormatter.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import Ap from "@/core/instances/A/Ap.ts";
import B from "@/core/instances/B/B.js";
import Bp from "@/core/instances/B/Bp.js";

let player = window.player;
</script>

<template>
  <div class="header">
    <div class="main-text header-A-text">
      <TextFormatter :text="Ap.amount_message()"/>
    </div>
    <div class="main-text header-A-inc-text">
      <TextFormatter :text="Ap.amount_inc_message()"/>
    </div>
    <div class="main-text" v-if="B.unlocked || B.buyable()">
      <UpgradeButton :buy="B.manual_buy" :buyable="B.buyable" height="50px" :extra_classes="'B-button'">
        <template #text>
          <TextFormatter :text="B.buy_button_message()"/>
        </template>
      </UpgradeButton>
    </div>
    <div class="main-text header-B-text" v-if="B.unlocked">
      <TextFormatter :text="Bp.amount_message()"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-A-text {
  font-size: 25px;
  margin-top: 15px;
}

.header-A-inc-text {
  font-size: 15px;
}

.header-B-text {
  font-size: 15px;
}
</style>