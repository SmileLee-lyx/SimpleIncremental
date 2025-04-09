<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import ToggleButton from "@/components/objects/ToggleButton.vue";
import A from "@/core/instances/A/A.js";
import Ai from "@/core/instances/A/Ai.js";
import As from "@/core/instances/A/As.js";
import At from "@/core/instances/A/At";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
</script>

<template>
  <template v-if="A.automation.auto_sign.unlocked">
    <div class="automation-term A-automation">
      <div class="content-center">
        <TextFormatter :text="A.automation.auto_sign.setting_description()"/>
      </div>
      <div class="content-center">
        <ToggleButton v-model="A.automation.auto_sign.enabled" :values="[true, false]" height="30px" width="60px">
          <template #selection>
            <TextFormatter :text="A.automation.auto_sign.enable_button_text()"/>
          </template>
        </ToggleButton>
      </div>
    </div>
  </template>
  <template v-if="At.automation.unlocked">
    <div class="automation-term A-automation">
      <div class="content-center">
        <TextFormatter :text="At.automation.setting_description()"/>
      </div>
      <div>
        <ToggleButton v-model="At.automation.enabled" :values="[true, false]" height="30px" width="60px">
          <template #selection>
            <TextFormatter :text="At.automation.enable_button_text()"/>
          </template>
        </ToggleButton>
      </div>
      <div/>
      <div class="content-center">
        <ToggleButton
            v-model="At.automation.mode" :values="At.automation.allowed_modes()"
            height="30px" width="100px">
          <template #selection>
            <TextFormatter :text="At.automation.mode_button_text()"/>
          </template>
        </ToggleButton>
      </div>
    </div>
  </template>
  <template v-for="layer in 8">
    <template v-if="Ai(layer).automation.unlocked">
      <div class="automation-term A-automation">
        <div class="content-center">
          <TextFormatter :text="Ai(layer).automation.setting_description()"/>
        </div>
        <div>
          <ToggleButton v-model="Ai(layer).automation.enabled" :values="[true, false]" height="30px" width="60px">
            <template #selection>
              <TextFormatter :text="Ai(layer).automation.enable_button_text()"/>
            </template>
          </ToggleButton>
        </div>
        <div/>
        <div class="content-center">
          <ToggleButton
              v-model="Ai(layer).automation.mode" :values="Ai(layer).automation.allowed_modes()"
              height="30px" width="100px">
            <template #selection>
              <TextFormatter :text="Ai(layer).automation.mode_button_text()"/>
            </template>
          </ToggleButton>
        </div>
      </div>
    </template>
  </template>
  <template v-if="As.automation.unlocked">
    <div class="automation-term A-automation">
      <div class="content-center">
        <TextFormatter :text="As.automation.setting_description()"/>
      </div>
      <div class="content-center">
        <ToggleButton v-model="As.automation.enabled" :values="[true, false]" height="30px" width="60px">
          <template #selection>
            <TextFormatter :text="As.automation.enable_button_text()"/>
          </template>
        </ToggleButton>
      </div>
      <div class="content-center">
        <div>
          <input v-model="As.automation.settings.use_no_limit_above_Atu" type="checkbox"/>
          <TextFormatter :text="As.automation.no_limit_text()"/>
        </div>
        <button class="select-button" style="height: 30px; width: 100px"
                @click="As.automation.no_limit_button_change_value()">
          <TextFormatter :text="As.automation.no_limit_button_text()"/>
        </button>
      </div>
      <div class="content-center">
        <div>
          <input v-model="As.automation.settings.use_limit" type="checkbox"/>
          <TextFormatter :text="As.automation.limit_text()"/>
        </div>
        <button class="select-button" style="height: 30px; width: 100px"
                @click="As.automation.limit_button_change_value">
          <TextFormatter :text="As.automation.limit_button_text()"/>
        </button>
      </div>
    </div>
  </template>
  <template v-if="Atu.automation.unlocked">
    <div class="automation-term A-automation">
      <div class="content-center">
        <TextFormatter :text="Atu.automation.setting_description()"/>
      </div>
      <div class="content-center">
        <ToggleButton v-model="Atu.automation.enabled" :values="[true, false]" height="30px" width="60px">
          <template #selection>
            <TextFormatter :text="Atu.automation.enable_button_text()"/>
          </template>
        </ToggleButton>
      </div>
      <div/>
      <div class="content-center">
        <div>
          <input v-model="Atu.automation.settings.use_limit" type="checkbox"/>
          <TextFormatter :text="Atu.automation.limit_text()"/>
        </div>
        <button class="select-button" style="height: 30px; width: 100px"
                @click="Atu.automation.limit_button_change_value">
          <TextFormatter :text="Atu.automation.limit_button_text()"/>
        </button>
      </div>
    </div>
    <template v-if="B.automation.unlocked">
      <div class="automation-term B-automation">
        <div class="content-center">
          <TextFormatter :text="B.automation.setting_description()"/>
        </div>
        <div class="content-center">
          <ToggleButton v-model="B.automation.enabled" :values="[true, false]" height="30px" width="60px">
            <template #selection>
              <TextFormatter :text="B.automation.enable_button_text()"/>
            </template>
          </ToggleButton>
        </div>
        <div/>
        <div class="content-center">
          <TextFormatter :text="B.automation.setting_text()"/>
          <button class="select-button" style="height: 30px; width: 100px"
                  @click="B.automation.setting_button_change_value">
            <TextFormatter :text="B.automation.setting_button_text()"/>
          </button>
        </div>
      </div>
    </template>
  </template>
</template>

<style scoped>
.automation-term {
  box-sizing: border-box;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 0.5fr 1fr 1fr;
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
    background-color: #fcc;
    border-color: #f44;
  }

  &.B-automation {
    background-color: #ccf;
    border-color: #44f;
  }
}
</style>