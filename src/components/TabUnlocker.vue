<script lang="ts" setup>
import { run_on_frame } from "@/components/misc/run-on-frame.ts";
import { TabId } from "@/core/typing.ts";
import { watchEffect } from "vue";

function unlock(tabId: TabId): boolean {
  if (!window.player.progress.unlocked_tabs.includes(tabId)) {
    window.player.progress.unlocked_tabs.push(tabId);
    return true;
  }
  return false;
}

run_on_frame(() => {
  if (window.player.A.Ap.gte("1e2")) {
    if (unlock(TabId.A_UPGRADES)) {
      window.game.alert_tabs.add(TabId.A_UPGRADES);
    }
  }
});

watchEffect(() => {
  if (window.game.show_cheat) {
    window.player.progress.unlocked_tabs.push(TabId.CHEAT);
  }
});

</script>

<template>

</template>

<style scoped>

</style>