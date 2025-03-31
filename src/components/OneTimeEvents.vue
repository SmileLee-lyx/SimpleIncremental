<script lang="ts" setup>
import { run_on_frame } from "@/components/misc/run-on-frame.ts";
import Ap from "@/core/instances/A/Ap.js";
import At from "@/core/instances/A/At.js";
import { AlertId, TabId } from "@/core/main/defines.ts";
import { add_global_message } from "@/core/main/global-messages.js";
import { ref, type Ref, watchEffect } from "vue";

function alert_ignored(id: AlertId): boolean {
  return window.player.progress.ignored_alerts.includes(id);
}

function ignore_alert(id: AlertId) {
  window.player.progress.ignored_alerts.push(id);
}

function unlocked(tab: TabId) {
  return window.player.progress.unlocked_tabs.includes(tab);
}

function unlock(tabId: TabId): boolean {
  if (!unlocked(tabId)) {
    window.player.progress.unlocked_tabs.push(tabId);
    return true;
  }
  return false;
}

run_on_frame(() => {
  if (!unlocked(TabId.A_UPGRADES) && Ap.amount.gte("1e2")) {
    unlock(TabId.A_UPGRADES);
    window.game.alert_tabs.add(TabId.A_UPGRADES);
  }
});

watchEffect(() => {
  if (window.game.show_cheat) {
    unlock(TabId.CHEAT);
  }
});

const shift_message: Ref<number | null> = ref(null);

watchEffect(() => {
  if (!alert_ignored(AlertId.SHIFT) && shift_message.value === null && Ap.amount.gte("1e2")) {
    shift_message.value = add_global_message({
      type: 'alert',
      message_text: "对于游戏中的一部分按钮, 按住 shift 可以查看更多信息.",
      done() {
        ignore_alert(AlertId.SHIFT);
      },
    });
  }
});

const hide_sign_message: Ref<number | null> = ref(null);

watchEffect(() => {
  if (!alert_ignored(AlertId.HIDE_SIGN) && hide_sign_message.value === null && At.sign_speed().gt(5)) {
    hide_sign_message.value = add_global_message({
      type: 'alert',
      message_text: "默认情况下, 游戏速度达到 5 时, 手动签到按钮将隐藏. 可在设置页修改.",
      done() {
        ignore_alert(AlertId.HIDE_SIGN);
      },
    });
  }
});


</script>

<template>

</template>

<style scoped>

</style>