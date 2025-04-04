<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import B from "@/core/instances/B/B.js";
</script>

<template>

  <div class="main-text">
    <TextFormatter :text="[B.formatted_name(), ' QOL 页面']"></TextFormatter>
  </div>
</template>

<style scoped>

</style>