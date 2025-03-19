<script lang="ts" setup>
import AUpgradesTab from "@/components/Tabs/AUpgradesTab.vue";
import CheatTab from "@/components/Tabs/CheatTab.vue";
import ATab from "@/components/Tabs/ATab.vue";
import EndgameWindow from "@/components/EndgameWindow.vue";
import SettingsTab from "@/components/Tabs/SettingsTab.vue";
import SideBar from "@/components/SideBar.vue";
import { TabId } from "@/core/typing.ts";

import "@/assets/main.scss";
import { gameLoop } from "@/core/game-loop.ts";
import { type Component, computed, type ComputedRef, type DefineComponent, onMounted } from "vue";

onMounted(() => {
  let previous_time = Date.now();

  function run() {
    let current_time = Date.now();
    let duration = current_time - previous_time;
    previous_time = current_time;
    gameLoop(duration);

    requestAnimationFrame(run);
  }

  run();
});

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
  <EndgameWindow v-if="player.endgame &&! player.endgame_continue"/>
  <SideBar/>
  <div class="content">
    <div class="tab-container">
      <Component :is="activeTab"/>
    </div>
  </div>
</template>

<style scoped>
</style>
