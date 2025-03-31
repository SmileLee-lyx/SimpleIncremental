<script setup lang="ts">
import TextFormatter from "@/components/objects/TextFormatter.vue";
import type { AlertData } from "@/core/main/global-messages.js";

defineProps<{
  index: number;
  data: AlertData
}>()

defineEmits<{
  (e: 'done'): void;
}>()
</script>

<template>
  <div class="message-window">
    <TextFormatter :text="data.message_text"/>
    <button class="message-button" @click="$emit('done')">确认</button>
  </div>
</template>

<style scoped>

</style>