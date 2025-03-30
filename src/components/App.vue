<script lang="ts" setup>

import JumpButton from "@/components/JumpButton.vue";
import { versions } from "@/core/versions.js";

</script>

<template>
  <div v-for="v in Object.keys(versions)">
    <JumpButton
        :code="v"
        :path="versions[v].path"
        :name="versions[v].name"
    ></JumpButton>
  </div>
</template>

<style scoped>
.auto-save-time {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10000;
  font-size: 12px;
  border: black solid 1px;
  background: white;
}
</style>
