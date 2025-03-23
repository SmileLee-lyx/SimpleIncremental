<script lang="ts" setup>

import ToggleButton from "@/components/objects/ToggleButton.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import { defaultPlayer } from "@/core/defines.ts";
import { format } from "@/visual/format.ts";
import { cloneDeep } from "lodash";

let player = window.player;

function auto_sign_buyable(): boolean {
  return player.A.Ap.gte("1e4");
}

function auto_sign_buy() {
  player.A.Ap = cloneDeep(defaultPlayer.A.Ap);
  player.A.Ai = cloneDeep(defaultPlayer.A.Ai);
  player.A.At_unlocked = true;
}

</script>

<template>
  <div class="text-box">
    <br>
    <UpgradeButton
        :buy="auto_sign_buy"
        :buyable="auto_sign_buyable"
        :fully_bought="() => player.A.At_unlocked">
      <template #text>
        购买自动签到, 但重置所有 <span class="A-text">A</span>.
        <br>
        (需要 <span class="A-text">10000 A</span>)
      </template>
    </UpgradeButton>
    <template v-if="!player.A.At_automation.unlocked">
      <UpgradeButton
          v-if="!player.A.At_automation.unlocked"
          :buy="() => player.A.At_automation.unlocked = player.A.At_automation.enabled = true"
          :buyable="() => player.A.Ap.gte('1e100')">
        <template #text>
          需要 <span class="A-text">{{ format('1e100') }} A</span> 以解锁:
          自动购买 <span class="A-text">A<sub>t</sub></span>.
        </template>
      </UpgradeButton>
    </template>
    <template v-else>
      <ToggleButton v-model="player.A.At_automation.enabled" :values="[true, false]">
        <template #selection>
          自动购买 <span class="A-text">A<sub>t</sub></span>:
          {{ player.A.At_automation.enabled ? "开启" : "关闭" }}
        </template>
      </ToggleButton>
    </template>
    <br>
    <template v-for="i in 8">
      <template v-if="!player.A.Ai_automation[i-1].unlocked">
        <UpgradeButton
            :buy="() => player.A.Ai_automation[i-1].unlocked = player.A.Ai_automation[i-1].enabled = true"
            :buyable="() => player.A.Ap.gte('1e' + i + '0')">
          <template #text>
            需要 <span class="A-text">{{ format('1e' + i + '0') }} A</span> 以解锁:
            自动购买 <span class="A-text">A<sub>{{ i }}</sub></span>.
          </template>
        </UpgradeButton>
      </template>
      <template v-else>
        <ToggleButton v-model="player.A.Ai_automation[i-1].enabled" :values="[true, false]">
          <template #selection>
            自动购买 <span class="A-text">A<sub>{{ i }}</sub></span>:
            {{ player.A.Ai_automation[i - 1].enabled ? "开启" : "关闭" }}
          </template>
        </ToggleButton>
      </template>
    </template>
  </div>
</template>

<style scoped>
.text-box {
  text-align: center;
}
</style>