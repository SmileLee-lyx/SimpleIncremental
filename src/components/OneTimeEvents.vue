<script lang="ts" setup>
import { run_on_frame } from "@/components/misc/run-on-frame.ts";
import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import At from "@/core/instances/A/At.js";
import B from "@/core/instances/B/B.js";
import Bp from "@/core/instances/B/Bp.js";
import Progress from "@/core/instances/Progress/Progress.js";
import DC from "@/core/main/DC.js";
import { TabId } from "@/core/main/defines.ts";
import { add_global_message } from "@/core/main/global-messages.js";
import { AlertId } from "@/core/main/settings.js";
import { br } from "@/util/format.js";
import { ref, type Ref, watch, watchEffect } from "vue";

function alert_ignored(id: AlertId): boolean {
  return window.player.progress.ignored_alerts.includes(id);
}

function ignore_alert(id: AlertId) {
  window.player.progress.ignored_alerts.push(id);
}

run_on_frame(() => {
  if (!Progress.tab_unlocked(TabId.A_UPGRADES) && Ap.amount.gte("1e2")) {
    Progress.unlock_tab(TabId.A_UPGRADES);
    window.game.alert_tabs.add(TabId.A_UPGRADES);
  }
});

watch(() => B.unlocked, (value) => {
  if (value) {
    Progress.unlock_tab(TabId.B);
    Progress.unlock_tab(TabId.B_UPGRADES);
    Progress.unlock_tab(TabId.B_QOL);
    Progress.unlock_tab(TabId.B_CHALLENGES);
  }
});

watchEffect(() => {
  if (window.game.show_cheat) {
    Progress.unlock_tab(TabId.CHEAT);
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

const Ai_scaling_message: Ref<number | null> = ref(null);

watchEffect(() => {
  if (!alert_ignored(AlertId.B_UNLOCK) && Ai_scaling_message.value === null && Ap.amount.gte(DC.dNm)) {
    Ai_scaling_message.value = add_global_message({
      type: 'alert',
      message_text: [
        "在价格达到 ", DC.dNm, " ", Ap.formatted_name(), " 后, ",
        Ai.formatted_name(), " 将无法购买.", br(),
        "此时你可以重置所有与 ", Ap.formatted_name(), " 有关的资源以获得 ", Bp.formatted_name(), ", 并购买更多升级."],
      done() {
        ignore_alert(AlertId.B_UNLOCK);
      },
    });
  }
});


</script>

<template>

</template>

<style scoped>

</style>