<script lang="ts" setup>
import {computed, type ComputedRef, ref, type Ref} from "vue";
import type {Paths} from "@/util/typing.ts"
import type {Player} from "@/core/player.ts";
import type Decimal from "@/break-eternity/break-eternity.ts";
import type {ButtonProps} from "@/components/button-typing.ts";

const props = defineProps<ButtonProps>()

function onClick(): void {
  props.buy();
}

let mouseHover: Ref<boolean> = ref(false);

let tooltip: ComputedRef<string | null> = computed(() => {
  if (mouseHover.value && props.tooltipText !== undefined) return props.tooltipText();
  return null;
})
</script>

<template>
  <span class="purchase-button-container">
    <button
        v-show="visible()"
        :id="id"
        :class="{
          'purchase-button': true,
          'buyable': buyable(),
          'hover': mouseHover,
        }"
        :disabled="!buyable()"
        @click="onClick()"
        @mouseenter="mouseHover = true"
        @mouseleave="mouseHover = false">
      {{ text() }}
    </button>
    <span v-if="tooltip !== null" class="tooltip" v-html="tooltip"/>
  </span>

</template>

<style scoped>

</style>