<script lang="ts" setup>

import TextFormatter from "@/components/objects/TextFormatter.vue";
import BC from "@/core/instances/B/BC.js";
</script>

<template>
  <div class="main-text">
    <TextFormatter :text="BC.description()"/>
    <br>
    <TextFormatter :text="BC.current_challenge_description()"/>
    <button v-if="BC.is_running()" class="select-button exit-challenge" @click="BC.manual_exit()">退出挑战</button>
    <br>
    <template v-for="label in 4">
      <div class="challenge-tab">
        <TextFormatter :text="BC(label).description()"/>

        <button class="select-button challenge-start" @click="BC(label).start_button()">开始挑战</button>
      </div>
      <br v-if="label % 2 === 0">
    </template>
  </div>
</template>

<style scoped>
.challenge-tab {
  position: relative;
  display: inline-block;
  width: 250px;
  height: 150px;
  border-radius: 10px;
  background-color: #88f;
  vertical-align: middle;
}

.select-button.challenge-start {
  width: 100px;
  height: 30px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
}

.select-button.exit-challenge {
  width: 100px;
  height: 30px;
}
</style>