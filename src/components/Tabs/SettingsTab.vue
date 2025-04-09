<script lang="ts" setup>
import { global_now } from "@/components/misc/component-timer.js";
import SaveLoadPad from "@/components/objects/SaveLoadPad.vue";
import SelectButton from "@/components/objects/SelectButton.vue";
import TextFormatter from "@/components/objects/TextFormatter.vue";
import ToggleButton from "@/components/objects/ToggleButton.vue";
import A from "@/core/instances/A/A.js";
import Ap from "@/core/instances/A/Ap.js";
import As from "@/core/instances/A/As.js";
import Atu from "@/core/instances/A/Atu.js";
import B from "@/core/instances/B/B.js";
import BC from "@/core/instances/B/BC.js";
import Bp from "@/core/instances/B/Bp.js";
import Bq from "@/core/instances/B/Bq.js";
import Settings from "@/core/instances/Settings/Settings.js";
import { type AnimationSettings, type ConfirmationSettings, TabId } from "@/core/main/defines.js";
import { fullReset } from "@/core/main/full-reset.js";
import { add_global_message, add_header_message, manual_close_message } from "@/core/main/global-messages.js";
import { SignSetting } from "@/core/main/settings.ts";
import {
  auto_save,
  create_empty_manual_save,
  get_manual_save_slots,
  load_from_data,
  type LoadResult,
  manual_delete,
  manual_load,
  manual_save,
  saved_data,
} from "@/save/save-load.js";
import { deserialize, serialize } from "@/save/serializer.js";
import { br, type FormattedText } from "@/util/format.js";
import clipboard from "clipboardy";
import { type Ref, ref } from "vue";

function show_hint() {
  add_global_message({
    type: 'alert',
    message_text: [
      "提示: ", br(),
      "刚开始游戏时, 能购买 ", As.formatted_name(), " 时就应当购买, 除非能购买 ", Atu.formatted_name(), ".", br(),
      "仅需 2 个 ", Atu.formatted_name(), " 即可达到 1.8e308 ", Ap.formatted_name(),
      " 并解锁 ", B.formatted_name(), ".", br(),
      "然而, 若获得 3 个", Atu.formatted_name(), " 则可获得约 e340 ", Ap.formatted_name(),
      ", 并直接获得 2 ", Bp.formatted_name(), ".", br(),
      BC(1).formatted_name(), " 没有任何负面作用, 因此一旦发现在外面 ", Ap.formatted_name(),
      " 能达到要求, 就可以完成这个挑战.", br(),
      Bq.formatted_name(), " 升级应该优先购买最后 3 个.", br(),
      "完成 10 次挑战的最佳方法是 3322. 其中最难的是 2 次 ", BC(3).formatted_name(),
      ", 适当刷一些 ", B.formatted_name(), " 次数以增加升级提供的倍率可能有助于完成挑战.",
    ],
  });
}

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

function handle_load_result(result: LoadResult) {
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
    if (result.warnings && result.warnings.includes('version-1-Bq')) {
      game.alert_tabs.add(TabId.B_QOL);
    }
  } else {
    add_global_message({
      type: 'alert',
      message_text: "存档读取失败!",
    });
  }
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
  handle_load_result(result);
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

function force_auto_save() {
  auto_save();
  game.last_auto_save = global_now.value;
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
  handle_load_result(result);
}

let show_confirmation_setting: Ref<boolean> = ref(false);

function open_confirmation_setting() {
  show_confirmation_setting.value = true;
}

function close_confirmation_setting() {
  show_confirmation_setting.value = false;
}

type ConfirmationItems = keyof ConfirmationSettings;

const confirmation_descriptions: Record<ConfirmationItems, FormattedText> = {
  buy_As: As.formatted_name(),
  buy_Atu: Atu.formatted_name(),
  buy_B: B.formatted_name(),
  enter_BC: BC.formatted_name(),
};

let show_animation_setting: Ref<boolean> = ref(false);

function open_animation_setting() {
  show_animation_setting.value = true;
}

function close_animation_setting() {
  show_animation_setting.value = false;
}

type AnimationItems = keyof AnimationSettings;

const animation_descriptions: Record<AnimationItems, FormattedText> = {
  buy_B: B.formatted_name(),
};

</script>

<template>
  <div class="text-box">
    <span class="text-title">设置页</span>
    <br>
    <br>
    <button class="select-button" @click="show_reset_confirm_text">硬重置存档</button>
    <SelectButton v-model="player.settings.sign_setting" :values="sign_settings">
      <template #option="{ value }">{{ sign_settings_configs[value as SignSetting].description }}</template>
      <template #selection>手动签到显示: <br>{{ sign_settings_configs[player.settings.sign_setting].select }}</template>
    </SelectButton>
    <button class="select-button" @click="open_save_load">打开存档界面</button>
    <button class="select-button" @click="force_auto_save">强制触发自动存档</button>
    <br>
    <button class="select-button" @click="export_save">导出存档</button>
    <button class="select-button" @click="import_save">导入存档</button>
    <button class="select-button" @click="open_confirmation_setting">确认信息设置</button>
    <button class="select-button" @click="open_animation_setting">动画播放设置</button>
    <br>
    <button class="select-button" @click="show_hint">查看提示</button>
  </div>

  <SaveLoadPad
      v-if="show_save_load"
      :slots="save_slots"
      @action="save_load_action"
      @close="() => show_save_load = false"
      @create="create_save"
  ></SaveLoadPad>

  <div v-if="show_confirmation_setting" class="pad-container" @click="close_confirmation_setting">
    <div class="pad-body" @click.stop>
      <div class="slots-grid">
        <template
            v-for="item in (Object.keys(confirmation_descriptions) as ConfirmationItems[])"
            :key="item"
        >
          <div class="content-center">
            <ToggleButton v-model="Settings.confirmation_setting[item]"
                          :values="[true, false]">
              <template #selection>
                <TextFormatter :text="confirmation_descriptions[item]"/><!-- 此处没有空格
                -->:
                {{ Settings.confirmation_setting[item] ? '开启' : '关闭' }}
              </template>
            </ToggleButton>
          </div>
        </template>
      </div>
    </div>
  </div>

  <div v-if="show_animation_setting" class="pad-container" @click="close_animation_setting">
    <div class="pad-body" @click.stop>
      <div class="slots-grid">
        <template
            v-for="item in (Object.keys(animation_descriptions) as AnimationItems[])"
            :key="item"
        >
          <div class="content-center">
            <ToggleButton v-model="Settings.animation_setting[item]"
                          :values="[true, false]">
              <template #selection>
                <TextFormatter :text="animation_descriptions[item]"/><!-- 此处没有空格
                -->:
                {{ Settings.animation_setting[item] ? '开启' : '关闭' }}
              </template>
            </ToggleButton>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-title {
  font-size: 32px;
}

.pad-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.pad-body {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #000;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  place-content: center;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

  margin: 20px 0;
}
</style>