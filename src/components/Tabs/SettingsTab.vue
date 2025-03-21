<script setup lang="ts">
import ConfirmBox from "@/components/objects/ConfirmBox.vue";
import InputBox from "@/components/objects/InputBox.vue";
import MessageBox from "@/components/objects/MessageBox.vue";
import { defaultPlayer } from "@/core/defines.ts";
import { assign, cloneDeep } from "lodash";
import { ref } from "vue";

let game = window.game;

let show_reset_confirm = ref(0);

function confirm_reset(text: string) {
  if (text.trim() === "A comathematician is a machine for turning cotheorems into ffee.") {
    show_reset_confirm.value = 2;
  }
}

function full_reset() {
  show_reset_confirm.value = 0;

  let defaultCopy = cloneDeep(defaultPlayer);
  assign(window.player, defaultCopy);
}

let alert = window.alert;
</script>

<template>
  <div class="text-box">
    设置页

    <button @click="show_reset_confirm = 1">硬重置存档</button>
  </div>

  <InputBox
      v-if="show_reset_confirm === 1"
      type="string"
      placeholder=""
      @done="confirm_reset"
      @close="show_reset_confirm = 0"

      @paste="(e: Event) => { e.preventDefault(); show_reset_confirm = 3; }"
  >请输入以下句子以确认: "A comathematician is a machine for turning cotheorems into ffee."</InputBox>
  <ConfirmBox
      v-if="show_reset_confirm === 2"
      @done="full_reset()"
      @close="show_reset_confirm = 0"
  >
    确定要重置吗?
  </ConfirmBox>
  <MessageBox
    v-if="show_reset_confirm === 3"
    @done="show_reset_confirm = 1">
    请手动输入!
  </MessageBox>
</template>

<style scoped>
.text-box {
  text-align: center;
}
</style>