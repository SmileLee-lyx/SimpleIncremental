<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  type?: string,
  placeholder?: string,
}>()

let emit = defineEmits<{
  close: [];
  done: [string];
}>();

let input = ref('');
</script>

<template>
  <div class="message-window">
    <div><slot/></div>
    <input v-model="input" :type="type" :placeholder="placeholder" v-bind="$attrs"
      style="flex-grow: 1"
    ></input>
    <div style="text-align: center;">
      <button class="message-button" @click="emit('done', input)">确认</button>
      <button class="message-button" @click="emit('close')">取消</button>
    </div>
  </div>
</template>

<style scoped>

</style>