<script lang="ts" setup>
import AlertBox from "@/components/message/AlertBox.vue";
import ConfirmBox from "@/components/message/ConfirmBox.vue";
import HeaderBox from "@/components/message/HeaderBox.vue";
import InputBox from "@/components/message/InputBox.vue";
import { run_on_frame } from "@/components/misc/run-on-frame.js";
import type { AlertData, ConfirmData, HeaderMessageData, InputData, MessageData } from "@/core/main/global-messages.js";
import { computed } from "vue";

const props = defineProps<{
  messages: MessageData[];
  indices: Set<number>;
  headers: HeaderMessageData[];
  clear_header_timeout: () => void;
}>();

run_on_frame(props.clear_header_timeout);

function alert_done(index: number) {
  const message = props.messages[index] as AlertData;
  if (message.done !== undefined) {
    message.done();
  }
  props.indices.delete(index);
}

function confirm_done(index: number) {
  const message = props.messages[index] as ConfirmData;
  const keep = message.done();
  if (keep === undefined || !keep) {
    props.indices.delete(index);
  }
}

function confirm_close(index: number) {
  const message = props.messages[index] as ConfirmData;
  if (message.cancel !== undefined) {
    message.cancel();
  }
  props.indices.delete(index);
}

function input_done(index: number, text: string) {
  const message = props.messages[index] as InputData;
  const keep = message.done(text);
  if (keep === undefined || !keep) {
    props.indices.delete(index);
  }
}

function input_close(index: number) {
  const message = props.messages[index] as InputData;
  if (message.cancel !== undefined) {
    message.cancel();
  }
  props.indices.delete(index);
}

const max_index = computed(() => {
  let result = 0;
  for (let index of props.indices) {
    if (index > result) {
      result = index;
    }
  }
  return result;
});
</script>

<template>
  <template v-for="index in indices" :key="index">
    <AlertBox
        v-if="messages[index].type === 'alert'" :data="messages[index] as AlertData" :index="index"
        @done="() => alert_done(index)"
    />
    <ConfirmBox
        v-if="messages[index].type === 'confirm'" :data="messages[index] as ConfirmData" :index="index"
        @close="() => confirm_close(index)" @done="() => confirm_done(index)"
    />
    <InputBox
        v-if="messages[index].type === 'input_box'" :data="messages[index] as InputData" :index="index"
        @close="() => input_close(index)" @done="(text) => input_done(index, text)"
    />
  </template>
  <div v-if="indices.size > 0" :style="{zIndex: max_index * 2 + 101}" class="modal"/>
  <transition-group name="message-header-slide">
    <HeaderBox v-for="header in headers" :key="header.start_time" :data="header.message_text"/>
  </transition-group>
</template>

<style scoped>

</style>