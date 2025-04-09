<script lang="ts" setup>
import { set_make_B_animation } from "@/animation/make-B-animation.js";
import MakeBAnimation from "@/components/animation/MakeBAnimation.vue";
import EndgameWindow from "@/components/EndgameWindow.vue";
import Header from "@/components/Header.vue";
import MessageManager from "@/components/message/MessageManager.vue";
import { global_now, init_timer } from "@/components/misc/component-timer.ts";
import { init_keyboard_press } from "@/components/misc/global-keyboard-press.ts";
import { run_on_frame } from "@/components/misc/run-on-frame.ts";
import TextFormatter from "@/components/objects/TextFormatter.vue";
import OneTimeEvents from "@/components/OneTimeEvents.vue";
import SideBar from "@/components/SideBar.vue";
import AchievementsTab from "@/components/Tabs/AchievementsTab.vue";
import ATab from "@/components/Tabs/ATab.vue";
import AUpgradesTab from "@/components/Tabs/AUpgradesTab.vue";
import AutomationTab from "@/components/Tabs/AutomationTab.vue";
import BChallengesTab from "@/components/Tabs/BChallengesTab.vue";
import BQolTab from "@/components/Tabs/BQolTab.vue";
import BTab from "@/components/Tabs/BTab.vue";
import BUpgradesTab from "@/components/Tabs/BUpgradesTab.vue";
import CheatTab from "@/components/Tabs/CheatTab.vue";
import SettingsTab from "@/components/Tabs/SettingsTab.vue";
import StatsTab from "@/components/Tabs/StatsTab.vue";
import { TabId } from "@/core/main/defines.ts";

import "@/assets/main.scss";
import { gameLoop } from "@/core/main/game-loop.ts";
import {
  active_message_indices,
  global_messages,
  headers,
  remove_header_message_timeout,
} from "@/core/main/global-messages.js";
import { init } from "@/core/main/init.ts";
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

const tabs: Record<TabId, Component | null> = {
  [TabId.AUTOMATION]: AutomationTab,
  [TabId.A]: ATab,
  [TabId.A_UPGRADES]: AUpgradesTab,
  [TabId.B]: BTab,
  [TabId.B_UPGRADES]: BUpgradesTab,
  [TabId.B_QOL]: BQolTab,
  [TabId.B_CHALLENGES]: BChallengesTab,
  [TabId.ACHIEVEMENTS]: AchievementsTab,
  [TabId.SETTINGS]: SettingsTab,
  [TabId.CHEAT]: CheatTab,
  [TabId.STATS]: StatsTab,
}

let activeTab: ComputedRef<Component | null> = computed(() => {
  return tabs[game.current_tab];
});

</script>

<template>
  <EndgameWindow/>
  <OneTimeEvents/>
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
  <MessageManager :clear_header_timeout="remove_header_message_timeout" :headers="headers"
                  :indices="active_message_indices" :messages="global_messages"/>

  <MakeBAnimation :set_start_animation="set_make_B_animation"></MakeBAnimation>
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
