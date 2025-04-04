<script lang="ts" setup>
import TextFormatter from "@/components/objects/TextFormatter.vue";
import type { ConfirmData } from "@/core/main/global-messages.js";

defineProps<{
  index: number;
  data: ConfirmData
}>();

defineEmits<{
  (e: 'done'): void;
  (e: 'close'): void;
}>();
</script>

<template>
  <div :style="{ zIndex: index * 2 + 102 }" class="message-window">
    <TextFormatter :text="data.message_text"/>
    <div class="text-box">
      <button class="message-button" @click="$emit('done')">确认</button>
      <button class="message-button" @click="$emit('close')">取消</button>
    </div>
  </div>
</template>

<style scoped>

</style>