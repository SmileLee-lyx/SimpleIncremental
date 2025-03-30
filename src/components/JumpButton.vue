<script lang="ts" setup>
const props = defineProps<{
  code: string;
  name: string;
  path: string;
}>();

function open_path(path: string) {
  let element = document.createElement('a');
  element.href = path;
  element.click();
}

</script>

<template>
  <button @click="open_path(path)">
    {{ name }}
  </button>
</template>

<style scoped>

</style>