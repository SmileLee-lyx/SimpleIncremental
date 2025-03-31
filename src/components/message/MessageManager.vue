<script lang="ts" setup>
import AlertBox from "@/components/message/AlertBox.vue";
import ConfirmBox from "@/components/message/ConfirmBox.vue";
import InputBox from "@/components/message/InputBox.vue";
import type { AlertData, ConfirmData, InputData, MessageData } from "@/core/main/global-messages.js";

const props = defineProps<{
  messages: MessageData[];
  indices: Set<number>;
}>();

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
</template>

<style scoped>

</style>