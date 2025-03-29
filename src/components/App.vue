<script lang="ts" setup>
import EndgameWindow from "@/components/EndgameWindow.vue";
import Header from "@/components/Header.vue";
import { global_now, init_timer } from "@/components/misc/component-timer.ts";
import { init_keyboard_press } from "@/components/misc/global-keyboard-press.ts";
import { run_on_frame } from "@/components/misc/run-on-frame.ts";
import TextFormatter from "@/components/objects/TextFormatter.vue";
import SideBar from "@/components/SideBar.vue";
import ATab from "@/components/Tabs/ATab.vue";
import AUpgradesTab from "@/components/Tabs/AUpgradesTab.vue";
import CheatTab from "@/components/Tabs/CheatTab.vue";
import SettingsTab from "@/components/Tabs/SettingsTab.vue";
import TabUnlocker from "@/components/TabUnlocker.vue";
import { TabId } from "@/core/defines.ts";

import "@/assets/main.scss";
import { gameLoop } from "@/core/game-loop.ts";
import { init } from "@/core/init.ts";
import type { FormattedText } from "@/util/format.js";
import { type Component, computed, type ComputedRef } from "vue";

init();

let player = window.player;
let game = window.game;

let auto_save_time_text: ComputedRef<FormattedText> = computed(() => {
  if (game.last_auto_save === null) {
    return "从未进行自动存档.";
  }
  let time = global_now.value - game.last_auto_save;
  if (time < 1000) {
    return ["距离上次自动存档: ", Math.floor(time), " 毫秒."];
  } else if (time < 60000) {
    return ["距离上次自动存档: ", Math.floor(time / 1000), " 秒."];
  } else {
    return ["距离上次自动存档: ", Math.floor(time / 60000), " 分钟 ", Math.floor(time / 1000) % 60, " 秒."];
  }
});

let previous_time = Date.now();
run_on_frame(() => {
  let current_time = Date.now();
  let duration = current_time - previous_time;
  previous_time = current_time;
  gameLoop(duration);
});

init_timer();
init_keyboard_press();

let activeTab: ComputedRef<Component | null> = computed(() => {
  switch (game.current_tab) {
    case TabId.A:
      return ATab;
    case TabId.A_UPGRADES:
      return AUpgradesTab;
    case TabId.SETTINGS:
      return SettingsTab;
    case TabId.CHEAT:
      return CheatTab;
    default:
      return null;
  }
});

</script>

<template>
  <EndgameWindow/>
  <TabUnlocker></TabUnlocker>
  <SideBar/>
  <div class="content">
    <div class="tab-container">
      <Header/>
      <div class="tab-content">
        <Component :is="activeTab"/>
      </div>
    </div>
  </div>
  <div class="auto-save-time">
    <TextFormatter :text="auto_save_time_text"/>
  </div>
</template>

<style scoped>
.auto-save-time {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10000;
  font-size: 12px;
  border: black solid 1px;
  background: white;
}
</style>
