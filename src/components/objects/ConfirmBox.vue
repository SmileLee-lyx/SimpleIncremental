<script lang="ts" setup>

let emit = defineEmits<{
  close: [];
  done: [];
}>();

</script>

<template>
  <div class="message-window">
    <div>
      <slot/>
    </div>
    <div style="text-align: center">
      <button class="message-button" @click="emit('done')">确认</button>
      <button class="message-button" @click="emit('close')">取消</button>
    </div>
  </div>
</template>

<style scoped>

</style>