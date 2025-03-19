<script setup lang="ts">
import Decimal, { dTen } from "@/break-eternity/break-eternity.ts";
import { format } from "@/visual/format.ts";

let player = window.player;

</script>

<template>
  <div class="main">
    当前点数为 {{ format(player.main.points.amount) }}.
  </div>
</template>

<style scoped>

</style>