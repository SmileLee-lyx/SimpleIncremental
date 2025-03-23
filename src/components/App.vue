<script lang="ts" setup>
import { init_timer } from "@/components/misc/component-timer.ts";
import { run_on_frame } from "@/components/misc/run-on-frame.ts";
import { init_keyboard_press } from "@/components/misc/global-keyboard-press.ts";
import AUpgradesTab from "@/components/Tabs/AUpgradesTab.vue";
import CheatTab from "@/components/Tabs/CheatTab.vue";
import ATab from "@/components/Tabs/ATab.vue";
import EndgameWindow from "@/components/EndgameWindow.vue";
import SettingsTab from "@/components/Tabs/SettingsTab.vue";
import SideBar from "@/components/SideBar.vue";
import Header from "@/components/Header.vue";
import TabUnlocker from "@/components/TabUnlocker.vue";
import { TabId } from "@/core/typing.ts";

import "@/assets/main.scss";
import { gameLoop } from "@/core/game-loop.ts";
import { type Component, computed, type ComputedRef, type DefineComponent, onMounted } from "vue";

let previous_time = Date.now();
run_on_frame(() => {
    let current_time = Date.now();
    let duration = current_time - previous_time;
    previous_time = current_time;
    gameLoop(duration);
});

init_timer();
init_keyboard_press();

let player = window.player;
let game = window.game;

let activeTab: ComputedRef<any | null> = computed(() => {
  switch (game.current_tab) {
    case TabId.A: return ATab;
    case TabId.A_UPGRADES: return AUpgradesTab;
    case TabId.SETTINGS: return SettingsTab;
    case TabId.CHEAT: return CheatTab;
    default: return null;
  }
})

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
</template>

<style scoped>
</style>
