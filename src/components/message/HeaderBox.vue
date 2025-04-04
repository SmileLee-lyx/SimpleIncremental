<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import type { FormattedText } from "@/util/format.js";

defineProps<{
  data: FormattedText
}>();
</script>

<template>
  <div class="message-header">
    <TextFormatter :text="data"/>
  </div>
</template>

<style scoped>

</style>