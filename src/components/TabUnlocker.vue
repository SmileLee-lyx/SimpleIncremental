<script setup lang="ts">
import { TabId } from "@/core/typing.ts";

function unlock(tabId: TabId): boolean {
  if (!window.player.progress.unlocked_tabs.includes(tabId)) {
    window.player.progress.unlocked_tabs.push(tabId);
    return true;
  }
  return false;
}

function checkTabUnlock() {
  function run() {
    if (window.player.A.points.amount.gte("1e5")) {
      if (unlock(TabId.A_UPGRADES)) {
        window.game.alert_tabs.add(TabId.A_UPGRADES);
      }
    }

    requestAnimationFrame(run);
  }

  run();
}

checkTabUnlock();
</script>

<template>

</template>

<style scoped>

</style>