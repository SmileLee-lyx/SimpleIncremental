<script setup lang="ts">
import TextFormatter from "@/components/objects/TextFormatter.vue";
import type { InputData } from "@/core/main/global-messages.js";
import { ref, type Ref } from "vue";

defineProps<{
  index: number;
  data: InputData
}>()

defineEmits<{
  (e: 'close'): v
  (e: 'done', text: string): void;
}>()

const input: Ref<string> = ref()
</script>

<template>
  <div class="message-window">
    <TextFormatter :text="data.message_text"/>
    <input v-model="input" :type="data.input_type" style="flex-grow: 1"/>
    <div class="text-box">
      <button class="message-button" @click="$emit('done', input)">确认</button>
      <button class="message-button" @click="$emit('close')">取消</button>
    </div>
  </div>
</template>

<style scoped>

</style>