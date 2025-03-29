<script lang="ts" setup>
import ConfirmBox from "@/components/objects/ConfirmBox.vue";
import InputBox from "@/components/objects/InputBox.vue";
import MessageBox from "@/components/objects/MessageBox.vue";
import SaveLoadPad from "@/components/objects/SaveLoadPad.vue";
import SelectButton from "@/components/objects/SelectButton.vue";
import { defaultPlayer } from "@/core/defines.ts";
import { SignSetting } from "@/core/settings.ts";
import {
  create_empty_manual_save,
  get_manual_save_slots,
  manual_delete,
  manual_load,
  manual_save,
} from "@/save/save-load.js";
import { br } from "@/util/format.js";
import { assign, cloneDeep } from "lodash";
import { type Ref, ref } from "vue";

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

let save_slots: Ref<string[]> = ref([]);

let show_save_load: Ref<boolean> = ref(false);
let show_create_save: Ref<boolean> = ref(false);
let save_load_target: Ref<string | null> = ref(null);
let save_load_mode: Ref<'save' | 'load' | 'delete' | null> = ref(null);
let show_save_load_no_target_message: Ref<boolean> = ref(false);

function update_save_slots() {
  save_slots.value = [...get_manual_save_slots()];
}

function open_save_load() {
  show_save_load.value = true;
  update_save_slots();
}

function save_load_action(mode: 'save' | 'load' | 'delete', target: string | null) {
  if (target === null) {
    show_save_load_no_target_message.value = true;
    return;
  }
  save_load_mode.value = mode;
  save_load_target.value = target;
}

function cancel_save_load() {
  save_load_mode.value = null;
  save_load_target.value = null;
}

function confirm_save() {
  let target = save_load_target.value as string;
  manual_save(target);
  save_load_mode.value = null;
  save_load_target.value = null;
  update_save_slots();
}

function confirm_load() {
  let target = save_load_target.value as string;
  manual_load(target);
  save_load_mode.value = null;
  save_load_target.value = null;
  update_save_slots();
}

function confirm_delete() {
  let target = save_load_target.value as string;
  manual_delete(target);
  save_load_mode.value = null;
  save_load_target.value = null;
  update_save_slots();
}

function create_save() {
  show_create_save.value = true;
}

function confirm_create(target: string) {
  create_empty_manual_save(target);
  show_create_save.value = false;
  update_save_slots();
}

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
    <button class="select-button" @click="open_save_load()">打开存档界面</button>
  </div>

  <SaveLoadPad
      v-if="show_save_load"
      :slots="save_slots"
      @action="save_load_action"
      @create="create_save"
      @close="() => show_save_load = false"
  ></SaveLoadPad>

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

  <InputBox
      v-if="show_create_save"
      placeholder=""
      type="string"
      @close="show_create_save = false"
      @done="confirm_create"
  >请输入存档名称.
  </InputBox>

  <MessageBox
      v-if="show_save_load_no_target_message"
      @done="show_save_load_no_target_message = false">
    请选择存档位.
  </MessageBox>

  <ConfirmBox
      v-if="save_load_mode === 'save'"
      @close="cancel_save_load()"
      @done="confirm_save()"
  >
    确定要保存到栏位 {{ save_load_target }} 吗?
  </ConfirmBox>

  <ConfirmBox
      v-if="save_load_mode === 'load'"
      @close="cancel_save_load()"
      @done="confirm_load()"
  >
    确定要读取栏位 {{ save_load_target }} 吗?
  </ConfirmBox>

  <ConfirmBox
      v-if="save_load_mode === 'delete'"
      @close="cancel_save_load()"
      @done="confirm_delete()"
  >
    确定要删除栏位 {{ save_load_target }} 吗?
  </ConfirmBox>
</template>

<style scoped>
.text-box {
  text-align: center;
}

.text-title {
  font-size: 32px;
}
</style>