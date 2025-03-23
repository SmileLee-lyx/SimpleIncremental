<script lang="ts" setup>

let emit = defineEmits<{
  done: [];
}>();

</script>

<template>
  <div class="message-window">
    <div>
      <slot/>
    </div>
    <button class="message-button" @click="emit('done')">确认</button>
  </div>
</template>

<style scoped>

</style>