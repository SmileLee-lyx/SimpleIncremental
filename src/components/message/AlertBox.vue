<script lang="ts" setup>
import TextFormatter from "@/components/objects/TextFormatter.vue";
import type { AlertData } from "@/core/main/global-messages.js";

defineProps<{
  index: number;
  data: AlertData
}>();

defineEmits<{
  (e: 'done'): void;
}>();
</script>

<template>
  <div :style="{ zIndex: index * 2 + 102 }" class="message-window">
    <TextFormatter :text="data.message_text"/>
    <button class="message-button" @click="$emit('done')">确认</button>
  </div>
</template>

<style scoped>

</style>