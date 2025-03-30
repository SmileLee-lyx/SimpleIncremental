<script lang="ts" setup>

import JumpButton from "@/components/JumpButton.vue";
import { versions } from "@/core/versions.js";

</script>

<template>
  <h2>请选择版本:</h2>
  <div v-for="v in Object.keys(versions)">
    <JumpButton
        :code="v"
        :path="versions[v].path"
        :name="versions[v].name"
    ></JumpButton>
  </div>
</template>

<style scoped>

</style>
