<script lang="ts" setup>
import type { ButtonProps } from "@/core/defines.ts";
import { computed, type ComputedRef, ref, type Ref } from "vue";

const props = defineProps<ButtonProps>();

function onClick(): void {
  props.buy();
}

let mouseHover: Ref<boolean> = ref(false);

let tooltip: ComputedRef<string | null> = computed(() => {
  if (mouseHover.value && props.tooltipText !== undefined) return props.tooltipText();
  return null;
});
</script>

<template>
  <span class="purchase-button-container">
    <button
        v-show="visible()"
        :id="id"
        :class="[{
          'purchase-button': true,
          'buyable': buyable(),
          'hover': mouseHover,
          'fully-bought': fullyBought !== undefined && fullyBought(),
        }, extraClasses]"
        :disabled="!buyable() || (fullyBought !== undefined && fullyBought())"
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