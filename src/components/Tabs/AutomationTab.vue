<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import ToggleButton from "@/components/objects/ToggleButton.vue";
import A from "@/core/instances/A/A.js";
</script>

<template>
  <template v-if="A.automation.auto_sign.unlocked">
    <div class="automation-term A-automation">
      <div class="flex-element"/>
      <div class="flex-element content-center automation-description">
        <TextFormatter :text="A.automation.auto_sign.setting_description()"/>
      </div>
      <ToggleButton v-model="A.automation.auto_sign.enabled" :values="[true, false]" height="30px" width="60px">
        <template #selection>
          <TextFormatter :text="A.automation.auto_sign.enable_button_text()"/>
        </template>
      </ToggleButton>
      <div style="width: 100px"/>
      <div class="flex-element"/>
    </div>
  </template>
  <template v-if="A.automation.At.unlocked">
    <div class="automation-term A-automation">
      <div class="flex-element"/>
      <div class="flex-element content-center automation-description">
        <TextFormatter :text="A.automation.At.setting_description()"/>
      </div>
      <ToggleButton v-model="A.automation.At.enabled" :values="[true, false]" height="30px" width="60px">
        <template #selection>
          <TextFormatter :text="A.automation.At.enable_button_text()"/>
        </template>
      </ToggleButton>
      <ToggleButton
          v-model="A.automation.At.mode" :values="A.automation.At.allowed_modes()"
          height="30px" width="100px">
        <template #selection>
          <TextFormatter :text="A.automation.At.mode_button_text()"/>
        </template>
      </ToggleButton>
      <div class="flex-element"/>
    </div>
  </template>
  <template v-for="layer in 8">
    <template v-if="A.automation.Ai(layer).unlocked">
      <div class="automation-term A-automation">
        <div class="flex-element"/>
        <div class="flex-element content-center automation-description">
          <TextFormatter :text="A.automation.Ai(layer).setting_description()"/>
        </div>
        <ToggleButton v-model="A.automation.Ai(layer).enabled" :values="[true, false]" height="30px" width="60px">
          <template #selection>
            <TextFormatter :text="A.automation.Ai(layer).enable_button_text()"/>
          </template>
        </ToggleButton>
        <ToggleButton
            v-model="A.automation.Ai(layer).mode" :values="A.automation.Ai(layer).allowed_modes()"
            height="30px" width="100px">
          <template #selection>
            <TextFormatter :text="A.automation.Ai(layer).mode_button_text()"/>
          </template>
        </ToggleButton>
        <div class="flex-element"/>
      </div>
    </template>
  </template>
</template>

<style scoped>
.automation-term {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: row;
  text-align: center;
  vertical-align: center;
  padding: 10px;
  margin: 10px;

  left: 10%;
  width: 80%;
  border-radius: 10px;
  border-width: 4px;
  border-style: solid;

  &.A-automation {
    background-color: #f88;
    border-color: #f44;
  }

  &.B-automation {
    background-color: #88f;
    border-color: #44f;
  }
}

.automation-description {
  width: 100px;
}
</style>