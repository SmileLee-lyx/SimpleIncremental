<script lang="ts" setup>
import { is_shift_pressed } from "@/components/misc/global-keyboard-press.ts";
import PurchaseButton from "@/components/objects/PurchaseButton.vue";
import TextFormatter from "@/components/objects/TextFormatter.vue";
import ToggleButton from "@/components/objects/ToggleButton.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import A from "@/core/instances/A/A.js";
import Ai from "@/core/instances/A/Ai.ts";
import As from "@/core/instances/A/As.js";
import At from "@/core/instances/A/At.ts";
import Atu from "@/core/instances/A/Atu.js";
</script>

<template>
  <div class="main-text">
    <ToggleButton v-model="Ai.buy_mode" :values="Ai.buy_modes"
                  class="buy-mode-button" height="30px" width="120px">
      <template #selection>
        <TextFormatter :text="Ai.buy_mode_description()"/>
      </template>
    </ToggleButton>
    <ToggleButton v-model="At.buy_mode" :values="At.buy_modes"
                  class="buy-mode-button-2" height="30px" width="120px">
      <template #selection>
        <TextFormatter :text="At.buy_mode_description()"/>
      </template>
    </ToggleButton>
    <TextFormatter :text="At.auto_sign_description()"/>
    <br>
    <UpgradeButton
        :visible="A.sign_visible"
        :buy="A.manual_sign"
        :extra_classes="'A-button'"
    >
      <template #text>
        <TextFormatter :text="A.sign_message()"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buyable="At.buyable"
        :has_tooltip="true"
        :visible="At.visible"
        :buy="At.buy"
        :extra_classes="'A-button'"
    >
      <template #text>
        <TextFormatter :text="At.buy_button_message()"/>
      </template>
      <template #tooltip>
        <TextFormatter :text="At.buy_button_tooltip_message()"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buyable="As.buyable"
        :has_tooltip="true"
        :visible="As.visible"
        :buy="As.manual_buy"
        :extra_classes="'A-button'"
    >
      <template #text>
        <TextFormatter v-if="!is_shift_pressed" :text="As.buy_button_message()"/>
        <TextFormatter v-else :text="As.buy_button_shift_message()"/>
      </template>
      <template #tooltip>
        <TextFormatter :text="As.buy_button_tooltip_message()"/>
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buyable="Atu.buyable"
        :has_tooltip="true"
        :visible="Atu.visible"
        :buy="Atu.manual_buy"
        :extra_classes="'A-button'">
      <template #text>
        <TextFormatter v-if="!is_shift_pressed" :text="Atu.buy_button_message()"/>
        <TextFormatter v-else :text="Atu.buy_button_shift_message()"/>
      </template>
      <template #tooltip>
        <TextFormatter :text="Atu.buy_button_tooltip_message()"/>
      </template>
    </UpgradeButton>
  </div>
  <div v-for="layer in 8" :class="{'grey-background': layer%2}" class="a-div">
    <span class="fixed-width text-left vert-flex" style="width: 100px">
      <TextFormatter :text="Ai(layer).formatted_name()"/>
      <TextFormatter :text="Ai(layer).mult_message()" class="small2"/>
    </span>
    <span class="flex-element text-left vert-flex" style="width: 100px">
      <TextFormatter :text="Ai(layer).amount_message()"/>
      <TextFormatter :text="Ai(layer).amount_inc_message()" class="small2"/>
    </span>
    <PurchaseButton
        :unlocked="Ai(layer).unlocked"
        :already_bought="Ai(layer).bought_mod_10"
        :buyable_amount="Ai(layer).buyable_amount_to10"
        :has_tooltip="true"
        :total_amount="10"
        :buy="Ai(layer).buy">
      <template #text>
        <span class="text-box small-text">
          <TextFormatter v-if="!is_shift_pressed" :text="Ai(layer).buy_button_message()"/>
          <TextFormatter v-else :text="Ai(layer).buy_button_shift_message()"/>
        </span>
      </template>
      <template #tooltip>
        <TextFormatter :text="Ai(layer).buy_button_tooltip_message()"/>
      </template>
    </PurchaseButton>
  </div>
</template>

<style scoped>
.fixed-width {
  position: relative;
  display: inline-block;
}

.a-div {
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  display: flex;
  flex-direction: row;
  text-align: center;
  width: 100%;
}

.vert-flex {
  display: flex;
  flex-direction: column;
}

.flex-element {
  flex-grow: 1;
}

.grey-background {
  background: #ccc;
}

.small-text {
  line-height: 10px;
  font-size: 14px;
}

.buy-mode-button {
  position: absolute;
  left: 10px;
  top: 170px;
}

.buy-mode-button-2 {
  position: absolute;
  left: 10px;
  top: 210px;
}
</style>