<script lang="ts" setup>
import ConfirmBox from "@/components/objects/ConfirmBox.vue";
import InputBox from "@/components/objects/InputBox.vue";
import MessageBox from "@/components/objects/MessageBox.vue";
import SelectButton from "@/components/objects/SelectButton.vue";
import { defaultPlayer } from "@/core/defines.ts";
import { SignSetting } from "@/core/settings.ts";
import { assign, cloneDeep } from "lodash";
import { ref } from "vue";

let game = window.game;
let player = window.player;

let show_reset_confirm = ref(0);

function confirm_reset(text: string) {
  if (text.trim() === "A comathematician is a machine for turning cotheorems into ffee.") {
    show_reset_confirm.value = 2;
  } else if (text.trim() === "cheat") {
    game.show_cheat = true;
    show_reset_confirm.value = 0;
  }
}

function full_reset() {
  show_reset_confirm.value = 0;

  let defaultCopy = cloneDeep(defaultPlayer);
  assign(player, defaultCopy);
}

let sign_settings: SignSetting[] = Object.values(SignSetting).filter(x => typeof x === "number");

let sign_settings_configs = {
  [SignSetting.DEFAULT]: { description: "默认", select: "默认" },
  [SignSetting.WHEN_SLOW]: { description: "慢速时开启", select: "慢速时开启" },
  [SignSetting.ALWAYS]: { description: "开启", select: "开启" },
  [SignSetting.NEVER]: { description: "关闭", select: "关闭" },
};
</script>

<template>
  <div class="text-box">
    <span class="text-title">设置页</span>
    <br>
    <br>
    <button class="select-button" @click="show_reset_confirm = 1">硬重置存档</button>
    <SelectButton v-model="player.settings.sign_setting" :values="sign_settings">
      <template #option="{ value }">{{ sign_settings_configs[value as SignSetting].description }}</template>
      <template #selection>手动签到显示: <br>{{ sign_settings_configs[player.settings.sign_setting].select }}</template>
    </SelectButton>
  </div>

  <InputBox
      v-if="show_reset_confirm === 1"
      placeholder=""
      type="string"
      @close="show_reset_confirm = 0"
      @done="confirm_reset"

      @paste="(e: Event) => { e.preventDefault(); show_reset_confirm = 3; }"
  >请输入以下句子以确认: "A comathematician is a machine for turning cotheorems into ffee."
  </InputBox>
  <ConfirmBox
      v-if="show_reset_confirm === 2"
      @close="show_reset_confirm = 0"
      @done="full_reset()"
  >
    确定要重置吗?
  </ConfirmBox>
  <MessageBox
      v-if="show_reset_confirm === 3"
      @done="show_reset_confirm = 1">
    请手动输入!
  </MessageBox>
</template>

<style scoped>
.text-box {
  text-align: center;
}

.text-title {
  font-size: 32px;
}
</style>