<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import Ap from "@/core/instances/A/Ap.js";
import B from "@/core/instances/B/B.js";
import Bp from "@/core/instances/B/Bp.js";
import Progress from "@/core/instances/Progress/Progress.js";
import Records from "@/core/instances/Progress/Records.js";
import { A_text, B_text, type FormattedText } from "@/util/format.js";
import { computed, type ComputedRef } from "vue";

const game_stats: ComputedRef<FormattedText>[] = [
  computed(() => ["游戏时长: ", Progress.Game.game_time, "s"]),
  computed(() =>
      ["最大 ", Ap.formatted_name(), " 数量: ", A_text(Records.Game.best_Ap), " ", Ap.formatted_name()],
  ),
  computed(() =>
      ["最大 ", Bp.formatted_name(), " 数量: ", B_text(Records.Game.best_Bp), " ", Bp.formatted_name()],
  ),
  computed(() =>
      ["最快获得 ", Bp.formatted_name(), " 速度: ", B_text(Records.Game.best_Bp_speed), " ", Bp.formatted_name(), "/s"],
  ),
  computed(() =>
      ["最快制作 ", B.formatted_name(), " 时间: ", Records.Game.best_B_time, "s"]),
];

const this_B_stats: ComputedRef<FormattedText>[] = [
  computed(() => ["游戏时长: ", Progress.this_B.game_time, "s"]),
  computed(() =>
      ["最大 ", Ap.formatted_name(), " 数量: ", A_text(Records.this_B.best_Ap), " ", Ap.formatted_name()],
  ),
];
</script>

<template>
  <div class="main-text">
    <div class="large2">游戏统计</div>
    <div>
      <template v-for="stat of game_stats">
        <TextFormatter :text="stat.value"/>
        <br>
      </template>
    </div>
    <div class="large2">
      <TextFormatter :text="['当前 ', B.formatted_name(), ' 统计']"/>
    </div>
    <div>
      <template v-for="stat of this_B_stats">
        <TextFormatter :text="stat.value"/>
        <br>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>