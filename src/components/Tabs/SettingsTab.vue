<script lang="ts" setup>
import SaveLoadPad from "@/components/objects/SaveLoadPad.vue";
import SelectButton from "@/components/objects/SelectButton.vue";
import A from "@/core/instances/A/A.js";
import { fullReset } from "@/core/main/full-reset.js";
import { add_global_message, add_header_message, manual_close_message } from "@/core/main/global-messages.js";
import { SignSetting } from "@/core/main/settings.ts";
import {
  create_empty_manual_save,
  get_manual_save_slots,
  load_from_data,
  manual_delete,
  manual_load,
  manual_save,
  saved_data,
} from "@/save/save-load.js";
import { deserialize, serialize } from "@/save/serializer.js";
import { br } from "@/util/format.js";
import clipboard from "clipboardy";
import { type Ref, ref } from "vue";

let game = window.game;
let player = window.player;

const RESET_CONFIRM_TEXT = //"A comathematician is a machine for turning cotheorems into ffee.";
    "233";

function show_reset_confirm_text() {
  const reset_input_box_index: Ref<number> = ref(0);
  reset_input_box_index.value = add_global_message({
    type: 'input_box',
    message_text: [
      "请输入以下内容以确认硬重置 (注意标点符号):", br(),
      RESET_CONFIRM_TEXT,
    ],
    done: (text) => show_reset_confirm(text, reset_input_box_index.value),
  });
}

function show_reset_confirm(text: string, index: number) {
  if (text.trim() === RESET_CONFIRM_TEXT) {
    add_global_message({
      type: 'confirm',
      message_text: "确定要重置吗?",
      done: () => confirm_reset(index),
    });
  } else if (text.trim() === 'cheat') {
    game.show_cheat = true;
    add_header_message("已解锁作弊.");
    return false;
  } else {
    add_global_message({
      type: 'alert',
      message_text: "输入的内容不正确!",
    });
  }
  return true;
}

function confirm_reset(index: number) {
  manual_close_message(index);

  fullReset();
}

let sign_settings: SignSetting[] = Object.values(SignSetting).filter(x => typeof x === "number");

let sign_settings_configs = {
  [SignSetting.DEFAULT]: { description: "默认", select: "默认" },
  [SignSetting.ALWAYS]: { description: "开启", select: "开启" },
  [SignSetting.NEVER]: { description: "关闭", select: "关闭" },
};

let show_save_load: Ref<boolean> = ref(false);
let save_slots: Ref<string[]> = ref([]);

function update_save_slots() {
  save_slots.value = [...get_manual_save_slots()];
}

function open_save_load() {
  show_save_load.value = true;
  update_save_slots();
}

function save_load_action(mode: 'save' | 'load' | 'delete', target: string | null) {
  if (target === null) {
    add_global_message({
      type: 'alert',
      message_text: "未指定存档!",
    });
    return;
  }
  switch (mode) {
    case 'save':
      add_global_message({
        type: 'confirm',
        message_text: ["确定要保存到档位 ", target, " 吗?"],
        done() {
          confirm_save(target);
        },
      });
      return;
    case 'load':
      add_global_message({
        type: 'confirm',
        message_text: ["确定要读取档位 ", target, " 吗?"],
        done() {
          confirm_load(target);
        },
      });
      return;
    case 'delete':
      add_global_message({
        type: 'confirm',
        message_text: ["确定要删除档位 ", target, " 吗?"],
        done() {
          confirm_delete(target);
        },
      });
      return;
  }
}

function confirm_save(target: string) {
  manual_save(target);
  add_header_message("存档成功.");
  update_save_slots();
}

function confirm_load(target: string) {
  const result = manual_load(target);
  if (result.success) {
    add_header_message("读档成功.");
    update_save_slots();

    if (result.warnings && result.warnings.includes('version-0')) {
      add_global_message({
        type: 'alert',
        message_text: [
          "你正在导入旧版本存档. 此版本的存档不能正确记录游戏时长.", br(),
          "此外, 由于引入了一些新机制, 存档内部分 ", A.formatted_name(), " 阶段的内容可能被重置.",
        ],
      });
    }
  } else {
    add_header_message("读档失败!");
  }
}

function confirm_delete(target: string) {
  manual_delete(target);
  add_header_message("删除成功.");
  update_save_slots();
}

function create_save() {
  add_global_message({
    type: 'input_box',
    message_text: "请输入存档名称",
    done: confirm_create,
  });
}

function confirm_create(target: string) {
  create_empty_manual_save(target);
  update_save_slots();
}

function export_save() {
  let data = serialize(saved_data());
  try {
    clipboard.write("SaveStart" + data + "SaveEnd");
    add_global_message({
      type: 'alert',
      message_text: "已成功导出到剪贴板.",
    });
  } catch (e) {
    add_global_message({
      type: 'alert',
      message_text: "导出到剪贴板失败!",
    });
    console.error(e);
  }
}

function import_save() {
  add_global_message({
    type: 'input_box',
    message_text: "请输入导出的存档",
    done: confirm_import,
  });
}

function confirm_import(data: string) {
  if (!(data.startsWith("SaveStart") && data.endsWith("SaveEnd"))) {
    add_global_message({
      type: 'alert',
      message_text: "存档识别失败!",
    });
    return;
  }
  let result = load_from_data(deserialize(data.substring(9, data.length - 7)));
  if (result.success) {
    add_global_message({
      type: 'alert',
      message_text: "存档导入成功!",
    });

    if (result.warnings && result.warnings.includes('version-0')) {
      add_global_message({
        type: 'alert',
        message_text: [
          "你正在导入旧版本存档. 此版本的存档不能正确记录游戏时长.", br(),
          "此外, 由于引入了一些新机制, 存档内部分 ", A.formatted_name(), " 阶段的内容可能被重置.",
        ],
      });
    }
  } else {
    add_global_message({
      type: 'alert',
      message_text: "存档读取失败!",
    });
  }
}

</script>

<template>
  <div class="text-box">
    <span class="text-title">设置页</span>
    <br>
    <br>
    <button class="select-button" @click="show_reset_confirm_text()">硬重置存档</button>
    <SelectButton v-model="player.settings.sign_setting" :values="sign_settings">
      <template #option="{ value }">{{ sign_settings_configs[value as SignSetting].description }}</template>
      <template #selection>手动签到显示: <br>{{ sign_settings_configs[player.settings.sign_setting].select }}</template>
    </SelectButton>
    <button class="select-button" @click="open_save_load()">打开存档界面</button>
    <br>
    <button class="select-button" @click="export_save()">导出存档</button>
    <button class="select-button" @click="import_save()">导入存档</button>
  </div>

  <SaveLoadPad
      v-if="show_save_load"
      :slots="save_slots"
      @action="save_load_action"
      @close="() => show_save_load = false"
      @create="create_save"
  ></SaveLoadPad>
</template>

<style scoped>
.text-title {
  font-size: 32px;
}
</style>